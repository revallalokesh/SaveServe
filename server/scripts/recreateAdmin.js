require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const recreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Delete existing admin user
    await User.deleteOne({ email: 'admin@example.com' });
    console.log('Deleted existing admin user');

    // Create new admin user
    const admin = new User({
      email: 'admin@example.com',
      password: 'admin@123', // Will be hashed by the pre-save hook
      name: 'Admin User',
      role: 'admin'
    });

    await admin.save();
    console.log('New admin user created:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);

    // Verify the user was created correctly
    const savedAdmin = await User.findOne({ email: 'admin@example.com' });
    console.log('Saved admin details:', {
      email: savedAdmin.email,
      name: savedAdmin.name,
      role: savedAdmin.role,
      hasPassword: !!savedAdmin.password
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

recreateAdmin(); 