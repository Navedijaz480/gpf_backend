const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    vehicleNo: { type: String, required: true },
    houseNo: { type: String, required: true },
    flockNo: { type: String, required: true },
    weight1: { type: Number, default: 0 },
    weight2: { type: Number, default: 0 },
    netWeight: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    due: { type: Number, default: 0 },
    brokerName: { type: String },
    commission: { type: Number, default: 0 },
    cashAmount: { type: Number, default: 0 },
    bankPayments: [
        {
            amount: { type: Number, default: 0 },
            accountTitle: { type: String },
            bankName: { type: String }
        }
    ],
    advance: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['Cash', 'Bank', 'Mixed'], default: 'Cash' },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Sale', SaleSchema);
