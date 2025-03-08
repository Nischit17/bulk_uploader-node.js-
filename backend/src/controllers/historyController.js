/**
 * History Controller
 * Handles HTTP requests related to upload history
 */
const historyModel = require("../models/uploadHistory");

/**
 * Get all upload history records with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUploadHistory = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    // Get history records with pagination
    const [history, total] = await Promise.all([
      historyModel.getHistory({ limit, offset, status }),
      historyModel.getHistoryCount(status),
    ]);

    // Format response data to match frontend expectations
    const formattedHistory = history.map((record) => ({
      id: record.id.toString(),
      fileName: record.file_name,
      uploadDate: record.upload_date,
      fileSize: record.file_size,
      status: record.status,
      rowsProcessed: record.rows_processed,
      errorCount: record.error_count,
      errorMessage: record.error_message,
      additionalInfo: record.additional_info,
    }));

    // Return success response with pagination metadata
    return res.status(200).json({
      success: true,
      history: formattedHistory,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching upload history:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch upload history",
      message: error.message,
    });
  }
};

/**
 * Get a single upload history record by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUploadHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "History ID is required",
      });
    }

    const record = await historyModel.getHistoryById(id);

    // Format response data
    const formattedRecord = {
      id: record.id.toString(),
      fileName: record.file_name,
      uploadDate: record.upload_date,
      fileSize: record.file_size,
      status: record.status,
      rowsProcessed: record.rows_processed,
      errorCount: record.error_count,
      errorMessage: record.error_message,
      additionalInfo: record.additional_info,
    };

    return res.status(200).json({
      success: true,
      history: formattedRecord,
    });
  } catch (error) {
    console.error("Error fetching upload history record:", error);

    // Handle specific errors
    if (error.message === "History record not found") {
      return res.status(404).json({
        success: false,
        error: "History record not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to fetch upload history record",
      message: error.message,
    });
  }
};

module.exports = {
  getUploadHistory,
  getUploadHistoryById,
};
