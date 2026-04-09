const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Register (Patient / Doctor)
router.post('/register', [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.registerUser);

// Login (All Roles)
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Public Doctor Discovery
router.get('/doctors', protect, authController.getDoctors);

// Get Me
router.get('/me', protect, authController.getMe);

// Update Profile
router.put('/update', protect, authController.updateProfile);

// Change Password
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
