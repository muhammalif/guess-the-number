from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    # Initialize database with Flask app
    db.init_app(app)
    with app.app_context():
        from database.models import Leaderboard, User
        db.create_all()
        
        # Set proper permissions for the database file
        import os
        instance_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'instance')
        db_path = os.path.join(instance_path, 'game.db')
        if os.path.exists(db_path):
            os.chmod(db_path, 0o666)
        print("✅ Database successfully initialized")