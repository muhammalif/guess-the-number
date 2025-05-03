from flask import Blueprint, request, jsonify
from database.crud import add_user, get_users, delete_user

user_blueprint = Blueprint("user", __name__)

# Create User
@user_blueprint.route("/add-user", methods=["POST"])
def create_user():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username required"}), 400
    
    # Checking username in database
    all_users = get_users()
    if any(user.username == username for u in all_users):
        return jsonify({"error": "Username already exist"}), 400
    
    user = add_user(username)
    return jsonify({"message": "User created", "user": user.username})

# Get All Users
@user_blueprint.route("/users", methods=["GET"])
def users():
    all_users = get_users()
    return jsonify([{"id": user.id, "username": user.username} for user in all_users])

# Delete User
@user_blueprint.route("/delete-user/<username>", methods=["DELETE"])
def remove_user(username):
    success = delete_user(username)
    if success:
        return jsonify({"message": f"User {username} deleted"})
    return jsonify({"error": "User not found"}), 404