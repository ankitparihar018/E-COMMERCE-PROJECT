import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import User from "../models/User.js";
import ChatConversation from "../models/ChatConversation.js";
import ChatMessage from "../models/ChatMessage.js";

const getTokenFromCookie = (cookieHeader = "") => {
    const tokenCookie = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="));

    if (!tokenCookie) {
        return null;
    }

    try {
        return decodeURIComponent(tokenCookie.slice("token=".length));
    } catch {
        return null;
    }
};

const participantFilter = (user) => (
    user.role === "consumer"
        ? { buyer: user._id }
        : { farmer: user._id }
);

const acknowledgeError = (acknowledge, message) => {
    if (typeof acknowledge === "function") {
        acknowledge({
            success: false,
            message
        });
    }
};

export const attachChatSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = getTokenFromCookie(
                socket.handshake.headers.cookie
            );

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("_id role");

            if (!user || !["consumer", "farmer"].includes(user.role)) {
                return next(new Error("Chat access denied"));
            }

            socket.data.user = user;
            return next();
        } catch {
            return next(new Error("Invalid or expired authentication"));
        }
    });

    io.on("connection", (socket) => {
        const user = socket.data.user;
        socket.join(`user:${user._id}`);

        socket.on("chat:join", async (conversationId, acknowledge) => {
            try {
                if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                    return acknowledgeError(acknowledge, "Invalid conversation");
                }

                const conversation = await ChatConversation.findOne({
                    _id: conversationId,
                    ...participantFilter(user)
                }).select("_id");

                if (!conversation) {
                    return acknowledgeError(acknowledge, "Conversation not found");
                }

                socket.join(`conversation:${conversation._id}`);
                if (typeof acknowledge === "function") {
                    acknowledge({ success: true });
                }
            } catch (error) {
                console.error("CHAT SOCKET JOIN ERROR:", error);
                acknowledgeError(acknowledge, "Unable to join conversation");
            }
        });

        socket.on("chat:send", async (payload = {}, acknowledge) => {
            try {
                const { conversationId, text } = payload;

                if (
                    typeof conversationId !== "string" ||
                    !mongoose.Types.ObjectId.isValid(conversationId)
                ) {
                    return acknowledgeError(acknowledge, "Invalid conversation");
                }

                if (
                    typeof text !== "string" ||
                    !text.trim() ||
                    text.trim().length > 2000
                ) {
                    return acknowledgeError(
                        acknowledge,
                        "Message must contain 1 to 2000 characters"
                    );
                }

                const conversation = await ChatConversation.findOne({
                    _id: conversationId,
                    ...participantFilter(user)
                });

                if (!conversation) {
                    return acknowledgeError(acknowledge, "Conversation not found");
                }

                const message = await ChatMessage.create({
                    conversation: conversation._id,
                    sender: user._id,
                    text: text.trim()
                });

                conversation.lastMessage = text.trim();
                conversation.lastMessageAt = message.createdAt;
                await conversation.save();
                await message.populate("sender", "fullname role");

                const serializedMessage = {
                    ...message.toObject(),
                    conversationId: conversation._id.toString()
                };

                io.to(`user:${conversation.buyer}`)
                    .to(`user:${conversation.farmer}`)
                    .emit("chat:message", serializedMessage);

                if (typeof acknowledge === "function") {
                    acknowledge({
                        success: true,
                        message: serializedMessage
                    });
                }
            } catch (error) {
                console.error("CHAT SOCKET SEND ERROR:", error);
                acknowledgeError(acknowledge, "Unable to send message");
            }
        });
    });

    return io;
};
