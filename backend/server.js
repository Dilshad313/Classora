// server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

// Import Routes
import adminRoutes from './routes/authRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import feeStructureRoutes from './routes/feeStructureRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import rulesRegulationsRoutes from './routes/rulesRegulationsRoutes.js';
import marksGradingRoutes from './routes/marksGradingRoutes.js';
import accountSettingsRoutes from './routes/accountSettingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import feesRoutes from './routes/feesRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import questionPaperRoutes from './routes/questionPaperRoutes.js';
import examRoutes from './routes/examRoutes.js';
import classTestRoutes from './routes/classTestRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userNotificationRoutes from './routes/userNotificationRoutes.js';
import behaviourRoutes from './routes/behaviourRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import { requestLogger, errorLogger } from './middleware/logging.js';
import notificationScheduler from './utils/notificationScheduler.js';

const app = express();

app.use(requestLogger);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/fee-structure", feeStructureRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use("/api/rules-regulations", rulesRegulationsRoutes);
app.use("/api/marks-grading", marksGradingRoutes);
app.use("/api/account-settings", accountSettingsRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/homework", homeworkRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/employees', employeeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/fees', feesRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/question-paper", questionPaperRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/class-tests", classTestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user-notifications", userNotificationRoutes);
app.use("/api/behaviours", behaviourRoutes);
app.use("/api/skills", skillRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorLogger, (error, req, res, next) => {
  console.error("Global Error Handler:", error);

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // Start notification scheduler
  notificationScheduler.start();
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

startServer();