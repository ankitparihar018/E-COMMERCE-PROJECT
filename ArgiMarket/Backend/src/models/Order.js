import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        consumer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                farmer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                name: String,

                quantity: {
                    type: Number,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                costPrice: {
                    type: Number,
                    min: 0,
                    select: false
                },

                unit: String
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            address: String,
            city: String,
            state: String,
            pincode: String,
            contact: String
        },

        deliverySlot: {
            date: Date,

            timeSlot: {
                type: String,
                enum: ["morning", "afternoon", "evening"]
            }
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        paymentId: {
            type: String,
            default: ""
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "out_for_delivery",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;