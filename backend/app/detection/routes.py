from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Request,
    Depends,
    HTTPException
)

from app.auth.dependencies import get_current_user

from app.ml.predictor import (
    predict_fracture,
    predict_tumor,
    predict_cancer,
    predict_tb
)

from app.services.scan_service import save_prediction


router = APIRouter(
    prefix="/detection",
    tags=["detection"]
)


# ============================================================
# Fracture Detection
# ============================================================

@router.post("/fracture")
async def fracture_detection(
    request: Request,
    images: list[UploadFile] = File(...),
    current_user=Depends(get_current_user)
):
    try:
        # ----------------------------------------------------
        # Get model
        # ----------------------------------------------------
        model = request.app.state.models["fracture"]

        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------
        result = await predict_fracture(
            images,
            model
        )

        # ----------------------------------------------------
        # Save scan + upload images
        # ----------------------------------------------------
        scan = await save_prediction(
            user=current_user,
            images=images,
            disease_type="fracture",
            model=result["model"],
            predictions=result["predictions"]
        )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------
        return {
            "success": True,
            "disease_type": "fracture",
            **result,
            "scan_id": str(scan["_id"])
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print(f"Fracture prediction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Fracture prediction failed."
        )


# ============================================================
# Brain Tumor Detection
# ============================================================

@router.post("/tumor")
async def tumor_detection(
    request: Request,
    images: list[UploadFile] = File(...),
    current_user=Depends(get_current_user)
):
    try:
        # ----------------------------------------------------
        # Get model
        # ----------------------------------------------------
        model = request.app.state.models["tumor"]

        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------
        result = await predict_tumor(
            images,
            model
        )

        # ----------------------------------------------------
        # Save scan + upload images
        # ----------------------------------------------------
        scan = await save_prediction(
            user=current_user,
            images=images,
            disease_type="brain_tumor",
            model=result["model"],
            predictions=result["predictions"]
        )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------
        return {
            "success": True,
            "disease_type": "brain_tumor",
            **result,
            "scan_id": str(scan["_id"])
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print(f"Tumor prediction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Tumor prediction failed."
        )


# ============================================================
# Lung Cancer Detection
# ============================================================

@router.post("/cancer")
async def cancer_detection(
    request: Request,
    images: list[UploadFile] = File(...),
    current_user=Depends(get_current_user)
):
    try:
        # ----------------------------------------------------
        # Get model
        # ----------------------------------------------------
        model = request.app.state.models["cancer"]

        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------
        result = await predict_cancer(
            images,
            model
        )

        # ----------------------------------------------------
        # Save scan + upload images
        # ----------------------------------------------------
        scan = await save_prediction(
            user=current_user,
            images=images,
            disease_type="lung_cancer",
            model=result["model"],
            predictions=result["predictions"]
        )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------
        return {
            "success": True,
            "disease_type": "lung_cancer",
            **result,
            "scan_id": str(scan["_id"])
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print(f"Cancer prediction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Lung cancer prediction failed."
        )


# ============================================================
# Tuberculosis Detection
# ============================================================

@router.post("/tb")
async def tb_detection(
    request: Request,
    images: list[UploadFile] = File(...),
    current_user=Depends(get_current_user)
):
    try:
        # ----------------------------------------------------
        # Get model
        # ----------------------------------------------------
        model = request.app.state.models["tb"]

        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------
        result = await predict_tb(
            images,
            model
        )

        # ----------------------------------------------------
        # Save scan + upload images
        # ----------------------------------------------------
        scan = await save_prediction(
            user=current_user,
            images=images,
            disease_type="tuberculosis",
            model=result["model"],
            predictions=result["predictions"]
        )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------
        return {
            "success": True,
            "disease_type": "tuberculosis",
            **result,
            "scan_id": str(scan["_id"])
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print(f"TB prediction error: {e}")

        raise HTTPException(
            status_code=500,
            detail="TB prediction failed."
        )