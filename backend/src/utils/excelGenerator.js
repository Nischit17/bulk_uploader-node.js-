/**
 * Excel Generator Utility
 * Generates Excel files from database data
 */
const xlsx = require("xlsx");
const db = require("../config/database");
const historyModel = require("../models/uploadHistory");

/**
 * Convert database data to Excel binary data
 * @param {string|number} historyId - ID of the history record
 * @returns {Promise<Buffer>} - Promise resolving to Excel file buffer
 */
const convertExcelData = async (historyId) => {
  try {
    // Get the history record
    const historyRecord = await historyModel.getHistoryById(historyId);

    // Get related data from the database
    const data = await fetchDataForHistory(historyRecord);

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Export Data");

    // Generate binary data
    const excelBuffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return excelBuffer;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    throw error;
  }
};

/**
 * Fetch data from the database based on the history record
 * @param {Object} historyRecord - The history record
 * @returns {Promise<Array>} - Promise resolving to database records
 */
const fetchDataForHistory = async (historyRecord) => {
  return new Promise((resolve, reject) => {
    // Query to fetch data from bulk_testing table
    // This can be customized based on your specific data model
    const sql = `SELECT * FROM bulk_testing WHERE 1=1`;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching data for Excel generation:", err);
        return reject(err);
      }

      // Format data if needed
      const formattedData = results.map((record) => {
        return {
          ...record,
          // Format date fields if needed
          joining_date: record.joining_date
            ? new Date(record.joining_date).toISOString().split("T")[0]
            : null,
        };
      });

      resolve(formattedData);
    });
  });
};

module.exports = {
  convertExcelData,
};
