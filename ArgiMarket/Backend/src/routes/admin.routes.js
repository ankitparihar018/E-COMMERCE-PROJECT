import express from "express";

import {
    getFarmers,
    approveFarmer,
    rejectFarmer,
    getProducts,
    deleteProduct,
    getOrders,
    createCategory,
    getCategories,
    deleteCategory,
    getAnalytics
} from "../controllers/admin.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

router.get("/farmers", getFarmers);

router.put(
    "/farmers/:id/approve",
    approveFarmer
);

router.put(
    "/farmers/:id/reject",
    rejectFarmer
);

router.get("/products", getProducts);

router.delete(
    "/products/:id",
    deleteProduct
);

router.get("/orders", getOrders);

router.post(
    "/categories",
    createCategory
);

router.get(
    "/categories",
    getCategories
);

router.delete(
    "/categories/:id",
    deleteCategory
);

router.get(
    "/analytics",
    getAnalytics
);

export default router;