import Job from "../models/Job.js";

import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";

// Create Job
export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user.id,
  });

  logger.info(`Job created: ${job.title}`);

  sendResponse(res, 201, true, "Job created successfully", job);
});

// Get All Jobs
export const getJobs = asyncHandler(async (req, res) => {
  const resultPerPage = Number(req.query.limit) || 10;

  const apiFeatures = new ApiFeatures(Job.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const jobs = await apiFeatures.query
    .populate("company")
    .populate("postedBy", "name email");

  sendResponse(res, 200, true, "Jobs fetched successfully", jobs);
});

// Get Logged-in Employer Jobs
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    postedBy: req.user.id,
  }).populate("company");

  sendResponse(res, 200, true, "Your jobs fetched successfully", jobs);
});

// Get Job By ID
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("company")
    .populate("postedBy", "name email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  sendResponse(res, 200, true, "Job fetched successfully", job);
});

// Update Job
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  logger.info(`Job updated: ${updatedJob.title}`);

  sendResponse(res, 200, true, "Job updated successfully", updatedJob);
});

// Delete Job
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to delete this job");
  }

  await job.deleteOne();

  logger.info(`Job deleted: ${job.title}`);

  sendResponse(res, 200, true, "Job deleted successfully");
});

// Toggle Job Status
export const toggleJobStatus = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.isActive = !job.isActive;

  await job.save();

  logger.info(`Job status changed: ${job.title}`);

  sendResponse(res, 200, true, "Job status updated", job);
});

// Job Statistics
export const getJobStats = asyncHandler(async (req, res) => {
  const totalJobs = await Job.countDocuments();

  const myJobs = await Job.countDocuments({
    postedBy: req.user.id,
  });

  const activeJobs = await Job.countDocuments({
    isActive: true,
  });

  const inactiveJobs = await Job.countDocuments({
    isActive: false,
  });

  sendResponse(res, 200, true, "Job statistics fetched", {
    totalJobs,
    myJobs,
    activeJobs,
    inactiveJobs,
  });
});