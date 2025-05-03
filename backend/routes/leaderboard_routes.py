from flask import Blueprint, request, jsonify
from database.crud import add_score, get_leaderboard, get_user_by_username, add_user
from database.db import db

leaderboard_blueprint = Blueprint("leaderboard", __name__)

# Add Score
@leaderboard_blueprint.route("/add-score", methods=["POST"])
def create_score():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        username = data.get("username")
        score = data.get("score")
        difficulty = data.get("difficulty")

        # Validate required fields
        if not username:
            return jsonify({"error": "Username is required"}), 400
        if score is None:
            return jsonify({"error": "Score is required"}), 400
        if not difficulty:
            return jsonify({"error": "Difficulty is required"}), 400

        # Validate score is a positive integer
        try:
            score = int(score)
            if score < 0:
                return jsonify({"error": "Score must be a positive integer"}), 400
        except (TypeError, ValueError):
            return jsonify({"error": "Score must be a valid integer"}), 400

        # Check if user exists, if not create one
        user = get_user_by_username(username)
        if not user:
            try:
                user = add_user(username)
                if not user:
                    print(f"Failed to create user: {username}")
                    return jsonify({"error": "Failed to create user"}), 500
            except Exception as e:
                print(f"Error creating user: {str(e)}")
                return jsonify({"error": "Failed to create user"}), 500

        # Add score
        try:
            entry = add_score(username, score, difficulty)
            if not entry:
                print(f"Failed to add score for user: {username}")
                return jsonify({"error": "Failed to add score"}), 500
            return jsonify({"message": "Score added successfully", "score": entry.score})
        except Exception as e:
            print(f"Error adding score: {str(e)}")
            db.session.rollback()
            return jsonify({"error": "Failed to add score to database"}), 500

    except Exception as e:
        print(f"Unexpected error in create_score: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# Get Leaderboard
@leaderboard_blueprint.route("/leaderboard", methods=["GET"])
def leaderboard():
    try:
        difficulty = request.args.get("difficulty", "easy")
        scores = get_leaderboard(difficulty)
        if scores is None:
            return jsonify({"error": "Failed to fetch leaderboard data"}), 500
            
        return jsonify(scores)
    except Exception as e:
        print(f"Error fetching leaderboard: {str(e)}")
        return jsonify({"error": f"Failed to load leaderboard: {str(e)}"}), 500