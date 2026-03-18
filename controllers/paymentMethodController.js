const PaymentMethod = require('../models/PaymentMethod');

// Get all online payment methods
exports.getOnlinePaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: paymentMethods.map(method => ({
                id: method._id,
                accountHolder: method.accountHolder,
                bankName: method.bankName,
                createdAt: method.createdAt
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Add new online payment method
exports.saveOnlinePaymentMethod = async (req, res) => {
    try {
        const { accountHolder, bankName } = req.body;

        // Validation
        if (!accountHolder || !bankName) {
            return res.status(400).json({
                success: false,
                message: 'Account holder name and bank name are required'
            });
        }

        const newPaymentMethod = new PaymentMethod({
            accountHolder,
            bankName,
            createdAt: new Date()
        });

        await newPaymentMethod.save();

        res.status(201).json({
            success: true,
            message: 'Payment method added successfully',
            data: {
                id: newPaymentMethod._id,
                accountHolder: newPaymentMethod.accountHolder,
                bankName: newPaymentMethod.bankName
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
