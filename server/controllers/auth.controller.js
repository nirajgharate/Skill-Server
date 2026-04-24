import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

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
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    const { name, email, password, phone, profession, experienceYears, serviceArea, bio, profilePhoto, certificatePhoto, hourlyRate, skills } = req.body;

    const workerExists = await Worker.findOne({ email });
    if (workerExists) return res.status(400).json({ message: "Worker already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const worker = await Worker.create({
      name,
      email,
      password: hashedPassword,
      phone,
      profession,
      experienceYears,
      serviceArea,
      bio: bio || "",
      profilePhoto: profilePhoto || "",
      certificatePhoto: certificatePhoto || "",
      hourlyRate: hourlyRate || 0,
      skills: skills || [],
      role: "worker",
    });

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
      profileCompletionPercentage: worker.profileCompletionPercentage,
      token: generateToken(worker._id, worker.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login for both User & Worker
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check User Collection
    let account = await User.findOne({ email });
    let role = "user";

    // 2. If not found, check Worker Collection
    if (!account) {
      account = await Worker.findOne({ email });
      role = "worker";
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      const response = {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
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