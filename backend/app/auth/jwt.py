from datetime import datetime, timedelta, timezone
import jwt
import uuid
from app.config.settings import settings


def create_access_token(user_id: str) -> str:

    now = datetime.now(timezone.utc)

    expiration = now + timedelta(
        days=settings.JWT_EXPIRE_DAYS
    )

    payload = {
        "sub": user_id,
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": expiration
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return token