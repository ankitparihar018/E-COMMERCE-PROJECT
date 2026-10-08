import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        costPrice: {
            type: Number,
            required: true,
            min: 0,
            select: false
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        harvestDate: {
            type: Date
        },

        farmingMethod: {
            type: String,
            enum: ["organic", "conventional"],
            default: "conventional"
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        images: [
            {
                type: String
            }
        ],

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;