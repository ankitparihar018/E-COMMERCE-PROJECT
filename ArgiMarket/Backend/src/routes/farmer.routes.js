import express from "express";

import {
    createFarmerProfile,
    getMyFarmerProfile,
    updateFarmerProfile,
    deleteFarmerProfile,
    getFarmers,
    getFarmerById
} from "../controllers/farmer.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { farmerOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getFarmers);

router.get(
    "/my/profile",
    authMiddleware,
    farmerOnly,
    getMyFarmerProfile
);

router.get("/:id", getFarmerById);

router.post(
    "/profile",
    authMiddleware,
    farmerOnly,
    createFarmerProfile
);

router.put(
    "/profile",
    authMiddleware,
    farmerOnly,
    updateFarmerProfile
);

router.delete(
    "/profile",
    authMiddleware,
    farmerOnly,
    deleteFarmerProfile
);

export default router;