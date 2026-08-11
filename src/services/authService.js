import API from "./api";

const AUTH_TOKEN_KEY = "lifeline-auth-token";

const decodeTokenPayload = () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");

        const decodedPayload = typeof window !== "undefined"
            ? window.atob(paddedBase64)
            : Buffer.from(paddedBase64, "base64").toString("utf8");

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Unable to decode auth token:", error);
        return null;
    }
};

export const setAuthToken = (token) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const clearAuthToken = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getCurrentUserRole = () => decodeTokenPayload()?.role || null;

export const isDoctorAuthenticated = () => getCurrentUserRole() === "doctor";
export const isPatientAuthenticated = () => getCurrentUserRole() === "patient";
export const isAdminAuthenticated = () => getCurrentUserRole() === "admin";

export const doctorLogin = async (data) => {
    const response = await API.post("/auth/doctor/login", data);
    if (response?.data?.success && response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};

export const registerDoctor = async (data) => {
    const response = await API.post("/auth/doctor/register", data);
    if (response?.data?.success && response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};

export const adminLogin = async (data) => {
    const response = await API.post("/auth/admin/login", data);
    if (response?.data?.success && response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};

export const patientLogin = async (data) => {
    const response = await API.post("/auth/patient/login", data);
    if (response?.data?.success && response.data.token) {
        setAuthToken(response.data.token);
    }
    return response.data;
};