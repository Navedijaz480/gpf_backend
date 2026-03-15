const Settings = require('../models/Settings');

// Get all settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.find().populate('createdBy', 'username email');
        res.json({
            success: true,
            data: settings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create new settings
exports.createSettings = async (req, res) => {
    try {
        const { houseNo, flockNo, price, date } = req.body;

        // Validate required fields
        if (!houseNo || !flockNo || !price || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const settings = new Settings({
            houseNo,
            flockNo,
            price,
            date,
            createdBy: req.user.id
        });

        await settings.save();

        res.status(201).json({
            success: true,
            data: settings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { houseNo, flockNo, price, date } = req.body;

        const settings = await Settings.findByIdAndUpdate(
            id,
            { houseNo, flockNo, price, date },
            { new: true, runValidators: false }
        );

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found'
            });
        }

        res.json({
            success: true,
            data: settings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Delete settings
exports.deleteSettings = async (req, res) => {
    try {
        const { id } = req.params;

        const settings = await Settings.findById(id);
        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found'
            });
        }

        await Settings.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Settings deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
