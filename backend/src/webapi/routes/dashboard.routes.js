const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

router.get('/admin/dashboard', isAuthenticated, requireRole('ADMIN'), dashboardController.getDashboardView);
router.get('/admin/dashboard/stats', isAuthenticated, requireRole('ADMIN'), dashboardController.getStats);

module.exports = router;
