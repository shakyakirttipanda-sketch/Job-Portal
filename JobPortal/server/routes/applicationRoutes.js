import express from "express";

import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
=========================================
        JOB SEEKER ROUTES
=========================================
*/

// Apply for Job
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Job Seeker"),
  upload.single("resume"),
  applyJob
);

// Get My Applications
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("Job Seeker"),
  getMyApplications
);

// Delete Application
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Job Seeker"),
  deleteApplication
);

/*
=========================================
        EMPLOYER ROUTES
=========================================
*/

// Get Applicants of a Job
router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("Employer"),
  getApplicants
);

// Accept / Reject Application
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("Employer"),
  updateApplicationStatus
);

/*
=========================================
        ADMIN / EMPLOYER
=========================================
*/

// Application Statistics
router.get(
  "/stats/overview",
  authMiddleware,
  authorizeRoles("Admin", "Employer"),
  getApplicationStats
);

export default router;