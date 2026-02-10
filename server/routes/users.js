const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth');

// Get all users (HR only)
router.get('/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const connection = await req.pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    connection.release();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (HR only)
router.post('/users', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }

    const connection = await req.pool.getConnection();

    // Check if user exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'employee';

    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    connection.release();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user (HR only)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const connection = await req.pool.getConnection();

    // Check if email is used by another user
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already in use' });
    }

    if (password) {
      // Update with new password
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [name, email, hashedPassword, role || 'employee', id]
      );
    } else {
      // Update without changing password
      await connection.execute(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role || 'employee', id]
      );
    }

    connection.release();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (HR only)
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Don't allow deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const connection = await req.pool.getConnection();
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
