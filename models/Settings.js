const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
