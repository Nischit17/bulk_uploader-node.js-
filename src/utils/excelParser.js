/**
 * Excel Parser Utility
 * Handles reading and parsing Excel files into structured data
 */
const xlsx = require("xlsx");

/**
 * Converts Excel date serial number to MySQL date format
 * @param {number} excelDate - Excel date serial number
 * @returns {string|null} MySQL formatted date (YYYY-MM-DD) or null if invalid
 */
const convertExcelDate = (excelDate) => {
  if (!excelDate && excelDate !== 0) return null;

  try {
    // Excel dates are stored as days since January 0, 1900
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const jsDate = new Date(excelEpoch);
    jsDate.setDate(excelEpoch.getDate() + excelDate);

    // Format date as YYYY-MM-DD for MySQL
    return jsDate.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error converting Excel date:", error);
    return null;
  }
};

/**
 * Parses an Excel file and returns structured data
 * @param {string} filePath - Path to the Excel file
 * @returns {Object} Object containing parsed data and any errors
 */
const parseExcelFile = (filePath) => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        error: "Excel file has no sheets",
        data: null,
      };
    }

    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const rawData = xlsx.utils.sheet_to_json(worksheet);

    if (!rawData || rawData.length === 0) {
      return {
        success: false,
        error: "Excel file has no data",
        data: null,
      };
    }

    return {
      success: true,
      data: rawData,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse Excel file: ${error.message}`,
      data: null,
    };
  }
};

module.exports = {
  parseExcelFile,
  convertExcelDate,
};
