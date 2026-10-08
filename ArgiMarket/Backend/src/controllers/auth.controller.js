import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
    isValidEmail,
    isValidPhone,
    isValidPassword
} from "../utils/validators.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const registerUser = async (req, res) => {
    try {
        const {
            fullname,
            email,
            contact,
            password,
            role
        } = req.body;

        if (!fullname || fullname.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Full name must contain at least 3 characters"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (!isValidPhone(contact)) {
            return res.status(400).json({
                success: false,
                message: "Contact must contain exactly 10 digits"
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const allowedRoles = ["consumer", "farmer"];

        const selectedRole = role || "consumer";

        if (!allowedRoles.includes(selectedRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { contact }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or contact already registered"
            });
        }

        const user = await User.create({
            fullname: fullname.trim(),
            email: email.toLowerCase(),
            contact,
            password,
            role: selectedRole
        });

        const token = generateToken(user._id);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration failed:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, cookieOptions);

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie("token");

    res.json({
        success: true,
        message: "Logout successful"
    });
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user ?? null
    });
};