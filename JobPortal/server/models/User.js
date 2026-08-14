import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Employer", "Job Seeker"],
    default: "Job Seeker",
  },

  phone: {
    type: String,
  },

  profileImage: {
    type: String,
    default: "",
  },

  resume: {
    type: String,
    default: "",
  },
  address: {
  type: String,
  default: "",
 },

 bio: {
  type: String,
  default: "",
 },

 skills: {
  type: [String],
  default: [],
 },

 isBlocked: {
  type: Boolean,
  default: false,
 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);