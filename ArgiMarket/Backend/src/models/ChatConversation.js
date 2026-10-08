import mongoose from "mongoose";

const chatConversationSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        lastMessage: {
            type: String,
            default: ""
        },

        lastMessageAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

chatConversationSchema.index(
    { buyer: 1, farmer: 1 },
    { unique: true }
);

const ChatConversation = mongoose.model(
    "ChatConversation",
    chatConversationSchema
);

export default ChatConversation;
