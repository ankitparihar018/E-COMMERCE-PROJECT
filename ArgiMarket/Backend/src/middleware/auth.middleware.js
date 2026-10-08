import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ========================================
// REQUIRED AUTHENTICATION
// ========================================

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// ========================================
// OPTIONAL AUTHENTICATION
// ========================================

export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        // User is not logged in
        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("-password");

        req.user = user || null;

        next();

    } catch (error) {
        // Invalid token should NOT block public route
        req.user = null;
        next();
    }
};

export default authMiddleware;