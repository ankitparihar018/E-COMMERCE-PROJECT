import express from "express";

import {
    createSupportRequest,
    getSupportRequests,
    getFarmerSupportRequests,
    updateFarmerSupportRequestStatus,
    updateSupportRequestStatus
} from "../controllers/support.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import {
    adminOnly,
    consumerOnly,
    farmerOnly
} from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    consumerOnly,
    createSupportRequest
);

router.get(
    "/farmer",
    authMiddleware,
    farmerOnly,
    getFarmerSupportRequests
);

router.patch(
    "/:id/farmer-status",
    authMiddleware,
    farmerOnly,
    updateFarmerSupportRequestStatus
);

router.get(
    "/",
    authMiddleware,
    adminOnly,
    getSupportRequests
);

router.patch(
    "/:id/status",
    authMiddleware,
    adminOnly,
    updateSupportRequestStatus
);

export default router;
