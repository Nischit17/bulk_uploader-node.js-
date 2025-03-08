/**
 * Download Controller
 * Handles HTTP requests related to file downloads
 */
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const historyModel = require("../models/uploadHistory");
const { convertExcelData } = require("../utils/excelGenerator");

/**
 * Download a single file by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const downloadSingleFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "File ID is required",
      });
    }

    // Get file history record
    const historyRecord = await historyModel.getHistoryById(id);

    // Generate Excel file from the database
    const fileData = await convertExcelData(id);

    // Send the file
    const fileName = historyRecord.file_name || `export-${id}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", fileData.length);

    return res.send(fileData);
  } catch (error) {
    console.error("Error downloading file:", error);

    if (error.message === "History record not found") {
      return res.status(404).json({
        success: false,
        error: "File not found or no longer available",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to download file",
      message: error.message,
    });
  }
};

/**
 * Download multiple files as a zip archive
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const downloadMultipleFiles = async (req, res) => {
  try {
    const { fileIds } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "File IDs are required",
      });
    }

    // Create a zip archive
    const archive = archiver("zip", {
      zlib: { level: 5 }, // Compression level
    });

    // Set the archive as the response
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bulk-download-${Date.now()}.zip"`
    );

    // Pipe the archive to the response
    archive.pipe(res);

    // Process each file
    for (const fileId of fileIds) {
      try {
        // Get file history record
        const historyRecord = await historyModel.getHistoryById(fileId);

        // Generate Excel file from the database
        const fileData = await convertExcelData(fileId);

        // Add the file to the archive
        const fileName = historyRecord.file_name || `export-${fileId}.xlsx`;
        archive.append(fileData, { name: fileName });
      } catch (fileError) {
        console.error(`Error processing file ${fileId}:`, fileError);
        // Continue with other files
      }
    }

    // Finalize the archive and send the response
    await archive.finalize();
  } catch (error) {
    console.error("Error creating zip archive:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create downloads archive",
      message: error.message,
    });
  }
};

module.exports = {
  downloadSingleFile,
  downloadMultipleFiles,
};
