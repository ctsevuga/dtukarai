import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Admin only
 */
router.post(
  "/register",
  protect,
  authorizeRoles("admin"),
  registerUser
);

/**
 * @route POST /api/users/auth
 * @desc Login user
 * @access Public
 */
router.post("/auth", authUser);

/**
 * @route GET & PUT /api/users/profile
 * @desc Get or update logged-in user profile
 * @access Logged-in users (Admin + Agent)
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Admin only
 */
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);

/**
 * @route GET /api/users/:id
 * @desc Get single user by ID
 * @access Admin only
 */
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);

/**
 * @route PUT /api/users/:id
 * @desc Admin updates any user
 * @access Admin only
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateUser
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Admin only
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

export default router;
