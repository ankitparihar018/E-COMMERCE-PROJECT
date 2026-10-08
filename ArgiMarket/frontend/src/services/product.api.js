import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/products`,
    withCredentials: true
});

// ================= PUBLIC =================

export const getProducts = (params = {}) => {
    return api.get("/", {
        params
    });
};

export const getProductCategories = () => {
    return api.get("/categories");
};

export const getProduct = (id) => {
    return api.get(`/${id}`);
};

// ================= FARMER =================

export const getMyProducts = () => {
    return api.get("/my/products");
};

export const createProduct = (formData) => {
    return api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const updateProduct = (id, data) => {
    return api.put(`/${id}`, data);
};

export const deleteProduct = (id) => {
    return api.delete(`/${id}`);
};

export default api;