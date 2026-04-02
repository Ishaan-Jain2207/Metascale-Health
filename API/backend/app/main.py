from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import screenings, explain
from app.ml.model_registry import model_registry
from app.config import settings

app = FastAPI(title=settings.APP_NAME)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("[Main] Initializing Model Registry...")
    model_registry.load_all()

@app.get("/health")
def health_check():
    return {
        "status": "healthy" if model_registry.models_loaded else "degraded",
        "models_loaded": model_registry.models_loaded,
        "error": model_registry.error_message if not model_registry.models_loaded else None
    }

# Register routers
app.include_router(screenings.router, prefix="/api")
app.include_router(explain.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
