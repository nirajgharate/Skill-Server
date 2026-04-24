import Worker from "../models/Worker.js";
import { getCachedValue, setCachedValue, deleteCacheByPattern } from "../config/redis.js";

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (worker) => {
  const requiredFields = [
    "name",
    "email",
    "phone",
    "profession",
    "experienceYears",
    "serviceArea",
    "bio",
    "profilePhoto",
    "hourlyRate",
  ];

  let filledFields = 0;
  requiredFields.forEach((field) => {
    if (worker[field] && worker[field] !== "" && worker[field] !== 0) {
      filledFields++;
    }
  });

  // Check for at least one ID document (Aadhar or PAN) - counts as 1
  if (worker.aadharCard || worker.panCard) {
    filledFields++;
  }

  // Total 10 required fields for 100% completion
  const totalFields = requiredFields.length + 1;
  return Math.round((filledFields / totalFields) * 100);
};

// @desc    Get all workers with profile completion filter
// @route   GET /api/workers
export const getAllWorkers = async (req, res) => {
  try {
    const { minCompletion = 0, profession, serviceArea } = req.query;

    let filter = {};

    // Filter by profile completion percentage - if minCompletion is provided
    if (minCompletion && parseInt(minCompletion) > 0) {
      filter.profileCompletionPercentage = { $gte: parseInt(minCompletion) };
    }

    // Filter by profession
    if (profession && profession !== "All") {
      filter.profession = profession.toLowerCase();
    }

    // Filter by service area
    if (serviceArea && serviceArea !== "All Areas") {
      filter.serviceArea = new RegExp(serviceArea, "i");
    }

    const cacheKey = `workers:${minCompletion}:${profession || "all"}:${serviceArea || "all"}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const workers = await Worker.find(filter).select("-password").sort({ createdAt: -1 });
    const response = workers;
    await setCachedValue(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error("Worker fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
export const getWorkerById = async (req, res) => {
  try {
    const cacheKey = `worker:${req.params.id}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const worker = await Worker.findById(req.params.id).select("-password");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const response = worker;
    await setCachedValue(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/:id
export const updateWorkerProfile = async (req, res) => {
  try {
    const { name, phone, profession, experienceYears, serviceArea, bio, profilePhoto, certificatePhoto, hourlyRate, skills, aadharCard, panCard, degreeCertificate, gender, coreExpertise, portfolio } = req.body;

    let worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Update allowed fields
    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (profession) worker.profession = profession;
    if (experienceYears !== undefined) worker.experienceYears = experienceYears;
    if (serviceArea) worker.serviceArea = serviceArea;
    if (bio) worker.bio = bio;
    if (profilePhoto) worker.profilePhoto = profilePhoto;
    if (certificatePhoto) worker.certificatePhoto = certificatePhoto;
    if (hourlyRate !== undefined) worker.hourlyRate = hourlyRate;
    if (skills) worker.skills = skills;
    if (aadharCard) worker.aadharCard = aadharCard;
    if (panCard) worker.panCard = panCard;
    if (degreeCertificate) worker.degreeCertificate = degreeCertificate;
    if (gender) worker.gender = gender;
    if (coreExpertise) worker.coreExpertise = coreExpertise;
    if (portfolio !== undefined) worker.portfolio = portfolio;

    // Calculate and update profile completion
    worker.profileCompletionPercentage = calculateProfileCompletion(worker);

    await worker.save();
    await deleteCacheByPattern("workers:*");
    await deleteCacheByPattern(`worker:${req.params.id}`);
    await deleteCacheByPattern(`worker_profile:${req.params.id}`);

    // Emit Socket.io event for profile update
    if (req.io) {
      req.io.emit("worker_updated", {
        action: "profile_updated",
        worker: {
          _id: worker._id,
          name: worker.name,
          email: worker.email,
          profession: worker.profession,
          serviceArea: worker.serviceArea,
          profileCompletionPercentage: worker.profileCompletionPercentage,
          profilePhoto: worker.profilePhoto,
          hourlyRate: worker.hourlyRate,
        },
      });
    }

    res.json({
      message: "Profile updated successfully",
      worker,
      profileCompletion: worker.profileCompletionPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current worker profile
// @route   GET /api/workers/me/profile
export const getMyProfile = async (req, res) => {
  try {
    const cacheKey = `worker_profile:${req.user.id}`;
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const worker = await Worker.findById(req.user.id).select("-password");
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    const response = worker;
    await setCachedValue(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
