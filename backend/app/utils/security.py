import base64
import hashlib
import hmac
import secrets

PASSWORD_HASH_ALGORITHM = "pbkdf2_sha256"
PASSWORD_HASH_ITERATIONS = 600000


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_HASH_ITERATIONS)
    encoded_salt = base64.b64encode(salt).decode("utf-8")
    encoded_hash = base64.b64encode(hashed).decode("utf-8")
    return f"{PASSWORD_HASH_ALGORITHM}${PASSWORD_HASH_ITERATIONS}${encoded_salt}${encoded_hash}"


def verify_password(password: str, encoded_password_hash: str) -> bool:
    try:
        algorithm, iterations_text, encoded_salt, encoded_hash = encoded_password_hash.split("$")
        if algorithm != PASSWORD_HASH_ALGORITHM:
            return False
        iterations = int(iterations_text)
        salt = base64.b64decode(encoded_salt.encode("utf-8"))
        expected_hash = base64.b64decode(encoded_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False

    candidate_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return hmac.compare_digest(candidate_hash, expected_hash)


def generate_session_token() -> str:
    return secrets.token_urlsafe(48)


def hash_session_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
