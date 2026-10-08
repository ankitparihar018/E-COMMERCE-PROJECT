import express from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cart.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import { consumerOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(consumerOnly);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:productId", updateCartItem);

router.delete("/:productId", removeFromCart);

router.delete("/", clearCart);

export default router;