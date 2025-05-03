import { api } from "./api";

export const createUser = async (username: string) => {
    try {
        const response = await api.post("/user/add-user", { username })
        return response.data
    } catch (error) {
        console.error('Failed to create user:', error)
        throw error
    }
}

export const getUsers = async () => {
    try {
        const response = await api.get("/user/users")
        return response.data
    } catch (error) {
        console.error("Failed to get users:", error)
        throw error
    }
}