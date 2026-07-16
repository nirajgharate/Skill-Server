import express from "express";
import { handleAgentChat, handleResetSession, handleSyncIndex } from "../controllers/aiAgent.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Chat with the AI booking concierge
router.post("/chat", verifyToken, handleAgentChat);

// Reset the user's agent conversational state session
router.post("/reset", verifyToken, handleResetSession);

// Sync workers database to vector database
router.get("/sync", verifyToken, handleSyncIndex);

export default router;
