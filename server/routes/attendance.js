const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Check-in
router.post('/checkin', verifyToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const connection = await req.pool.getConnection();

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const [existing] = await connection.execute(
      'SELECT id FROM attendance WHERE user_id = ? AND DATE(check_in_time) = ?',
      [userId, today]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Already checked in today' });
    }

    await connection.execute(
      'INSERT INTO attendance (user_id, check_in_time, check_in_latitude, check_in_longitude) VALUES (?, NOW(), ?, ?)',
      [userId, latitude, longitude]
    );

    connection.release();

    res.json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-out
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const connection = await req.pool.getConnection();

    const today = new Date().toISOString().split('T')[0];
    const [records] = await connection.execute(
      'SELECT id FROM attendance WHERE user_id = ? AND DATE(check_in_time) = ? AND check_out_time IS NULL',
      [userId, today]
    );

    if (records.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'No check-in found for today' });
    }

    await connection.execute(
      'UPDATE attendance SET check_out_time = NOW(), check_out_latitude = ?, check_out_longitude = ? WHERE id = ?',
      [latitude, longitude, records[0].id]
    );

    connection.release();

    res.json({ message: 'Check-out successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await req.pool.getConnection();

    const today = new Date().toISOString().split('T')[0];
    const [records] = await connection.execute(
      'SELECT check_in_time, check_out_time FROM attendance WHERE user_id = ? AND DATE(check_in_time) = ?',
      [userId, today]
    );

    connection.release();

    if (records.length === 0) {
      return res.json({ checkedIn: false, checkedOut: false });
    }

    res.json({
      checkedIn: true,
      checkedOut: records[0].check_out_time !== null,
      checkInTime: records[0].check_in_time,
      checkOutTime: records[0].check_out_time
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
