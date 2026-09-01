import io
import torch
from PIL import Image
from torchvision import transforms
from app.ml.model_loader import DEVICE

# ============================================================
# Class names
# ============================================================
APPLE_CLASSES = ["Healthy", "Rust", "Scab"]
CHERRY_CLASSES = ["Healthy", "Powdery Mildew"]
GRAPE_CLASSES = ["Black Measles", "Black Rot", "Healthy", "Isariopsis Leaf Spot"]
MANGO_CLASSES = ["Anthracnose", "Bacterial Canker", "Cutting Weevil", "Die Back", "Gall Midge", "Healthy", "Powdery Mildew", "Sooty Mould"]

# ============================================================
# Image preprocessing
# ============================================================
transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor()])

# ============================================================
# Preprocess ONE image
# ============================================================
async def preprocess_image(upload_file):
    image_bytes = await upload_file.read()
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise ValueError(f"Invalid image file: {upload_file.filename}")
    return transform(image)

# ============================================================
# Preprocess MULTIPLE images
# ============================================================
async def preprocess_images(upload_files):
    image_tensors = []
    filenames = []
    for upload_file in upload_files:
        tensor = await preprocess_image(upload_file)
        image_tensors.append(tensor)
        filenames.append(upload_file.filename)
    if not image_tensors:
        raise ValueError("At least one image is required.")
    batch = torch.stack(image_tensors).to(DEVICE)
    return batch, filenames

# ============================================================
# Prediction helper
# ============================================================
def predict_with_model(model, image_batch, class_names, filenames):
    with torch.inference_mode():
        logits = model(image_batch)
        probabilities = torch.softmax(logits, dim=1)
    predictions = []
    for image_index in range(image_batch.size(0)):
        image_probabilities = probabilities[image_index]
        predicted_index = torch.argmax(image_probabilities).item()
        predicted_class = class_names[predicted_index]
        predicted_confidence = image_probabilities[predicted_index].item() * 100
        class_confidence = {class_name: round(image_probabilities[index].item() * 100, 2) for index, class_name in enumerate(class_names)}
        predictions.append({"filename": filenames[image_index], "predicted_class": predicted_class, "class_index": predicted_index, "confidence": round(predicted_confidence, 2), "class_confidence": class_confidence})
    return predictions

# ============================================================
# Apple prediction
# ============================================================
async def predict_apple(upload_files, model):
    image_batch, filenames = await preprocess_images(upload_files)
    predictions = predict_with_model(model, image_batch, APPLE_CLASSES, filenames)
    return {"model": "AppleNet", "total_images": len(predictions), "predictions": predictions}

# ============================================================
# Cherry prediction
# ============================================================
async def predict_cherry(upload_files, model):
    image_batch, filenames = await preprocess_images(upload_files)
    predictions = predict_with_model(model, image_batch, CHERRY_CLASSES, filenames)
    return {"model": "CherryNet", "total_images": len(predictions), "predictions": predictions}

# ============================================================
# Grape prediction
# ============================================================
async def predict_grape(upload_files, model):
    image_batch, filenames = await preprocess_images(upload_files)
    predictions = predict_with_model(model, image_batch, GRAPE_CLASSES, filenames)
    return {"model": "GrapeNet", "total_images": len(predictions), "predictions": predictions}

# ============================================================
# Mango prediction
# ============================================================
async def predict_mango(upload_files, model):
    image_batch, filenames = await preprocess_images(upload_files)
    predictions = predict_with_model(model, image_batch, MANGO_CLASSES, filenames)
    return {"model": "MangoNet", "total_images": len(predictions), "predictions": predictions}