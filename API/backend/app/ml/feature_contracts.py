from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

# --- ENUMS ---

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class ActivityEnum(str, Enum):
    none = "none"
    lt30 = "lt30"
    between30and60 = "between30and60"
    gt60 = "gt60"

class JunkFoodEnum(str, Enum):
    rarely = "rarely"
    occasionally = "occasionally"
    often = "often"
    veryOften = "veryOften"

class SleepQualityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class StressEnum(str, Enum):
    none = "none"
    sometimes = "sometimes"
    veryOften = "veryOften"
    always = "always"

class BPLevelEnum(str, Enum):
    low = "low"
    normal = "normal"
    high = "high"

class BinaryEnum(str, Enum):
    yes = "yes"
    no = "no"

class LiverModeEnum(str, Enum):
    full_labs = "full-labs"
    partial_labs = "partial-labs"
    no_labs = "no-labs"

class RiskLevelEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class ConfidenceModeEnum(str, Enum):
    full_features = "full-features"
    partial_imputation = "partial-imputation"
    unsupported = "unsupported"

# --- REQUEST SCHEMAS ---

class ScreeningRequest(BaseModel):
    # Basic info
    age: float = Field(..., ge=1, le=120)
    sex: GenderEnum
    height: Optional[float] = Field(None, ge=50, le=250)
    weight: Optional[float] = Field(None, ge=10, le=300)
    
    # Lifestyle
    activity: ActivityEnum
    junkFood: JunkFoodEnum
    smoking: BinaryEnum
    alcohol: BinaryEnum
    
    # Sleep & Stress
    sleep: float = Field(..., ge=1, le=24)
    sleepQuality: SleepQualityEnum
    stress: StressEnum
    
    # BP & History
    highBP: BinaryEnum
    bpLevel: BPLevelEnum
    familyDiabetes: BinaryEnum
    preDiabetes: BinaryEnum
    pregnancies: int = Field(0, ge=0)
    urinationFreq: BinaryEnum
    regularMedicine: BinaryEnum = BinaryEnum.no  # NEW in v2
    
    # Liver Hints / Labs
    liverDiag: BinaryEnum
    alcoholPattern: str
    liverTests: str
    bilirubin: Optional[float] = None
    alt: Optional[float] = None
    ast: Optional[float] = None

# --- RESPONSE SCHEMAS ---

class DiseasePrediction(BaseModel):
    probability: float
    risk_level: RiskLevelEnum
    confidence_mode: ConfidenceModeEnum
    mode: Optional[LiverModeEnum] = None  # Specific to liver

class ScreeningResponse(BaseModel):
    screening_id: str
    created_at: str
    diabetes: DiseasePrediction
    liver: DiseasePrediction
    ai_explanation_status: str

# --- VERSION-LOCKED FEATURE LISTS ---

DIABETES_FEATURES = [
    "Age", "Gender", "Family_Diabetes", "highBP", "PhysicallyActive", 
    "BMI", "Smoking", "Alcohol", "Sleep", "SoundSleep", 
    "RegularMedicine", "JunkFood", "Stress", "BPLevel", 
    "Pregnancies", "Pdiabetes", "UriationFreq"
]

LIVER_FEATURES = [
    "age", "gender", "total_bilirubin", "direct_bilirubin", 
    "alkaline_phosphotase", "alt", "ast", "total_proteins", 
    "albumin", "albumin_globulin_ratio"
]
