import Worker from "../models/Worker.js";
import Booking from "../models/booking.model.js";
import { getCachedValue, setCachedValue, deleteCacheByPattern } from "../config/redis.js";
import { uploadBase64ToCloudinary } from "../services/cloudinary.service.js";

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
    const workersWithCounts = await attachWorkerCounts(workers);
    const response = workersWithCounts;
    await setCachedValue(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error("Worker fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

const attachWorkerCounts = async (workers) => {
  if (!Array.isArray(workers) || workers.length === 0) {
    return workers;
  }

  const workerIds = workers.map((worker) =>
    worker._id ? worker._id : worker?._id,
  );

  const countResults = await Booking.aggregate([
    { $match: { workerId: { $in: workerIds } } },
    {
      $group: {
        _id: "$workerId",
        totalJobs: { $sum: 1 },
        completedJobs: {
          $sum: {
            $cond: [
              {
                $in: [
                  { $toLower: "$status" },
                  ["completed", "paid", "confirmed"],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const countMap = countResults.reduce((acc, item) => {
    acc[item._id.toString()] = item;
    return acc;
  }, {});

  return workers.map((worker) => {
    const doc = worker.toObject ? worker.toObject() : worker;
    const counts = countMap[doc._id.toString()] || {
      totalJobs: 0,
      completedJobs: 0,
    };
    return {
      ...doc,
      totalJobs: Math.max(doc.totalJobs || 0, counts.totalJobs || 0),
      completedJobs: Math.max(doc.completedJobs || 0, counts.completedJobs || 0),
    };
  });
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

    const workerId = req.params.id || req.user.id;
    let worker = await Worker.findById(workerId);
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
    if (profilePhoto) {
      if (typeof profilePhoto === "string" && profilePhoto.startsWith("data:")) {
        const uploadResult = await uploadBase64ToCloudinary(profilePhoto, "skill-server/worker-profiles");
        worker.profilePhoto = uploadResult.url;
      } else {
        worker.profilePhoto = profilePhoto;
      }
    }
    if (certificatePhoto) {
      if (typeof certificatePhoto === "string" && certificatePhoto.startsWith("data:")) {
        const uploadResult = await uploadBase64ToCloudinary(certificatePhoto, "skill-server/worker-certificates");
        worker.certificatePhoto = uploadResult.url;
      } else {
        worker.certificatePhoto = certificatePhoto;
      }
    }
    if (hourlyRate !== undefined) worker.hourlyRate = hourlyRate;
    if (skills) worker.skills = skills;
    if (aadharCard) {
      if (typeof aadharCard === "string" && aadharCard.startsWith("data:")) {
        const uploadResult = await uploadBase64ToCloudinary(
          aadharCard,
          "skill-server/worker-aadhar",
        );
        worker.aadharCard = uploadResult.url;
      } else {
        worker.aadharCard = aadharCard;
      }
    }
    if (panCard) worker.panCard = panCard;
    if (degreeCertificate) {
      if (typeof degreeCertificate === "string" && degreeCertificate.startsWith("data:")) {
        const uploadResult = await uploadBase64ToCloudinary(
          degreeCertificate,
          "skill-server/worker-degrees",
        );
        worker.degreeCertificate = uploadResult.url;
      } else {
        worker.degreeCertificate = degreeCertificate;
      }
    }
    if (gender) worker.gender = gender;
    if (coreExpertise) worker.coreExpertise = coreExpertise;
    if (portfolio !== undefined) {
      const normalizedPortfolio = Array.isArray(portfolio) ? portfolio : [portfolio];
      const processedPortfolio = await Promise.all(
        normalizedPortfolio.map(async (item) => {
          if (!item) return item;

          if (typeof item === "string") {
            return {
              url: item,
              mediaType: "photo",
              uploadedAt: new Date(),
            };
          }

          const mediaItem = {
            ...item,
            mediaType: item.mediaType || "photo",
            uploadedAt: item.uploadedAt ? new Date(item.uploadedAt) : new Date(),
          };

          if (typeof item.url === "string" && item.url.startsWith("data:")) {
            const uploadResult = await uploadBase64ToCloudinary(
              item.url,
              "skill-server/worker-portfolio",
            );
            return {
              ...mediaItem,
              url: uploadResult.url,
            };
          }

          return mediaItem;
        }),
      );
      worker.portfolio = processedPortfolio;
    }

    // Calculate and update profile completion
    worker.profileCompletionPercentage = calculateProfileCompletion(worker);

    await worker.save();
    await deleteCacheByPattern("workers:*");
    await deleteCacheByPattern(`worker:${workerId}`);
    await deleteCacheByPattern(`worker_profile:${workerId}`);

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
