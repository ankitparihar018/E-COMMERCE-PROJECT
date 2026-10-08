import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/support`,
    withCredentials: true
});

export const createSupportRequest = (data) => {
    return api.post("/", data);
};

export const getFarmerSupportRequests = () => {
    return api.get("/farmer");
};

export const updateFarmerSupportRequestStatus = (id, status) => {
    return api.patch(`/${id}/farmer-status`, { status });
};
