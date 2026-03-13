const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gpf_farm');
        console.log('Connected to MongoDB');

        // Get the users collection directly
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: 'admin@farm.com' });
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            console.log('You can login with: admin@farm.com / admin123');
            process.exit(0);
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Insert user directly
        const result = await usersCollection.insertOne({
            username: 'admin',
            email: 'admin@farm.com',
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log('User created successfully!');
        console.log('Email: admin@farm.com');
        console.log('Password: admin123');
        console.log('User ID:', result.insertedId);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

createTestUser();
