require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const fixAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find and update admin user
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      { $set: { role: 'admin' } },
      { new: true }
    );
    
    if (admin) {
      console.log('Admin user updated:');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Raw document:', JSON.stringify(admin.toObject(), null, 2));
    } else {
      console.log('No admin user found to update');
    }

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

fixAdminRole(); 