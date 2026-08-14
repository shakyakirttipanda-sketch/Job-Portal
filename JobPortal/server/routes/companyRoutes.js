import express from "express";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  getCompanyStats,
} from "../controllers/companyController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
=========================================
        PUBLIC ROUTES
=========================================
*/

// Get All Companies
router.get("/", getCompanies);


/*
=========================================
      EMPLOYER ROUTES
=========================================
*/

// Create Company
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Employer"),
  createCompany
);

// Get My Companies
router.get(
  "/my/companies",
  authMiddleware,
  authorizeRoles("Employer"),
  getMyCompanies
);

// Get Company By ID
router.get("/:id", getCompanyById);

// Update Company
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Employer"),
  updateCompany
);

// Delete Company
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Employer"),
  deleteCompany
);

// Company Statistics
router.get(
  "/stats/overview",
  authMiddleware,
  authorizeRoles("Employer", "Admin"),
  getCompanyStats
);

export default router;