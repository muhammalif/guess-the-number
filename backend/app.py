from flask import Flask, jsonify, request
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

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    # Setup JWT
    jwt = JWTManager(app)

    # Enable CORS with more permissive configuration
    CORS(app, 
        origins=["http://localhost:5173", "http://192.168.1.2:5173"],  # Allow specific origins
        allow_credentials=True,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": ["http://localhost:5173", "http://192.168.1.2:5173"],  # Allow specific origins
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True
            }
        })

    # Ensure instance folder exists with proper permissions
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path, mode=0o777)
        print(f"✅ Created instance directory at {instance_path}")

    # Initialize database with our app
    init_db(app)
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in ["http://localhost:5173", "http://192.168.1.2:5173"]:
            response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
        
    # Home routes
    @app.route("/")
    def home():
        return jsonify({"message": "🎮 Server is running now!"})

    # Checking database status
    @app.route("/db-status")
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
                    "db_uri": app.config['SQLALCHEMY_DATABASE_URI'],
                    "instance_path": instance_path
                }
            })

    # Register Blueprints
    app.register_blueprint(game_blueprint, url_prefix="/game")
    app.register_blueprint(leaderboard_blueprint, url_prefix="/leaderboard") 
    app.register_blueprint(user_blueprint, url_prefix="/user")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app

if __name__ == "__main__":
    app = create_app()
    print("🚀 Server is running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)