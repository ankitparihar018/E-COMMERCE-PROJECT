import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            consumer: req.user._id
        }).populate({
            path: "items.product",
            populate: [
                {
                    path: "farmer",
                    select: "fullname"
                },
                {
                    path: "category",
                    select: "name"
                }
            ]
        });

        if (!cart) {
            cart = await Cart.create({
                consumer: req.user._id,
                items: []
            });
        } else {
            const availableItems = cart.items.filter(
                item => item.product
            );

            if (availableItems.length !== cart.items.length) {
                cart.items = availableItems;
                await cart.save();
            }
        }

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            !product.isAvailable ||
            product.quantity < quantity
        ) {
            return res.status(400).json({
                success: false,
                message: "Product quantity unavailable"
            });
        }

        let cart = await Cart.findOne({
            consumer: req.user._id
        });

        if (!cart) {
            cart = await Cart.create({
                consumer: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + Number(quantity);

            if (newQuantity > product.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        await cart.populate({
            path: "items.product"
        });

        res.json({
            success: true,
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({
            consumer: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item =>
                item.product.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        const product = await Product.findById(
            req.params.productId
        );

        if (!product || product.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity unavailable"
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.json({
            success: true,
            message: "Cart updated",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            consumer: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item =>
                item.product.toString() !==
                req.params.productId
        );

        await cart.save();

        res.json({
            success: true,
            message: "Product removed from cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            consumer: req.user._id
        });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            success: true,
            message: "Cart cleared"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};