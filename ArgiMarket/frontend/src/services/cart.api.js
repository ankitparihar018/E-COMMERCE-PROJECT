import axios from "axios";

const api = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});

export const getCart = () => {
    return api.get("/");
};

export const addToCart = (data) => {
    return api.post("/", data);
};

export const updateCartItem = (productId, quantity) => {
    return api.put(`/${productId}`, {
        quantity
    });
};

export const removeFromCart = (productId) => {
    return api.delete(`/${productId}`);
};

export const clearCart = () => {
    return api.delete("/");
};