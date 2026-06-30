const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

// Protect all catalog endpoints for ADMIN only
router.use(isAuthenticated);
router.use(requireRole('ADMIN'));

// Route definitions
router.get('/admin/catalog', catalogController.getCatalog);
router.get('/admin/catalog/items', catalogController.getItems);
router.get('/admin/catalog/destinations', catalogController.getDestinations);
router.post('/admin/catalog/items', catalogController.createItem);
router.post('/admin/catalog/destinations', catalogController.createDestination);

module.exports = router;
