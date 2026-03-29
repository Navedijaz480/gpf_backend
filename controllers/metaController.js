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
        const vehicles = await Sale.distinct('vehicleNo');
        res.json(vehicles);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

const Broker = require('../models/Broker');

// Get list of unique brokers
exports.getBrokers = async (req, res) => {
    try {
        const saleBrokers = await Sale.distinct('brokerName');
        const dbBrokers = await Broker.find({ userId: req.user.id }).distinct('name');
        
        // Merge and remove duplicates
        const allBrokers = [...new Set([...saleBrokers, ...dbBrokers])];
        res.json(allBrokers.filter(b => b)); // Filter out null/empty
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Add a new explicit broker
exports.addBroker = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ msg: 'Broker name is required' });

        // Check if it already exists
        const existingBroker = await Broker.findOne({ name: name.trim(), userId: req.user.id });
        if (existingBroker) {
            return res.json({ msg: 'Broker already exists', data: existingBroker });
        }

        const newBroker = new Broker({
            name: name.trim(),
            userId: req.user.id
        });

        await newBroker.save();
        res.status(201).json({ msg: 'Broker added successfully', data: newBroker });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get the last rate for a specific house and flock
exports.getLastRate = async (req, res) => {
    try {
        const { houseNo, flockNo } = req.query;
        if (!houseNo || !flockNo) {
            return res.status(400).json({ msg: 'houseNo and flockNo are required' });
        }
        
        const latestSale = await Sale.findOne({
            userId: req.user.id,
            houseNo: houseNo,
            flockNo: flockNo,
            status: 'completed',
            rate: { $gt: 0 }
        }).sort({ date: -1 });

        if (!latestSale) {
            return res.json({ rate: 0 });
        }
        res.json({ rate: latestSale.rate });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get vehicle last 10 time weight history (specifically first weight as requested)
exports.getVehicleWeightHistory = async (req, res) => {
    try {
        const { vehicleNo } = req.params;
        const history = await Sale.find({ 
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
        const houses = await Sale.distinct('houseNo');
        res.json(houses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Get unique flock numbers
exports.getFlocks = async (req, res) => {
    try {
        const flocks = await Sale.distinct('flockNo');
        res.json(flocks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
