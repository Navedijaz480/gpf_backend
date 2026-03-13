const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gpf_farm');
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'admin@farm.com' });
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            console.log('You can login with: admin@farm.com / admin123');
            process.exit(0);
        }

        // Create new user
        const user = new User({
            username: 'admin',
            email: 'admin@farm.com',
            password: 'admin123'
        });

        await user.save();
        console.log('User created successfully!');
        console.log('Email: admin@farm.com');
        console.log('Password: admin123');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

createTestUser();
