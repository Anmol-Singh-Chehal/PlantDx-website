import io

import torch
from PIL import Image
from torchvision import transforms

from app.ml.model_loader import DEVICE


# ============================================================
# Class names
# ============================================================

FRACTURE_CLASSES = [
    "Fracture",
    "Normal"
]

TUMOR_CLASSES = [
    "glioma_tumor",
    "meningioma_tumor",
    "no_tumor",
    "pituitary_tumor"
]

CANCER_CLASSES = [
    "adenocarcinoma",
    "large_cell_carcinoma",
    "normal",
    "squamous_cell_carcinoma"
]

TB_CLASSES = [
    "Normal",
    "Tuberculosis"
]


# ============================================================
# Image preprocessing
# ============================================================

def get_transforms():

    return transforms.Compose([

        transforms.Resize(
            (224, 224)
        ),

        transforms.ToTensor(),

        transforms.Normalize(
            mean=[
                0.485,
                0.456,
                0.406
            ],

            std=[
                0.229,
                0.224,
                0.225
            ]
        )
    ])


transform = get_transforms()


# ============================================================
# Read and preprocess ONE frontend image
# ============================================================

async def preprocess_image(upload_file):

    image_bytes = await upload_file.read()

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

    except Exception:

        raise ValueError(
            f"Invalid image file: {upload_file.filename}"
        )

    tensor = transform(image)

    # tensor shape:
    #
    # [3, 224, 224]
    #
    # IMPORTANT:
    # We do NOT add unsqueeze(0) here.
    #
    # We will stack multiple images later.

    return tensor


# ============================================================
# Preprocess MULTIPLE images
# ============================================================

async def preprocess_images(upload_files):

    image_tensors = []
    filenames = []

    for upload_file in upload_files:

        tensor = await preprocess_image(
            upload_file
        )

        image_tensors.append(tensor)

        filenames.append(
            upload_file.filename
        )

    if not image_tensors:

        raise ValueError(
            "At least one image is required."
        )

    # --------------------------------------------------------
    # Stack all images into one batch
    # --------------------------------------------------------
    #
    # Before:
    #
    # image 1 = [3, 224, 224]
    # image 2 = [3, 224, 224]
    # image 3 = [3, 224, 224]
    #
    # After:
    #
    # [3, 3, 224, 224]
    #
    # where:
    #
    # batch = 3
    # channels = 3
    # height = 224
    # width = 224
    #

    batch = torch.stack(
        image_tensors
    )

    batch = batch.to(DEVICE)

    return batch, filenames


# ============================================================
# Prediction helper for MULTIPLE images
# ============================================================

def predict_with_model(
    model,
    image_batch,
    class_names,
    filenames
):

    with torch.inference_mode():

        # ----------------------------------------------------
        # Model prediction
        # ----------------------------------------------------

        logits = model(
            image_batch
        )

        # ----------------------------------------------------
        # Convert logits to probabilities
        # ----------------------------------------------------

        probabilities = torch.softmax(
            logits,
            dim=1
        )

    # --------------------------------------------------------
    # One result for every image
    # --------------------------------------------------------

    predictions = []

    for image_index in range(
        image_batch.size(0)
    ):

        image_probabilities = probabilities[
            image_index
        ]

        # ----------------------------------------------------
        # Predicted class
        # ----------------------------------------------------

        predicted_index = torch.argmax(
            image_probabilities
        ).item()

        predicted_class = class_names[
            predicted_index
        ]

        predicted_confidence = (
            image_probabilities[
                predicted_index
            ].item() * 100
        )

        # ----------------------------------------------------
        # Confidence of every class
        # ----------------------------------------------------

        class_confidence = {}

        for index, class_name in enumerate(
            class_names
        ):

            class_confidence[class_name] = round(
                image_probabilities[index].item() * 100,
                2
            )

        # ----------------------------------------------------
        # Result for this image
        # ----------------------------------------------------

        predictions.append({

            "filename": filenames[
                image_index
            ],

            "predicted_class": predicted_class,

            "class_index": predicted_index,

            "confidence": round(
                predicted_confidence,
                2
            ),

            "class_confidence": class_confidence

        })

    return predictions


# ============================================================
# Fracture prediction
# ============================================================

async def predict_fracture(
    upload_files,
    model
):

    image_batch, filenames = await preprocess_images(
        upload_files
    )

    predictions = predict_with_model(
        model,
        image_batch,
        FRACTURE_CLASSES,
        filenames
    )

    return {

        "model": "FractureNet",

        "total_images": len(
            predictions
        ),

        "predictions": predictions

    }


# ============================================================
# Tumor prediction
# ============================================================

async def predict_tumor(
    upload_files,
    model
):

    image_batch, filenames = await preprocess_images(
        upload_files
    )

    predictions = predict_with_model(
        model,
        image_batch,
        TUMOR_CLASSES,
        filenames
    )

    return {

        "model": "TumorNet",

        "total_images": len(
            predictions
        ),

        "predictions": predictions

    }


# ============================================================
# Lung cancer prediction
# ============================================================

async def predict_cancer(
    upload_files,
    model
):

    image_batch, filenames = await preprocess_images(
        upload_files
    )

    predictions = predict_with_model(
        model,
        image_batch,
        CANCER_CLASSES,
        filenames
    )

    return {

        "model": "LungCancerNet",

        "total_images": len(
            predictions
        ),

        "predictions": predictions

    }


# ============================================================
# TB prediction
# ============================================================

async def predict_tb(
    upload_files,
    model
):

    image_batch, filenames = await preprocess_images(
        upload_files
    )

    predictions = predict_with_model(
        model,
        image_batch,
        TB_CLASSES,
        filenames
    )

    return {

        "model": "TBNet",

        "total_images": len(
            predictions
        ),

        "predictions": predictions

    }