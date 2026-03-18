const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
    accountHolder: {
        type: String,
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
