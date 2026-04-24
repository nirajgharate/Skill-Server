import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    role: {
      type: String,
      default: "worker",
    },
    profession: {
      type: String,
      required: [true, "Please specify a profession (e.g., Electrician)"],
      enum: ["electrician", "plumber", "carpenter", "cleaner", "painter"],
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      required: [true, "Please add years of experience"],
    },
    serviceArea: {
      type: String,
      required: [true, "Please define a service radius/area"],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    totalJobs: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    certificatePhoto: {
      type: String,
      default: "",
    },
    aadharCard: {
      type: String,
      default: "",
    },
    panCard: {
      type: String,
      default: "",
    },
    degreeCertificate: {
      type: String,
      default: "",
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "",
    },
    coreExpertise: {
      type: [String],
      default: [],
    },
    portfolio: [
      {
        type: String,
        url: String,
        mediaType: {
          type: String,
          enum: ["photo", "video"],
          default: "photo",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    upiId: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return !v || /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(v);
        },
        message: "Please provide a valid UPI ID (e.g., name@upi)",
      },
    },
    bankAccount: {
      accountHolder: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    pendingEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;