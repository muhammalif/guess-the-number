from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Initialize database with the Flask app"""
    try:
        db.init_app(app)
        
        # Create tables if they don't exist
        with app.app_context():
            try:
                db.create_all()
                logger.info("✅ Database tables created successfully!")
            except Exception as e:
                logger.error(f"❌ Error creating database tables: {str(e)}")
                raise
    except Exception as e:
        logger.error(f"❌ Error initializing database: {str(e)}")
        raise

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set SQLite pragmas for better performance"""
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()