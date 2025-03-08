/**
 * Main Application Entry Point
 * Sets up Express server with middleware and routes
 */
const express = require("express");
const path = require("path");
require("dotenv").config();

// Import routes
const uploadRoutes = require("./routes/uploadRoutes");

// Import error handlers
const {
  handleMulterError,
  handleGeneralError,
} = require("./middleware/errorHandler");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static files directory
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/upload", uploadRoutes);

// Simple health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use(handleMulterError);
app.use(handleGeneralError);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // In production, you might want to exit the process
  // process.exit(1);
});

module.exports = app; // Export for testing
