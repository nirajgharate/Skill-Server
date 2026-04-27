import ChatThread from "../models/chat.model.js";
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
      messages: [],
      lastUpdatedAt: new Date(),
    });
  }

  return thread;
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

  const update = {
    $push: {
      messages: {
        senderId,
        senderRole,
        senderName,
        content: content.trim(),
        createdAt: new Date(),
      },
    },
    $set: {
      lastMessage: content.trim(),
      lastUpdatedAt: new Date(),
    },
    $setOnInsert: {
      bookingId,
      userId: booking.userId._id,
      workerId: booking.workerId._id,
    },
  };

  const thread = await ChatThread.findOneAndUpdate({ bookingId }, update, {
    new: true,
    upsert: true,
  });

  const message = thread.messages[thread.messages.length - 1];

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
