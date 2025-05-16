const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');

// Get all hostels (public route)
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find()
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Raw hostels from DB:', hostels); // Debug log
    
    // Map the data to include all required fields
    const mappedHostels = hostels.map(hostel => ({
      _id: hostel._id,
      name: hostel.name,
      owner: hostel.owner,
      email: hostel.email,
      username: hostel.username,
      address: hostel.address,
      createdAt: hostel.createdAt
    }));

    console.log('Mapped hostels:', mappedHostels); // Debug log
    res.json(mappedHostels);
  } catch (error) {
    console.error('Error getting hostels:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new hostel
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, owner, email, username, password } = req.body;

    // Validate required fields
    if (!name || !address || !owner || !email || !username || !password) {
      return res.status(400).json({ 
        message: 'All fields are required: name, address, owner, email, username, password' 
      });
    }

    // Create hostel document
    const hostelData = {
      name,
      address,
      owner,
      email,
      username,
      password
    };

    console.log('Attempting to create hostel with data:', {
      ...hostelData,
      password: '[HIDDEN]'
    });

    // Create and save in one step
    const savedHostel = await Hostel.create(hostelData);

    console.log('Saved hostel document:', {
      _id: savedHostel._id,
      name: savedHostel.name,
      address: savedHostel.address,
      owner: savedHostel.owner,
      email: savedHostel.email,
      username: savedHostel.username,
      hasPassword: !!savedHostel.password
    });

    res.status(201).json(savedHostel);
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating hostel',
      error: error.message
    });
  }
});

// Update a hostel
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, address, owner } = req.body;
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== hostel.name) {
      const existingHostel = await Hostel.findOne({ name });
      if (existingHostel && existingHostel._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Hostel with this name already exists' });
      }
    }

    // Update fields if provided
    if (name) hostel.name = name.trim();
    if (address) hostel.address = address.trim();
    if (owner) hostel.owner = owner.trim();

    const updatedHostel = await hostel.save();
    res.json(updatedHostel);
  } catch (error) {
    console.error('Error updating hostel:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map(err => err.message).join(', ') });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a hostel
router.delete('/:id', auth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    await hostel.deleteOne();
    res.json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hostel:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 