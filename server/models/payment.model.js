import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    transactionId: { type: String }, // Unique transaction ID for reference
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    workerUpiId: { type: String }, // UPI ID where payment goes
    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed", "cancelled"],
      default: "created",
    },
    method: {
      type: String,
      enum: ["card", "upi", "wallet", "netbanking", "cash"],
      default: "upi",
    },
    description: { type: String },
    notes: { type: Object },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
