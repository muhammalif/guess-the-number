import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RetroGrid } from "../components/magicui/retro-grid";
import { ShinyButton } from "../components/magicui/shiny-button";
import { SparklesText } from "../components/magicui/sparkles-text";
import { clickSfx } from "../utils/clickSfx";
import { useAuth } from '../hooks/useAuth';

const Game = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [gameState, setGameState] = useState("difficulty");
    const [difficulty, setDifficulty] = useState("");
    const [guess, setGuess] = useState<number | "">("");
    const [message, setMessage] = useState("");
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [range, setRange] = useState(10);
    const [winner, setWinner] = useState("");
    const [secretNumber, setSecretNumber] = useState<number | null>(null);

    // Select difficulty
    const selectDifficulty = (selectedDifficulty: string) => {
        clickSfx.play();
        setDifficulty(selectedDifficulty);
        startNewGame(selectedDifficulty);
    };
    
    // Start new game
    const startNewGame = (selectedDifficulty: string) => {
        const ranges = {
            easy: 10,
            medium: 50,
            hard: 100
        };
        
        const attempts = {
            easy: 3,
            medium: 15,
            hard: 30
        };
        
        setRange(ranges[selectedDifficulty as keyof typeof ranges] || 10);
        setSecretNumber(Math.floor(Math.random() * (ranges[selectedDifficulty as keyof typeof ranges] || 10)) + 1);
        setGameState("playing");
        setAttemptsLeft(attempts[selectedDifficulty as keyof typeof attempts] || 3);
        setMessage("");
        setWinner("");
    };

    // Make a guess
    const makeGuess = () => {
        clickSfx.play();
        if (guess === "") {
            setMessage("Please enter a number");
            return;
        }

        if (attemptsLeft <= 0) {
            setMessage("Game over! No attempts left.");
            setGameState("gameOver");
            return;
        }

        const currentGuess = Number(guess);
        setAttemptsLeft(prev => prev - 1);

        if (secretNumber === null) {
            setMessage("Error: Game not properly initialized");
            return;
        }

        if (currentGuess === secretNumber) {
            setWinner(user?.username || "");
            setMessage("Congratulations! You won!");
            setGameState("gameOver");
            addToLeaderboard(user?.username || "", 100, "singleplayer", difficulty);
        } else if (currentGuess < secretNumber) {
            setMessage(`Too low! ${attemptsLeft - 1} attempts left.`);
        } else {
            setMessage(`Too high! ${attemptsLeft - 1} attempts left.`);
        }

        setGuess("");
    };

    // Add score to leaderboard
    const addToLeaderboard = async (username: string, score: number, mode: string, difficulty?: string) => {
        try {
            const requestData = {
                username,
                score,
                mode,
                difficulty
            };
            
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/leaderboard/add-score`, 
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
            console.log(`Score added to leaderboard for ${username} in ${difficulty} mode`);
        } catch (error) {
            console.error("Failed to add score to leaderboard:", error);
        }
    };

    // Start new game
    const playAgain = () => {
        clickSfx.play();
        setGameState("difficulty");
        setMessage("");
        setWinner("");
        setSecretNumber(null);
        setAttemptsLeft(3);
        setDifficulty("");
    };

    // Add back button handler
    const handleBack = () => {
        clickSfx.play();
        navigate('/');
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <RetroGrid />
            
            <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 sm:px-6">
                <div className="text-center mb-4 sm:mb-6">
                    <SparklesText text="Guess The Number" className="text-3xl sm:text-4xl font-bold text-black" />
                </div>

                <div className="bg-black bg-opacity-70 p-4 sm:p-6 rounded-lg shadow-lg text-white w-full max-w-md backdrop-blur-sm border border-purple-500/30">
                    {gameState === "difficulty" && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-center mb-4">Select Difficulty</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <ShinyButton className="bg-white" onClick={() => selectDifficulty("easy")}>Easy (1-10)</ShinyButton>
                                <ShinyButton className="bg-white" onClick={() => selectDifficulty("medium")}>Medium (1-50)</ShinyButton>
                                <ShinyButton className="bg-white" onClick={() => selectDifficulty("hard")}>Hard (1-100)</ShinyButton>
                            </div>
                            <ShinyButton onClick={handleBack} className="mt-4 bg-white">Back</ShinyButton>
                        </div>
                    )}

                    {gameState === "playing" && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="mb-2">Guess a number between 1 and {range}</p>
                                <p className="mb-2">Attempts left: {attemptsLeft}</p>
                                {message && <p className="text-yellow-400">{message}</p>}
                            </div>
                            <div className="flex flex-col space-y-4">
                                <input
                                    type="number"
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value ? Number(e.target.value) : "")}
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500/30 focus:outline-none focus:border-purple-500"
                                    min="1"
                                    max={range}
                                />
                                <ShinyButton className="bg-white" onClick={makeGuess}>Submit Guess</ShinyButton>
                                <ShinyButton className="bg-white" onClick={handleBack}>Back</ShinyButton>
                            </div>
                        </div>
                    )}

                    {gameState === "gameOver" && (
                        <div className="space-y-4 text-center">
                            <h2 className="text-xl font-semibold">
                                {winner ? "Congratulations! You won! 🎉" : "Game Over! 😢"}
                            </h2>
                            <p>The number was: {secretNumber}</p>
                            {message && <p className="text-yellow-400">{message}</p>}
                            <div className="flex flex-col space-y-4">
                                <ShinyButton className="bg-white" onClick={playAgain}>Play Again</ShinyButton>
                                <ShinyButton className="bg-white" onClick={handleBack}>Back to Home</ShinyButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;