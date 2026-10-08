import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
    try {
        const {
            productId,
            rating,
            comment
        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const existingReview = await Review.findOne({
            consumer: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            consumer: req.user._id,
            product: productId,
            farmer: product.farmer,
            rating,
            comment
        });

        const populatedReview = await Review.findById(
            review._id
        ).populate(
            "consumer",
            "fullname profileImage"
        );

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: populatedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.id
        })
            .populate(
                "consumer",
                "fullname profileImage"
            )
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFarmerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            farmer: req.params.id
        })
            .populate(
                "consumer",
                "fullname profileImage"
            )
            .populate("product", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};