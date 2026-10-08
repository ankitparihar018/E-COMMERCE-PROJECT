import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            deliverySlot
        } = req.body;

        const cart = await Cart.findOne({
            consumer: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            if (!item.product) {
                return res.status(404).json({
                    success: false,
                    message: "A product in your cart no longer exists. Refresh your cart and try again."
                });
            }

            const product = await Product.findById(
                item.product._id
            ).select("+costPrice");

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product no longer exists"
                });
            }

            if (
                !product.isAvailable ||
                product.quantity < item.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is out of stock`
                });
            }

            const itemTotal =
                product.price * item.quantity;

            totalAmount += itemTotal;

            const orderItem = {
                product: product._id,
                farmer: product.farmer,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                unit: product.unit
            };

            if (Number.isFinite(product.costPrice)) {
                orderItem.costPrice = product.costPrice;
            }

            orderItems.push(orderItem);
        }

        const order = await Order.create({
            consumer: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            deliverySlot
        });

        // Reduce inventory
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        quantity: -item.quantity
                    }
                }
            );
        }

        cart.items = [];
        await cart.save();

        const populatedOrder = await Order.findById(order._id)
            .populate("consumer", "fullname email contact")
            .populate("items.product", "name images")
            .populate("items.farmer", "fullname");

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFarmerProfitSummary = async (req, res) => {
    try {
        const orders = await Order.find({
            "items.farmer": req.user._id,
            orderStatus: "delivered"
        }).select(
            "items.farmer items.quantity items.price +items.costPrice"
        );

        const summary = {
            deliveredRevenue: 0,
            trackedRevenue: 0,
            estimatedProfit: 0,
            deliveredLineItems: 0,
            trackedLineItems: 0,
            missingCostLineItems: 0
        };

        for (const order of orders) {
            for (const item of order.items) {
                if (item.farmer.toString() !== req.user._id.toString()) {
                    continue;
                }

                const revenue = item.price * item.quantity;
                summary.deliveredRevenue += revenue;
                summary.deliveredLineItems += 1;

                if (!Number.isFinite(item.costPrice)) {
                    summary.missingCostLineItems += 1;
                    continue;
                }

                summary.trackedRevenue += revenue;
                summary.estimatedProfit +=
                    (item.price - item.costPrice) * item.quantity;
                summary.trackedLineItems += 1;
            }
        }

        summary.profitMargin = summary.trackedRevenue > 0
            ? (summary.estimatedProfit / summary.trackedRevenue) * 100
            : null;

        return res.json({
            success: true,
            summary
        });
    } catch (error) {
        console.error("GET FARMER PROFIT SUMMARY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            consumer: req.user._id
        })
            .populate("items.product", "name images")
            .populate("items.farmer", "fullname")
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

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            consumer: req.user._id
        })
            .populate("items.product")
            .populate("items.farmer", "fullname");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            "items.farmer": req.user._id
        })
            .populate("consumer", "fullname email contact")
            .populate("items.product", "name images")
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

export const updateOrderStatus = async (req, res) => {
    try {
        const {
            orderStatus
        } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const isFarmerOrder = order.items.some(
            item =>
                item.farmer.toString() ===
                req.user._id.toString()
        );

        const isAdmin = req.user.role === "admin";

        if (!isFarmerOrder && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You cannot update this order"
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};