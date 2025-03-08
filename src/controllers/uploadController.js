/**
 * Upload Controller
 * Handles HTTP requests related to file uploads
 */
const fs = require("fs");
const { parseExcelFile } = require("../utils/excelParser");
const { insertBulkData, validateData } = require("../models/bulkUpload");

/**
 * Handles single file upload and processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadSingleFile = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please select a file to upload.",
      });
    }

    // Get file path
    const filePath = req.file.path;

    // Parse Excel file
    const parseResult = parseExcelFile(filePath);

    if (!parseResult.success) {
      // Clean up the uploaded file if parsing failed
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });

      return res.status(400).json({
        success: false,
        error: parseResult.error,
      });
    }

    // Validate data structure
    const validationResult = validateData(parseResult.data);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        error: validationResult.error,
        details: validationResult,
      });
    }

    // Insert data into database
    const result = await insertBulkData(parseResult.data);

    // Clean up the uploaded file after successful processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Data uploaded and processed successfully",
      rowsAffected: result.affectedRows,
    });
  } catch (error) {
    console.error("Error in file upload:", error);

    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to process uploaded file",
      message: error.message,
    });
  }
};

/**
 * Handles multiple file uploads and processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadMultipleFiles = async (req, res) => {
  try {
    // Check if files exist in request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded. Please select files to upload.",
      });
    }

    const results = [];
    let totalRowsAffected = 0;

    // Process each file
    for (const file of req.files) {
      const filePath = file.path;
      const fileName = file.originalname;

      try {
        // Parse Excel file
        const parseResult = parseExcelFile(filePath);

        if (!parseResult.success) {
          results.push({
            fileName,
            success: false,
            error: parseResult.error,
          });
          continue;
        }

        // Validate data structure
        const validationResult = validateData(parseResult.data);
        if (!validationResult.valid) {
          results.push({
            fileName,
            success: false,
            error: validationResult.error,
          });
          continue;
        }

        // Insert data into database
        const dbResult = await insertBulkData(parseResult.data);

        results.push({
          fileName,
          success: true,
          rowsAffected: dbResult.affectedRows,
        });

        totalRowsAffected += dbResult.affectedRows;
      } catch (fileError) {
        results.push({
          fileName,
          success: false,
          error: fileError.message,
        });
      } finally {
        // Clean up the file after processing
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting file ${fileName}:`, err);
        });
      }
    }

    // Return combined results
    return res.status(200).json({
      success: true,
      message: "Files processed",
      totalRowsAffected,
      fileResults: results,
    });
  } catch (error) {
    console.error("Error in multiple file upload:", error);

    // Clean up files if they exist
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err)
            console.error(`Error deleting file ${file.originalname}:`, err);
        });
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to process uploaded files",
      message: error.message,
    });
  }
};

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
};
