import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["electrician", "plumber", "ac-repair", "carpenter", "painter", "cleaner"] 
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  rating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
export default Service;