from email.message import EmailMessage
import aiosmtplib

from app.config.settings import settings


async def send_reset_code_email(
    email: str,
    code: str
):

    message = EmailMessage()

    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = email
    message["Subject"] = "PlantDx Password Reset Code"

    message.set_content(
        f"""
Hello,

Your PlantDx password reset code is:

{code}

This code will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

PlantDx
"""
    )

    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        start_tls=True,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD
    )