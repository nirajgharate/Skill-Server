import { emitToUser, SOCKET_EVENTS } from "../utils/socketio.utils.js";
import chatService from "../services/chat.service.js";

export const getChatThread = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const thread = await chatService.fetchChatThread(bookingId, req.user.id);

    res.status(200).json({ success: true, data: thread });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content } = req.body;

    const { message, recipientId } = await chatService.appendChatMessage({
      bookingId,
      senderId: req.user.id,
      senderRole: req.user.role || "user",
      senderName: req.user.name || req.user.email || "Unknown",
      content,
    });

    if (recipientId && req.io) {
      emitToUser(req.io, recipientId, SOCKET_EVENTS.MESSAGE_SENT, {
        senderId: req.user.id,
        senderRole: req.user.role || "user",
        senderName: req.user.name || req.user.email || "Unknown",
        message: content.trim(),
        bookingId,
        createdAt: message.createdAt,
      });
    }

    res.status(201).json({ success: true, data: { message, bookingId } });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export default {
  getChatThread,
  sendChatMessage,
};
