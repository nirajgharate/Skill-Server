import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";
import Worker from "../models/Worker.js";

const VALID_SERVICE_CATEGORIES = ["electrician", "plumber", "ac-repair", "carpenter", "painter", "cleaner"];
const CATEGORY_ALIASES = {
  electrician: ["electrician", "electrical", "electrical service", "electrical repair"],
  plumber: ["plumber", "plumbing"],
  "ac-repair": ["ac", "ac repair", "ac-repair", "air conditioner", "air conditioning"],
  carpenter: ["carpenter", "carpentry"],
  painter: ["painter", "painting"],
  cleaner: ["cleaner", "cleaning", "maid"],
};

const normalizeCategory = (value) => {
  if (!value || typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (VALID_SERVICE_CATEGORIES.includes(normalized)) return normalized;
  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.includes(normalized)) return category;
  }
  return null;
};

const normalizePaymentMethod = (value) => {
  if (!value || typeof value !== "string") return "upi";
  const normalized = value.trim().toLowerCase();
  if (normalized === "cod") return "cash";
  if (["upi", "card", "cash"].includes(normalized)) return normalized;
  return "upi";
};

export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      date,
      address,
      notes,
      workerId,
      serviceName,
      price: requestedPrice,
      category: requestedCategory,
      paymentMethod: requestedPaymentMethod,
    } = req.body;

    const paymentMethod = normalizePaymentMethod(requestedPaymentMethod);
    const requestedCategoryValue = normalizeCategory(requestedCategory);

    
    if (!date || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: date and address are required"
      });
    }

    const isValidObjectId = (value) =>
      typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

    const normalizedWorkerId = isValidObjectId(workerId) ? workerId : null;
    const normalizedServiceId = isValidObjectId(serviceId) ? serviceId : null;

    if (!normalizedServiceId && !normalizedWorkerId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: serviceId or workerId"
      });
    }

    let service = null;
    let resolvedWorkerId = normalizedWorkerId;
    let resolvedServiceId = normalizedServiceId;
    let price = requestedPrice || 499;

    if (normalizedServiceId) {
      service = await Service.findById(normalizedServiceId).populate("workerId", "_id name upiId");
      if (service) {
        resolvedWorkerId = service.workerId?._id || resolvedWorkerId;
        price = service.price || price;
        resolvedServiceId = service._id;
      }
    }

    if (!service && resolvedWorkerId) {
      service = await Service.findOne({ workerId: resolvedWorkerId }).populate("workerId", "_id name upiId");
      if (service) {
        price = service.price || price;
        resolvedServiceId = service._id;
        resolvedWorkerId = service.workerId?._id || resolvedWorkerId;
      }
    }

    if (!service && resolvedWorkerId) {
      const category = requestedCategoryValue || normalizeCategory(serviceName) || "electrician";
      const newService = await Service.create({
        title: serviceName || "Professional Service",
        description: notes?.problemDesc || notes?.description || "Service booked through platform",
        category,
        price,
        location: "Remote",
        workerId: resolvedWorkerId,
      });
      service = newService;
      resolvedServiceId = newService._id;
    }

    if (!resolvedWorkerId && service?.workerId) {
      resolvedWorkerId = service.workerId._id;
    }

    if (!resolvedWorkerId) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine worker for booking"
      });
    }

    if (!resolvedServiceId) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine a valid service for booking"
      });
    }

    // Get worker details
    let workerData = null;
    if (service?.workerId) {
      workerData = service.workerId;
    } else {
      workerData = await Worker.findById(resolvedWorkerId).select("_id name upiId");
    }

    if (!workerData) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    // Convert notes object to string if needed
    let notesString = notes;
    if (typeof notes === 'object' && notes !== null) {
      notesString = JSON.stringify(notes);
    }

    const booking = await Booking.create({
      userId: req.user.id,
      workerId: resolvedWorkerId,
      serviceId: resolvedServiceId,
      amount: price,
      price,
      paymentMethod,
      date,
      address,
      notes: notesString,
    });

    // Emit socket event to worker
    req.io.emit("booking_created", {
      bookingId: booking._id,
      userId: req.user.id,
      workerId: resolvedWorkerId,
      serviceName: service?.title || notes?.serviceName || "Professional Service",
      userName: req.user.name,
      price,
      date,
      address,
    });

    res.status(201).json({ success: true, message: "Booking request sent", data: booking });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a mock booking in "pending" state. This is the first step of the simulated payment flow.
export const createMockBooking = async (req, res) => {
  try {
    const { workerId, amount, serviceName, date, address, notes } = req.body;

    if (!workerId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: workerId and amount are required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      workerId,
      amount,
      serviceName: serviceName || "Professional Service",
      status: "pending",
      date: date ? new Date(date) : undefined,
      address,
      notes: typeof notes === "object" ? JSON.stringify(notes) : notes,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Mock booking creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("serviceId", "title")
      .populate("workerId", "name rating phone")
      .sort({ createdAt: -1 });

    const statusMap = {
      pending: "Pending",
      paid: "Paid",
      active: "Active",
      completed: "Completed",
      accepted: "Confirmed",
      "in-progress": "Active",
      cancelled: "Cancelled",
      rejected: "Cancelled",
    };

    const transformedBookings = bookings.map((booking) => {
      const dateObj = booking.date ? new Date(booking.date) : new Date(booking.createdAt);
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        _id: booking._id,
        service: booking.serviceName || booking.serviceId?.title || "Service",
        expert: booking.workerId?.name || "Worker",
        date: dateStr,
        time: timeStr,
        location: booking.address || "TBD",
        amount: booking.amount ?? booking.price,
        status: statusMap[booking.status] || booking.status,
        expertImage: `https://i.pravatar.cc/150?u=${encodeURIComponent(booking.workerId?.name || "worker")}`,
        rating: booking.workerId?.rating || 5.0,
        phone: booking.workerId?.phone || "",
      };
    });

    res.status(200).json({ success: true, data: transformedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.user || !req.user.id || req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const bookings = await Booking.find({ userId })
      .populate("workerId", "name rating phone")
      .sort({ createdAt: -1 });

    const statusMap = {
      pending: "Pending",
      paid: "Paid",
      active: "Active",
      completed: "Completed",
      accepted: "Confirmed",
      "in-progress": "Active",
      cancelled: "Cancelled",
      rejected: "Cancelled",
    };

    const transformedBookings = bookings.map((booking) => {
      const dateObj = booking.date ? new Date(booking.date) : new Date(booking.createdAt);
      const dateStr = dateObj.toISOString().split("T")[0];
      const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        _id: booking._id,
        service: booking.serviceName || "Service",
        expert: booking.workerId?.name || "Worker",
        date: dateStr,
        time: timeStr,
        location: booking.address || "TBD",
        amount: booking.amount ?? booking.price,
        status: statusMap[booking.status] || booking.status,
        expertImage: `https://i.pravatar.cc/150?u=${encodeURIComponent(booking.workerId?.name || "worker")}`,
        rating: booking.workerId?.rating || 5.0,
        phone: booking.workerId?.phone || "",
      };
    });

    res.status(200).json({ success: true, data: transformedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Simulate payment for a booking. The booking goes from pending → paid → active.
export const mockPayBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!req.user || !req.user.id || booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ success: false, message: "Booking is not pending" });
    }

    booking.status = "paid";
    booking.paidAt = new Date();
    await booking.save();

    booking.status = "active";
    booking.activatedAt = new Date();
    await booking.save();

    res.status(200).json({ success: true, message: "Booking successful", data: booking });
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark an active booking as completed. This simulates the user confirming work is done.
export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!req.user || !req.user.id || booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status !== "active") {
      return res.status(400).json({ success: false, message: "Only active bookings can be completed" });
    }

    booking.status = "completed";
    booking.completedAt = new Date();
    await booking.save();

    res.status(200).json({ success: true, message: "Booking marked completed", data: booking });
  } catch (error) {
    console.error("Complete booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, workerId: req.user.id },
      { status },
      { new: true }
    ).populate("userId", "name").populate("serviceId", "name");

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found or unauthorized" });

    // Emit socket event to user
    req.io.emit("booking_status_changed", {
      bookingId: booking._id,
      userId: booking.userId._id,
      workerId: req.user.id,
      status,
      serviceName: booking.serviceId.name,
      userName: booking.userId.name,
    });

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user bookings
    const bookings = await Booking.find({ userId })
      .populate("serviceId")
      .populate("workerId", "name rating");

    // Calculate stats
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === "completed").length;
    const totalSpent = bookings
      .filter(b => b.status === "completed")
      .reduce((sum, b) => sum + b.price, 0);

    // Calculate average rating from completed bookings
    const ratedBookings = bookings.filter(b => b.status === "completed" && b.workerId?.rating);
    const averageRating = ratedBookings.length > 0
      ? ratedBookings.reduce((sum, b) => sum + b.workerId.rating, 0) / ratedBookings.length
      : 0;

    // Get active bookings (pending, confirmed, in-progress)
    const activeBookings = bookings.filter(b =>
      ["pending", "confirmed", "accepted", "in-progress"].includes(b.status)
    );

    // Get recent bookings (last 5)
    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        completedBookings,
        totalSpent,
        averageRating: Math.round(averageRating * 10) / 10,
        activeBookings,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking details with all info
export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("userId", "_id name phone email")
      .populate("workerId", "_id name phone upiId rating")
      .populate("serviceId", "_id name description price");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Worker: Accept booking
export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("userId", "name")
      .populate("workerId", "name")
      .populate("serviceId", "name");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Verify worker authorization
    if (booking.workerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ success: false, message: `Cannot accept booking with status: ${booking.status}` });
    }

    // Update booking
    booking.status = "accepted";
    booking.workerAcceptedAt = new Date();
    await booking.save();

    // Emit socket event to user
    req.io.emit("booking_accepted", {
      bookingId: booking._id,
      userId: booking.userId._id,
      workerName: booking.workerId.name,
      serviceName: booking.serviceId.name,
    });

    res.status(200).json({ success: true, message: "Booking accepted successfully", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Worker: Reject booking
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("userId", "name")
      .populate("workerId", "name");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Verify worker authorization
    if (booking.workerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ success: false, message: `Cannot reject booking with status: ${booking.status}` });
    }

    // Update booking
    booking.status = "rejected";
    booking.notes = `Rejected: ${reason || "No reason"}`;
    await booking.save();

    // Emit socket event to user
    req.io.emit("booking_rejected", {
      bookingId: booking._id,
      userId: booking.userId._id,
      reason,
    });

    res.status(200).json({ success: true, message: "Booking rejected", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark work as done
export const markWorkDone = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { role } = req.body; // "user" or "worker"

    const booking = await Booking.findById(bookingId)
      .populate("userId", "_id name")
      .populate("workerId", "_id name");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Verify authorization
    if (role === "user" && booking.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized: User cannot mark other's work" });
    }

    if (role === "worker" && booking.workerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized: Worker cannot mark other's work" });
    }

    if (booking.status !== "accepted" && booking.status !== "in-progress") {
      return res.status(400).json({ success: false, message: `Cannot mark work done. Booking status is: ${booking.status}` });
    }

    // Mark work done
    if (role === "user") {
      booking.userMarkedDoneAt = new Date();
    } else {
      booking.workerMarkedDoneAt = new Date();
    }

    // Set status to in-progress if not already
    if (booking.status === "accepted") {
      booking.status = "in-progress";
    }

    // Check if both have marked as done
    if (booking.userMarkedDoneAt && booking.workerMarkedDoneAt) {
      booking.status = "completed";
      booking.completedAt = new Date();
    }

    await booking.save();

    // Emit socket event
    const otherUserId = role === "user" ? booking.workerId._id : booking.userId._id;
    req.io.emit("work_progress", {
      bookingId: booking._id,
      userId: otherUserId,
      role,
      status: booking.status,
    });

    res.status(200).json({
      success: true,
      message: "Work marked as done",
      data: booking,
      isCompleted: booking.status === "completed"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get worker bookings
export const getWorkerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.user.id })
      .populate("userId", "_id name phone email")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};