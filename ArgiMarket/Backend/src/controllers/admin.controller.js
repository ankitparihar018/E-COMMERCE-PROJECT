import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";

export const getFarmers = async (req, res) => {
    try {
        const farmers = await FarmerProfile.find()
            .populate(
                "user",
                "fullname email contact isActive createdAt"
            )
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            farmers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const approveFarmer = async (req, res) => {
    try {
        const farmer = await FarmerProfile.findByIdAndUpdate(
            req.params.id,
            {
                verificationStatus: "approved",
                rejectionReason: ""
            },
            {
                returnDocument: "after"
            }
        );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });
        }

        await User.findByIdAndUpdate(
            farmer.user,
            {
                isVerified: true
            }
        );

        res.json({
            success: true,
            message: "Farmer approved",
            farmer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const rejectFarmer = async (req, res) => {
    try {
        const {
            reason
        } = req.body;

        const farmer = await FarmerProfile.findByIdAndUpdate(
            req.params.id,
            {
                verificationStatus: "rejected",
                rejectionReason: reason || "Not approved"
            },
            {
                returnDocument: "after"
            }
        );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found"
            });
        }

        res.json({
            success: true,
            message: "Farmer rejected",
            farmer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("farmer", "fullname email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product deleted by admin"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "consumer",
                "fullname email contact"
            )
            .populate(
                "items.farmer",
                "fullname email"
            )
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            image
        } = req.body;

        const category = await Category.create({
            name,
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "Category created",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ name: 1 });

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const [
            totalUsers,
            totalFarmers,
            totalConsumers,
            totalProducts,
            totalOrders,
            deliveredOrders
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({
                role: "farmer"
            }),
            User.countDocuments({
                role: "consumer"
            }),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({
                orderStatus: "delivered"
            })
        ]);

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: {
                        $ne: "cancelled"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue =
            revenueResult[0]?.totalRevenue || 0;

        res.json({
            success: true,
            analytics: {
                totalUsers,
                totalFarmers,
                totalConsumers,
                totalProducts,
                totalOrders,
                deliveredOrders,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};