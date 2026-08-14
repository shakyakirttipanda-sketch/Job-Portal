import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getJobStats,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=========================================
            PUBLIC ROUTES
=========================================
*/

// Get All Jobs
router.get("/", getJobs);

// Get Job By ID
router.get("/:id", getJobById);

/*
=========================================
          EMPLOYER ROUTES
=========================================
*/

// Create Job
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Employer"),
  createJob
);

// Get My Jobs
router.get(
  "/my/jobs",
  authMiddleware,
  authorizeRoles("Employer"),
  getMyJobs
);

// Update Job
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Employer"),
  updateJob
);

// Delete Job
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Employer"),
  deleteJob
);

// Toggle Job Status
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("Employer"),
  toggleJobStatus
);

// Job Statistics
router.get(
  "/stats/overview",
  authMiddleware,
  authorizeRoles("Employer", "Admin"),
  getJobStats
);

export default router;