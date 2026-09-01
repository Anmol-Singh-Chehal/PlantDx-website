from fastapi import APIRouter, UploadFile, File, Request, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.ml.predictor import predict_apple, predict_cherry, predict_grape, predict_mango
from app.services.scan_service import save_prediction

router = APIRouter(prefix="/detection", tags=["detection"])

# ============================================================
# Apple Disease Detection
# ============================================================

@router.post("/apple")
async def apple_detection(request: Request, images: list[UploadFile] = File(...), current_user=Depends(get_current_user)):
    try:
        model = request.app.state.models["apple"]
        result = await predict_apple(images, model)
        scan = await save_prediction(user=current_user, images=images, disease_type="apple", model=result["model"], predictions=result["predictions"])
        return {"success": True, "disease_type": "apple", **result, "scan_id": str(scan["_id"])}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Apple prediction error: {e}")
        raise HTTPException(status_code=500, detail="Apple disease prediction failed.")

# ============================================================
# Cherry Disease Detection
# ============================================================

@router.post("/cherry")
async def cherry_detection(request: Request, images: list[UploadFile] = File(...), current_user=Depends(get_current_user)):
    try:
        model = request.app.state.models["cherry"]
        result = await predict_cherry(images, model)
        scan = await save_prediction(user=current_user, images=images, disease_type="cherry", model=result["model"], predictions=result["predictions"])
        return {"success": True, "disease_type": "cherry", **result, "scan_id": str(scan["_id"])}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Cherry prediction error: {e}")
        raise HTTPException(status_code=500, detail="Cherry disease prediction failed.")

# ============================================================
# Grape Disease Detection
# ============================================================

@router.post("/grape")
async def grape_detection(request: Request, images: list[UploadFile] = File(...), current_user=Depends(get_current_user)):
    try:
        model = request.app.state.models["grape"]
        result = await predict_grape(images, model)
        scan = await save_prediction(user=current_user, images=images, disease_type="grape", model=result["model"], predictions=result["predictions"])
        return {"success": True, "disease_type": "grape", **result, "scan_id": str(scan["_id"])}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Grape prediction error: {e}")
        raise HTTPException(status_code=500, detail="Grape disease prediction failed.")

# ============================================================
# Mango Disease Detection
# ============================================================

@router.post("/mango")
async def mango_detection(request: Request, images: list[UploadFile] = File(...), current_user=Depends(get_current_user)):
    try:
        model = request.app.state.models["mango"]
        result = await predict_mango(images, model)
        scan = await save_prediction(user=current_user, images=images, disease_type="mango", model=result["model"], predictions=result["predictions"])
        return {"success": True, "disease_type": "mango", **result, "scan_id": str(scan["_id"])}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Mango prediction error: {e}")
        raise HTTPException(status_code=500, detail="Mango disease prediction failed.")