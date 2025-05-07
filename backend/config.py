import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the absolute path of the current directory
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '').replace('postgres://', 'postgresql://')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # CORS Configuration
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGINS = [
        # Development URLs
        "http://localhost:5173",
        "http://192.168.1.2:5173",
        # Production URL (akan diisi dari environment variable)
        os.getenv('FRONTEND_URL', '')
    ]
    CORS_SUPPORTS_CREDENTIALS = True

class DevelopmentConfig(Config):
    DEBUG = True
    # Gunakan database development jika ada
    SQLALCHEMY_DATABASE_URI = os.getenv('DEV_DATABASE_URL', '').replace('postgres://', 'postgresql://') or \
                            os.getenv('DATABASE_URL', '').replace('postgres://', 'postgresql://')

class ProductionConfig(Config):
    DEBUG = False
    # Pastikan menggunakan database production
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '').replace('postgres://', 'postgresql://')
    
    # Production CORS settings
    CORS_ORIGINS = [
        os.getenv('FRONTEND_URL', '')  # Hanya izinkan frontend production
    ]

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}