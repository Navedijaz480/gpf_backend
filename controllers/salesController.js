const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Vehicle = require('../models/Vehicle');

exports.createSale = async (req, res) => {
    try {
        const { 
            vehicleNumber, vehicleNo, 
            brokerName, 
            houseNo, 
            flockNo, 
            advanceAmount, advance,
            weight1, 
            price, rate,
            weight2,
            netWeight,
            status
        } = req.body;

        const effectiveVehicleNo = vehicleNumber || vehicleNo;
        const effectiveAdvance = advanceAmount || advance || 0;
        const effectiveRate = price || rate || 0;

        // First, create or update the vehicle
        let vehicle = await Vehicle.findOne({ vehicleNumber: effectiveVehicleNo });
        if (vehicle) {
            // Update broker name if different
            if (brokerName && vehicle.brokerName !== brokerName) {
                vehicle.brokerName = brokerName;
                await vehicle.save();
            }
        } else {
            // Create new vehicle
            vehicle = new Vehicle({
                vehicleNumber: effectiveVehicleNo,
                brokerName,
                houseNo,
                flockNo,
                createdBy: req.user.id
            });
            await vehicle.save();
        }

        // Create sale with vehicle reference
        const newSale = new Sale({
            vehicleId: vehicle._id,
            vehicleNo: effectiveVehicleNo,
            houseNo,
            flockNo,
            weight1,
            weight2: weight2 || 0,
            netWeight: netWeight || weight1,
            rate: effectiveRate,
            totalAmount: (netWeight || weight1) * effectiveRate,
            brokerName,
            advance: effectiveAdvance,
            due: ((netWeight || weight1) * effectiveRate) - effectiveAdvance,
            status: status || 'pending',
            userId: req.user.id
        });

        const sale = await newSale.save();
        res.json({
            success: true,
            data: sale
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Calculate net weight and total amount if relevant fields are present
        if (updateData.weight1 !== undefined && updateData.weight2 !== undefined) {
             // If weight2 - weight1 is requested by user, we use that
             updateData.netWeight = updateData.weight2 - updateData.weight1;
        }

        if (updateData.netWeight !== undefined && updateData.rate !== undefined) {
            updateData.totalAmount = updateData.netWeight * updateData.rate;
        }

        // Calculate due if needed
        if (updateData.totalAmount !== undefined) {
            const advance = updateData.advance || 0;
            const cash = updateData.cashAmount || 0;
            const bank = (updateData.bankPayments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
            updateData.due = updateData.totalAmount - (advance + cash + bank);
        }

        const sale = await Sale.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { $set: updateData },
            { new: true }
        );

        if (!sale) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        res.json({
            success: true,
            data: sale
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getSales = async (req, res) => {
    try {
        const { date, houseNo, flockNo } = req.query;
        let query = { userId: req.user.id };

        if (houseNo) {
            query.houseNo = houseNo;
        }

        if (flockNo) {
            query.flockNo = flockNo;
        }

        if (date) {
            // Filter entirely by the specified date string (assuming format 'YYYY-MM-DD')
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.date = { $gte: startDate, $lte: endDate };
        }

        const sales = await Sale.find(query).sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err);
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
