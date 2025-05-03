import os
from app import create_app
from database.db import db

def reset_database():
    app, _ = create_app()
    
    with app.app_context():
        # Drop all tables
        db.drop_all()
        print("✅ All tables dropped")
        
        # Create all tables
        db.create_all()
        print("✅ All tables created")
        
        print("✅ Database reset complete")

if __name__ == "__main__":
    reset_database() 