const Sale = require('../models/Sale');
const mongoose = require('mongoose');

// Get current rate, flock, and house number (latest record)
exports.getCurrentMeta = async (req, res) => {
    try {
        const latestSale = await Sale.findOne({ userId: req.user.id }).sort({ date: -1 });
        if (!latestSale) {
            return res.json({
                rate: 0,
                flockNo: 'N/A',
                houseNo: 'N/A'
            });
        }
        res.json({
            rate: latestSale.rate,
            flockNo: latestSale.flockNo,
            houseNo: latestSale.houseNo
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get list of unique vehicle numbers
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Sale.distinct('vehicleNo', { userId: req.user.id });
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get list of unique brokers
exports.getBrokers = async (req, res) => {
    try {
        const brokers = await Sale.distinct('brokerName', { userId: req.user.id });
        res.json(brokers.filter(b => b)); // Filter out null/empty
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get vehicle last 10 time weight history (specifically first weight as requested)
exports.getVehicleWeightHistory = async (req, res) => {
    try {
        const { vehicleNo } = req.params;
        const history = await Sale.find({ 
            userId: req.user.id, 
            vehicleNo: vehicleNo 
        })
        .sort({ date: -1 })
        .limit(10)
        .select('date weight1 weight2 netWeight');
        
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get unique house numbers
exports.getHouses = async (req, res) => {
    try {
        const houses = await Sale.distinct('houseNo', { userId: req.user.id });
        res.json(houses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get unique flock numbers
exports.getFlocks = async (req, res) => {
    try {
        const flocks = await Sale.distinct('flockNo', { userId: req.user.id });
        res.json(flocks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
