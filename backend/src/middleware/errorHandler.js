/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Handles multer-specific errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleMulterError = (err, req, res, next) => {
  if (err.name === "MulterError") {
    // Handle specific Multer errors
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          error: "File too large. Maximum file size is 10MB.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          error: "Unexpected field name in form data.",
        });
      default:
        return res.status(400).json({
          success: false,
          error: `File upload error: ${err.message}`,
        });
    }
  }
  next(err);
};

/**
 * General error handler for all other errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleGeneralError = (err, req, res, next) => {
  console.error("Error:", err);

  // Determine if this is a known error type
  if (err.type === "validation") {
    return res.status(400).json({
      success: false,
      error: err.message || "Validation error",
    });
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message || "Internal server error",
  });
};

module.exports = {
  handleMulterError,
  handleGeneralError,
};
