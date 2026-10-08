import express from "express";

import {
    createProduct,
    getProducts,
    getProductCategories,
    getProductById,
    getMyProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { farmerOnly } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Get all products
router.get("/", getProducts);

// Get product categories for the catalog and farmer product form
router.get("/categories", getProductCategories);

// Get single product
router.get("/:id", getProductById);


/*
|--------------------------------------------------------------------------
| FARMER ROUTES
|--------------------------------------------------------------------------
*/

// Get logged-in farmer's products
router.get(
    "/my/products",
    authMiddleware,
    farmerOnly,
    getMyProducts
);

// Create product with images
router.post(
    "/",
    authMiddleware,
    farmerOnly,
    upload.array("images", 5),
    createProduct
);

// Update product
router.put(
    "/:id",
    authMiddleware,
    farmerOnly,
    updateProduct
);

// Delete product
router.delete(
    "/:id",
    authMiddleware,
    farmerOnly,
    deleteProduct
);

export default router;