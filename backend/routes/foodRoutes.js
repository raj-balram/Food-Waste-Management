import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  updateStatus,
  getMyListings
} from "../controllers/foodController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getNearbyListings } from "../controllers/foodController.js";

const router = express.Router();

// Create (Restaurant only)
router.post("/", protect, authorizeRoles("restaurant"), createListing);

// Get all (NGO, Admin, Restaurant)
router.get("/", protect, getAllListings);

// Nearby listings (NGO)
router.get("/nearby", protect, authorizeRoles("ngo"), getNearbyListings);

router.get("/my", protect, authorizeRoles("restaurant"), getMyListings);

// Update status
router.patch("/:id/status", protect, updateStatus);

// Get one
router.get("/:id", protect, getListingById);

// Update (Owner only)
router.put("/:id", protect, updateListing);

// Delete (Owner only)
router.delete("/:id", protect, deleteListing);



export default router;