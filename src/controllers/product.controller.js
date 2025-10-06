import Product from "../models/product.model.js";

// 🟢 Create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, restaurantId } = req.body;

    if (!name || !price || !restaurantId) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const product = await Product.create({
      restaurant: restaurantId,
      name,
      price,
      description,
      image: req.file?.path || "", // multer orqali yuklangan rasm
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟡 Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("restaurant", "name");
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟠 Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("restaurant", "name");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔵 Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (req.file?.path) req.body.image = req.file.path; // yangi rasm bo‘lsa yangilash
    Object.assign(product, req.body);

    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔴 Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
