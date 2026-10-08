import dotenv from "dotenv";
import Category from "./src/models/Category.js";
import { createServer } from "node:http";

dotenv.config();

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/db.js");
const { attachChatSocket } = await import("./src/realtime/chat.socket.js");

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
attachChatSocket(httpServer);

const startServer = async () => {
    try {
        // Connect MongoDB
        await connectDB();

        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            await Category.insertMany([
                { name: "Fresh Vegetables" },
                { name: "Fruits" },
                { name: "Dairy Products" },
                { name: "Organic Products" },
                { name: "Grains & Pulses" }
            ]);
            console.log("Default product categories created");
        }

        // Start Express server
        httpServer.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);

        process.exit(1);
    }
};

startServer();