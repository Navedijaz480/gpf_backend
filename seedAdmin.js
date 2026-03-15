const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gpf_farmer';

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gpf.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@gpf.com',
      password: 'admin123',
      role: 'admin'
    });

    // Hash password (will be done automatically by pre-save hook)
    await adminUser.save();

    console.log('Admin user created successfully!');
    console.log('Email: admin@gpf.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
