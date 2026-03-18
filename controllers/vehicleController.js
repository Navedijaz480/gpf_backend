const Vehicle = require('../models/Vehicle');

// Get all vehicles
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('createdBy', 'username email');
        res.json({
            success: true,
            data: vehicles
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create or update vehicle
exports.createOrUpdateVehicle = async (req, res) => {
    try {
        const { vehicleNumber, brokerName, houseNo, flockNo } = req.body;

        if (!vehicleNumber || !brokerName || !houseNo || !flockNo) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if vehicle already exists
        let vehicle = await Vehicle.findOne({ vehicleNumber });

        if (vehicle) {
            // Update existing vehicle
            if (vehicle.brokerName !== brokerName) {
                vehicle.brokerName = brokerName;
                await vehicle.save();
            }
            res.json({
                success: true,
                data: vehicle,
                message: 'Vehicle broker updated'
            });
        } else {
            // Create new vehicle
            const newVehicle = new Vehicle({
                vehicleNumber,
                brokerName,
                houseNo,
                flockNo,
                createdBy: req.user.id
            });

            await newVehicle.save();
            res.status(201).json({
                success: true,
                data: newVehicle,
                message: 'Vehicle created'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get single vehicle by number
exports.getVehicleByNumber = async (req, res) => {
    try {
        const { vehicleNumber } = req.params;
        const vehicle = await Vehicle.findOne({ vehicleNumber }).populate('createdBy', 'username email');
        
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.json({
            success: true,
            data: vehicle
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get vehicles by broker name
exports.getVehiclesByBroker = async (req, res) => {
    try {
        const { brokerName } = req.params;
        const vehicles = await Vehicle.find({ 
            brokerName: { $regex: `^${brokerName}`, $options: 'i' } 
        }).populate('createdBy', 'username email');
        
        res.json({
            success: true,
            data: vehicles
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
