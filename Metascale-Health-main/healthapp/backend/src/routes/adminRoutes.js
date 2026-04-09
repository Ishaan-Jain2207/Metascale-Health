const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Get all doctors (Admin only)
router.get('/doctors', protect, authorize('admin'), adminController.getDoctors);

// Get analytics (Admin only)
router.get('/analytics', protect, authorize('admin'), adminController.getSystemAnalytics);

// Toggle user status (Admin only)
router.put('/users/:id/status', protect, authorize('admin'), adminController.toggleUserStatus);

// Approve doctor (Admin only)
router.put('/doctors/:id/approve', protect, authorize('admin'), adminController.approveDoctor);

module.exports = router;
