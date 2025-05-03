import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the absolute path of the current directory
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # CORS Configuration
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGINS = ["http://localhost:5173", "http://192.168.1.2:5173"]
    CORS_SUPPORTS_CREDENTIALS = True