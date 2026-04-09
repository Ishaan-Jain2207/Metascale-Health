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
const _runInference = (features) => {
  let score = 30; // Calibrated clinical baseline.

  const {
    totalBilirubin, directBilirubin,
    alkalinePhosphotase, alamineAminotransferase, aspartateAminotransferase,
    totalProteins, albumin, albuminGlobulinRatio,
    alcoholPattern, priorLiverDiagnosis, liverTestResult,
    age, gender,
  } = features;

  // 1. BIOMARKER AUDIT: BILIRUBIN (Excretory Function)
  if (totalBilirubin > 1.2)  score += 8;
  if (totalBilirubin > 3.0)  score += 10;
  if (directBilirubin > 0.4) score += 5;
  if (directBilirubin > 1.0) score += 8;

  // 2. BIOMARKER AUDIT: ENZYMES (Cellular Integrity)
  if (alkalinePhosphotase > 120)  score += 7;
  if (alkalinePhosphotase > 300)  score += 8;
  if (alamineAminotransferase > 40)  score += 6;
  if (alamineAminotransferase > 120) score += 8;
  if (aspartateAminotransferase > 40)  score += 6;
  if (aspartateAminotransferase > 120) score += 8;

  // 3. BIOMARKER AUDIT: PROTEINS (Synthesis Capacity)
  if (totalProteins < 6.0)        score += 5;
  if (albumin < 3.5)              score += 8;
  if (albuminGlobulinRatio < 1.0) score += 6;

  // 4. LIFESTYLE MULTIPLIERS
  if (alcoholPattern === 'regular') score += 10;
  if (alcoholPattern === 'heavy')   score += 18;

  // 5. HISTORICAL RISK VECTOR
  if (priorLiverDiagnosis)              score += 15;
  if (liverTestResult === 'mildAbnormal')   score += 8;
  if (liverTestResult === 'clearAbnormal')  score += 18;

  // 6. DEMOGRAPHIC SENSITIVITY
  if (age > 50) score += 5;
  if (gender === 'male') score += 3;

  return Math.min(Math.max(Math.round(score), 0), 100);
};

/**
 * INTERNAL: RISK STRATIFICATION MAPPING
 * Bridges the gap between numerical scores and clinical risk bands.
 */
const _toRiskLabel = (score) => {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: DASHBOARD SEMANTICS (_toRiskBand)
 * Maps the risk profile to the UI-standardized semantic tiers.
 */
const _toRiskBand = (score) => {
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

/**
 * INTERNAL: NARRATIVE INTERPRETATIONMAP
 * Pre-calibrated clinical summaries for the patient portal.
 */
const _interpretation = (score, label) => {
  const map = {
    Low:      'Liver indicators are within physiological range. Maintain regular hydration.',
    Moderate: 'Mild elevation observed. Monitoring biometrics via quarterly check-ups is advised.',
    High:     'Significant enzymatic elevation detected. Specialist evaluation is required.',
    'Very High': 'High probability of hepatic stress. Seek immediate medical diagnostic review.',
  };
  return map[label] || 'Specialist consultation necessary.';
};

/**
 * INTERNAL: INTERVENTION ENGINE (_recommendations)
 * 
 * Logic:
 *   - Urgency Tiering: Provides baseline directives for High-Risk bands.
 *   - Specificity: Injects directives based on individual biomarkers 
 *     (e.g., Albumin -> Dietary Protein).
 */
const _recommendations = (features, label) => {
  const recs = [];
  
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult a Hepatologist for a comprehensive FibroScan.');
    recs.push('Immediate panel verification (LFT, PT/INR) required.');
  }

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
 *   - Orchestrates the full internal pipeline from inference to recommendation.
 *   - Wraps the finalized profile into a structured schema for the persistence layer.
 */
const predict = (features) => {
  const score = _runInference(features);
  const label = _toRiskLabel(score);

  return {
    prediction:      label,
    confidence:      parseFloat((score / 100).toFixed(4)),
    riskBand:        _toRiskBand(score),
    riskScore:       score,
    interpretation:  _interpretation(score, label),
    recommendations: _recommendations(features, label),
  };
};

module.exports = { predict };


