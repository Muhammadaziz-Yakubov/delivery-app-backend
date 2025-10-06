import Restaurant from "../models/restaurant.model.js";

export const createRestaurant = async (req, res) => {
  const { name, address, phone, location } = req.body;

  const rest = await Restaurant.create({
    name,
    address,
    phone,
    owner: req.user._id,
    location: location || { type: "Point", coordinates: [0, 0] },
    image: req.file?.path || "", // Cloudinarydan kelgan URL saqlaymiz
  });

  res.status(201).json(rest);
};

export const getRestaurants = async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };

  const skip = (page - 1) * limit;
  const list = await Restaurant.find(filter).skip(skip).limit(Number(limit));

  res.json(list);
};

export const getRestaurantById = async (req, res) => {
  const r = await Restaurant.findById(req.params.id);
  if (!r) return res.status(404).json({ message: "Restaurant not found" });
  res.json(r);
};

export const updateRestaurant = async (req, res) => {
  const rest = await Restaurant.findById(req.params.id);
  if (!rest) return res.status(404).json({ message: "Not found" });

  if (String(rest.owner) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.file?.path) req.body.image = req.file.path; // yangi rasm bo‘lsa yangilaymiz
  Object.assign(rest, req.body);

  await rest.save();
  res.json(rest);
};

export const deleteRestaurant = async (req, res) => {
  const rest = await Restaurant.findById(req.params.id);
  if (!rest) return res.status(404).json({ message: "Not found" });

  if (String(rest.owner) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await rest.deleteOne();
  res.json({ message: "Restaurant removed" });
};
