import Service from "../models/service.model.js";
import { getCachedValue, setCachedValue, deleteCacheByPattern } from "../config/redis.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, workerId: req.user.id });
    await deleteCacheByPattern("services:*");
    await deleteCacheByPattern("service:*");
    await deleteCacheByPattern(`worker_services:${req.user.id}`);
    res.status(201).json({ success: true, message: "Service created", data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { category, location } = req.query;
    const cacheKey = `services:${category || "all"}:${location || "all"}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    let query = {};
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');

    const services = await Service.find(query).populate("workerId", "name phone rating");
    const response = { success: true, data: services };
    await setCachedValue(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const cacheKey = `service:${req.params.id}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const service = await Service.findById(req.params.id).populate("workerId", "name phone email profession");
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const response = { success: true, data: service };
    await setCachedValue(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkerServices = async (req, res) => {
  try {
    const cacheKey = `worker_services:${req.user.id}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const services = await Service.find({ workerId: req.user.id });
    const response = { success: true, data: services };
    await setCachedValue(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};