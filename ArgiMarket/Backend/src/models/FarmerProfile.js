import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        farmName: {
            type: String,
            required: true,
            trim: true
        },

        farmLocation: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        },

        crops: [
            {
                type: String
            }
        ],

        farmingMethod: {
            type: String,
            enum: ["organic", "conventional", "mixed"],
            default: "conventional"
        },

        farmSize: {
            type: Number,
            default: 0
        },

        description: {
            type: String,
            default: ""
        },

        documents: [
            {
                type: String
            }
        ],

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "approved"
        },

        rejectionReason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const FarmerProfile = mongoose.model(
    "FarmerProfile",
    farmerProfileSchema
);

export default FarmerProfile;