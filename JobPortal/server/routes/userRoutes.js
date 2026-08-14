import express from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=========================================
        USER MANAGEMENT
=========================================
*/

// Admin - View All Users
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  getAllUsers
);

// Admin - View User By ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  getUserById
);

// Admin - Update User
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  updateUser
);

// Admin - Delete User
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteUser
);

// Admin - Block User
router.patch(
  "/:id/block",
  authMiddleware,
  authorizeRoles("Admin"),
  blockUser
);

// Admin - Unblock User
router.patch(
  "/:id/unblock",
  authMiddleware,
  authorizeRoles("Admin"),
  unblockUser
);

export default router;