import { Router } from "express";
import { getProfile, updateProfile, deleteProfile, getAllUsers } from "../controllers/user.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteProfile);

// admin
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

export default router;
