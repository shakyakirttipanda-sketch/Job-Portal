import Application from "../models/Application.js";
import Job from "../models/Job.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";

// Apply for Job
export const applyJob = asyncHandler(async (req, res) => {
  const { job, coverLetter } = req.body;

  const existingJob = await Job.findById(job);

  if (!existingJob) {
    throw new ApiError(404, "Job not found");
  }

  if (!existingJob.isActive) {
    throw new ApiError(400, "Job is closed");
  }

  const alreadyApplied = await Application.findOne({
    job,
    applicant: req.user.id,
  });

  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const application = await Application.create({
    job,
    applicant: req.user.id,
    resume: req.file ? req.file.path : "",
    coverLetter,
  });

  logger.info(`Application submitted by ${req.user.email}`);

  sendResponse(
    res,
    201,
    true,
    "Application submitted successfully",
    application
  );
});

// Get Logged-in User Applications
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    applicant: req.user.id,
  })
    .populate("job")
    .populate("applicant", "name email");

  sendResponse(
    res,
    200,
    true,
    "Applications fetched successfully",
    applications
  );
});

// Get Applicants For Employer Job
export const getApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }

  const applications = await Application.find({
    job: req.params.jobId,
  }).populate("applicant", "name email phone");

  sendResponse(
    res,
    200,
    true,
    "Applicants fetched successfully",
    applications
  );
});

// Accept / Reject Application
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate(
    "job"
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.job.postedBy.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
  }

  application.status = req.body.status;

  await application.save();

  logger.info(`Application updated: ${application._id}`);

  sendResponse(
    res,
    200,
    true,
    "Application status updated successfully",
    application
  );
});

// Delete Application
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.applicant.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized");
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

// Application Statistics
export const getApplicationStats = asyncHandler(async (req, res) => {
  const totalApplications = await Application.countDocuments();

  const pending = await Application.countDocuments({
    status: "Pending",
  });

  const accepted = await Application.countDocuments({
    status: "Accepted",
  });

  const rejected = await Application.countDocuments({
    status: "Rejected",
  });

  sendResponse(
    res,
    200,
    true,
    "Application statistics fetched",
    {
      totalApplications,
      pending,
      accepted,
      rejected,
    }
  );
});