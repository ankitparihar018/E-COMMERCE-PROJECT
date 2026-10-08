import mongoose from "mongoose";
import ChatConversation from "../models/ChatConversation.js";
import ChatMessage from "../models/ChatMessage.js";
import FarmerProfile from "../models/FarmerProfile.js";

const getParticipantFilter = (user) => (
    user.role === "consumer"
        ? { buyer: user._id }
        : { farmer: user._id }
);

export const getConversations = async (req, res) => {
    try {
        const conversations = await ChatConversation.find({
            $or: [
                { buyer: req.user._id },
                { farmer: req.user._id }
            ]
        })
            .populate("buyer", "fullname profileImage")
            .populate("farmer", "fullname profileImage")
            .sort({ lastMessageAt: -1, updatedAt: -1 });

        return res.json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error("GET CHAT CONVERSATIONS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load conversations"
        });
    }
};

export const startConversation = async (req, res) => {
    try {
        const { farmerId } = req.body;

        if (
            typeof farmerId !== "string" ||
            !mongoose.Types.ObjectId.isValid(farmerId)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid farmer is required"
            });
        }

        const profile = await FarmerProfile.findOne({
            user: farmerId,
            verificationStatus: "approved"
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Approved farmer not found"
            });
        }

        if (profile.user.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot start a conversation with yourself"
            });
        }

        let conversation = await ChatConversation.findOne({
            buyer: req.user._id,
            farmer: profile.user
        });

        if (!conversation) {
            try {
                conversation = await ChatConversation.create({
                    buyer: req.user._id,
                    farmer: profile.user
                });
            } catch (error) {
                if (error.code !== 11000) {
                    throw error;
                }

                conversation = await ChatConversation.findOne({
                    buyer: req.user._id,
                    farmer: profile.user
                });
            }
        }

        await conversation.populate([
            { path: "buyer", select: "fullname profileImage" },
            { path: "farmer", select: "fullname profileImage" }
        ]);

        return res.status(200).json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error("START CHAT CONVERSATION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to start conversation"
        });
    }
};

export const getConversationMessages = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation"
            });
        }

        const conversation = await ChatConversation.findOne({
            _id: req.params.id,
            ...getParticipantFilter(req.user)
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const messages = await ChatMessage.find({
            conversation: conversation._id
        })
            .populate("sender", "fullname role")
            .sort({ createdAt: 1 })
            .limit(500);

        return res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("GET CHAT MESSAGES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load messages"
        });
    }
};
