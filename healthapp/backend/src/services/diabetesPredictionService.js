/**
 * METASCALE HEALTH: METABOLIC DIABETES INFERENCE ENGINE (diabetesPredictionService.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This service acts as the 'Metabolic Risk Evaluator'. It specializes in 
 * Type 2 Diabetes (T2D) indicators, analyzing a multi-dimensional array 
 * of lifestyle, biometric, and hereditary data to quantify risk.
 * 
 * ─── INFERENCE ARCHITECTURE: MULTIVARIATE SCORING ───────────────────────────
 * Unlike discrete liver enzymes, Diabetes risk is heavily influenced by 
 * behavioral clusters. Our model weights reflect this:
 *   1. PRIMARY VECTORS: Family history and pre-diabetes flags (High weights).
 *   2. PHYSIOLOGICAL MARKERS: BMI (Body Mass Index) and BP levels.
 *   3. ENVIRONMENTAL STRESSORS: Sleep quality, perceived stress, and 
 *      nutritional habits (junk food frequency) are used as metabolic 
 *      disruptor variables.
 * 
 * ─── LIFESTYLE INTERVENTION ENGINE ──────────────────────────────────────────
 * Generates clinical directives focusing on modifiable risk factors—primarily 
 * diet, physical activity, and stress management protocols.
 */

const { runInference } = require('../utils/mlEngine');

/**
 * INTERNAL: TIER CLASSIFICATION
 */
const _toRiskLabel = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: UI SEMANTIC BANDS
 */
const _toRiskBand = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

/**
 * INTERNAL: NARRATIVE INTERPRETATION
 */
const _interpretation = (label) => {
  const map = {
    Low:         'Metabolic indicators suggest low immediate risk. Maintain your current active profile.',
    Moderate:    'Modifiable risk factors detected. Focus on incremental dietary and activity adjustments.',
    High:        'Risk vectors are elevated. A clinical blood glucose (Fasting/HbA1c) audit is recommended.',
    'Very High': 'Profile suggests high metabolic stress. Immediate specialist consultation for T2D screening is required.',
  };
  return map[label];
};

/**
 * INTERNAL: LIFESTYLE INTERVENTION ENGINE
 */
const _recommendations = (features, label) => {
  const recs = [];
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult an Endocrinologist for an HbA1c diagnostic benchmark.');
    recs.push('Initiate a daily fasting blood glucose tracking log.');
  }
  if (parseFloat(features.bmi) >= 25) recs.push('Implement a caloric-deficit diet aimed at BMI normalization.');
  if (['often', 'veryOften'].includes(String(features.junkFood).toLowerCase())) {
    recs.push('Restrict processed carbohydrate and refined sugar intake.');
  }
  recs.push('Engage in 30 minutes of cardiovascular activity daily.');
  return recs;
};

/**
 * PUBLIC EXPORT: DIABETES PREDICTION ORCHESTRATOR (predict)
 * 
 * Logic:
 *   - Pure ML Pipeline: Strictly uses trained Random Forest kernel via mlEngine utility.
 */
const predict = async (features) => {
  try {
    // 1. Sanitize features for ML compatibility
    const sanitized = {
      ageGroup: String(features.ageGroup || 'less than 40'),
      gender: String(features.gender || 'male').toLowerCase(),
      familyDiabetes: features.familyDiabetes === true || features.familyDiabetes === 'yes',
      highBP: features.highBP === true || features.highBP === 'yes',
      physicallyActive: String(features.physicallyActive || 'none'),
      bmi: parseFloat(features.bmi || 25.0),
      smoking: features.smoking === true || features.smoking === 'yes',
      alcohol: features.alcohol === true || features.alcohol === 'yes',
      sleepHours: parseFloat(features.sleepHours || 7),
      soundSleep: parseFloat(features.soundSleep || 6),
      regularMedicine: features.regularMedicine === true || features.regularMedicine === 'yes',
      junkFood: String(features.junkFood || 'occasionally'),
      stress: String(features.stress || 'sometimes'),
      bpLevel: String(features.bpLevel || 'normal').toLowerCase(),
      pregnancies: parseFloat(features.pregnancies || 0),
      prediabetes: features.prediabetes === true || features.prediabetes === 'yes',
      urinationFreq: String(features.urinationFreq || 'not much')
    };

    // 2. Execute Primary ML Inference via centralized engine
    const mlResult = await runInference('diabetes', sanitized);
    const prob = mlResult.probability;
    const label = _toRiskLabel(prob);
    const score = Math.round(prob * 100);

    return {
      prediction:      label,
      confidence:      parseFloat(prob.toFixed(4)),
      riskBand:        _toRiskBand(prob),
      riskScore:       score,
      interpretation:  _interpretation(label),
      recommendations: _recommendations(features, label),
      ml_prediction:   mlResult.prediction,
      features:        sanitized
    };
  } catch (err) {
    console.error('[DIABETES SERVICE] ML Core Error:', err.message);
    return {
      prediction: 'Inference Failure',
      confidence: 0,
      riskBand: 'Service Offline',
      riskScore: 0,
      interpretation: `Metabolic Engine Critical Fault: ${err.message}. Please verify the Python environment and required packages.`,
      recommendations: ['Check system connection.', 'Ensure virtual environment is configured correctly.']
    };
  }
};

module.exports = { predict };
