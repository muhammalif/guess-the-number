from database.db import db
from database.models import User, Leaderboard

# CREATE User
def add_user(username):
    try:
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return existing_user

        user = User(username=username)
        db.session.add(user)
        db.session.commit()
        return user
    except Exception as e:
        print(f"Error in add_user: {str(e)}")
        db.session.rollback()
        return None

# CREATE Leaderboard Entry
def add_score(username, score, difficulty):
    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            return None

        entry = Leaderboard(
            user_id=user.id,
            username=username,  # Keep username for display purposes
            score=score, 
            mode="singleplayer", 
            difficulty=difficulty
        )
        db.session.add(entry)
        db.session.commit()
        return entry
    except Exception as e:
        print(f"Error adding score: {str(e)}")
        db.session.rollback()
        return None

# READ All Users
def get_users():
    return User.query.all()

# READ Leaderboard
def get_leaderboard(difficulty="easy"):
    try:
        # Get the count of wins (scores of 100) per user for the specified difficulty
        win_counts = db.session.query(
            Leaderboard.username,
            db.func.count(Leaderboard.id).label('wins'),
            Leaderboard.difficulty
        ).filter_by(mode="singleplayer", score=100, difficulty=difficulty)\
         .group_by(Leaderboard.username, Leaderboard.difficulty)\
         .order_by(db.desc('wins'))\
         .limit(20)\
         .all()
        
        # Create a dictionary to store the results
        result = []
        
        # For each user with wins, calculate total score
        for user in win_counts:
            # Calculate total score (wins × 100)
            total_score = user.wins * 100
            
            # Add to result
            result.append({
                'username': user.username,
                'wins': user.wins,
                'total_score': total_score,
                'difficulty': user.difficulty
            })
        
        return result
    except Exception as e:
        print(f"Error in get_leaderboard: {str(e)}")
        return []

# READ User by username
def get_user_by_username(username):
    return User.query.filter_by(username=username).first()

# UPDATE User
def update_username(old_username, new_username):
    user = User.query.filter_by(username=old_username).first()
    if user:
        user.username = new_username
        db.session.commit()
        return user
    return None

# DELETE User
def delete_user(username):
    user = User.query.filter_by(username=username).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    return False