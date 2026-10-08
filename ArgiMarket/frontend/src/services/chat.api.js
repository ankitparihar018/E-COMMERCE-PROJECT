import axios from "axios";

const api = axios.create({
    baseURL: "/api/chats",
    withCredentials: true
});

export const getConversations = () => api.get("/");

export const startConversation = (farmerId) => {
    return api.post("/", { farmerId });
};

export const getConversationMessages = (conversationId) => {
    return api.get(`/${conversationId}/messages`);
};

