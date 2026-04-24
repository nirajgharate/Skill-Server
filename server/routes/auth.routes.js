import express from "express";
import { signupUser, signupWorker, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup-user", signupUser);
router.post("/signup-worker", signupWorker);
router.post("/login", login);

export default router;