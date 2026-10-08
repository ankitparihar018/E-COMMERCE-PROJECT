import express from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    getFarmerOrders,
    getFarmerProfitSummary,
    updateOrderStatus
} from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    consumerOnly,
    farmerOnly
} from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    consumerOnly,
    createOrder
);

router.get(
    "/my",
    authMiddleware,
    consumerOnly,
    getMyOrders
);

router.get(
    "/farmer/profit-summary",
    authMiddleware,
    farmerOnly,
    getFarmerProfitSummary
);

router.get(
    "/farmer",
    authMiddleware,
    farmerOnly,
    getFarmerOrders
);

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

router.put(
    "/:id/status",
    authMiddleware,
    updateOrderStatus
);

export default router;