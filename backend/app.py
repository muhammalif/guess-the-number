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
from config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])

    # Setup JWT
    jwt = JWTManager(app)

    # Initialize CORS with specific configuration
    CORS(app, 
         resources={r"/*": {
             "origins": app.config['CORS_ORIGINS'],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }},
         supports_credentials=True)

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
        if origin in app.config['CORS_ORIGINS']:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
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
    app.register_blueprint(game_blueprint, url_prefix="/api/game")
    app.register_blueprint(leaderboard_blueprint, url_prefix="/api/leaderboard") 
    app.register_blueprint(user_blueprint, url_prefix="/api/user")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app

if __name__ == '__main__':
    app = create_app('development')
    print("🚀 Server is running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)