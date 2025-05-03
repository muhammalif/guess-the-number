import { api } from "./api";

interface LeaderboardEntry {
    id: string
    username: string
    score: number
    mode: string
    difficulty?: string
}

export const getLeaderboard = async (mode?: string): Promise<LeaderboardEntry[]> => {
    if (!mode) {
        throw new Error("Mode parameter is required");
    }
    
    try {
        const queryParams = `?mode=${mode}`
        const response = await api.get(`/leaderboard/leaderboard${queryParams}`)
        
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid response format from server");
        }
        
        return response.data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
}

export const addScore = async (username: string, score: number, mode: string, difficulty?: string) => {
    try {
        const response = await api.post("/leaderboard/add-score", {
            username,
            score,
            mode,
            difficulty,
        })
        return response.data
    } catch (error) {
        console.error("Failed to add score:", error)
        throw error
    }
}