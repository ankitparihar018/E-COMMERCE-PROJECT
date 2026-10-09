
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import farmerRoutes from "./routes/farmer.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import supportRoutes from "./routes/support.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ================= PATH SETUP =================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE =================

app.use(
    cors({
        origin: (process.env.CLIENT_URL || "http://localhost:5173").trim(),
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());

app.use(morgan("dev"));

// ================= STATIC UPLOADS =================

// backend/uploads folder ko publicly accessible banata hai
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Agri Marketplace API is running"
    });
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/farmers", farmerRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/chats", chatRoutes);

// ================= 404 ROUTE =================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// ================= ERROR HANDLER =================

app.use(errorMiddleware);

export default app;