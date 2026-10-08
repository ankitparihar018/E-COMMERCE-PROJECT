import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
    {
        consumer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            enum: ["order", "payment", "delivery", "account", "other"],
            required: true
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        status: {
            type: String,
            enum: ["open", "in_progress", "resolved"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

const SupportRequest = mongoose.model(
    "SupportRequest",
    supportRequestSchema
);

export default SupportRequest;
