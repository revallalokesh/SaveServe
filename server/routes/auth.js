const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection function
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  roomNo: String,
  username: String,
  password: String,
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel'
  }
});

const User = mongoose.model('User', userSchema);

// Hostel Schema
const hostelSchema = new mongoose.Schema({
  name: String,
  address: String,
  // Add other hostel fields as needed
});

const Hostel = mongoose.model('Hostel', hostelSchema);

// Get all hostels
router.get('/hostel/all', async (req, res, next) => {
  try {
    console.log('Fetching hostels...');
    const hostels = await Hostel.find({}, 'name _id');
    console.log('Found hostels:', hostels);
    
    res.json(hostels);
  } catch (error) {
    console.error('Error fetching hostels:', error);
    next(error);
  }
});

// Student login route
router.post('/student/login', async (req, res, next) => {
  try {
    const { username, password, hostelId } = req.body;
    
    // Find user
    const user = await User.findOne({ 
      username,
      hostelId // Also check if user belongs to the selected hostel
    }).populate('hostelId', 'name');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roomNo: user.roomNo,
        username: user.username,
        hostel: user.hostelId ? {
          id: user.hostelId._id,
          name: user.hostelId.name
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
});

// Signup route
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, phone, roomNo, username, password, hostelId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(400).json({ message: 'Invalid hostel' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      roomNo,
      username,
      password: hashedPassword,
      hostelId
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 