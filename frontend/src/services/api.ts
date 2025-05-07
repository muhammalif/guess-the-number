import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,  // 10-second timeout
    withCredentials: true  // Important for CORS
})

// Optional: Add request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Sending request to: ${config.url}`, config.params);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);