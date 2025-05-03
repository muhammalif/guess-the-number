import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RetroGrid } from "../components/magicui/retro-grid";
import { ShinyButton } from "../components/magicui/shiny-button";
import { SparklesText } from "../components/magicui/sparkles-text";
import { clickSfx } from "../utils/clickSfx";
import Loading from "../components/Loading";

interface LeaderboardEntry {
    id: string;
    username: string;
    wins: number;
    total_score: number;
    difficulty?: string;
}

type Difficulty = "easy" | "medium" | "hard";

const Leaderboard = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/leaderboard/leaderboard`, {
                params: { 
                    mode: "singleplayer",
                    difficulty: selectedDifficulty 
                },
                timeout: 10000
            });
            
            const data = response.data;
            if (Array.isArray(data)) {
                const sortedData = data
                    .filter(entry => entry.difficulty === selectedDifficulty)
                    .sort((a, b) => b.wins - a.wins);
                setLeaderboard(sortedData);
            } else {
                throw new Error("Invalid data format received from server");
            }
        } catch (err) {
            console.error("Leaderboard fetch error:", err);
            
            let errorMessage = "An unexpected error occurred";
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    errorMessage = err.response.data?.error || 
                                   err.response.data?.message || 
                                   `Error ${err.response.status}: Server error`;
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [selectedDifficulty]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard, selectedDifficulty]);

    const handleBack = () => {
        clickSfx.play();
        navigate('/');
    };

    const handleDifficultyChange = (difficulty: Difficulty) => {
        clickSfx.play();
        setSelectedDifficulty(difficulty);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-0">
            <RetroGrid />
            <SparklesText text="Leaderboard" className="text-3xl sm:text-4xl font-bold text-black mb-4 sm:mb-6" />

            <div className="bg-black bg-opacity-50 p-4 sm:p-6 rounded-lg shadow-lg text-white w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <ShinyButton onClick={handleBack} className="bg-white py-2 sm:py-3 px-3 sm:px-4">
                        ← Back
                    </ShinyButton>
                </div>

                <div className="flex justify-center space-x-2 mb-4">
                    {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => handleDifficultyChange(difficulty)}
                            className={`px-4 py-2 rounded-full transition-all duration-200 ${
                                selectedDifficulty === difficulty
                                    ? "bg-white text-black font-bold"
                                    : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                        >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </button>
                    ))}
                </div>

                <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
                    {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Mode Ranking
                </h2>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className="text-center">
                        <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
                        <ShinyButton onClick={fetchLeaderboard} className="bg-white py-2 sm:py-3">
                            Try Again
                        </ShinyButton>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {leaderboard.length > 0 ? (
                            <table className="w-full min-w-[300px]">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 text-left text-sm sm:text-base">Rank</th>
                                        <th className="py-2 text-left text-sm sm:text-base">Username</th>
                                        <th className="py-2 text-right text-sm sm:text-base">Wins</th>
                                        <th className="py-2 text-right text-sm sm:text-base">Total Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <tr
                                            key={entry.username}
                                            className="border-b border-gray-800"
                                        >
                                            <td className="py-2 text-sm sm:text-base">#{index + 1}</td>
                                            <td className="py-2 text-sm sm:text-base">{entry.username}</td>
                                            <td className="py-2 text-right text-sm sm:text-base">{entry.wins}</td>
                                            <td className="py-2 text-right text-sm sm:text-base">{entry.total_score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-sm sm:text-base">No scores yet!</p>
                        )}

                        <ShinyButton className="mt-4 w-full bg-white py-2 sm:py-3" onClick={fetchLeaderboard}>
                            Refresh Leaderboard
                        </ShinyButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;