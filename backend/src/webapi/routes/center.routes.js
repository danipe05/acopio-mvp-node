const express = require('express');
const router = express.Router();
const centerController = require('../controllers/center.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

// Apply auth middlewares to all admin center routes
router.use(isAuthenticated);
router.use(requireRole('ADMIN'));

// Route definitions
router.get('/admin/centers', centerController.getCenters);
router.get('/admin/centers/new', centerController.getNewForm);
router.post('/admin/centers', centerController.createCenter);
router.get('/admin/centers/:id/edit', centerController.getEditForm);
router.put('/admin/centers/:id', centerController.updateCenter);

module.exports = router;
