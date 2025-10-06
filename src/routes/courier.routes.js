import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  createCourier,
  getCouriers,
  getCourierById,
  updateCourier,
  deleteCourier,
} from "../controllers/courier.controller.js";

const router = express.Router();

// faqat courier user yaratishi mumkin
router.post("/", protect, authorizeRoles("courier"), createCourier);

// faqat admin barcha courerni ko‘radi
router.get("/", protect, authorizeRoles("admin"), getCouriers);

// admin ham, courier ham o‘z profilini ko‘ra oladi
router.get("/:id", protect, authorizeRoles("admin", "courier"), getCourierById);

// courier faqat o‘zini update qiladi
router.put("/", protect, authorizeRoles("courier"), updateCourier);

// faqat admin o‘chiradi
router.delete("/:id", protect, authorizeRoles("admin"), deleteCourier);

export default router;
