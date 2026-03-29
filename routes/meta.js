const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');
const auth = require('../middleware/auth');

router.get('/current', auth, metaController.getCurrentMeta);
router.get('/vehicles', auth, metaController.getVehicles);
router.get('/brokers', auth, metaController.getBrokers);
router.post('/brokers', auth, metaController.addBroker);
router.get('/houses', auth, metaController.getHouses);
router.get('/last-rate', auth, metaController.getLastRate);
router.get('/flocks', auth, metaController.getFlocks);
router.get('/vehicle-history/:vehicleNo', auth, metaController.getVehicleWeightHistory);

module.exports = router;
