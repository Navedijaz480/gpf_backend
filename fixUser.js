const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

async function fixUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gpf_farm');
        console.log('Connected to MongoDB');

        // Delete existing user
        await User.deleteOne({ email: 'admin@farm.com' });
        console.log('Deleted existing user (if any)');

        // Create new user using Mongoose model (password will be hashed automatically)
        const user = new User({
            username: 'admin',
            email: 'admin@farm.com',
            password: 'admin123'
        });

        await user.save();
        console.log('User created successfully with proper password hashing!');
        console.log('Email: admin@farm.com');
        console.log('Password: admin123');

        // Verify password works
        const foundUser = await User.findOne({ email: 'admin@farm.com' });
        const isMatch = await foundUser.comparePassword('admin123');
        console.log('Password verification test:', isMatch ? 'PASSED' : 'FAILED');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

fixUser();
