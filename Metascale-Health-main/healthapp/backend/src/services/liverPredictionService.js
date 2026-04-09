/**
 * Liver Prediction Service
 *
 * Architecture Note:
 *   This module is the single integration point for the liver ML model.
 *   To swap in a real trained model (Python pickle / ONNX / TF.js),
 *   replace the `_runInference` function below with actual model calls
 *   while keeping the public `predict` function signature intact.
 */

/**
 * Compute a feature-weighted risk score based on clinical heuristics.
 * Returns a value 0–100 representing the likelihood of liver disease.
 */
const _runInference = (features) => {
  let score = 30; // baseline

  const {
    totalBilirubin, directBilirubin,
    alkalinePhosphotase, alamineAminotransferase, aspartateAminotransferase,
    totalProteins, albumin, albuminGlobulinRatio,
    alcoholPattern, priorLiverDiagnosis, liverTestResult,
    age, gender,
  } = features;

  // ── Bilirubin ──────────────────────────────────────────────
  if (totalBilirubin > 1.2)  score += 8;
  if (totalBilirubin > 3.0)  score += 10;
  if (directBilirubin > 0.4) score += 5;
  if (directBilirubin > 1.0) score += 8;

  // ── Enzymes ────────────────────────────────────────────────
  if (alkalinePhosphotase > 120)  score += 7;
  if (alkalinePhosphotase > 300)  score += 8;
  if (alamineAminotransferase > 40)  score += 6;
  if (alamineAminotransferase > 120) score += 8;
  if (aspartateAminotransferase > 40)  score += 6;
  if (aspartateAminotransferase > 120) score += 8;

  // ── Proteins ───────────────────────────────────────────────
  if (totalProteins < 6.0)        score += 5;
  if (albumin < 3.5)              score += 8;
  if (albuminGlobulinRatio < 1.0) score += 6;

  // ── Alcohol ────────────────────────────────────────────────
  if (alcoholPattern === 'regular') score += 10;
  if (alcoholPattern === 'heavy')   score += 18;

  // ── Prior diagnosis & test result ──────────────────────────
  if (priorLiverDiagnosis)              score += 15;
  if (liverTestResult === 'mildAbnormal')   score += 8;
  if (liverTestResult === 'clearAbnormal')  score += 18;

  // ── Demographics ───────────────────────────────────────────
  if (age > 50) score += 5;
  if (age > 65) score += 5;
  if (gender === 'male') score += 3;

  return Math.min(Math.max(Math.round(score), 0), 100);
};

const _toRiskLabel = (score) => {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

const _toRiskBand = (score) => {
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

const _interpretation = (score, label) => {
  const map = {
    Low:      'Your liver-related indicators appear largely within normal range. Maintaining a healthy lifestyle is recommended.',
    Moderate: 'Some liver markers are mildly elevated. Clinical review within the next 3 months is advisable.',
    High:     'Several liver markers are significantly elevated. Prompt clinical consultation is strongly advised.',
    'Very High': 'Your screening values indicate a high probability of liver dysfunction. Immediate medical evaluation is required.',
  };
  return map[label] || 'Please consult a healthcare professional for a detailed assessment.';
};

const _recommendations = (features, label) => {
  const recs = [];
  if (['High', 'Very High'].includes(label)) {
    recs.push('Schedule an appointment with a hepatologist immediately.');
    recs.push('Get a comprehensive liver function test (LFT) panel.');
  }
  if (features.alcoholPattern === 'regular' || features.alcoholPattern === 'heavy') {
    recs.push('Significantly reduce or eliminate alcohol consumption.');
  }
  if (features.albumin < 3.5) recs.push('Increase dietary protein intake and consult a nutritionist.');
  if (features.totalBilirubin > 3.0) recs.push('An ultrasound of the abdomen is recommended.');
  recs.push('Stay hydrated and avoid hepatotoxic medications without medical supervision.');
  if (label === 'Low') recs.push('Continue routine health check-ups annually.');
  return recs;
};

/**
 * Public prediction function.
 * @param {object} features - raw form inputs
 * @returns {object} prediction result
 */
const predict = (features) => {
  const score = _runInference(features);
  const label = _toRiskLabel(score);

  return {
    prediction:     label,
    confidence:     parseFloat((score / 100).toFixed(4)),
    riskBand:       _toRiskBand(score),
    riskScore:      score,
    interpretation: _interpretation(score, label),
    recommendations: _recommendations(features, label),
  };
};

module.exports = { predict };
