/**
 * Diabetes Prediction Service
 *
 * Architecture Note:
 *   Replace `_runInference` with real model inference to plug in a trained model.
 *   The public `predict` function signature must remain unchanged.
 */

const _runInference = (features) => {
  let score = 20;

  const {
    familyDiabetes, highBP, physicallyActive, bmi,
    smoking, alcohol, sleepHours, soundSleep,
    regularMedicine, junkFood, stress, bpLevel,
    pregnancies, prediabetes, urinationFreq,
    ageGroup, gender,
  } = features;

  // ── Family & personal history ──────────────────────────────
  if (familyDiabetes)  score += 15;
  if (prediabetes)     score += 18;
  if (highBP)          score += 10;

  // ── BMI ───────────────────────────────────────────────────
  if (bmi >= 25 && bmi < 30) score += 8;
  if (bmi >= 30 && bmi < 35) score += 14;
  if (bmi >= 35)             score += 20;

  // ── Lifestyle factors ─────────────────────────────────────
  if (physicallyActive === 'none')    score += 10;
  if (physicallyActive === 'lt30')    score += 5;
  if (junkFood === 'often')           score += 6;
  if (junkFood === 'veryOften')       score += 10;
  if (smoking)                        score += 5;
  if (alcohol)                        score += 4;

  // ── Sleep ─────────────────────────────────────────────────
  if (sleepHours < 6)     score += 7;
  if (soundSleep < 5)     score += 5;

  // ── Stress ────────────────────────────────────────────────
  if (stress === 'sometimes')  score += 4;
  if (stress === 'veryOften')  score += 9;
  if (stress === 'always')     score += 14;

  // ── BP level ──────────────────────────────────────────────
  if (bpLevel === 'high') score += 10;

  // ── Pregnancies ───────────────────────────────────────────
  if (pregnancies > 3) score += 6;

  // ── Urination ─────────────────────────────────────────────
  if (urinationFreq === 'quiteOften') score += 8;

  // ── Regular medicine ──────────────────────────────────────
  if (regularMedicine) score += 5;

  // ── Age group ─────────────────────────────────────────────
  if (ageGroup === '45-60') score += 8;
  if (ageGroup === '60+')   score += 14;

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

const _interpretation = (label) => {
  const map = {
    Low:         'Your lifestyle and health indicators suggest a low risk for diabetes at this time. Keep up healthy habits.',
    Moderate:    'You have some modifiable risk factors. Dietary changes and increased physical activity are recommended.',
    High:        'Multiple risk factors are present. A fasting blood glucose test and HbA1c measurement are advised soon.',
    'Very High': 'Your profile indicates a very high risk for type 2 diabetes. Immediate clinical evaluation is strongly advised.',
  };
  return map[label];
};

const _recommendations = (features, label) => {
  const recs = [];
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult an endocrinologist or diabetologist promptly.');
    recs.push('Request a fasting blood sugar and HbA1c test.');
  }
  if (features.bmi >= 25) recs.push('Target a BMI below 25 through diet and exercise.');
  if (features.physicallyActive === 'none' || features.physicallyActive === 'lt30') {
    recs.push('Aim for at least 150 minutes of moderate exercise per week.');
  }
  if (features.junkFood === 'often' || features.junkFood === 'veryOften') {
    recs.push('Reduce processed food and sugary beverages significantly.');
  }
  if (features.stress === 'veryOften' || features.stress === 'always') {
    recs.push('Practice stress management techniques such as yoga or mindfulness.');
  }
  if (features.sleepHours < 6) recs.push('Aim for 7–8 hours of quality sleep nightly.');
  recs.push('Monitor fasting blood sugar regularly if you have risk factors.');
  return recs;
};

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
