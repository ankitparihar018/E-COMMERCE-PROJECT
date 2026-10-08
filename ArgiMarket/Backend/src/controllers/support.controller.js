import mongoose from "mongoose";
import SupportRequest from "../models/SupportRequest.js";
import FarmerProfile from "../models/FarmerProfile.js";

export const createSupportRequest = async (req, res) => {
    try {
        const { category, subject, message, farmer: farmerId } = req.body;

        const allowedCategories = [
            "order",
            "payment",
            "delivery",
            "account",
            "other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid support category"
            });
        }

        if (
            typeof farmerId !== "string" ||
            !mongoose.Types.ObjectId.isValid(farmerId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select a farmer"
            });
        }

        const farmerProfile = await FarmerProfile.findOne({
            user: farmerId,
            verificationStatus: "approved"
        });

        if (!farmerProfile) {
            return res.status(400).json({
                success: false,
                message: "Selected farmer is unavailable"
            });
        }

        if (
            typeof subject !== "string" ||
            !subject.trim() ||
            subject.trim().length > 120
        ) {
            return res.status(400).json({
                success: false,
                message: "Subject is required and must be 120 characters or fewer"
            });
        }

        if (
            typeof message !== "string" ||
            !message.trim() ||
            message.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "Message is required and must be 2000 characters or fewer"
            });
        }

        const supportRequest = await SupportRequest.create({
            consumer: req.user._id,
            farmer: farmerProfile.user,
            category,
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Your support request has been sent",
            request: {
                id: supportRequest._id,
                status: supportRequest.status,
                createdAt: supportRequest.createdAt
            }
        });
    } catch (error) {
        console.error("CREATE SUPPORT REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to send your support request"
        });
    }
};

export const getSupportRequests = async (req, res) => {
    try {
        const requests = await SupportRequest.find()
            .populate("consumer", "fullname email")
            .populate("farmer", "fullname")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("GET SUPPORT REQUESTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load support requests"
        });
    }
};

export const getFarmerSupportRequests = async (req, res) => {
    try {
        const requests = await SupportRequest.find({
            farmer: req.user._id
        })
            .populate("consumer", "fullname email")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("GET FARMER SUPPORT REQUESTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load support requests"
        });
    }
};

export const updateFarmerSupportRequestStatus = async (req, res) => {
    try {
        const allowedStatuses = ["open", "in_progress", "resolved"];
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid request status"
            });
        }

        const request = await SupportRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                farmer: req.user._id
            },
            { status },
            { new: true, runValidators: true }
        ).populate("consumer", "fullname email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Support request not found"
            });
        }

        return res.json({
            success: true,
            message: "Support request status updated",
            request
        });
    } catch (error) {
        console.error("UPDATE FARMER SUPPORT REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update support request"
        });
    }
};

export const updateSupportRequestStatus = async (req, res) => {
    try {
        const allowedStatuses = ["open", "in_progress", "resolved"];
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid request status"
            });
        }

        const request = await SupportRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate("consumer", "fullname email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Support request not found"
            });
        }

        return res.json({
            success: true,
            message: "Support request status updated",
            request
        });
    } catch (error) {
        console.error("UPDATE SUPPORT REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update support request"
        });
    }
};
