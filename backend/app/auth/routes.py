from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
    Depends
)
from app.auth.dependencies import get_current_user
from datetime import datetime, timedelta, timezone
from app.auth.password import (
    hash_password,
    verify_password,
    generate_reset_code
)
from pymongo.errors import DuplicateKeyError
from app.database.mongodb import users_collection, revoked_tokens_collection, password_resets_collection, queries_collection, scans_collection
from app.auth.password import hash_password
from app.services.cloudinary_service import upload_image, delete_image
from app.auth.jwt import create_access_token
from fastapi.security import HTTPAuthorizationCredentials
from app.auth.dependencies import security
from app.config.settings import settings
import jwt
from jwt.exceptions import InvalidTokenError
from app.auth.send_reset_code_email import send_reset_code_email
import hashlib
import secrets
from fastapi import (
    Request
)

def hash_reset_code(code: str):
    return hashlib.sha256(
        code.encode()
    ).hexdigest()

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/sign-up")
async def signup(
    profile_photo: UploadFile | None = File(None),
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    accepts_terms: bool = Form(...)
):

    full_name = full_name.strip()
    email = email.strip().lower()

    if not full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required"
        )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    if not accepts_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must accept the terms and policies"
        )

    existing_user = users_collection.find_one(
        {
            "email": email
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already present"
        )

    hashed_password = hash_password(password)

    user = {
        "full_name": full_name,
        "email": email,
        "password": hashed_password,
        "accepts_terms": accepts_terms,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    try:
        result = users_collection.insert_one(user)

    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already present"
        )

    user_id = str(result.inserted_id)

    profile_photo_url = None

    if profile_photo is not None:

        try:
            profile_result = upload_image(
                profile_photo,
                f"PlantDx/users/{user_id}/profile"
            )

            profile_photo_url = profile_result["url"]

            users_collection.update_one(
                {
                    "_id": result.inserted_id
                },
                {
                    "$set": {
                        "profile_photo": profile_result
                    }
                }
            )

        except Exception:
            users_collection.delete_one(
                {
                    "_id": result.inserted_id
                }
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload profile photo"
            )

    access_token = create_access_token(user_id)

    return {
        "message": "User successfully registered",
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_days": 7,
        "user": {
            "id": user_id,
            "full_name": full_name,
            "email": email,
            "profile_photo": profile_photo_url
        }
    }

@router.post("/log-in")
async def login(
    email: str = Form(...),
    password: str = Form(...)
):

    email = email.strip().lower()

    user = users_collection.find_one(
        {
            "email": email
        }
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    password_valid = verify_password(
        password,
        user["password"]
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        str(user["_id"])
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_days": 7,
        "user": {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "profile_photo": user.get(
                "profile_photo",
                {}
            ).get("url")
        }
    }

@router.put("/edit-profile")
async def edit_profile(
    profile_photo: UploadFile | None = File(None),
    full_name: str | None = Form(None),
    current_password: str = Form(...),
    current_user=Depends(get_current_user)
):

    if not current_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is required"
        )

    password_valid = verify_password(
        current_password,
        current_user["password"]
    )

    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    full_name = full_name.strip() if full_name else None

    if not full_name and profile_photo is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide either a profile photo or full name"
        )

    user_id = str(current_user["_id"])

    old_profile_photo = current_user.get("profile_photo")

    update_data = {
        "updated_at": datetime.now(timezone.utc)
    }

    new_profile_result = None

    if full_name:
        update_data["full_name"] = full_name

    if profile_photo is not None:

        try:
            new_profile_result = upload_image(
                profile_photo,
                f"PlantDx/users/{user_id}/profile"
            )

            update_data["profile_photo"] = new_profile_result

        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload new profile photo"
            )

    try:

        users_collection.update_one(
            {
                "_id": current_user["_id"]
            },
            {
                "$set": update_data
            }
        )

    except Exception:

        if new_profile_result:
            try:
                delete_image(
                    new_profile_result["public_id"]
                )
            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

    if new_profile_result and old_profile_photo:

        old_public_id = old_profile_photo.get(
            "public_id"
        )

        if old_public_id:

            try:
                delete_image(
                    old_public_id
                )

            except Exception as e:
                print(
                    f"Failed to delete old profile photo: {e}"
                )

    if new_profile_result:
        profile_photo_url = new_profile_result["url"]

    else:
        profile_photo_url = (
            old_profile_photo.get("url")
            if old_profile_photo
            else None
        )

    updated_at = update_data["updated_at"]

    return {
        "message": "Profile updated successfully",

        "user": {
            "id": user_id,
            "full_name": (
                full_name
                if full_name
                else current_user["full_name"]
            ),
            "email": current_user["email"],
            "profile_photo": profile_photo_url,
            "created_at": current_user["created_at"],
            "updated_at": updated_at
        }
    }

@router.post("/sign-out")
async def signout(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        jti = payload.get("jti")
        exp = payload.get("exp")

        if not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        try:
            revoked_tokens_collection.insert_one({
                "jti": jti,
                "expires_at": datetime.fromtimestamp(
                    exp,
                    timezone.utc
                ),
                "revoked_at": datetime.now(timezone.utc)
            })

        except DuplicateKeyError:
            return {
                "message": "Already logged out"
            }

        return {
            "message": "Successfully logged out"
        }

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

@router.post("/forgot-password")
async def forgot_password(
    email: str = Form(...)
):
    email = email.strip().lower()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email is not present. Please sign up."
        )

    code = generate_reset_code()
    code_hash = hash_reset_code(code)
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(
        minutes=10
    )

    password_resets_collection.delete_many({
        "user_id": user["_id"]
    })
    password_resets_collection.insert_one({
        "user_id": user["_id"],
        "email": email,
        "code_hash": code_hash,
        "expires_at": expires_at,
        "verified": False,
        "reset_token": None,
        "reset_token_expires_at": None,
        "created_at": now
    })

    await send_reset_code_email(
        email,
        code
    )

    return {
        "message": "Password reset code sent successfully"
    }

@router.post("/verify-code")
async def verify_code(
    email: str = Form(...),
    code: str = Form(...)
):
    email = email.strip().lower()
    code = code.strip()

    reset_request = password_resets_collection.find_one({
        "email": email
    })

    if not reset_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No password reset request found"
        )

    now = datetime.now(timezone.utc)

    expires_at = reset_request["expires_at"]

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if now > expires_at:
        password_resets_collection.delete_one({
            "_id": reset_request["_id"]
        })
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code has expired"
        )

    code_hash = hash_reset_code(code)

    if code_hash != reset_request["code_hash"]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset code"
        )

    # Generate short-lived reset token
    reset_token = secrets.token_urlsafe(32)

    reset_token_expires_at = now + timedelta(
        minutes=10
    )

    password_resets_collection.update_one(
        {
            "_id": reset_request["_id"]
        },
        {
            "$set": {
                "verified": True,
                "reset_token": reset_token,
                "reset_token_expires_at": reset_token_expires_at
            }
        }
    )

    return {
        "message": "Code verified successfully",
        "reset_token": reset_token
    }

@router.post("/update-password")
async def update_password(
    email: str = Form(...),
    reset_token: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...)
):

    email = email.strip().lower()

    if not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password is required"
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    if new_password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    reset_request = password_resets_collection.find_one({
        "email": email,
        "reset_token": reset_token,
        "verified": True
    })

    if not reset_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password reset request"
        )

    now = datetime.now(timezone.utc)

    reset_token_expires_at = reset_request["reset_token_expires_at"]

    if reset_token_expires_at.tzinfo is None:
        reset_token_expires_at = reset_token_expires_at.replace(
            tzinfo=timezone.utc
        )

    if now > reset_token_expires_at:
        password_resets_collection.delete_one({
            "_id": reset_request["_id"]
        })

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code has expired"
        )

    hashed_password = hash_password(
        new_password
    )

    users_collection.update_one(
        {
            "_id": reset_request["user_id"]
        },
        {
            "$set": {
                "password": hashed_password,
                "updated_at": now
            }
        }
    )

    # Get updated user
    user = users_collection.find_one({
        "_id": reset_request["user_id"]
    })

    # Generate new login access token
    access_token = create_access_token(
        str(reset_request["user_id"])
    )

    # Delete used reset request
    password_resets_collection.delete_one({
        "_id": reset_request["_id"]
    })

    return {
        "message": "Password updated successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_days": 7,
        "user": {
            "id": str(user["_id"]),
            "full_name": user["full_name"],
            "email": user["email"],
            "profile_photo": user.get(
                "profile_photo",
                {}
            ).get("url")
        }
    }

@router.post("/contact-us")
async def contact_us(
    name: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    current_user=Depends(get_current_user)
):

    name = name.strip()
    subject = subject.strip()
    message = message.strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required"
        )

    if not subject:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject is required"
        )

    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message is required"
        )

    now = datetime.now(timezone.utc)

    query = {
        "user_id": current_user["_id"],
        "name": name,
        "email": current_user["email"],
        "subject": subject,
        "message": message,
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }

    result = queries_collection.insert_one(query)

    return {
        "message": "Your query has been submitted successfully",
        "query_id": str(result.inserted_id)
    }

@router.get("/prediction-history")
async def prediction_history(
    current_user=Depends(get_current_user)
):
    user_id = current_user["_id"]

    scans = scans_collection.find(
        {
            "user_id": user_id
        }
    ).sort(
        "created_at",
        -1
    )

    history = []

    for scan in scans:

        created_at = scan.get("created_at")

        # Ensure UTC datetime is returned with timezone information
        if created_at is not None:

            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)

            created_at = created_at.isoformat()

        history.append({
            "id": str(scan["_id"]),
            "disease_type": scan["disease_type"],
            "model": scan["model"],
            "total_images": scan["total_images"],
            "images": scan["images"],
            "created_at": created_at
        })

    return {
        "success": True,
        "total_scans": len(history),
        "history": history
    }

@router.get("/get-queries")
async def get_queries(
    current_user=Depends(get_current_user)
):
    queries = queries_collection.find().sort(
        "created_at",
        -1
    )

    result = []

    for query in queries:
        created_at = query.get("created_at")
        updated_at = query.get("updated_at")

        if created_at and created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        if updated_at and updated_at.tzinfo is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)

        result.append({
            "id": str(query["_id"]),
            "user_id": str(query["user_id"]),
            "name": query["name"],
            "email": query["email"],
            "subject": query["subject"],
            "message": query["message"],
            "status": query.get("status", "pending"),
            "created_at": (
                created_at.isoformat()
                if created_at
                else None
            ),
            "updated_at": (
                updated_at.isoformat()
                if updated_at
                else None
            ),
        })

    return {
        "success": True,
        "total_queries": len(result),
        "queries": result,
    }
