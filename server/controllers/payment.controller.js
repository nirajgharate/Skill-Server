import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Worker from "../models/Worker.js";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error(
    "Missing Razorpay environment variables: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency = "INR", notes, method = "upi" } = req.body;
    const paymentMethod = String(method || "upi").trim().toLowerCase();

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user.id }).populate("serviceId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });
    }

    const existingPayment = await Payment.findOne({ bookingId, status: "paid" });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "Payment already completed for this booking" });
    }

    const amountValue = Number(amount) || booking.amount || booking.price || 0;
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderNotes = {
      bookingId: bookingId.toString(),
      userId: req.user.id,
      workerId: booking.workerId.toString(),
      serviceName: booking.serviceId?.name || booking.serviceId,
      method: paymentMethod,
      ...notes,
    };

    if (paymentMethod === "cash") {
      const payment = await Payment.create({
        bookingId,
        userId: req.user.id,
        workerId: booking.workerId,
        razorpayOrderId: null,
        transactionId,
        amount: amountValue * 100,
        currency,
        workerUpiId: null,
        status: "cod_pending",
        description: `Cash on Delivery booking for ${booking.serviceId?.name || "service"}`,
        notes: orderNotes,
        method: "cash",
      });

      await Booking.findByIdAndUpdate(bookingId, { status: "pending" });

      return res.status(200).json({
        success: true,
        data: {
          bookingId,
          paymentId: payment._id,
          status: payment.status,
          transactionId,
          amount: amountValue,
          currency,
          method: payment.method,
          message: "Cash on Delivery selected. Your booking has been created.",
        },
      });
    }

    const worker = await Worker.findById(booking.workerId);
    if (!worker) {
      return res.status(400).json({ success: false, message: "Worker payment details not configured" });
    }

    if (paymentMethod === "upi" && !worker.upiId) {
      return res.status(400).json({
        success: false,
        message: "Worker UPI details are not configured, please choose another payment method.",
        code: "WORKER_NO_UPI",
      });
    }

    const orderOptions = {
      amount: amountValue * 100,
      currency,
      receipt: `booking_${bookingId}_${Date.now()}`,
      notes: orderNotes,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
    } catch (error) {
      console.error("Razorpay order create failed, saving failed payment record:", error);
      const payment = await Payment.create({
        bookingId,
        userId: req.user.id,
        workerId: booking.workerId,
        razorpayOrderId: null,
        transactionId,
        amount: amountValue * 100,
        currency,
        workerUpiId: worker.upiId || null,
        status: "failed",
        description: `Payment order creation failed for ${booking.serviceId?.name || "service"}`,
        notes: orderNotes,
        method: paymentMethod,
      });

      return res.status(200).json({
        success: true,
        data: {
          bookingId,
          paymentId: payment._id,
          transactionId,
          amount: amountValue,
          currency,
          method: payment.method,
          status: payment.status,
          message: "Booking created, but payment order could not be started. You can complete payment from My Bookings.",
          error: error.message,
        },
      });
    }

    const payment = await Payment.create({
      bookingId,
      userId: req.user.id,
      workerId: booking.workerId,
      razorpayOrderId: razorpayOrder.id,
      transactionId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      workerUpiId: worker.upiId || null,
      status: "created",
      description: `Payment for ${booking.serviceId?.name || "service"} to ${worker.name}`,
      notes: orderNotes,
      method: paymentMethod,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: razorpayKeyId,
        paymentRecordId: payment._id,
        transactionId,
        workerUpiId: worker.upiId || null,
        workerName: worker.name,
        status: payment.status,
        method: payment.method,
      },
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({ success: false, message: "Failed to create payment order", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, method } = req.body;
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await Payment.findByIdAndUpdate(payment._id, {
        status: "failed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });
      await Booking.findByIdAndUpdate(payment.bookingId, { status: "pending" });
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const paymentStatus = razorpay_payment_id ? "paid" : "failed";
    await Payment.findByIdAndUpdate(payment._id, {
      status: paymentStatus,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
      method: method || payment.method,
    });

    // Update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      payment.bookingId,
      { status: paymentStatus === "paid" ? "confirmed" : "pending" },
      { new: true }
    ).populate("serviceId").populate("workerId", "name");

    // Emit socket event to both user and worker
    if (updatedBooking) {
      req.io.emit("booking_confirmed", {
        bookingId: updatedBooking._id,
        userId: payment.userId,
        workerId: payment.workerId,
        amount: payment.amount / 100,
        paymentId: razorpay_payment_id,
        status: updatedBooking.status,
        serviceName: updatedBooking.serviceId?.name || "Service",
      });

      req.io.emit("payment_completed", {
        bookingId: payment.bookingId,
        userId: payment.userId,
        workerId: payment.workerId,
        amount: payment.amount / 100,
        paymentId: razorpay_payment_id,
        status: updatedBooking.status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        transactionId: payment.transactionId,
        amount: payment.amount / 100,
        bookingId: payment.bookingId.toString(),
        status: paymentStatus,
        workerUpiId: payment.workerUpiId,
        workerName: updatedBooking?.workerId?.name || "Worker",
      }
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate("bookingId")
      .populate("userId", "name email")
      .populate("workerId", "name");
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    if (payment.userId._id.toString() !== req.user.id && payment.workerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to view this payment" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({ success: false, message: "Failed to get payment details", error: error.message });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).populate("bookingId").populate("workerId", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Get user payments error:", error);
    res.status(500).json({ success: false, message: "Failed to get payments", error: error.message });
  }
};

export const getWorkerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ workerId: req.user.id }).populate("bookingId").populate("userId", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Get worker payments error:", error);
    res.status(500).json({ success: false, message: "Failed to get payments", error: error.message });
  }
};

export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status: "failed", notes: { ...error } },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    await Booking.findByIdAndUpdate(payment.bookingId, { status: "pending" });

    res.status(200).json({ success: true, message: "Payment failure recorded", data: payment });
  } catch (error) {
    console.error("Payment failure handling error:", error);
    res.status(500).json({ success: false, message: "Failed to handle payment failure", error: error.message });
  }
};
