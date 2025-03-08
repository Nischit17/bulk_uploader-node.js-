/**
 * Bulk Upload Model
 * Handles database operations for bulk data uploads
 */
const db = require("../config/database");
const { convertExcelDate } = require("../utils/excelParser");

/**
 * Processes and inserts data from Excel into the database
 * @param {Array} data - Array of objects from Excel file
 * @returns {Promise} Promise resolving to database operation result
 */
const insertBulkData = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return reject(new Error("No valid data provided for insertion"));
    }

    // Filter out rows with missing required fields and map to array format
    const values = data
      .filter((row) => row.name) // Filter out rows where name is null/undefined
      .map((row) => {
        // Process joining date
        const joiningDate = convertExcelDate(row.joining_date);

        return [
          row.name || null,
          row.age || null,
          row.email || null,
          row.phone_number || null,
          row.salary || null,
          joiningDate,
          row.department || null,
        ];
      });

    // Check if we have any valid rows to insert
    if (values.length === 0) {
      return reject(
        new Error(
          "No valid data found after filtering. 'name' field is required."
        )
      );
    }

    // SQL query for insertion
    const sql =
      "INSERT INTO bulk_testing (name, age, email, phone_number, salary, joining_date, department) VALUES ?";

    // Execute the query
    db.query(sql, [values], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * Validates the structure of data before insertion
 * @param {Array} data - Array of objects from Excel file
 * @returns {Object} Validation result with success flag and any errors
 */
const validateData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      valid: false,
      error: "No data provided or data is not in expected format",
    };
  }

  // Check for required fields
  const missingRequiredFields = data.filter((row) => !row.name);

  if (missingRequiredFields.length > 0) {
    return {
      valid: false,
      error: `${missingRequiredFields.length} rows are missing the required 'name' field`,
      invalidRows: missingRequiredFields.length,
    };
  }

  return {
    valid: true,
    error: null,
  };
};

module.exports = {
  insertBulkData,
  validateData,
};
