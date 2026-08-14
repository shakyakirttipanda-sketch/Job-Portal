import bcrypt from "bcryptjs";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";
import {
  isValidEmail,
  isStrongPassword,
  isValidPhone,
} from "../utils/validators.js";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!isStrongPassword(password)) {
    throw new ApiError(
      400,
      "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long"
    );
  }

  if (!isValidPhone(phone)) {
    throw new ApiError(400, "Invalid phone number");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  logger.info(`New user registered: ${email}`);

  sendResponse(
    res,
    201,
    true,
    "Registration successful",
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    }
  );
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Your account has been blocked");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  logger.info(`User logged in: ${email}`);

  sendResponse(
    res,
    200,
    true,
    "Login successful",
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  );
});

// Get Logged-in User Profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  sendResponse(res, 200, true, "Profile fetched successfully", user);
});

// Update Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  logger.info(`Profile updated: ${updatedUser.email}`);

  sendResponse(
    res,
    200,
    true,
    "Profile updated successfully",
    updatedUser
  );
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
  sendResponse(res, 200, true, "Logout successful");
});