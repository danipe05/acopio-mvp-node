const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/dashboard/stats', isAuthenticated, dashboardController.getStats);

module.exports = router;
