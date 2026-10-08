import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/orders`,
    withCredentials: true
});

export const createOrder = (data) => {
    return api.post("/", data);
};

export const getMyOrders = () => {
    return api.get("/my");
};

export const getOrder = (id) => {
    return api.get(`/${id}`);
};

export const getFarmerOrders = () => {
    return api.get("/farmer");
};

export const getFarmerProfitSummary = () => {
    return api.get("/farmer/profit-summary");
};

export const updateOrderStatus = (id, orderStatus) => {
    return api.put(`/${id}/status`, {
        orderStatus
    });
};