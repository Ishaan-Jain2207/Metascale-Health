import json
import os
import numpy as np
from app.ml.model_registry import model_registry
from app.ml.feature_contracts import (
    ScreeningRequest, ScreeningResponse, DiseasePrediction, 
    RiskLevelEnum, ConfidenceModeEnum, LiverModeEnum,
    DIABETES_FEATURES, LIVER_FEATURES
)
from app.services.preprocessing import map_diabetes_features, map_liver_features
from datetime import datetime
import uuid

# Load model metadata (thresholds and medians)
base_path = os.path.dirname(os.path.abspath(__file__))
metadata_path = os.path.join(base_path, "../ml/model_metadata.json")
with open(metadata_path, 'r') as f:
    METADATA = json.load(f)

def get_risk_level(prob: float, disease: str) -> RiskLevelEnum:
    low = METADATA[disease]["RISK_THRESHOLD_LOW"]
    high = METADATA[disease]["RISK_THRESHOLD_HIGH"]
    if prob < low: return RiskLevelEnum.low
    if prob < high: return RiskLevelEnum.medium
    return RiskLevelEnum.high

def predict_screening(req: ScreeningRequest) -> ScreeningResponse:
    # 1. Diabetes Prediction
    dm_features_dict = map_diabetes_features(req)
    dm_vector = [dm_features_dict[f] for f in DIABETES_FEATURES]
    dm_prob = model_registry.diabetes_model.predict_proba([dm_vector])[0][1]
    
    diabetes_pred = DiseasePrediction(
        probability=round(dm_prob, 3),
        risk_level=get_risk_level(dm_prob, "diabetes"),
        confidence_mode=ConfidenceModeEnum.full_features
    )

    # 2. Liver Prediction (Mode Selection)
    lv_features_dict = map_liver_features(req)
    
    # Core labs: bilirubin, alt, ast
    core_labs = [req.bilirubin, req.alt, req.ast]
    labs_present_count = sum(1 for x in lv_features_dict.values() if x is not None)
    
    # Modes per Blueprint v2:
    # Mode A (Full-labs): all 8 lab fields provided (total=10 features)
    # Mode B (Partial-labs): age, gender + any 4 or more lab fields
    # Mode C (No-labs): fewer than 4 lab fields -> RF model NOT called
    
    liver_pred = None
    if labs_present_count >= 10: # Mode A: age, gender + 8 labs
        lv_vector = [lv_features_dict[f] for f in LIVER_FEATURES]
        lv_prob = model_registry.liver_model.predict_proba([lv_vector])[0][1]
        liver_pred = DiseasePrediction(
            probability=round(lv_prob, 3),
            risk_level=get_risk_level(lv_prob, "liver"),
            confidence_mode=ConfidenceModeEnum.full_features,
            mode=LiverModeEnum.full_labs
        )
    elif labs_present_count >= 6: # Mode B: age (1), gender (1) + at least 4 labs (4) = 6
        # Impute missing labs with medians
        lv_vector = []
        for f in LIVER_FEATURES:
            val = lv_features_dict[f]
            if val is None:
                val = METADATA["liver"]["medians"][f]
            lv_vector.append(val)
            
        lv_prob = model_registry.liver_model.predict_proba([lv_vector])[0][1]
        liver_pred = DiseasePrediction(
            probability=round(lv_prob, 3),
            risk_level=get_risk_level(lv_prob, "liver"),
            confidence_mode=ConfidenceModeEnum.partial_imputation,
            mode=LiverModeEnum.partial_labs
        )
    else: # Mode C: Hard Safety Rule
        liver_pred = DiseasePrediction(
            probability=0.0,
            risk_level=RiskLevelEnum.low,
            confidence_mode=ConfidenceModeEnum.unsupported,
            mode=LiverModeEnum.no_labs
        )

    return ScreeningResponse(
        screening_id=str(uuid.uuid4()),
        created_at=datetime.utcnow().isoformat(),
        diabetes=diabetes_pred,
        liver=liver_pred,
        ai_explanation_status="ready" # Placeholder for Track A
    )
