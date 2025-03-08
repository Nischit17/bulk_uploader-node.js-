/**
 * Upload History Model
 * Handles database operations for tracking file upload history
 */
const db = require("../config/database");

/**
 * Creates a new upload history record
 * @param {Object} historyData - Object containing upload history data
 * @returns {Promise} Promise resolving to database operation result
 */
const createHistory = (historyData) => {
  return new Promise((resolve, reject) => {
    const {
      fileName,
      fileSize,
      mimetype,
      status,
      rowsProcessed = 0,
      errorCount = 0,
      errorMessage = null,
      uploadedBy = "system",
      additionalInfo = {},
    } = historyData;

    if (!fileName || !fileSize || !mimetype || !status) {
      return reject(new Error("Missing required fields for upload history"));
    }

    const additionalInfoJson = JSON.stringify(additionalInfo);

    const sql = `
      INSERT INTO upload_history 
      (file_name, file_size, mimetype, status, rows_processed, error_count, error_message, uploaded_by, additional_info) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      fileName,
      fileSize,
      mimetype,
      status,
      rowsProcessed,
      errorCount,
      errorMessage,
      uploadedBy,
      additionalInfoJson,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error creating upload history:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Updates an existing upload history record
 * @param {number} id - ID of the history record to update
 * @param {Object} updateData - Object containing fields to update
 * @returns {Promise} Promise resolving to database operation result
 */
const updateHistory = (id, updateData) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject(new Error("History ID is required for update"));
    }

    // Build SET clause for the SQL query
    const updateFields = [];
    const values = [];

    // Add fields to update if they exist
    if (updateData.status) {
      updateFields.push("status = ?");
      values.push(updateData.status);
    }

    if (updateData.rowsProcessed !== undefined) {
      updateFields.push("rows_processed = ?");
      values.push(updateData.rowsProcessed);
    }

    if (updateData.errorCount !== undefined) {
      updateFields.push("error_count = ?");
      values.push(updateData.errorCount);
    }

    if (updateData.errorMessage !== undefined) {
      updateFields.push("error_message = ?");
      values.push(updateData.errorMessage);
    }

    if (updateData.additionalInfo) {
      updateFields.push("additional_info = ?");
      values.push(JSON.stringify(updateData.additionalInfo));
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return reject(new Error("No update fields provided"));
    }

    // Add id to values array
    values.push(id);

    const sql = `
      UPDATE upload_history 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating upload history:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Gets all upload history records with optional filters
 * @param {Object} filters - Optional filters (limit, offset, status)
 * @returns {Promise} Promise resolving to history records
 */
const getHistory = (filters = {}) => {
  return new Promise((resolve, reject) => {
    const { limit = 100, offset = 0, status } = filters;

    let sql = "SELECT * FROM upload_history";
    const values = [];

    // Add status filter if provided
    if (status) {
      sql += " WHERE status = ?";
      values.push(status);
    }

    // Add ordering and pagination
    sql += " ORDER BY upload_date DESC LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error getting upload history:", err);
        return reject(err);
      }

      // Format dates and parse JSON
      const formattedResults = results.map((record) => {
        let parsedInfo = {};

        // Safely parse JSON, handling potential errors
        if (record.additional_info) {
          try {
            // Handle case where additional_info might be stored as a string representation of [object Object]
            if (record.additional_info === "[object Object]") {
              parsedInfo = {};
            } else if (typeof record.additional_info === "string") {
              parsedInfo = JSON.parse(record.additional_info);
            } else {
              // If it's already an object, use it as is
              parsedInfo = record.additional_info;
            }
          } catch (e) {
            console.error("Error parsing additional_info JSON:", e);
            parsedInfo = {}; // Use empty object on parse error
          }
        }

        return {
          ...record,
          upload_date: new Date(record.upload_date).toISOString(),
          additional_info: parsedInfo,
        };
      });

      resolve(formattedResults);
    });
  });
};

/**
 * Gets single upload history record by ID
 * @param {number} id - ID of the history record to get
 * @returns {Promise} Promise resolving to history record
 */
const getHistoryById = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject(new Error("History ID is required"));
    }

    const sql = "SELECT * FROM upload_history WHERE id = ?";

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error getting upload history by ID:", err);
        return reject(err);
      }

      if (results.length === 0) {
        return reject(new Error("History record not found"));
      }

      // Format date and parse JSON
      const record = results[0];
      let parsedInfo = {};

      // Safely parse JSON, handling potential errors
      if (record.additional_info) {
        try {
          // Handle case where additional_info might be stored as a string representation of [object Object]
          if (record.additional_info === "[object Object]") {
            parsedInfo = {};
          } else if (typeof record.additional_info === "string") {
            parsedInfo = JSON.parse(record.additional_info);
          } else {
            // If it's already an object, use it as is
            parsedInfo = record.additional_info;
          }
        } catch (e) {
          console.error("Error parsing additional_info JSON:", e);
          parsedInfo = {}; // Use empty object on parse error
        }
      }

      const formatted = {
        ...record,
        upload_date: new Date(record.upload_date).toISOString(),
        additional_info: parsedInfo,
      };

      resolve(formatted);
    });
  });
};

/**
 * Gets total count of history records with optional status filter
 * @param {string} status - Optional status filter
 * @returns {Promise} Promise resolving to count
 */
const getHistoryCount = (status) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT COUNT(*) AS count FROM upload_history";
    const values = [];

    // Add status filter if provided
    if (status) {
      sql += " WHERE status = ?";
      values.push(status);
    }

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error counting upload history:", err);
        return reject(err);
      }

      resolve(results[0].count);
    });
  });
};

module.exports = {
  createHistory,
  updateHistory,
  getHistory,
  getHistoryById,
  getHistoryCount,
};
