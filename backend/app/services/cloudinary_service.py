import cloudinary
import cloudinary.uploader

from app.config.settings import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


def upload_image(
    file,
    folder: str
):

    result = cloudinary.uploader.upload(
        file.file,
        folder=folder
    )

    return {
        "public_id": result["public_id"],
        "url": result["secure_url"]
    }

def delete_image(public_id: str):

    result = cloudinary.uploader.destroy(
        public_id
    )

    return result