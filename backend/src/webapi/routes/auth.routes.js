const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Authentication routes
router.get('/auth/login', authController.getLoginView);
router.get('/auth/register', authController.getRegisterView);
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/logout', authController.logout);

module.exports = router;
