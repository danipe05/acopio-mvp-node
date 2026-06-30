const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');
const { isAuthenticated, requireRole } = require('../middlewares/auth.middleware');

// Apply auth middlewares to all admin volunteer routes
router.use(isAuthenticated);
router.use(requireRole('ADMIN'));

// Route definitions
router.get('/admin/volunteers', volunteerController.getVolunteers);
router.post('/admin/volunteers', volunteerController.createVolunteer);
router.delete('/admin/volunteers/:id', volunteerController.deleteVolunteer);

module.exports = router;
