const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// Apply auth middleware to all routes
router.use(auth);

// GET /api/settings - Get all settings
router.get('/', settingsController.getSettings);

// POST /api/settings - Create new settings
router.post('/', settingsController.createSettings);

// PUT /api/settings/:id - Update settings
router.put('/:id', settingsController.updateSettings);

// DELETE /api/settings/:id - Delete settings
router.delete('/:id', settingsController.deleteSettings);

module.exports = router;
