import math
from app.ml.feature_contracts import ScreeningRequest, DIABETES_FEATURES, LIVER_FEATURES
from typing import Dict, Any

def map_diabetes_features(req: ScreeningRequest) -> Dict[str, Any]:
    # ── SoundSleep ──
    sleep_quality_multiplier = {"low": 0.5, "medium": 0.75, "high": 1.0}
    sound_sleep = round(req.sleep * sleep_quality_multiplier[req.sleepQuality])

    # ── Age Binning ──
    age_bin = 0
    if req.age < 40: age_bin = 0
    elif req.age < 50: age_bin = 1
    elif req.age < 60: age_bin = 2
    else: age_bin = 3

    # ── PhysicallyActive ──
    active_map = {"none": 0, "lt30": 1, "between30and60": 2, "gt60": 3}

    # ── JunkFood ──
    # Training: 1: occasionally, 2: often, 3: very often, 4: always
    # UI map: rarely (v2->1), occasionally (1->1), often (2->2), veryOften (3->3)
    # Applying v2 adjustment: 'rarely' should map to 1 as per blueprint
    junk_map = {"rarely": 1, "occasionally": 1, "often": 2, "veryOften": 3}

    # ── BPLevel ──
    bp_map = {"low": 0, "normal": 1, "high": 2}

    # ── Stress ──
    stress_map = {"none": 0, "sometimes": 1, "veryOften": 2, "always": 3}

    features = {
        "Age": age_bin,
        "Gender": 1 if req.sex == "male" else 0,
        "Family_Diabetes": 1 if req.familyDiabetes == "yes" else 0,
        "highBP": 1 if req.highBP == "yes" else 0,
        "PhysicallyActive": active_map[req.activity],
        "BMI": req.weight / ((req.height/100)**2) if req.height and req.weight else 23.0,
        "Smoking": 1 if req.smoking == "yes" else 0,
        "Alcohol": 1 if req.alcohol == "yes" else 0,
        "Sleep": req.sleep,
        "SoundSleep": sound_sleep,
        "RegularMedicine": 1 if req.regularMedicine == "yes" else 0,
        "JunkFood": junk_map[req.junkFood],
        "Stress": stress_map[req.stress],
        "BPLevel": bp_map[req.bpLevel],
        "Pregnancies": min(req.pregnancies, 4) if req.sex == "female" else 0,
        "Pdiabetes": 1 if req.preDiabetes == "yes" else 0,
        "UriationFreq": 1 if req.urinationFreq == "yes" else 0
    }
    return features

def map_liver_features(req: ScreeningRequest) -> Dict[str, Any]:
    # Basic numeric fields
    features = {
        "age": req.age,
        "gender": 1 if req.sex == "male" else 0,
        "total_bilirubin": req.bilirubin,
        "direct_bilirubin": (req.bilirubin * 0.3) if req.bilirubin else None,
        "alkaline_phosphotase": None,
        "alt": req.alt,
        "ast": req.ast,
        "total_proteins": None,
        "albumin": None,
        "albumin_globulin_ratio": None
    }
    return features
