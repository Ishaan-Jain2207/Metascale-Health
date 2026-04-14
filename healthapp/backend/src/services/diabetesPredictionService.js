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

/**
 * INTERNAL: METABOLIC INFERENCE COMPUTATION (_runInference)
 * 
 * Logic:
 *   - Baseline: Starts at an initial floor of 20.
 *   - Hierarchical Weighting: Prioritizes hereditary factors (Family history) 
 *     first, followed by current physiological state (BMI), then lifestyle behaviors.
 *   - Normalization: Scores are clamped to 100 to provide a probabilistic 
 *     confidence tier.
 */
const { execFile } = require('child_process');
const path = require('path');

/**
 * INTERNAL: METABOLIC INFERENCE COMPUTATION (_runInference)
 * 
 * Logic: Spawns the Python inference engine to perform Random Forest analysis
 * using the trained .pkl models from the project notebooks.
 */
const _runInference = (features) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '../../../../venv/bin/python');
    const scriptPath = path.join(__dirname, '../../scripts/inference.py');
    
    execFile(pythonPath, [scriptPath, 'diabetes', JSON.stringify(features)], (error, stdout, stderr) => {
      if (error) {
        console.error('[ML ENGINE ERROR]:', stderr);
        return reject(new Error('Inference engine failure'));
      }
      try {
        const result = JSON.parse(stdout);
        if (result.status === 'error') {
          return reject(new Error(result.message));
        }
        resolve(result);
      } catch (e) {
        reject(new Error('Invalid output from inference engine'));
      }
    });
  });
};

/**
 * INTERNAL: TIER CLASSIFICATION
 * Maps the risk probability to clinical labels used in reporting.
 */
const _toRiskLabel = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: UI SEMANTIC BANDS (_toRiskBand)
 * Standardizes the risk visual language for the Patient Dashboard.
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
 * Provides a text-based summary of the metabolic state based on probability.
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
 * INTERNAL: LIFESTYLE INTERVENTION ENGINE (_recommendations)
 */
const _recommendations = (features, label) => {
  const recs = [];
  
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult an Endocrinologist for an HbA1c diagnostic benchmark.');
    recs.push('Initiate a daily fasting blood glucose tracking log.');
  }

  if (features.bmi >= 25) recs.push('Implement a caloric-deficit diet aimed at BMI normalization.');
  if (features.physicallyActive === 'none' || features.physicallyActive === 'lt30') {
    recs.push('Engage in 30 minutes of cardiovascular activity (e.g., brisk walking) daily.');
  }
  if (features.junkFood === 'often' || features.junkFood === 'veryOften') {
    recs.push('Restrict processed carbohydrate and refined sugar intake.');
  }
  if (features.stress === 'always') recs.push('Explore cortisol-management techniques (Mindfulness, Yoga).');
  
  return recs;
};

/**
 * PUBLIC EXPORT: DIABETES PREDICTION ORCHESTRATOR (predict)
 * 
 * Logic:
 *   - Orchestrates the call to the Python ML kernel.
 *   - Returns a structured diagnostic payload for the backend control flow.
 */
const predict = async (features) => {
  try {
    const mlResult = await _runInference(features);
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
      ml_prediction:   mlResult.prediction // "Diabetic" or "Not Diabetic"
    };
  } catch (err) {
    console.error('[DIABETES SERVICE] ML Integration Fault:', err);
    // Graceful fallback to a neutral state if ML fails
    return {
      prediction: 'Review Required',
      confidence: 0,
      riskBand: 'Unknown',
      riskScore: 0,
      interpretation: 'Metabolic engine offline. Please consult a clinician.',
      recommendations: ['Check system connection.', 'Manual benchmark required.']
    };
  }
};

module.exports = { predict };



