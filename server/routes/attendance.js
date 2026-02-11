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

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const existingResult = await req.pool.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND DATE(check_in_time) = $2',
      [userId, today]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    await req.pool.query(
      'INSERT INTO attendance (user_id, check_in_time, check_in_lat, check_in_long) VALUES ($1, CURRENT_TIMESTAMP, $2, $3)',
      [userId, latitude, longitude]
    );

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

    const today = new Date().toISOString().split('T')[0];
    const recordsResult = await req.pool.query(
      'SELECT id FROM attendance WHERE user_id = $1 AND DATE(check_in_time) = $2 AND check_out_time IS NULL',
      [userId, today]
    );

    if (recordsResult.rows.length === 0) {
      return res.status(400).json({ error: 'No check-in found for today' });
    }

    await req.pool.query(
      'UPDATE attendance SET check_out_time = CURRENT_TIMESTAMP, check_out_lat = $1, check_out_long = $2 WHERE id = $3',
      [latitude, longitude, recordsResult.rows[0].id]
    );

    res.json({ message: 'Check-out successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date().toISOString().split('T')[0];
    const recordsResult = await req.pool.query(
      'SELECT check_in_time, check_out_time FROM attendance WHERE user_id = $1 AND DATE(check_in_time) = $2',
      [userId, today]
    );

    if (recordsResult.rows.length === 0) {
      return res.json({ checkedIn: false, checkedOut: false });
    }

    res.json({
      checkedIn: true,
      checkedOut: recordsResult.rows[0].check_out_time !== null,
      checkInTime: recordsResult.rows[0].check_in_time,
      checkOutTime: recordsResult.rows[0].check_out_time
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
