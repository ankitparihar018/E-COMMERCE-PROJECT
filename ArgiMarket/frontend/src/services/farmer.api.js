import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/farmers`,
    withCredentials: true
});

export const getFarmers = () => {
    return api.get("/");
};

export const getFarmer = (id) => {
    return api.get(`/${id}`);
};

export const getMyFarmerProfile = () => {
    return api.get("/my/profile");
};

export const createFarmerProfile = (data) => {
    return api.post("/profile", data);
};

export const updateFarmerProfile = (data) => {
    return api.put("/profile", data);
};

export const deleteFarmerProfile = () => {
    return api.delete("/profile");
};