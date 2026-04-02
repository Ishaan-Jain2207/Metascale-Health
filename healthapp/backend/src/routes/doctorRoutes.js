const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Get all patients (Doctor Only)
router.get('/patients', protect, authorize('doctor', 'admin'), doctorController.getAllPatients);

// Get patient detail (Doctor Only)
router.get('/patients/:id', protect, authorize('doctor', 'admin'), doctorController.getPatientDetail);

// Review screening (Doctor Only)
router.post('/review/:type/:id', protect, authorize('doctor'), doctorController.reviewScreening);

// Dashboard stats (Doctor Only)
router.get('/stats', protect, authorize('doctor'), doctorController.getDashboardStats);

module.exports = router;
