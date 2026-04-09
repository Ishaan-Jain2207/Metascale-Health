const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Book appointment (Patient only)
router.post('/book', protect, authorize('patient'), appointmentController.bookAppointment);

// Get patient appointments (Patient only)
router.get('/patient', protect, authorize('patient'), appointmentController.getPatientAppointments);

// Get doctor appointments (Doctor only)
router.get('/doctor', protect, authorize('doctor'), appointmentController.getDoctorAppointments);

// Update appointment status (Doctor only)
router.put('/:id/status', protect, authorize('doctor'), appointmentController.updateStatus);

module.exports = router;
