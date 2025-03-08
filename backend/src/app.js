/**
 * Main Application Entry Point
 * Sets up Express server with middleware and routes
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Import routes
const uploadRoutes = require("./routes/uploadRoutes");

// Import error handlers
const {
  handleMulterError,
  handleGeneralError,
} = require("./middleware/errorHandler");

// Import database initialization
const initDatabase = require("./utils/initDatabase");

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

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

// Initialize database and start server
const PORT = process.env.PORT || 3000;

// Self-invoking async function to initialize the database before starting the server
(async () => {
  try {
    // Initialize database tables
    await initDatabase();

    // Start the server after database initialization
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // In production, you might want to exit the process
  // process.exit(1);
});

module.exports = app; // Export for testing
