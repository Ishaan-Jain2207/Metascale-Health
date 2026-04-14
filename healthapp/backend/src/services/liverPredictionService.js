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

const { runInference } = require('../utils/mlEngine');

/**
 * INTERNAL: RISK STRATIFICATION MAPPING
 */
const _toRiskLabel = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: DASHBOARD SEMANTICS
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
const _interpretation = (prob, label) => {
  const map = {
    Low:      'Liver indicators are within physiological range. Maintain regular hydration.',
    Moderate: 'Mild elevation observed. Monitoring biometrics via quarterly check-ups is advised.',
    High:     'Significant enzymatic elevation detected. Specialist evaluation is required.',
    'Very High': 'High probability of hepatic stress. Seek immediate medical diagnostic review.',
  };
  return map[label] || 'Specialist consultation necessary.';
};

/**
 * INTERNAL: INTERVENTION ENGINE
 */
const _recommendations = (features, label) => {
  const recs = [];
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult a Hepatologist for a comprehensive FibroScan.');
    recs.push('Immediate panel verification (LFT, PT/INR) required.');
  }
  if (['regular', 'heavy'].includes(String(features.alcoholPattern).toLowerCase())) {
    recs.push('Abstain from alcohol to reduce metabolic strain on hepatocytes.');
  }
  if (parseFloat(features.albumin) < 3.5) recs.push('Review nutritional protein markers with a clinical dietician.');
  recs.push('Avoid non-prescription hepatotoxic substances.');
  return recs;
};

/**
 * PUBLIC EXPORT: CLINICAL PREDICTION ORCHESTRATOR (predict)
 * 
 * Logic:
 *   - Pure ML Pipeline: Strictly uses trained Random Forest kernel via mlEngine utility.
 */
const predict = async (features) => {
  try {
    // 1. Sanitize features for ML compatibility
    const sanitized = {
      age: parseFloat(features.age || 0),
      gender: String(features.gender || 'male').toLowerCase(),
      totalBilirubin: parseFloat(features.totalBilirubin || 0),
      directBilirubin: parseFloat(features.directBilirubin || 0),
      alkalinePhosphotase: parseFloat(features.alkalinePhosphotase || 0),
      alamineAminotransferase: parseFloat(features.alamineAminotransferase || 0),
      aspartateAminotransferase: parseFloat(features.aspartateAminotransferase || 0),
      totalProteins: parseFloat(features.totalProteins || 0),
      albumin: parseFloat(features.albumin || 0),
      albuminGlobulinRatio: parseFloat(features.albuminGlobulinRatio || 0)
    };

    // 2. Execute Primary ML Inference via centralized engine
    const mlResult = await runInference('liver', sanitized);
    const prob = mlResult.probability;
    const label = _toRiskLabel(prob);
    const score = Math.round(prob * 100);

    return {
      prediction:      label,
      confidence:      parseFloat(prob.toFixed(4)),
      riskBand:        _toRiskBand(prob),
      riskScore:       score,
      interpretation:  _interpretation(prob, label),
      recommendations: _recommendations(features, label),
      ml_prediction:   mlResult.prediction,
      features:        sanitized
    };
  } catch (err) {
    console.error('[LIVER SERVICE] ML Core Error:', err.message);
    // Graceful error state for UI stability
    return {
      prediction: 'Inference Failure',
      confidence: 0,
      riskBand: 'Service Offline',
      riskScore: 0,
      interpretation: `ML Engine Critical Fault: ${err.message}. Please verify the Python environment and required packages.`,
      recommendations: ['Check system connection.', 'Ensure virtual environment is configured correctly.']
    };
  }
};

module.exports = { predict };
