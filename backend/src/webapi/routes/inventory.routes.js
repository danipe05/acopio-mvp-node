const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

const auth = [isAuthenticated, requireRole('VOLUNTEER')];

// Entry routes
router.get('/volunteer/inventory/in', auth, inventoryController.getEntryForm);
router.post('/volunteer/inventory/in', auth, inventoryController.registerEntry);

// Exit routes
router.get('/volunteer/inventory/out', auth, inventoryController.getExitForm);
router.post('/volunteer/inventory/out', auth, inventoryController.registerExit);

// Stock consultation routes
router.get('/volunteer/inventory/stock', auth, inventoryController.getStockView);
router.get('/volunteer/inventory/stock/search', auth, inventoryController.searchStock);

// Movements history routes
router.get('/volunteer/inventory/movements', auth, inventoryController.getMovementsHistory);

module.exports = router;
