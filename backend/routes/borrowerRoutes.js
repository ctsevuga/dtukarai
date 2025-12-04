// routes/borrowerRoutes.js

import express from "express";
import {
  createBorrower,
  getAllBorrowers,
  getBorrowerById,
  searchBorrowerByPhone,
  updateBorrower,
  deactivateBorrower
} from "../controllers/borrowerController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/borrowers
 * @route GET  /api/borrowers
 * Admin can create, Admin+Agent can view
 */
router
  .route("/")
  .post(protect, authorizeRoles("admin"), createBorrower)
  .get(protect,  getAllBorrowers);

/**
 * @route GET /api/borrowers/search/:phone
 * Admin + Agent
 */
router.get(
  "/search/:phone",
  protect,
  authorizeRoles("admin", "agent"),
  searchBorrowerByPhone
);

/**
 * @route GET /api/borrowers/:id
 * @route PUT /api/borrowers/:id
 * @route DELETE /api/borrowers/:id
 */
router
  .route("/:id")
  .get(protect,  getBorrowerById)
  .put(protect, authorizeRoles("admin"), updateBorrower)
  .delete(protect, authorizeRoles("admin"), deactivateBorrower);

export default router;
