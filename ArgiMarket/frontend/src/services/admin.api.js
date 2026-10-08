import axios from "axios";

const api = axios.create({
    baseURL: "/api/admin",
    withCredentials: true
});

export const getAnalytics = () => {
    return api.get("/analytics");
};

export const getFarmers = () => {
    return api.get("/farmers");
};

export const approveFarmer = (id) => {
    return api.put(`/farmers/${id}/approve`);
};

export const rejectFarmer = (id, rejectionReason) => {
    return api.put(`/farmers/${id}/reject`, {
        rejectionReason
    });
};

export const getProducts = () => {
    return api.get("/products");
};

export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};

export const getOrders = () => {
    return api.get("/orders");
};

export const getCategories = () => {
    return api.get("/categories");
};

export const createCategory = (data) => {
    return api.post("/categories", data);
};

export const deleteCategory = (id) => {
    return api.delete(`/categories/${id}`);
};

export const getSupportRequests = () => {
    return api.get("/support");
};

export const updateSupportRequestStatus = (id, status) => {
    return api.patch(`/support/${id}/status`, { status });
};