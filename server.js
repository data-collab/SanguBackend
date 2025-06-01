require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const budgetRoutes = require("./routes/budget");

const app = express();

// CORS Middleware
const allowedOrigins = [
  'http://localhost:4200',
  process.env.FRONTEND_URL // Your deployed frontend URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);

// Serve Angular frontend from the correct 'dist/sangu-finance-app/browser' folder
app.use(express.static(path.join(__dirname, 'dist/sangu-finance-app/browser')));

// Fallback to index.html for Angular routing support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/sangu-finance-app/browser/index.html'));
});

// Connect to MongoDB with MONGO_URI from environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// Start server on Render or local port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
