# Guess The Number Game

A full-stack web application that implements a number guessing game with user authentication, leaderboards, and real-time game mechanics.

## 🎮 Features

- User authentication and registration
- Interactive number guessing gameplay
- Real-time game state management
- Leaderboard system
- Responsive and modern UI design
- Sound effects and animations

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Framer Motion (for animations)
- Howler.js (for sound effects)
- React Router DOM
- Axios (for API calls)

### Backend
- Python Flask
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Flask-Migrate (Database migrations)
- Flask-CORS (Cross-Origin Resource Sharing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python reset_db.py
   ```

5. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout user

### Game
- POST `/game/start` - Start a new game
- POST `/game/guess` - Make a guess
- GET `/game/status` - Get current game status

### Leaderboard
- GET `/leaderboard` - Get top players
- POST `/leaderboard/update` - Update player score

### User
- GET `/user/profile` - Get user profile
- PUT `/user/profile` - Update user profile

## 📁 Project Structure

```
guess-the-number/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── database/
│   ├── routes/
│   ├── services/
│   └── utils/
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

## 🔒 Environment Variables

### Backend
Create a `.env` file in the backend directory with:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

### Frontend
Create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 