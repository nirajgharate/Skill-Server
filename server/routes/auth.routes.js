import express from "express";
import {
  signupUser,
  signupWorker,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup-user", signupUser);
router.post("/signup-worker", signupWorker);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, updateProfile);

export default router;