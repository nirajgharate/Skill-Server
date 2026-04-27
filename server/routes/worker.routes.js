import express from "express";
import { getAllWorkers, getWorkerById, updateWorkerProfile, getMyProfile } from "../controllers/worker.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorkerProfile);
router.patch("/profile", verifyToken, updateWorkerProfile);
router.get("/me/profile", verifyToken, getMyProfile);

export default router;
