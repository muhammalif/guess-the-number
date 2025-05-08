from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy import text
from database.db import db, init_db
from routes.game_routes import game_blueprint
from routes.leaderboard_routes import leaderboard_blueprint
from routes.user_routes import user_blueprint
from routes.auth import auth_bp
import os
from flask_migrate import Migrate
from config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])

    # Setup JWT
    jwt = JWTManager(app)

    # Initialize CORS with correct origin
    frontend_url = os.getenv('FRONTEND_URL')
    CORS(app,
         origins=frontend_url,
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # Initialize database with our app
    init_db(app)
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # Home routes
    @app.route("/")
    def home():
        return jsonify({"message": "🎮 Server is running now!"})

    # Checking database status
    @app.route("/api/db-status")
    def db_status():
        try:
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT 1")).fetchone()
                if result:
                    return jsonify({"status": "✅ Database connected"})
                else:
                    return jsonify({"status": "⚠️ Database connected, but can't access data!"})
        except Exception as e:
            return jsonify({
                "status": f"❌ Cannot access a database: {str(e)}",
                "details": {
                    "cwd": os.getcwd(),
                    "db_uri": app.config['SQLALCHEMY_DATABASE_URI']
                }
            })

    # Register Blueprints
    app.register_blueprint(game_blueprint, url_prefix="/api/game")
    app.register_blueprint(leaderboard_blueprint, url_prefix="/api/leaderboard") 
    app.register_blueprint(user_blueprint, url_prefix="/api/user")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app

app = create_app('production')

if __name__ == '__main__':
    app = create_app('development')
    print("🚀 Server is running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)

