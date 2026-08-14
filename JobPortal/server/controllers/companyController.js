import Company from "../models/Company.js";

import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../utils/sendResponse.js";

// Create Company
export const createCompany = asyncHandler(async (req, res) => {
  const { companyName, description, website, location, logo } = req.body;

  if (!companyName || !description || !location) {
    throw new ApiError(400, "Please fill all required fields");
  }

  const company = await Company.create({
    companyName,
    description,
    website,
    location,
    logo,
    owner: req.user.id,
  });

  logger.info(`Company created: ${company.companyName}`);

  sendResponse(res, 201, true, "Company created successfully", company);
});

// Get All Companies
export const getCompanies = asyncHandler(async (req, res) => {
  const resultPerPage = 10;

  const apiFeatures = new ApiFeatures(Company.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const companies = await apiFeatures.query.populate(
    "owner",
    "name email"
  );

  sendResponse(
    res,
    200,
    true,
    "Companies fetched successfully",
    companies
  );
});

// Get Logged-in Employer Companies
export const getMyCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({
    owner: req.user.id,
  });

  sendResponse(
    res,
    200,
    true,
    "Your companies fetched successfully",
    companies
  );
});

// Get Company By ID
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate(
    "owner",
    "name email phone"
  );

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

// Update Company
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  if (company.owner.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You are not authorized to update this company"
    );
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  logger.info(`Company updated: ${updatedCompany.companyName}`);

  sendResponse(
    res,
    200,
    true,
    "Company updated successfully",
    updatedCompany
  );
});

// Delete Company
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  if (company.owner.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You are not authorized to delete this company"
    );
  }

  await company.deleteOne();

  logger.info(`Company deleted: ${company.companyName}`);

  sendResponse(
    res,
    200,
    true,
    "Company deleted successfully"
  );
});

// Company Statistics
export const getCompanyStats = asyncHandler(async (req, res) => {
  const totalCompanies = await Company.countDocuments();

  const myCompanies = await Company.countDocuments({
    owner: req.user.id,
  });

  sendResponse(
    res,
    200,
    true,
    "Company statistics fetched successfully",
    {
      totalCompanies,
      myCompanies,
    }
  );
});