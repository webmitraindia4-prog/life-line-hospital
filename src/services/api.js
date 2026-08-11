import axios from "axios";

const AUTH_TOKEN_KEY = "lifeline-auth-token";

const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

const defaultApiHost =
    typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.hostname}:5002`
        : "http://localhost:5002";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `${defaultApiHost}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return config;
});

export default API;