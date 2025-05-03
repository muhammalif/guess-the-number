import secrets

def generate_secret_key():
    """Generate a secure random key."""
    return secrets.token_hex(32)  # 32 bytes = 64 hex characters

if __name__ == "__main__":
    jwt_secret = generate_secret_key()
    flask_secret = generate_secret_key()
    
    print("\n=== Generated Secret Keys ===")
    print(f"JWT_SECRET_KEY={jwt_secret}")
    print(f"SECRET_KEY={flask_secret}")
    print("\nCopy these values to your .env file")