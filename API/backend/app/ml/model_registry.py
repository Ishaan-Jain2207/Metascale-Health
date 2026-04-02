import joblib
import os
import numpy as np
from app.config import settings
from app.ml.feature_contracts import DIABETES_FEATURES, LIVER_FEATURES

class ModelRegistry:
    def __init__(self):
        self.diabetes_model = None
        self.liver_model = None
        self.models_loaded = False
        self.error_message = None

    def load_all(self):
        try:
            # Use absolute paths from settings
            diabetes_path = settings.DIABETES_MODEL_PATH
            liver_path = settings.LIVER_MODEL_PATH

            print(f"[ModelRegistry] Loading diabetes model from {diabetes_path}")
            self.diabetes_model = joblib.load(diabetes_path)
            
            print(f"[ModelRegistry] Loading liver model from {liver_path}")
            self.liver_model = joblib.load(liver_path)

            # Verification Gate
            self._verify_models()
            
            self.models_loaded = True
            print("[ModelRegistry] All models loaded and verified successfully.")
        except Exception as e:
            self.models_loaded = False
            self.error_message = str(e)
            print(f"[ModelRegistry] ERROR: {self.error_message}")

    def _verify_models(self):
        # 1. Feature Check
        d_features = list(self.diabetes_model.feature_names_in_)
        l_features = list(self.liver_model.feature_names_in_)

        # Check against contracts (ignoring order for now, but contracts should match training)
        if set(d_features) != set(DIABETES_FEATURES):
            raise ValueError(f"Diabetes model features mismatch. Expected {DIABETES_FEATURES}, got {d_features}")
        
        if set(l_features) != set(LIVER_FEATURES):
            raise ValueError(f"Liver model features mismatch. Expected {LIVER_FEATURES}, got {l_features}")

        # 2. Test Vector Execution
        print("[ModelRegistry] Running test vectors...")
        
        # Mock zero vectors
        d_test = np.zeros((1, len(d_features)))
        l_test = np.zeros((1, len(l_features)))

        d_proba = self.diabetes_model.predict_proba(d_test)[0]
        l_proba = self.liver_model.predict_proba(l_test)[0]

        if len(d_proba) != 2 or not np.isclose(sum(d_proba), 1.0):
            raise ValueError("Diabetes model predict_proba failed test vector check.")
        
        if len(l_proba) != 2 or not np.isclose(sum(l_proba), 1.0):
            raise ValueError("Liver model predict_proba failed test vector check.")

model_registry = ModelRegistry()
