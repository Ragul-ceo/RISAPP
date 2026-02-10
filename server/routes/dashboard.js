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
    const connection = await req.pool.getConnection();

    let query = `
      SELECT 
        u.id, u.name, u.email,
        a.check_in_time, a.check_out_time,
        a.check_in_latitude, a.check_in_longitude,
        a.check_out_latitude, a.check_out_longitude
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE u.role = 'employee'
    `;

    const params = [];

    if (startDate) {
      query += ' AND DATE(a.check_in_time) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(a.check_in_time) <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY a.check_in_time DESC';

    const [records] = await connection.execute(query, params);
    connection.release();

    res.json(records);
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

    const connection = await req.pool.getConnection();

    const today = new Date().toISOString().split('T')[0];

    // Total employees
    const [totalEmployees] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "employee"'
    );

    // Employees checked in today
    const [checkedInToday] = await connection.execute(
      `SELECT COUNT(DISTINCT user_id) as count FROM attendance 
       WHERE DATE(check_in_time) = ?`,
      [today]
    );

    // Employees checked out today
    const [checkedOutToday] = await connection.execute(
      `SELECT COUNT(*) as count FROM attendance 
       WHERE DATE(check_in_time) = ? AND check_out_time IS NOT NULL`,
      [today]
    );

    connection.release();

    res.json({
      totalEmployees: totalEmployees[0].count,
      checkedInToday: checkedInToday[0].count,
      checkedOutToday: checkedOutToday[0].count
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
    const connection = await req.pool.getConnection();

    let query = `
      SELECT 
        u.name, u.email,
        a.check_in_time, a.check_out_time,
        a.check_in_latitude, a.check_in_longitude,
        a.check_out_latitude, a.check_out_longitude
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE u.role = 'employee'
    `;

    const params = [];

    if (startDate) {
      query += ' AND DATE(a.check_in_time) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(a.check_in_time) <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY a.check_in_time DESC';

    const [records] = await connection.execute(query, params);
    connection.release();

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    // Add headers
    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Check-in Time', key: 'check_in_time', width: 20 },
      { header: 'Check-out Time', key: 'check_out_time', width: 20 },
      { header: 'Check-in Lat', key: 'check_in_latitude', width: 15 },
      { header: 'Check-in Long', key: 'check_in_longitude', width: 15 },
      { header: 'Check-out Lat', key: 'check_out_latitude', width: 15 },
      { header: 'Check-out Long', key: 'check_out_longitude', width: 15 }
    ];

    // Add data
    records.forEach(record => {
      worksheet.addRow({
        name: record.name,
        email: record.email,
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time || 'Not checked out',
        check_in_latitude: record.check_in_latitude,
        check_in_longitude: record.check_in_longitude,
        check_out_latitude: record.check_out_latitude || '-',
        check_out_longitude: record.check_out_longitude || '-'
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
