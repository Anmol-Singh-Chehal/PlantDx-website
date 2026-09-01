from pwdlib import PasswordHash
import secrets

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    return password_hash.verify(
        password,
        hashed_password
    )

def generate_reset_code():
    return str(
        secrets.randbelow(900000) + 100000
    )