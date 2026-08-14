import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";

/*
====================================================
                ADMIN DASHBOARD
====================================================
*/

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = {
    totalUsers: await User.countDocuments({
      role: "Job Seeker",
    }),

    totalEmployers: await User.countDocuments({
      role: "Employer",
    }),

    totalAdmins: await User.countDocuments({
      role: "Admin",
    }),

    blockedUsers: await User.countDocuments({
      isBlocked: true,
    }),

    totalCompanies: await Company.countDocuments(),

    totalJobs: await Job.countDocuments(),

    activeJobs: await Job.countDocuments({
      isActive: true,
    }),

    inactiveJobs: await Job.countDocuments({
      isActive: false,
    }),

    totalApplications: await Application.countDocuments(),

    pendingApplications: await Application.countDocuments({
      status: "Pending",
    }),

    acceptedApplications: await Application.countDocuments({
      status: "Accepted",
    }),

    rejectedApplications: await Application.countDocuments({
      status: "Rejected",
    }),
  };

  sendResponse(
    res,
    200,
    true,
    "Dashboard fetched successfully",
    dashboard
  );
});

/*
====================================================
                USER MANAGEMENT
====================================================
*/

export const getAllUsers = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(
    User.find({
      role: "Job Seeker",
    }).select("-password"),
    req.query
  )
    .filter()
    .sort()
    .pagination(resultPerPage);

  const users = await apiFeatures.query;

  sendResponse(
    res,
    200,
    true,
    "Users fetched successfully",
    users
  );
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "Admin") {
    throw new ApiError(403, "Admin account cannot be blocked");
  }

  user.isBlocked = true;

  await user.save();

  logger.info(`User blocked: ${user.email}`);

  sendResponse(
    res,
    200,
    true,
    "User blocked successfully"
  );
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = false;

  await user.save();

  logger.info(`User unblocked: ${user.email}`);

  sendResponse(
    res,
    200,
    true,
    "User unblocked successfully"
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "Admin") {
    throw new ApiError(403, "Admin account cannot be deleted");
  }

  await user.deleteOne();

  logger.info(`User deleted: ${user.email}`);

  sendResponse(
    res,
    200,
    true,
    "User deleted successfully"
  );
});
/*
====================================================
            EMPLOYER MANAGEMENT
====================================================
*/

export const getAllEmployers = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(
    User.find({
      role: "Employer",
    }).select("-password"),
    req.query
  )
    .filter()
    .sort()
    .pagination(resultPerPage);

  const employers = await apiFeatures.query;

  sendResponse(
    res,
    200,
    true,
    "Employers fetched successfully",
    employers
  );
});

export const deleteEmployer = asyncHandler(async (req, res) => {
  const employer = await User.findById(req.params.id);

  if (!employer) {
    throw new ApiError(404, "Employer not found");
  }

  await Company.deleteMany({
    owner: employer._id,
  });

  await Job.deleteMany({
    postedBy: employer._id,
  });

  await employer.deleteOne();

  logger.info(`Employer deleted: ${employer.email}`);

  sendResponse(
    res,
    200,
    true,
    "Employer deleted successfully"
  );
});

/*
====================================================
            COMPANY MANAGEMENT
====================================================
*/

export const getAllCompanies = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(
    Company.find().populate("owner", "name email"),
    req.query
  )
    .filter()
    .sort()
    .pagination(resultPerPage);

  const companies = await apiFeatures.query;

  sendResponse(
    res,
    200,
    true,
    "Companies fetched successfully",
    companies
  );
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
    .populate("owner", "name email phone");

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  sendResponse(
    res,
    200,
    true,
    "Company fetched successfully",
    company
  );
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  await Job.deleteMany({
    company: company._id,
  });

  await company.deleteOne();

  logger.info(`Company deleted: ${company.companyName}`);

  sendResponse(
    res,
    200,
    true,
    "Company deleted successfully"
  );
});
/*
====================================================
                JOB MANAGEMENT
====================================================
*/

export const getAllJobs = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(
    Job.find()
      .populate("company", "companyName")
      .populate("postedBy", "name email"),
    req.query
  )
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const jobs = await apiFeatures.query;

  sendResponse(
    res,
    200,
    true,
    "Jobs fetched successfully",
    jobs
  );
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  await Application.deleteMany({
    job: job._id,
  });

  await job.deleteOne();

  logger.info(`Job deleted: ${job.title}`);

  sendResponse(
    res,
    200,
    true,
    "Job deleted successfully"
  );
});

/*
====================================================
            APPLICATION MANAGEMENT
====================================================
*/

export const getAllApplications = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(
    Application.find()
      .populate("job")
      .populate("applicant", "name email"),
    req.query
  )
    .filter()
    .sort()
    .pagination(resultPerPage);

  const applications = await apiFeatures.query;

  sendResponse(
    res,
    200,
    true,
    "Applications fetched successfully",
    applications
  );
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  await application.deleteOne();

  logger.info(`Application deleted: ${application._id}`);

  sendResponse(
    res,
    200,
    true,
    "Application deleted successfully"
  );
});

/*
====================================================
            REPORTS & ANALYTICS
====================================================
*/

export const getReports = asyncHandler(async (req, res) => {
  const report = {
    generatedAt: new Date(),

    users: await User.countDocuments({
      role: "Job Seeker",
    }),

    employers: await User.countDocuments({
      role: "Employer",
    }),

    admins: await User.countDocuments({
      role: "Admin",
    }),

    blockedUsers: await User.countDocuments({
      isBlocked: true,
    }),

    companies: await Company.countDocuments(),

    jobs: await Job.countDocuments(),

    activeJobs: await Job.countDocuments({
      isActive: true,
    }),

    inactiveJobs: await Job.countDocuments({
      isActive: false,
    }),

    applications: await Application.countDocuments(),

    pendingApplications: await Application.countDocuments({
      status: "Pending",
    }),

    acceptedApplications: await Application.countDocuments({
      status: "Accepted",
    }),

    rejectedApplications: await Application.countDocuments({
      status: "Rejected",
    }),
  };

  sendResponse(
    res,
    200,
    true,
    "Reports generated successfully",
    report
  );
});