import express from "express";
import { getAllUsers, approveNGO, getAdminStats } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/approve/:id", protect, authorizeRoles("admin"), approveNGO);
router.get("/stats", protect, authorizeRoles("admin"), getAdminStats);

export default router;