require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget"); // Budget API

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Dynamic frontend URL from environment variable
  credentials: true               // Required to send cookies
}));
app.use(cookieParser());           // To parse JWT from cookies
app.use(express.json());           // To parse incoming JSON

// Routes
app.use("/api/auth", authRoutes);     // Auth routes
app.use("/api/budget", budgetRoutes); // Budget routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Start the server
const PORT = process.env.PORT || 5000; // Dynamic port from environment variable (Heroku sets this)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error stack trace
  res.status(500).json({ message: "Something went wrong on the server!" });
});
