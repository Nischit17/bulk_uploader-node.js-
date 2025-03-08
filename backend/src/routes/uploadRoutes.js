/**
 * Upload Routes
 * Defines API routes for file upload operations
 */
const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");
const historyController = require("../controllers/historyController");
const downloadController = require("../controllers/downloadController");

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

/**
 * @route GET /api/upload/history
 * @desc Get upload history with pagination
 * @access Public
 */
router.get("/history", historyController.getUploadHistory);

/**
 * @route GET /api/upload/history/:id
 * @desc Get a single upload history record by ID
 * @access Public
 */
router.get("/history/:id", historyController.getUploadHistoryById);

/**
 * @route GET /api/upload/download/:id
 * @desc Download a specific uploaded file by ID
 * @access Public
 */
router.get("/download/:id", downloadController.downloadSingleFile);

/**
 * @route POST /api/upload/download-multiple
 * @desc Download multiple files as a zip archive
 * @access Public
 */
router.post("/download-multiple", downloadController.downloadMultipleFiles);

module.exports = router;
