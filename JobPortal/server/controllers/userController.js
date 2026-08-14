import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";

// Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  sendResponse(res, 200, true, "Users fetched successfully", users);
});

// Get User By ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendResponse(res, 200, true, "User fetched successfully", user);
});

// Update User
export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  logger.info(`User updated: ${updatedUser.email}`);

  sendResponse(res, 200, true, "User updated successfully", updatedUser);
});

// Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();

  logger.info(`User deleted: ${user.email}`);

  sendResponse(res, 200, true, "User deleted successfully");
});

// Block User
export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = true;

  await user.save();

  logger.info(`User blocked: ${user.email}`);

  sendResponse(res, 200, true, "User blocked successfully");
});

// Unblock User
export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = false;

  await user.save();

  logger.info(`User unblocked: ${user.email}`);

  sendResponse(res, 200, true, "User unblocked successfully");
});