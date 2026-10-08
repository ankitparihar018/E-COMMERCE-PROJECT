import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
    withCredentials: true
});

export const register = (data) => {
    return api.post("/register", data);
};

export const login = (data) => {
    return api.post("/login", data);
};

export const logout = () => {
    return api.post("/logout");
};

export const getMe = () => {
    return api.get("/me");
};

export default api;