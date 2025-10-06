import mongoose from "mongoose";

const courierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // har bir user faqat bitta courier bo‘ladi
    },
    vehicleType: {
      type: String,
      enum: ["bike", "car", "scooter"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Courier", courierSchema);
