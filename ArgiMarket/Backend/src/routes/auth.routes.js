import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getMe
} from "../controllers/auth.controller.js";

import authMiddleware, { optionalAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", optionalAuthMiddleware, getMe);

export default router;