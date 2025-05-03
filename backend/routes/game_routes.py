from flask import Blueprint, request, jsonify, session
import random

game_blueprint = Blueprint("game", __name__)

games = {}

@game_blueprint.route("/start", methods=["POST"])
def start_game():
    mode = request.json.get("mode", "singleplayer")
    difficulty = request.json.get("difficulty", "easy")
    username = request.json.get("username", "guest")
    room = request.json.get("room")

    ranges = {"easy": 10, "medium": 50, "hard": 100} 
    secret_number = random.randint(1, ranges.get(difficulty, 10))
    
    # Setup game session with attempts counter
    attempts = {"easy": 3, "medium": 15, "hard": 30}
    game_session = {
        "secret_number": secret_number,
        "attempts_left": attempts.get(difficulty, 3),  # Set attempts based on difficulty
        "difficulty": difficulty,
        "mode": mode
    }
    
    if mode == "multiplayer":
        if not room:
            return jsonify({"error": "Room ID required"}), 400
        session[f"game_{room}"] = game_session
    else:
        session[f"single_{username}"] = game_session

    return jsonify({
        "message": "Game started!", 
        "range": ranges.get(difficulty, 10),
        "attempts_left": attempts.get(difficulty, 3)
    })

@game_blueprint.route("/guess", methods=["POST"])
def guess_number():
    username = request.json.get("username", "guest")
    guess = request.json.get("guess")
    room = request.json.get("room")
    mode = request.json.get("mode", "singleplayer")

    if guess is None:
        return jsonify({"error": "Guess is required"}), 400

    try:
        guess = int(guess)
    except ValueError:
        return jsonify({"error": "Guess must be an integer"}), 400 
    
    # Get game session from session storage
    session_key = f"game_{room}" if room else f"single_{username}"
    game_session = session.get(session_key)

    if game_session is None:
        return jsonify({"error": "Game not started"}), 400
    
    # Check remaining attempts
    if game_session["attempts_left"] <= 0:
        return jsonify({"message": "Game over! No attempts left.", "finished": True})
    
    # Decrease attempts
    game_session["attempts_left"] -= 1
    session[session_key] = game_session
    
    secret_number = game_session["secret_number"]
    attempts_left = game_session["attempts_left"]
    
    if guess < secret_number:
        return jsonify({
            "message": "Too low!", 
            "attempts_left": attempts_left
        })
    elif guess > secret_number:
        return jsonify({
            "message": "Too high!", 
            "attempts_left": attempts_left
        })
    else:
        # If correct guess, clear the session
        if session_key in session:
            difficulty = game_session["difficulty"]
            session.pop(session_key)
        
        return jsonify({
            "message": "Correct! You won!", 
            "won": True,
            "difficulty": difficulty,
            "mode": mode
        })