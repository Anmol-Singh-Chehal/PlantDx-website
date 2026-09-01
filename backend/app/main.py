from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.database.mongodb import client
from app.services.cloudinary_service import upload_image
from app.auth.routes import router as auth_router
from app.ml.model_loader import load_all_models
from app.detection.routes import router as detection_router

# uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# ============================================================
# FastAPI lifespan
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n")
    print("=" * 60)
    print("Starting PlantDx")
    print("=" * 60)

    # --------------------------------------------------------
    # Load all ML models ONCE
    # --------------------------------------------------------

    app.state.models = load_all_models()

    print("\n")
    print("=" * 60)
    print("PlantDx is READY")
    print("=" * 60)

    yield

    # --------------------------------------------------------
    # Shutdown
    # --------------------------------------------------------

    print("\nShutting down PlantDx...")
    app.state.models.clear()
    print("Models released.")


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="PlantDx",
    description="PlantDx backend",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# Routers
# ============================================================

app.include_router(
    auth_router
)

app.include_router(
    detection_router
)

# ============================================================
# Root
# ============================================================

@app.get("/")
def root():
    return {
        "message": "PlantDx API is running"
    }


# ============================================================
# Health
# ============================================================

@app.get("/health")
def health_check():
    try:
        client.admin.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "models": {
                "AppleNet": "loaded",
                "CherryNet": "loaded",
                "GrapeNet": "loaded",
                "MangoNet": "loaded"
            }
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


# ============================================================
# Cloudinary Upload
# ============================================================

@app.post("/upload")
async def upload_images(
    images: list[UploadFile] = File(...)
):

    uploaded_files = []
    for file in images:
        result = upload_image(file)
        uploaded_files.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "cloudinary": result
        })

    return {
        "message":
            "Files uploaded successfully",

        "files":
            uploaded_files
    }