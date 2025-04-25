const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');

// Owner login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[Server] Login attempt for username: ${username}`);

    // Find hostel by username
    const hostel = await Hostel.findOne({ username });
    if (!hostel) {
      console.log(`[Server] Hostel not found for username: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(`[Server] Hostel found: ${hostel.name} (ID: ${hostel._id})`);

    // Verify password
    console.log('[Server] Comparing provided password with stored hash...');
    const isValidPassword = await hostel.comparePassword(password);
    console.log(`[Server] Password comparison result: ${isValidPassword}`);

    if (!isValidPassword) {
      console.log('[Server] Password mismatch.');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    console.log('[Server] Password valid. Generating token...');
    const token = hostel.generateAuthToken();

    // Successful login
    console.log('[Server] Login successful. Sending token and user data.');
    res.json({
      token,
      user: {
        id: hostel._id,
        username: hostel.username,
        name: hostel.owner,
        role: 'owner',
        hostelId: hostel._id,
        hostel: {
          id: hostel._id,
          name: hostel.name
        }
      }
    });
  } catch (error) {
    console.error('[Server] Login route error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get owner profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.user.id);
    if (!hostel) {
      return res.status(404).json({ error: 'Hostel not found' });
    }

    res.json({
      id: hostel._id,
      username: hostel.username,
      name: hostel.owner,
      role: 'owner',
      hostelId: hostel._id,
      hostel: {
        id: hostel._id,
        name: hostel.name
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 