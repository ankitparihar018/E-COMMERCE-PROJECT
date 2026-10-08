import { createHmac, timingSafeEqual } from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const getRazorpayClient = () => {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return null;
    }

    return new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET
    });
};

export const createPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required"
            });
        }

        const razorpay = getRazorpayClient();

        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            consumer: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.paymentStatus !== "pending" && order.paymentStatus !== "failed") {
            return res.status(400).json({
                success: false,
                message: "Order is not awaiting payment"
            });
        }

        if (order.orderStatus === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled orders cannot be paid"
            });
        }

        const amountInPaise = Math.round(order.totalAmount * 100);

        if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
            return res.status(400).json({
                success: false,
                message: "Order amount must be greater than zero"
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `pay_${new mongoose.Types.ObjectId()}`
        });

        await Payment.create({
            order: order._id,
            consumer: req.user._id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalAmount,
            status: "created"
        });

        res.json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to start payment. Please try again."
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(orderId) ||
            typeof razorpayOrderId !== "string" ||
            typeof razorpayPaymentId !== "string" ||
            typeof razorpaySignature !== "string" ||
            !/^[a-f\d]{64}$/i.test(razorpaySignature)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment verification details"
            });
        }

        const { RAZORPAY_KEY_SECRET } = process.env;

        if (!RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
            });
        }

        const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest();
        const receivedSignature = Buffer.from(razorpaySignature, "hex");

        if (
            receivedSignature.length !== expectedSignature.length ||
            !timingSafeEqual(receivedSignature, expectedSignature)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed"
            });
        }

        const payment = await Payment.findOne({
            order: orderId,
            consumer: req.user._id,
            razorpayOrderId
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        const orderRecord = await Order.findOne({
            _id: orderId,
            consumer: req.user._id
        });

        if (!orderRecord) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            !Number.isSafeInteger(Math.round(payment.amount * 100)) ||
            Math.round(payment.amount * 100) <= 0 ||
            Math.round(payment.amount * 100) !== Math.round(orderRecord.totalAmount * 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match the order"
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                consumer: req.user._id,
                paymentStatus: { $ne: "paid" },
                orderStatus: { $ne: "cancelled" }
            },
            {
                paymentStatus: "paid",
                paymentId: razorpayPaymentId,
                orderStatus: "confirmed"
            },
            { returnDocument: "after" }
        );

        if (!order) {
            const alreadyPaidOrder = await Order.findOne({
                _id: orderId,
                consumer: req.user._id,
                paymentStatus: "paid",
                paymentId: razorpayPaymentId
            });

            if (!alreadyPaidOrder) {
                return res.status(409).json({
                    success: false,
                    message: "Order cannot be marked as paid"
                });
            }
        }

        payment.razorpayPaymentId = razorpayPaymentId;
        payment.status = "paid";
        await payment.save();

        res.json({
            success: true,
            message: "Payment verified",
            payment
        });
    } catch (error) {
        console.error("Razorpay payment verification failed:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to verify payment. Please contact support."
        });
    }
};