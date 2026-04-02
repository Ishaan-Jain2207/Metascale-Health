"""
ai_service.py — Gemini AI explanation service for Metascale Health.

Uses the google-generativeai SDK. Set GEMINI_API_KEY in your .env file or
as an environment variable to enable live AI explanations.

If the key is not set, the service falls back to a structured mock response
so the app continues to work without an API key.
"""
import os
from typing import Dict, Any, Optional

# Lazy-import so the app doesn't crash if the package isn't installed
try:
    import google.generativeai as genai
    _GENAI_AVAILABLE = True
except ImportError:
    _GENAI_AVAILABLE = False

_GEMINI_KEY: Optional[str] = None  # loaded lazily from settings

def _get_key() -> Optional[str]:
    """Read key from settings (which loads .env) rather than raw os.environ."""
    global _GEMINI_KEY
    if _GEMINI_KEY is None:
        try:
            from app.config import settings
            _GEMINI_KEY = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        except Exception:
            _GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
    return _GEMINI_KEY

def _get_model():
    """Configure and return a Gemini model instance."""
    key = _get_key()
    if not _GENAI_AVAILABLE:
        raise RuntimeError("google-generativeai not installed. Run: pip install google-generativeai")
    if not key:
        raise RuntimeError("GEMINI_API_KEY not set.")
    genai.configure(api_key=key)
    return genai.GenerativeModel("gemini-2.0-flash")


def build_patient_prompt(data: Dict[str, Any]) -> str:
    liver  = data.get("liver", {})
    diab   = data.get("diabetes", {})
    ua     = data.get("user_answers", {})

    liver_txt = (
        f"{round(liver.get('probability', 0) * 100)}% ({liver.get('risk_level', 'unknown').upper()} risk)"
        if liver.get("mode") != "no-labs"
        else "Not estimated — no lab values provided"
    )

    return f"""You are a friendly, empathetic medical assistant helping an Indian patient understand their health screening results.
Write in plain simple English (no jargon). Keep it under 200 words. DO NOT diagnose. Always end with a disclaimer.

SCREENING RESULTS:
- Diabetes risk: {round(diab.get('probability', 0) * 100)}% ({diab.get('risk_level', 'unknown').upper()} risk)
- Liver risk: {liver_txt}
- BMI: {ua.get('bmi', 'unknown')}
- Physical activity: {ua.get('activity', 'unknown')}
- Stress: {ua.get('stress', 'unknown')}
- Alcohol: {ua.get('alcohol', 'no')}
- Family history of diabetes: {ua.get('familyDiabetes', 'no')}
- Junk food: {ua.get('junkFood', 'unknown')}
- Sleep: {ua.get('sleep', 'unknown')} hours ({ua.get('sleepQuality', 'unknown')} quality)

Explain what these scores mean for this person's health and give 3 specific, practical next steps they can take.
End with: "⚠️ This is not a medical diagnosis. Please consult a licensed doctor."
"""


def build_doctor_prompt(data: Dict[str, Any]) -> str:
    liver  = data.get("liver", {})
    diab   = data.get("diabetes", {})
    ua     = data.get("user_answers", {})

    return f"""You are a clinical decision-support AI for an Indian doctor. 
Generate a concise SOAP-style clinical note (under 200 words) based on this patient screening.

SCREENING DATA:
- Diabetes RF probability: {diab.get('probability', 0):.3f} (threshold 0.33/0.66)
- Liver RF probability: {liver.get('probability', 0):.3f} (mode: {liver.get('mode', 'unknown')})
- BMI: {ua.get('bmi', 'unknown')}, Age: {ua.get('age', 'unknown')}, Sex: {ua.get('sex', 'unknown')}
- BP: {ua.get('bpLevel', 'unknown')} (highBP: {ua.get('highBP', 'unknown')})
- Stress: {ua.get('stress', 'unknown')}, Sleep: {ua.get('sleep', 'unknown')}h
- Alcohol: {ua.get('alcohol', 'no')}, Smoking: {ua.get('smoking', 'no')}
- Family DM: {ua.get('familyDiabetes', 'no')}, Pre-DM: {ua.get('preDiabetes', 'no')}
- Labs: Bilirubin={ua.get('bilirubin', 'N/A')}, ALT={ua.get('alt', 'N/A')}, AST={ua.get('ast', 'N/A')}

Format response as:
S: [Subjective]
O: [Objective]  
A: [Assessment]
P: [Plan with specific tests to order]
Red Flags: [any urgent concerns]
"""


def _risk_label(prob: float) -> str:
    """Convert a 0-1 probability to a human-readable risk label."""
    if prob >= 0.66: return "high"
    if prob >= 0.33: return "medium"
    return "low"

def _mock_patient_response(data: Dict[str, Any]) -> str:
    diab = data.get("diabetes", {})
    prob = diab.get("probability", 0)
    risk = _risk_label(prob)
    pct  = round(prob * 100)
    return f"""Based on your screening, your diabetes risk score is {pct}% — which is in the {risk} range.

Your results reflect a combination of your lifestyle habits, family history, and physical metrics. 
The most important thing to know is that risk scores are not diagnoses — they're early warning signals.

3 steps you can take right now:
1. Book a fasting blood glucose + HbA1C test with your doctor.
2. Add 30 minutes of walking daily — this is the single most effective lifestyle change.
3. Reduce sugary drinks and refined carbs (white rice, maida) from your diet.

⚠️ This is not a medical diagnosis. Please consult a licensed doctor."""


def generate_patient_explanation(screening_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a patient-facing plain-language explanation."""
    key = _get_key()
    source = "mock"
    try:
        model = _get_model()
        prompt = build_patient_prompt(data)
        response = model.generate_content(prompt)
        text = response.text.strip()
        source = "gemini-1.5-flash"
    except Exception as e:
        print(f"[AI Service] Gemini unavailable ({e}), using mock response.")
        text = _mock_patient_response(data)

    return {
        "explanation": text,
        "source": source,
        "screening_id": screening_id
    }


def generate_doctor_explanation(screening_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a doctor-facing SOAP clinical summary."""
    try:
        model = _get_model()
        prompt = build_doctor_prompt(data)
        response = model.generate_content(prompt)
        text = response.text.strip()
    except Exception as e:
        print(f"[AI Service] Gemini unavailable ({e}), using mock response.")
        text = """S: Patient self-reported lifestyle screening data. Positive family history of DM.
O: Elevated BMI, high stress, low physical activity reported. Partial lab imputation used for liver model.
A: Moderate-to-high metabolic risk. RF models indicate elevated diabetes probability.
P: Order HbA1C, fasting plasma glucose, liver function panel. Lifestyle counselling referral.
Red Flags: None urgent. Follow up in 3 months.

*(AI key not configured — add GEMINI_API_KEY to enable live AI.)*"""

    return {
        "explanation": text,
        "source": "gemini-1.5-flash" if (_GEMINI_KEY and _GENAI_AVAILABLE) else "mock",
        "screening_id": screening_id
    }
