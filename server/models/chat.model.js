import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const chatThreadSchema = new mongoose.Schema(
  {
    bookingId: {
      type: ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerId: {
      type: ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    lastMessage: {
      type: String,
      trim: true,
      default: "",
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const chatMessageSchema = new mongoose.Schema(
  {
    bookingId: {
      type: ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    threadId: {
      type: ObjectId,
      ref: "ChatThread",
      required: true,
      index: true,
    },
    senderId: {
      type: ObjectId,
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "worker", "admin"],
      required: true,
      default: "user",
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  },
);

chatMessageSchema.index({ bookingId: 1, createdAt: 1 });
chatMessageSchema.index({ threadId: 1, createdAt: 1 });

const ChatThread = mongoose.model("ChatThread", chatThreadSchema);
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export { ChatThread, ChatMessage };
export default ChatThread;
