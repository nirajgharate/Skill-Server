import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import { uploadBase64ToCloudinary } from "../services/cloudinary.service.js";

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Helper to calculate profile completion
const calculateProfileCompletion = (worker) => {
  const fields = [
    "name",
    "email",
    "phone",
    "profession",
    "experienceYears",
    "serviceArea",
    "bio",
    "profilePhoto",
    "certificatePhoto",
    "hourlyRate",
  ];

  let filledFields = 0;
  fields.forEach((field) => {
    if (worker[field] && worker[field] !== "" && worker[field] !== 0) {
      filledFields++;
    }
  });

  return Math.round((filledFields / fields.length) * 100);
};

// @desc    Register a new Customer
// @route   POST /api/auth/signup-user
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    const workerExists = await Worker.findOne({ email });
    if (userExists || workerExists)
      return res.status(400).json({ message: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      location: req.body.location || "",
      profilePhoto: req.body.profilePhoto || "",
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      profilePhoto: user.profilePhoto,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new Worker
// @route   POST /api/auth/signup-worker
export const signupWorker = async (req, res) => {
  try {
    const { name, email, password, phone, profession, experienceYears, serviceArea, bio, profilePhoto, certificatePhoto, hourlyRate, skills, gender } = req.body;

    const workerExists = await Worker.findOne({ email });
    const userExists = await User.findOne({ email });
    if (workerExists || userExists)
      return res.status(400).json({ message: "Email already in use" });

    const normalizedGender = ["male", "female", "other"].includes(gender) ? gender : undefined;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const workerData = {
      name,
      email,
      password: hashedPassword,
      phone,
      profession,
      experienceYears,
      serviceArea,
      bio: bio || "",
      profilePhoto: "",
      certificatePhoto: "",
      hourlyRate: hourlyRate || 0,
      skills: skills || [],
      role: "worker",
    };

    if (normalizedGender) {
      workerData.gender = normalizedGender;
    }

    const worker = await Worker.create(workerData);

    // Calculate profile completion
    worker.profileCompletionPercentage = calculateProfileCompletion(worker);
    await worker.save();

    // Emit Socket.io event for new worker registration
    if (req.io) {
      req.io.emit("worker_updated", {
        action: "new_worker_registered",
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

    res.status(201).json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      role: worker.role,
      profession: worker.profession,
      profilePhoto: worker.profilePhoto || "",
      profileCompletionPercentage: worker.profileCompletionPercentage,
      token: generateToken(worker._id, worker.role),
    });
  } catch (error) {
    console.error("signupWorker error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login for both User & Worker
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userAccount = await User.findOne({ email });
    const workerAccount = await Worker.findOne({ email });
    let account = null;
    let role = null;

    if (userAccount && (await bcrypt.compare(password, userAccount.password))) {
      account = userAccount;
      role = "user";
    } else if (workerAccount && (await bcrypt.compare(password, workerAccount.password))) {
      account = workerAccount;
      role = "worker";
    }

    if (account) {
      const response = {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
        phone: account.phone || "",
        location: account.location || "",
        profilePhoto: account.profilePhoto || "",
        token: generateToken(account._id, account.role),
      };

      // Include profile completion for workers
      if (role === "worker") {
        response.profileCompletionPercentage = account.profileCompletionPercentage;
        response.profession = account.profession;
      }

      res.json(response);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    let profile;

    if (req.user.role === "worker") {
      profile = await Worker.findById(req.user.id).select("-password");
    } else {
      profile = await User.findById(req.user.id).select("-password");
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, phone, location, profilePhoto } = req.body;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;

    if (profilePhoto !== undefined) {
      if (typeof profilePhoto === "string" && profilePhoto.startsWith("data:")) {
        const uploadResult = await uploadBase64ToCloudinary(profilePhoto, "skill-server/user-profiles");
        user.profilePhoto = uploadResult.url;
      } else {
        user.profilePhoto = profilePhoto;
      }
    }

    await user.save();

    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      profilePhoto: user.profilePhoto,
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
