const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

// Apply authentication and role check (VOLUNTEER or ADMIN)
router.use(isAuthenticated);
router.use(requireRole('VOLUNTEER'));

// Entry routes
router.get('/volunteer/inventory/in', inventoryController.getEntryForm);
router.post('/volunteer/inventory/in', inventoryController.registerEntry);

// Exit routes
router.get('/volunteer/inventory/out', inventoryController.getExitForm);
router.post('/volunteer/inventory/out', inventoryController.registerExit);

module.exports = router;
