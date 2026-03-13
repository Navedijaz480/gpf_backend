const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middleware/auth');

router.post('/', auth, salesController.createSale);
router.get('/', auth, salesController.getSales);
router.get('/summary', auth, salesController.getSummary);
router.get('/today', auth, salesController.getTodaySales);
router.get('/flock-summary', auth, salesController.getFlockSummary);
router.get('/house-summary', auth, salesController.getHouseSummary);

module.exports = router;
