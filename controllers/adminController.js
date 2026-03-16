const User = require('../models/User');
const Sale = require('../models/Sale');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// @route   GET api/admin/users
// @desc    Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/admin/users
// @desc    Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password, role: role || 'user' });
        await user.save();
        res.json({ msg: 'User created successfully', user: { id: user._id, username, email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/sales
// @desc    Get all sales with filters
exports.getAllSales = async (req, res) => {
    try {
        const { userId, vehicleNo, flockNo, houseNo, startDate, endDate, status } = req.query;
        let query = {};

        if (userId) query.userId = userId;
        if (vehicleNo) query.vehicleNo = new RegExp(vehicleNo, 'i');
        if (flockNo) query.flockNo = flockNo;
        if (houseNo) query.houseNo = houseNo;
        if (status) query.status = status;
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const sales = await Sale.find(query)
            .populate('userId', 'username email')
            .populate('vehicleId')
            .sort({ date: -1 });
            
        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/vehicles
// @desc    Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/stats
// @desc    Get dashboard stats
exports.getAdminStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateQuery = {};
        if (startDate || endDate) {
            dateQuery.date = {};
            if (startDate) dateQuery.date.$gte = new Date(startDate);
            if (endDate) dateQuery.date.$lte = new Date(endDate);
        }

        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalSales = await Sale.countDocuments(dateQuery);
        const totalVehicles = await Vehicle.countDocuments();

        const salesSummary = await Sale.aggregate([
            { $match: dateQuery },
            {
                $group: {
                    _id: null,
                    totalWeight: { $sum: "$netWeight" },
                    totalAmount: { $sum: "$totalAmount" },
                    totalDue: { $sum: "$due" }
                }
            }
        ]);

        const recentSales = await Sale.find(dateQuery)
            .populate('userId', 'username')
            .sort({ date: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalSales,
                totalVehicles,
                totalWeight: salesSummary[0]?.totalWeight || 0,
                totalAmount: salesSummary[0]?.totalAmount || 0,
                totalDue: salesSummary[0]?.totalDue || 0
            },
            recentSales
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
