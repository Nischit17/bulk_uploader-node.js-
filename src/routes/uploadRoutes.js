/**
 * Upload Routes
 * Defines API routes for file upload operations
 */
const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

/**
 * @route POST /api/upload/single
 * @desc Upload a single Excel file and process it
 * @access Public
 */
router.post(
  "/single",
  uploadMiddleware.single("file"),
  uploadController.uploadSingleFile
);

/**
 * @route POST /api/upload/multiple
 * @desc Upload multiple Excel files and process them
 * @access Public
 */
router.post(
  "/multiple",
  uploadMiddleware.array("files", 10), // Allow up to 10 files
  uploadController.uploadMultipleFiles
);

module.exports = router;
