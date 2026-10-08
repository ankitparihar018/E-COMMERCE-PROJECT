import express from "express";

import {
    createReview,
    getProductReviews,
    getFarmerReviews
} from "../controllers/review.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { consumerOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/product/:id",
    getProductReviews
);

router.get(
    "/farmer/:id",
    getFarmerReviews
);

router.post(
    "/",
    authMiddleware,
    consumerOnly,
    createReview
);

export default router;