import { processAgentMessage, resetSession, syncWorkerIndex } from "../services/aiAgent.service.js";

/**
 * Controller to handle AI chatbot chat requests.
 */
export async function handleAgentChat(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required." });
    }

    const result = await processAgentMessage(userId, message);
    return res.status(200).json({
      success: true,
      reply: result.reply,
      step: result.step,
      booking: result.booking,
    });
  } catch (error) {
    console.error("AI Agent chat error:", error);
    return res.status(500).json({ success: false, message: "Internal server error in AI Agent." });
  }
}

/**
 * Controller to reset conversation session.
 */
export async function handleResetSession(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required." });
    }

    resetSession(userId);
    return res.status(200).json({ success: true, message: "Conversation session reset." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to trigger RAG indexing sync.
 */
export async function handleSyncIndex(req, res) {
  try {
    const count = await syncWorkerIndex();
    return res.status(200).json({ success: true, message: `Synced ${count} workers to RAG database.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
