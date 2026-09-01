from datetime import datetime, timezone

from app.database.mongodb import scans_collection
from app.services.cloudinary_service import upload_image


async def save_prediction(
    user,
    images,
    disease_type,
    model,
    predictions
):
    """
    Save a complete detection scan.

    One scan contains multiple images.
    Each image contains:
        - filename
        - Cloudinary image information
        - prediction
        - confidence
        - confidence of every class
    """

    # --------------------------------------------------------
    # Get user ID
    # --------------------------------------------------------

    user_id = user["_id"]

    # --------------------------------------------------------
    # Store all image results here
    # --------------------------------------------------------

    saved_images = []

    # --------------------------------------------------------
    # Upload each image and match it with its prediction
    # --------------------------------------------------------

    for image, prediction in zip(images, predictions):

        # ----------------------------------------------------
        # IMPORTANT:
        # predictor already read the UploadFile.
        #
        # Move the file pointer back to the beginning before
        # uploading it to Cloudinary.
        # ----------------------------------------------------

        await image.seek(0)

        # ----------------------------------------------------
        # Upload image to Cloudinary
        # ----------------------------------------------------

        image_data = upload_image(
            image,
            folder=f"medscan-ai/users/{user_id}/scans"
        )

        # ----------------------------------------------------
        # Store image + prediction together
        # ----------------------------------------------------

        saved_images.append({
            "filename": image.filename,

            "image": {
                "public_id": image_data["public_id"],
                "url": image_data["url"]
            },

            "prediction": {
                "predicted_class": prediction["predicted_class"],
                "class_index": prediction["class_index"],
                "confidence": prediction["confidence"],

                # IMPORTANT:
                # Save confidence of EVERY class
                "class_confidence": prediction["class_confidence"]
            }
        })

    # --------------------------------------------------------
    # Create complete scan document
    # --------------------------------------------------------

    document = {
        "user_id": user_id,

        "disease_type": disease_type,

        "model": model,

        "total_images": len(saved_images),

        "images": saved_images,

        "created_at": datetime.now(timezone.utc)
    }

    # --------------------------------------------------------
    # Save to MongoDB
    # --------------------------------------------------------

    result = scans_collection.insert_one(document)

    # --------------------------------------------------------
    # Return MongoDB ID
    # --------------------------------------------------------

    document["_id"] = str(result.inserted_id)

    return document