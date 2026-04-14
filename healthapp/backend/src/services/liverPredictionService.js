/**
 * METASCALE HEALTH: CLINICAL LIVER INFERENCE ENGINE (liverPredictionService.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This service acts as the 'Diagnostic Kernel' for hepatic risk assessment. 
 * it processes normalized biological markers (raw biometrics) and computes 
 * a stratified clinical risk profile.
 * 
 * ─── INFERENCE ARCHITECTURE: THE HEURISTIC MODEL ────────────────────────────
 * Currently, we utilize a 'Weighted-Heuristic Model' which serves as a 
 * prerequisite for future machine-learning (ML) transition.
 *   1. BIOMARKER WEIGHTING: 
 *      - Enzymes (ALT/AST): Indicators of acute cellular inflammation.
 *      - Excretors (Bilirubin): Indicators of filtration efficiency.
 *      - Synthesizers (Albumin): Indicators of long-term functional capacity.
 *   2. MULTIPLIERS: Lifestyle vectors (Alcohol) and prior diagnosis 
 *      history act as non-linear score escalators.
 * 
 * ─── CLINICAL INTERVENTION ENGINE ───────────────────────────────────────────
 * Beyond scoring, this service generates a 'Protocol Cluster'—a set of 
 * actionable medical recommendations based on specific physiological outliers.
 */

/**
 * INTERNAL: CLINICAL INFERENCE COMPUTATION (_runInference)
 * 
 * Logic:
 *   - Baseline: Starts at a 'Calibrated Low' score of 30.
 *   - Physiological Triage: Iteratively increments the score based on 
 *     biomarker thresholds provided by standard clinical guidelines (e.g., AASLD).
 *   - Normalization: The final sum is clamped between 0 and 100 to 
 *     facilitate confidence-level calculation.
 */
const { execFile } = require('child_process');
const path = require('path');

/**
 * INTERNAL: CLINICAL INFERENCE COMPUTATION (_runInference)
 * 
 * Logic: Spawns the Python inference engine to perform Random Forest analysis
 * using the trained .pkl models from the project notebooks.
 */
const _runInference = (features) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '../../../../venv/bin/python');
    const scriptPath = path.join(__dirname, '../../scripts/inference.py');

    execFile(pythonPath, [scriptPath, 'liver', JSON.stringify(features)], (error, stdout, stderr) => {
      if (error) {
        console.error('[ML ENGINE ERROR]:', stderr);
        return reject(new Error(stderr || 'Inference engine failure'));
      }
      try {
        const result = JSON.parse(stdout);
        if (result.status === 'error') {
          return reject(new Error(result.message));
        }
        resolve(result);
      } catch (e) {
        reject(new Error('Invalid output from inference engine (BOM or partial JSON)'));
      }
    });
  });
};

/**
 * INTERNAL: RISK STRATIFICATION MAPPING
 * Bridges the gap between numerical probability and clinical risk bands.
 */
const _toRiskLabel = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: DASHBOARD SEMANTICS (_toRiskBand)
 * Maps the risk profile to the UI-standardized semantic tiers.
 */
const _toRiskBand = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

/**
 * INTERNAL: NARRATIVE INTERPRETATIONMAP
 * Pre-calibrated clinical summaries for the patient portal.
 */
const _interpretation = (prob, label) => {
  const map = {
    Low: 'Liver indicators are within physiological range. Maintain regular hydration.',
    Moderate: 'Mild elevation observed. Monitoring biometrics via quarterly check-ups is advised.',
    High: 'Significant enzymatic elevation detected. Specialist evaluation is required.',
    'Very High': 'High probability of hepatic stress. Seek immediate medical diagnostic review.',
  };
  return map[label] || 'Specialist consultation necessary.';
};

/**
 * INTERNAL: INTERVENTION ENGINE (_recommendations)
 */
const _recommendations = (features, label) => {
  const recs = [];

  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult a Hepatologist for a comprehensive FibroScan.');
    recs.push('Immediate panel verification (LFT, PT/INR) required.');
  }

  // Lifestyle advice still valid based on raw features
  if (features.alcoholPattern === 'regular' || features.alcoholPattern === 'heavy') {
    recs.push('Abstain from alcohol to reduce metabolic strain on hepatocytes.');
  }
  if (features.albumin < 3.5) recs.push('Review nutritional protein markers with a clinical dietician.');

  recs.push('Avoid non-prescription hepatotoxic substances.');
  return recs;
};

/**
 * PUBLIC EXPORT: CLINICAL PREDICTION ORCHESTRATOR (predict)
 * 
 * Logic:
 *   - Orchestrates the call to the Python ML kernel.
 *   - Wraps the ML output into the application's reporting schema.
 */
const predict = async (features) => {
  try {
    const mlResult = await _runInference(features);
    const prob = mlResult.probability;
    const label = _toRiskLabel(prob);
    const score = Math.round(prob * 100);

    return {
      prediction: label,
      confidence: parseFloat(prob.toFixed(4)),
      riskBand: _toRiskBand(prob),
      riskScore: score,
      interpretation: _interpretation(prob, label),
      recommendations: _recommendations(features, label),
      ml_prediction: mlResult.prediction // "Disease" or "No Disease"
    };
  } catch (err) {
    console.error('[LIVER SERVICE] ML Integration Fault:', err);
    // Graceful error reporting for the engine state
    return {
      prediction: 'Inference Failure',
      confidence: 0,
      riskBand: 'Service Offline',
      riskScore: 0,
      interpretation: `ML Engine Critical Fault: ${err.message}. Please verify the Python environment and required packages (pandas, joblib, scikit-learn).`,
      recommendations: ['Check system connection.', 'Retry clinical screening.']
    };
  }
};

module.exports = { predict };



