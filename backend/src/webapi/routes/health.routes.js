const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/health', healthController.checkHealth);
router.get('/info', healthController.getInfo);

module.exports = router;
