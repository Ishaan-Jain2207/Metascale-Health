const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const aiSvc = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

// Liver Screening (Patient Only)
router.post('/liver', [
  protect,
  authorize('patient'),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('totalBilirubin').isNumeric().withMessage('Total bilirubin must be a number'),
  body('directBilirubin').isNumeric().withMessage('Direct bilirubin must be a number'),
  body('alkalinePhosphotase').isNumeric().withMessage('Alkaline phosphotase must be a number'),
  body('alamineAminotransferase').isNumeric().withMessage('ALT must be a number'),
  body('aspartateAminotransferase').isNumeric().withMessage('AST must be a number')
], predictionController.submitLiver);

// Diabetes Screening (Patient Only)
router.post('/diabetes', [
  protect,
  authorize('patient'),
  body('ageGroup').notEmpty().withMessage('Age group is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('bmi').isNumeric().withMessage('BMI must be a number')
], predictionController.submitDiabetes);

// History (Patient gets their own, Doctor/Admin with userId param)
router.get('/history', protect, predictionController.getHistory);
router.get('/history/:userId', protect, authorize('doctor', 'admin'), predictionController.getHistory);

// Detail
router.get('/detail/:type/:id', protect, predictionController.getScreeningDetail);

// AI Insight (On-demand)
router.post('/explain', protect, async (req, res, next) => {
  try {
    const { type, data, result } = req.body;
    const explanation = await aiSvc.explainScreening(type, data, result);
    return sendSuccess(res, { explanation });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
