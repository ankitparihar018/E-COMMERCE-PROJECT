import Product from "../models/Product.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Category from "../models/Category.js";


// =====================================================
// CREATE PRODUCT
// Farmer -> Add Product -> Local Image Upload -> MongoDB
// =====================================================

export const createProduct = async (req, res) => {
    try {

        const {
            name,
            category,
            description,
            price,
            costPrice,
            unit,
            quantity,
            harvestDate,
            farmingMethod,
            location
        } = req.body;


        // ---------------------------------------------
        // Check farmer profile
        // ---------------------------------------------

        const farmer = await FarmerProfile.findOne({
            user: req.user._id,
            verificationStatus: "approved"
        });

        if (!farmer) {
            return res.status(403).json({
                success: false,
                message: "Your farmer profile must be approved first"
            });
        }


        // ---------------------------------------------
        // Validate required fields
        // ---------------------------------------------

        if (
            !name ||
            !category ||
            !description ||
            !price ||
            !unit ||
            !quantity
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const parsedCostPrice = Number(costPrice);

        if (
            costPrice === "" ||
            costPrice == null ||
            !Number.isFinite(parsedCostPrice) ||
            parsedCostPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Cost per unit must be a non-negative number"
            });
        }

        const selectedCategory = await Category.findOne({
            name: category.trim()
        });

        if (!selectedCategory) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid product category"
            });
        }


        // ---------------------------------------------
        // IMAGE UPLOAD
        // Multer saves files inside:
        // backend/uploads/products/
        // ---------------------------------------------

        const uploadedImages = [];

        if (req.files && req.files.length > 0) {

            for (const file of req.files) {

                const imageUrl =
                    `/uploads/products/${file.filename}`;

                uploadedImages.push(imageUrl);
            }
        }


        // ---------------------------------------------
        // Image required
        // ---------------------------------------------

        if (uploadedImages.length === 0) {

            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }


        // ---------------------------------------------
        // CREATE PRODUCT
        // ---------------------------------------------

        const product = await Product.create({

            farmer: req.user._id,

            name: name.trim(),

            category,

            description: description.trim(),

            price: Number(price),

            costPrice: parsedCostPrice,

            unit,

            quantity: Number(quantity),

            images: uploadedImages,

            harvestDate: harvestDate || null,

            farmingMethod:
                farmingMethod || "conventional",

            location:
                location?.trim() ||
                farmer.farmLocation

        });


        // ---------------------------------------------
        // Populate response
        // ---------------------------------------------

        const populatedProduct =
            await Product.findById(product._id)
                .populate(
                    "farmer",
                    "fullname email profileImage"
                );


        return res.status(201).json({

            success: true,

            message: "Product created successfully",

            product: populatedProduct

        });

    } catch (error) {

        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async (req, res) => {

    try {

        const {
            search,
            category,
            farmer,
            farmingMethod,
            location
        } = req.query;


        const filter = {

            isAvailable: true,

            quantity: {
                $gt: 0
            }

        };


        // ---------------------------------------------
        // Category filter
        // ---------------------------------------------

        if (category) {

            filter.category = category;

        }


        // ---------------------------------------------
        // Farmer filter
        // ---------------------------------------------

        if (farmer) {

            filter.farmer = farmer;

        }


        // ---------------------------------------------
        // Farming method filter
        // ---------------------------------------------

        if (farmingMethod) {

            filter.farmingMethod =
                farmingMethod;

        }


        // ---------------------------------------------
        // Location filter
        // ---------------------------------------------

        if (location) {

            filter.location = {

                $regex: location,

                $options: "i"

            };

        }


        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        if (search && search.trim()) {

            filter.name = {

                $regex: search.trim(),

                $options: "i"

            };

        }


        // ---------------------------------------------
        // Get products
        // ---------------------------------------------

        const products = await Product.find(filter)
            .populate("farmer", "fullname profileImage")
            .sort({
                createdAt: -1
            });


        return res.json({

            success: true,

            count: products.length,

            products

        });

    } catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

export const getProductCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ name: 1 })
            .select("name");

        return res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("GET PRODUCT CATEGORIES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to load product categories"
        });
    }
};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(
            req.params.id
        )
            .populate(
                "farmer",
                "fullname email profileImage"
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }


        return res.json({

            success: true,

            product

        });

    } catch (error) {

        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// =====================================================
// GET MY PRODUCTS
// =====================================================

export const getMyProducts = async (req, res) => {

    try {

        const products = await Product.find({
            farmer: req.user._id
        })
            .select("+costPrice")
            .sort({
                createdAt: -1
            });


        return res.json({

            success: true,

            products

        });

    } catch (error) {

        console.error(
            "GET MY PRODUCTS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (req, res) => {

    try {

        const product =
            await Product.findOneAndUpdate(

                {
                    _id: req.params.id,

                    farmer: req.user._id
                },

                req.body,

                {
                    new: true,

                    runValidators: true
                }
            ).select("+costPrice");


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found or unauthorized"

            });

        }


        return res.json({

            success: true,

            message: "Product updated",

            product

        });

    } catch (error) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findOneAndDelete({

                _id: req.params.id,

                farmer: req.user._id

            });


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found or unauthorized"

            });

        }


        return res.json({

            success: true,

            message: "Product deleted"

        });

    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};