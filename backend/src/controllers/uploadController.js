/**
 * Upload Controller
 * Handles HTTP requests related to file uploads
 */
const fs = require("fs");
const { parseExcelFile } = require("../utils/excelParser");
const { insertBulkData, validateData } = require("../models/bulkUpload");
const historyModel = require("../models/uploadHistory");

/**
 * Handles single file upload and processing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadSingleFile = async (req, res) => {
  // Create a history record with initial 'processing' status
  let historyId = null;

  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please select a file to upload.",
      });
    }

    // Get file info
    const { originalname, path: filePath, size, mimetype } = req.file;

    // Create initial history record
    const historyData = {
      fileName: originalname,
      fileSize: size,
      mimetype,
      status: "processing",
      errorCount: 0,
    };

    const historyResult = await historyModel.createHistory(historyData);
    historyId = historyResult.insertId;

    // Parse Excel file
    const parseResult = parseExcelFile(filePath);

    if (!parseResult.success) {
      // Update history record to 'failed'
      if (historyId) {
        await historyModel.updateHistory(historyId, {
          status: "failed",
          errorCount: 1,
          errorMessage: parseResult.error,
        });
      }

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
      // Update history record to 'failed'
      if (historyId) {
        await historyModel.updateHistory(historyId, {
          status: "failed",
          errorCount: validationResult.invalidRows || 1,
          errorMessage: validationResult.error,
        });
      }

      return res.status(400).json({
        success: false,
        error: validationResult.error,
        details: validationResult,
      });
    }

    // Insert data into database
    const result = await insertBulkData(parseResult.data);

    // Update history record to 'success'
    if (historyId) {
      await historyModel.updateHistory(historyId, {
        status: "success",
        rowsProcessed: result.affectedRows,
        errorCount: 0,
      });
    }

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

    // Update history record to 'failed'
    if (historyId) {
      await historyModel.updateHistory(historyId, {
        status: "failed",
        errorMessage: error.message,
      });
    }

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
  // Keep track of created history records
  const historyRecords = [];

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
      let historyId = null;

      try {
        // Create initial history record for this file
        const historyData = {
          fileName,
          fileSize: file.size,
          mimetype: file.mimetype,
          status: "processing",
          errorCount: 0,
        };

        const historyResult = await historyModel.createHistory(historyData);
        historyId = historyResult.insertId;
        historyRecords.push(historyId);

        // Parse Excel file
        const parseResult = parseExcelFile(filePath);

        if (!parseResult.success) {
          // Update history record to 'failed'
          if (historyId) {
            await historyModel.updateHistory(historyId, {
              status: "failed",
              errorCount: 1,
              errorMessage: parseResult.error,
            });
          }

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
          // Update history record to 'failed'
          if (historyId) {
            await historyModel.updateHistory(historyId, {
              status: "failed",
              errorCount: validationResult.invalidRows || 1,
              errorMessage: validationResult.error,
            });
          }

          results.push({
            fileName,
            success: false,
            error: validationResult.error,
          });
          continue;
        }

        // Insert data into database
        const dbResult = await insertBulkData(parseResult.data);

        // Update history record to 'success'
        if (historyId) {
          await historyModel.updateHistory(historyId, {
            status: "success",
            rowsProcessed: dbResult.affectedRows,
            errorCount: 0,
          });
        }

        results.push({
          fileName,
          success: true,
          rowsAffected: dbResult.affectedRows,
        });

        totalRowsAffected += dbResult.affectedRows;
      } catch (fileError) {
        // Update history record to 'failed'
        if (historyId) {
          await historyModel.updateHistory(historyId, {
            status: "failed",
            errorMessage: fileError.message,
          });
        }

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

    // Update any history records to 'failed'
    for (const historyId of historyRecords) {
      try {
        await historyModel.updateHistory(historyId, {
          status: "failed",
          errorMessage: error.message,
        });
      } catch (updateError) {
        console.error(
          `Error updating history record ${historyId}:`,
          updateError
        );
      }
    }

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
