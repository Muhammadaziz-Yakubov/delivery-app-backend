import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js"; // multer config

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected (restaurant owner yoki admin)
router.post(
  "/",
  protect,
  authorizeRoles(["restaurant", "admin"]),
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  protect,
  authorizeRoles(["restaurant", "admin"]),
  upload.single("image"),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorizeRoles(["restaurant", "admin"]),
  deleteProduct
);

export default router;
