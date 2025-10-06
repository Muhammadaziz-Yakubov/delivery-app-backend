import Courier from "../models/courier.model.js";

// Create courier profile
export const createCourier = async (req, res) => {
  const { vehicleType, phone } = req.body;

  const exists = await Courier.findOne({ user: req.user._id });
  if (exists) {
    return res.status(400).json({ message: "Courier profile already exists" });
  }

  const courier = await Courier.create({
    user: req.user._id,
    vehicleType,
    phone,
  });

  res.status(201).json(courier);
};

// Get all couriers (Admin only)
export const getCouriers = async (req, res) => {
  const couriers = await Courier.find().populate("user", "name email role");
  res.json(couriers);
};

// Get courier by ID
export const getCourierById = async (req, res) => {
  const courier = await Courier.findById(req.params.id).populate("user", "name email role");
  if (!courier) return res.status(404).json({ message: "Courier not found" });
  res.json(courier);
};

// Update courier (owner only)
export const updateCourier = async (req, res) => {
  const { vehicleType, phone, isAvailable } = req.body;
  const courier = await Courier.findOne({ user: req.user._id });

  if (!courier) return res.status(404).json({ message: "Courier not found" });

  courier.vehicleType = vehicleType || courier.vehicleType;
  courier.phone = phone || courier.phone;
  courier.isAvailable = isAvailable ?? courier.isAvailable;

  const updated = await courier.save();
  res.json(updated);
};

// Delete courier (Admin only)
export const deleteCourier = async (req, res) => {
  const courier = await Courier.findById(req.params.id);
  if (!courier) return res.status(404).json({ message: "Courier not found" });

  await courier.deleteOne();
  res.json({ message: "Courier deleted" });
};
