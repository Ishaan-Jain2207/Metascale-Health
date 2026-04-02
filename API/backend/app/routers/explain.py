from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.services.ai_service import generate_patient_explanation, generate_doctor_explanation

router = APIRouter(prefix="/explain", tags=["AI Explanations"])

class ExplainRequest(BaseModel):
    screening_id: str
    role: str = "patient"   # "patient" or "doctor"
    diabetes: Dict[str, Any]
    liver: Dict[str, Any]
    user_answers: Dict[str, Any]

@router.post("/")
def explain(req: ExplainRequest):
    data = {
        "diabetes": req.diabetes,
        "liver": req.liver,
        "user_answers": req.user_answers
    }
    try:
        if req.role == "doctor":
            result = generate_doctor_explanation(req.screening_id, data)
        else:
            result = generate_patient_explanation(req.screening_id, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
