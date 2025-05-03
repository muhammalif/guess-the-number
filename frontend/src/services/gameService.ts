import { api } from "./api";

export const startGame = async (mode: string, difficulty: string, username?: string, room?: string) => {
    try {
        const response = await api.post("/game/start", {
            mode,
            difficulty,
            username,
            room,
        })
        return response.data
    } catch (error) {
        console.error("Failed to start game:", error)
        throw error
    }
}

export const makeGuess = async (username: string, guess: number, mode: string, room?: string) => {
    try {
        const response = await api.post("/game/guess", {
            username,
            guess,
            mode,
            room,
        })
        return response.data
    } catch (error) {
        console.error("Failed to make guess:", error)
        throw error
    }
}