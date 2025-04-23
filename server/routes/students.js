const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Student login route
router.post('/login', async (req, res) => {
  try {
    const { hostelId, email, password } = req.body;
    console.log('[Server] Login attempt:', { email, hostelId });

    // Validate required fields
    if (!hostelId || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields'
      });
    }

    // Find student by email and hostel
    const student = await Student.findOne({ email, hostelId });
    if (!student) {
      console.log('[Server] Student not found');
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    console.log('[Server] Found student:', { 
      id: student._id,
      name: student.name,
      email: student.email
    });

    // Verify password
    const isValidPassword = await student.comparePassword(password);
    if (!isValidPassword) {
      console.log('[Server] Invalid password');
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: 'student', hostelId: student.hostelId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return student data without password
    const studentData = {
      _id: student._id,
      name: student.name,
      email: student.email,
      hostelId: student.hostelId
    };

    console.log('[Server] Login successful. Sending data:', studentData);
    res.json({
      token,
      student: studentData
    });
  } catch (error) {
    console.error('[Server] Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Get all students for a hostel
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ hostelId: req.user.id })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// Register a new student
router.post('/register', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        error: 'A student with this email already exists'
      });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      hostelId: req.user.id // This comes from the authenticated hostel owner
    });

    await student.save();

    // Return student data without password
    const studentData = student.toObject();
    delete studentData.password;

    res.status(201).json(studentData);
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Error registering student' });
  }
});

// Reset student password
router.post('/:id/reset-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const student = await Student.findOne({
      _id: req.params.id,
      hostelId: req.user.id
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// Delete a student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      hostelId: req.user.id
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

module.exports = router; 