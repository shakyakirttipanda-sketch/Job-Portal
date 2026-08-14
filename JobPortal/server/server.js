import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

import logger from "./utils/logger.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

/*
=========================================
            MIDDLEWARES
=========================================
*/

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

/*
=========================================
            API ROUTES
=========================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/companies", companyRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/admin", adminRoutes);

/*
=========================================
            DEFAULT ROUTE
=========================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is Running 🚀",
    version: "1.0.0",
  });
});

/*
=========================================
        ERROR HANDLING
=========================================
*/

app.use(notFoundMiddleware);

app.use(errorMiddleware);

/*
=========================================
            SERVER
=========================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});