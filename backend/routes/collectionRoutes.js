import express from "express";
import {
  requestCollection,
  approveCollection,
  completeCollection,
  getRestaurantRequests,
  getNgoCollections,
} from "../controllers/collectionController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("restaurant"), getRestaurantRequests);
router.get("/ngo", protect, authorizeRoles("ngo"), getNgoCollections);

// NGO → Request
router.post("/:id/request", protect, authorizeRoles("ngo"), requestCollection);

// Restaurant → Approve
router.put("/:id/approve", protect, authorizeRoles("restaurant"), approveCollection);

// NGO → Complete
router.put("/:id/complete", protect, authorizeRoles("ngo"), completeCollection);

export default router;