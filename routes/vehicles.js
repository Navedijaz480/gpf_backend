const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vehicleController = require('../controllers/vehicleController');

// Apply auth middleware to all routes
router.use(auth);

// GET /api/vehicles - Get all vehicles
router.get('/', vehicleController.getVehicles);

// POST /api/vehicles - Create or update vehicle
router.post('/', vehicleController.createOrUpdateVehicle);

// GET /api/vehicles/:vehicleNumber - Get vehicle by number
router.get('/:vehicleNumber', vehicleController.getVehicleByNumber);

// GET /api/vehicles/broker/:brokerName - Get vehicles by broker name
router.get('/broker/:brokerName', vehicleController.getVehiclesByBroker);

module.exports = router;
