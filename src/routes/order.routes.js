import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  adminGetAllOrders,
  assignCourier,
  getMyDeliveries,
} from "../controllers/order.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// User buyurtma yaratadi
router.post("/", protect, authorizeRoles("user"), createOrder);

// Foydalanuvchi o‘z buyurtmalari
router.get("/my", protect, authorizeRoles("user"), getMyOrders);

// Courier o‘z buyurtmalarini ko‘radi
router.get("/deliveries/my", protect, authorizeRoles("courier"), getMyDeliveries);

// Admin barcha buyurtmalarni ko‘radi
router.get("/", protect, authorizeRoles("admin"), adminGetAllOrders);

// Bitta order
router.get("/:id", protect, getOrderById);

// Order statusni yangilash (owner/courier/admin)
router.put("/:id/status", protect, updateOrderStatus);

// Admin yoki restoran owner courier biriktiradi
router.put("/:id/assign", protect, authorizeRoles("admin", "restaurant"), assignCourier);

export default router;
