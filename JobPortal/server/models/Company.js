import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
