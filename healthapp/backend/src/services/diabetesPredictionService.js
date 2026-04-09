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
const _runInference = (features) => {
  let score = 20; // Initial metabolic baseline.

  const {
    familyDiabetes, highBP, physicallyActive, bmi,
    smoking, alcohol, sleepHours, soundSleep,
    regularMedicine, junkFood, stress, bpLevel,
    pregnancies, prediabetes, urinationFreq,
    ageGroup, gender,
  } = features;

  // 1. HEREDITARY & CLINICAL HISTORY (Core Vectors)
  if (familyDiabetes)  score += 15;
  if (prediabetes)     score += 18;
  if (highBP)          score += 10;

  // 2. BIOMETRIC VOLUME (BMI Banding)
  if (bmi >= 25 && bmi < 30) score += 8;
  if (bmi >= 30 && bmi < 35) score += 14;
  if (bmi >= 35)             score += 20;

  // 3. LIFESTYLE VECTORS (Activity & Diet)
  if (physicallyActive === 'none')    score += 10;
  if (physicallyActive === 'lt30')    score += 5;
  if (junkFood === 'often')           score += 6;
  if (junkFood === 'veryOften')       score += 10;

  // 4. METABOLIC DISRUPTORS (Sleep & Stress)
  if (sleepHours < 6)     score += 7;
  if (stress === 'veryOften')  score += 9;
  if (stress === 'always')     score += 14;

  // 5. SECONDARY PHYSIOLOGICAL SYMPTOMS
  if (bpLevel === 'high') score += 10;
  if (urinationFreq === 'quiteOften') score += 8;

  // 6. LIFE-STAGE SENSITIVITY (Age-group weighting)
  if (ageGroup === '50-59')       score += 10;
  if (ageGroup === '60 or above') score += 15;

  return Math.min(Math.max(Math.round(score), 0), 100);
};

/**
 * INTERNAL: TIER CLASSIFICATION
 * Maps the risk score to clinical labels used in reporting.
 */
const _toRiskLabel = (score) => {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

/**
 * INTERNAL: UI SEMANTIC BANDS (_toRiskBand)
 * Standardizes the risk visual language for the Patient Dashboard.
 */
const _toRiskBand = (score) => {
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

/**
 * INTERNAL: NARRATIVE INTERPRETATION
 * Provides a text-based summary of the metabolic state.
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
 * 
 * Logic:
 *   - Clinical Urgency: Suggests bloodwork for High/Very High bands.
 *   - Modifiable Behaviors: Targeting specific outliers in BMI, Diet, and Sleep.
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
 *   - Aggregates the internal scoring, labeling, and intervention logic.
 *   - Returns a structured diagnostic payload for the backend control flow.
 */
const predict = (features) => {
  const score = _runInference(features);
  const label = _toRiskLabel(score);

  return {
    prediction:      label,
    confidence:      parseFloat((score / 100).toFixed(4)),
    riskBand:        _toRiskBand(score),
    riskScore:       score,
    interpretation:  _interpretation(label),
    recommendations: _recommendations(features, label),
  };
};

module.exports = { predict };


