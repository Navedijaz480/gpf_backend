const mongoose = require('mongoose');
const Sale = require('../models/Sale');

exports.createSale = async (req, res) => {
    try {
        const newSale = new Sale({
            ...req.body,
            userId: req.user.id
        });
        const sale = await newSale.save();
        res.json(sale);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getSummary = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const summary = await Sale.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id), date: { $gte: sevenDaysAgo } } },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                totalWeight: { $sum: "$netWeight" },
                totalAmount: { $sum: "$totalAmount" }
            }},
            { $sort: { _id: 1 } }
        ]);
        res.json(summary);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// New Reporting APIs

exports.getTodaySales = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sales = await Sale.find({ 
            userId: req.user.id, 
            date: { $gte: today } 
        }).sort({ date: -1 });
        
        res.json(sales);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getFlockSummary = async (req, res) => {
    try {
        const summary = await Sale.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: {
                _id: "$flockNo",
                totalWeight: { $sum: "$netWeight" },
                totalAmount: { $sum: "$totalAmount" },
                avgRate: { $avg: "$rate" },
                count: { $sum: 1 }
            }},
            { $sort: { _id: -1 } }
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getHouseSummary = async (req, res) => {
    try {
        const summary = await Sale.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: {
                _id: "$houseNo",
                totalWeight: { $sum: "$netWeight" },
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
