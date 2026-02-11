const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const ExcelJS = require('exceljs');

// Get attendance records (HR only)
router.get('/attendance', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        u.id, u.name, u.email,
        a.check_in_time, a.check_out_time,
        a.check_in_lat, a.check_in_long,
        a.check_out_lat, a.check_out_long
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE u.role = 'employee'
    `;

    const params = [];
    let paramIndex = 1;

    if (startDate) {
      query += ` AND DATE(a.check_in_time) >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND DATE(a.check_in_time) <= $${paramIndex}`;
      params.push(endDate);
    }

    query += ' ORDER BY a.check_in_time DESC';

    const result = await req.pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard summary (HR only)
router.get('/summary', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Total employees
    const totalResult = await req.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = $1',
      ['employee']
    );

    // Employees checked in today
    const checkedInResult = await req.pool.query(
      `SELECT COUNT(DISTINCT user_id) as count FROM attendance 
       WHERE DATE(check_in_time) = $1`,
      [today]
    );

    // Employees checked out today
    const checkedOutResult = await req.pool.query(
      `SELECT COUNT(*) as count FROM attendance 
       WHERE DATE(check_in_time) = $1 AND check_out_time IS NOT NULL`,
      [today]
    );

    res.json({
      totalEmployees: parseInt(totalResult.rows[0].count),
      checkedInToday: parseInt(checkedInResult.rows[0].count),
      checkedOutToday: parseInt(checkedOutResult.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export to Excel (HR only)
router.post('/export', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { startDate, endDate } = req.body;

    let query = `
      SELECT 
        u.name, u.email,
        a.check_in_time, a.check_out_time,
        a.check_in_lat, a.check_in_long,
        a.check_out_lat, a.check_out_long
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE u.role = 'employee'
    `;

    const params = [];
    let paramIndex = 1;

    if (startDate) {
      query += ` AND DATE(a.check_in_time) >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND DATE(a.check_in_time) <= $${paramIndex}`;
      params.push(endDate);
    }

    query += ' ORDER BY a.check_in_time DESC';

    const result = await req.pool.query(query, params);
    const records = result.rows;

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Add headers
    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Check-in Time', key: 'check_in_time', width: 20 },
      { header: 'Check-out Time', key: 'check_out_time', width: 20 },
      { header: 'Check-in Lat', key: 'check_in_lat', width: 15 },
      { header: 'Check-in Long', key: 'check_in_long', width: 15 },
      { header: 'Check-out Lat', key: 'check_out_lat', width: 15 },
      { header: 'Check-out Long', key: 'check_out_long', width: 15 }
    ];

    // Add data
    records.forEach(record => {
      worksheet.addRow({
        name: record.name,
        email: record.email,
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time || 'Not checked out',
        check_in_lat: record.check_in_lat,
        check_in_long: record.check_in_long,
        check_out_lat: record.check_out_lat || '-',
        check_out_long: record.check_out_long || '-'
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
