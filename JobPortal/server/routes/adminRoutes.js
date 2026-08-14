import express from "express";

import {
  getDashboard,
  getAllUsers,
  getAllEmployers,
  getAllJobs,
  getAllApplications,
  blockUser,
  unblockUser,
  deleteUser,
  deleteEmployer,
  deleteJob,
  deleteApplication,
  getReports,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(authorizeRoles("Admin"));

/*
=========================================
        ADMIN DASHBOARD
=========================================
*/

router.get("/dashboard", getDashboard);

/*
=========================================
        USER MANAGEMENT
=========================================
*/

router.get("/users", getAllUsers);

router.put("/users/block/:id", blockUser);

router.put("/users/unblock/:id", unblockUser);

router.delete("/users/:id", deleteUser);

/*
=========================================
      EMPLOYER MANAGEMENT
=========================================
*/

router.get("/employers", getAllEmployers);

router.delete("/employers/:id", deleteEmployer);

/*
=========================================
        JOB MANAGEMENT
=========================================
*/

router.get("/jobs", getAllJobs);

router.delete("/jobs/:id", deleteJob);

/*
=========================================
     APPLICATION MANAGEMENT
=========================================
*/

router.get("/applications", getAllApplications);

router.delete("/applications/:id", deleteApplication);

/*
=========================================
          REPORTS
=========================================
*/

router.get("/reports", getReports);

export default router;