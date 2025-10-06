import { Router } from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js"; // qo‘shildi

const router = Router();

router.post(
  "/",
  protect,
  authorizeRoles(["restaurant", "admin"]),
  upload.single("image"), // image file qo‘shish
  createRestaurant
);

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

router.put(
  "/:id",
  protect,
  upload.single("image"), // update paytida ham rasm o‘zgartirish mumkin
  updateRestaurant
);

router.delete("/:id", protect, deleteRestaurant);

export default router;
