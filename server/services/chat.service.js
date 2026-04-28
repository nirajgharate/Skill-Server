import { ChatThread, ChatMessage } from "../models/chat.model.js";
import Booking from "../models/booking.model.js";

export const fetchChatThread = async (bookingId, requesterId) => {
  const booking = await Booking.findById(bookingId)
    .populate("userId", "_id name")
    .populate("workerId", "_id name");

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  const requesterIdString = String(requesterId);
  const hasAccess =
    requesterIdString === String(booking.userId._id) ||
    requesterIdString === String(booking.workerId._id);

  if (!hasAccess) {
    const error = new Error("Unauthorized to view this chat thread");
    error.status = 403;
    throw error;
  }

  let thread = await ChatThread.findOne({ bookingId });

  if (!thread) {
    thread = await ChatThread.create({
      bookingId,
      userId: booking.userId._id,
      workerId: booking.workerId._id,
      lastUpdatedAt: new Date(),
    });
  }

  const messages = await ChatMessage.find({ bookingId })
    .sort({ createdAt: 1 })
    .lean();

  return {
    ...thread.toObject(),
    messages,
  };
};

export const appendChatMessage = async ({ bookingId, senderId, senderRole, senderName, content }) => {
  if (!content || !content.trim()) {
    const error = new Error("Message content is required");
    error.status = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId)
    .populate("userId", "_id name")
    .populate("workerId", "_id name");

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  const senderIdString = String(senderId);
  const isUserSender = senderIdString === String(booking.userId._id);
  const isWorkerSender = senderIdString === String(booking.workerId._id);

  if (!isUserSender && !isWorkerSender) {
    const error = new Error("Unauthorized to send messages for this booking");
    error.status = 403;
    throw error;
  }

  const recipientId = isUserSender ? booking.workerId._id : booking.userId._id;
  const bookingSenderName = isUserSender
    ? booking.userId?.name
    : booking.workerId?.name;
  const finalSenderName = senderName?.trim() || bookingSenderName || "Unknown";

  let thread = await ChatThread.findOne({ bookingId });
  if (!thread) {
    thread = await ChatThread.create({
      bookingId,
      userId: booking.userId._id,
      workerId: booking.workerId._id,
      lastUpdatedAt: new Date(),
    });
  }

  const message = await ChatMessage.create({
    bookingId,
    threadId: thread._id,
    senderId,
    senderRole,
    senderName: finalSenderName,
    content: content.trim(),
    createdAt: new Date(),
  });

  thread.lastMessage = content.trim();
  thread.lastUpdatedAt = new Date();
  await thread.save();

  return {
    thread,
    message,
    recipientId,
    booking,
  };
};

export default {
  fetchChatThread,
  appendChatMessage,
};
