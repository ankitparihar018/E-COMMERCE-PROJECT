import express from "express";
import {
    getConversationMessages,
    getConversations,
    startConversation
} from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { consumerOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getConversations);
router.get("/:id/messages", getConversationMessages);
router.post(
    "/",
    consumerOnly,
    startConversation
);

export default router;
