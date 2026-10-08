import FarmerProfile from "../models/FarmerProfile.js";
 import Product from "../models/Product.js";
import User from "../models/User.js";

export const createFarmerProfile = async (req, res) => {
    try {
        const {
            farmName,
            farmLocation,
            city,
            state,
            pincode,
            crops,
            farmingMethod,
            farmSize,
            description
        } = req.body;

        const requiredFields = {
            farmName,
            farmLocation,
            city,
            state,
            pincode
        };
        const missingFields = Object.entries(requiredFields)
            .filter(([, value]) => typeof value !== "string" || !value.trim())
            .map(([field]) => field);

        if (missingFields.length) {
            return res.status(400).json({
                success: false,
                message: `Required fields: ${missingFields.join(", ")}`
            });
        }

        const parsedFarmSize = farmSize === "" || farmSize == null
            ? 0
            : Number(farmSize);

        if (!Number.isFinite(parsedFarmSize) || parsedFarmSize < 0) {
            return res.status(400).json({
                success: false,
                message: "Farm size must be a non-negative number"
            });
        }

        if (req.user.role !== "farmer") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can create farmer profile"
            });
        }

        const existingProfile = await FarmerProfile.findOne({
            user: req.user._id
        });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Farmer profile already exists"
            });
        }

        const profile = await FarmerProfile.create({
            user: req.user._id,
            farmName,
            farmLocation,
            city,
            state,
            pincode,
            crops,
            farmingMethod,
            farmSize: parsedFarmSize,
            description
        });

        res.status(201).json({
            success: true,
            message: "Farmer profile created",
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyFarmerProfile = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({
            user: req.user._id
        }).populate(
            "user",
            "fullname email contact profileImage"
        );

        res.json({
            success: true,
            profile: profile || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateFarmerProfile = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOneAndUpdate(
            {
                user: req.user._id
            },
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });
        }

        res.json({
            success: true,
            message: "Profile updated",
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteFarmerProfile = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({
            user: req.user._id
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });
        }

        await Product.deleteMany({
            farmer: req.user._id
        });
        await profile.deleteOne();

        res.json({
            success: true,
            message: "Farmer profile and products deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFarmers = async (req, res) => {
    try {
        const profiles = await FarmerProfile.find({
            verificationStatus: "approved"
        })
            .populate(
                "user",
                "fullname email contact profileImage"
            )
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            farmers: profiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFarmerById = async (req, res) => {
    try {
        const profile = await FarmerProfile.findOne({
            user: req.params.id,
            verificationStatus: "approved"
        }).populate(
            "user",
            "fullname email contact profileImage"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found"
            });
        }

        const products = await Product.find({
            farmer: profile.user._id,
            isAvailable: true,
            quantity: { $gt: 0 }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            farmer: {
                ...profile.toObject(),
                products
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};