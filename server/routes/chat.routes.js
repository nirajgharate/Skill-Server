import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getChatThread, sendChatMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:bookingId", verifyToken, getChatThread);
router.post("/:bookingId", verifyToken, sendChatMessage);

export default router;
