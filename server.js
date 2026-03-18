const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
    }
};

// Database connection middleware for serverless
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/meta', require('./routes/meta'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/payment-methods', require('./routes/paymentMethods'));
app.use('/api/admin', require('./routes/admin'));

// Root endpoint
app.get('/', (req, res) => {
    res.send('Farmer Manager API is running...');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
