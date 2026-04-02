from fastapi import APIRouter, HTTPException
from app.ml.feature_contracts import ScreeningRequest, ScreeningResponse
from app.services.prediction_service import predict_screening
from app.ml.model_registry import model_registry

router = APIRouter(prefix="/screenings", tags=["Screenings"])

@router.post("/", response_model=ScreeningResponse)
def create_screening(request: ScreeningRequest):
    if not model_registry.models_loaded:
        raise HTTPException(
            status_code=503, 
            detail=f"Models not loaded. Error: {model_registry.error_message}"
        )
    
    try:
        response = predict_screening(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
