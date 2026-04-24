import express from "express";
import { getAllWorkers, getWorkerById, updateWorkerProfile, getMyProfile } from "../controllers/worker.controller.js";

const router = express.Router();

router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorkerProfile);

export default router;
