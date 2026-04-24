import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isWorker } from "../middleware/role.middleware.js";
import { createService, getAllServices, getServiceById, getWorkerServices } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", verifyToken, isWorker, createService);
router.get("/worker/me", verifyToken, isWorker, getWorkerServices);

export default router;