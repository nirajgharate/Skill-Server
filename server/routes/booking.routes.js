import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isWorker, isUser } from "../middleware/role.middleware.js";
import { 
  createBooking, 
  createMockBooking,
  mockPayBooking,
  completeBooking,
  getUserBookings, 
  getBookingsForUser,
  updateBookingStatus, 
  getUserDashboardStats,
  getBookingDetails,
  acceptBooking,
  rejectBooking,
  markWorkDone,
  getWorkerBookings
} from "../controllers/booking.controller.js";

const router = express.Router();

// User routes
router.post("/", verifyToken, isUser, createBooking);
router.post("/create", verifyToken, isUser, createMockBooking);
router.post("/mock-pay/:bookingId", verifyToken, isUser, mockPayBooking);
router.post("/complete/:bookingId", verifyToken, isUser, completeBooking);
router.get("/user/me", verifyToken, isUser, getUserBookings);
router.get("/user/:userId", verifyToken, isUser, getBookingsForUser);
router.get("/user/dashboard", verifyToken, isUser, getUserDashboardStats);
router.get("/:bookingId/details", verifyToken, getBookingDetails);

// Worker routes
router.get("/worker/me", verifyToken, isWorker, getWorkerBookings);
router.patch("/:bookingId/accept", verifyToken, isWorker, acceptBooking);
router.patch("/:bookingId/reject", verifyToken, isWorker, rejectBooking);

// Shared routes
router.patch("/:bookingId/mark-done", verifyToken, markWorkDone);
router.patch("/:id/status", verifyToken, isWorker, updateBookingStatus);

export default router;