import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isUser, isWorker } from "../middleware/role.middleware.js";
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  getUserPayments,
  getWorkerPayments,
  handlePaymentFailure,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", verifyToken, isUser, createPaymentOrder);
router.post("/verify", verifyToken, verifyPayment);
router.post("/failure", verifyToken, handlePaymentFailure);
router.get("/:paymentId", verifyToken, getPaymentDetails);
router.get("/user/payments", verifyToken, isUser, getUserPayments);
router.get("/worker/payments", verifyToken, isWorker, getWorkerPayments);

export default router;
