import express from "express";

import {
    createPaymentOrder,
    verifyPayment
} from "../controllers/payment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { consumerOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(consumerOnly);

router.post(
    "/create-order",
    createPaymentOrder
);

router.post(
    "/verify",
    verifyPayment
);

export default router;