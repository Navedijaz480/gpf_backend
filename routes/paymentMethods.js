const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

// GET /api/payment-methods - Get all online payment methods
router.get('/', paymentMethodController.getOnlinePaymentMethods);

// POST /api/payment-methods - Add new online payment method
router.post('/', paymentMethodController.saveOnlinePaymentMethod);

module.exports = router;
