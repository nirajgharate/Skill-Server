import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  serviceName: { type: String, default: "Professional Service" },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "active", "completed", "accepted", "rejected", "in-progress", "cancelled", "confirmed"],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["upi", "card", "cash"], default: "upi" },
  date: { type: Date },
  address: { type: String },
  notes: { type: String },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: "" },
    userName: { type: String, default: "" },
    createdAt: { type: Date },
  },
  reviewedAt: { type: Date },
  paidAt: { type: Date },
  activatedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;