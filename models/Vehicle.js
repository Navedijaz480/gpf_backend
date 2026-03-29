const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    brokerName: {
        type: String,
        trim: true
    },
    houseNo: {
        type: String,
        required: true,
        trim: true
    },
    flockNo: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
