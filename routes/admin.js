const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes require both authentication and admin role
router.use(auth, adminAuth);

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.get('/sales', adminController.getAllSales);
router.get('/vehicles', adminController.getAllVehicles);
router.get('/stats', adminController.getAdminStats);

module.exports = router;
