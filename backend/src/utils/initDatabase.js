/**
 * Database Initialization Utility
 * Creates necessary tables if they don't exist
 */
const fs = require("fs");
const path = require("path");
const db = require("../config/database");

/**
 * Initializes database tables
 */
const initDatabase = async () => {
  console.log("Initializing database...");

  try {
    // Read SQL initialization script
    const sqlPath = path.join(__dirname, "db_init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Split SQL statements by semicolon
    const statements = sql
      .split(";")
      .filter((statement) => statement.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      await executeQuery(statement);
    }

    console.log("Database initialization complete.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

/**
 * Execute a single SQL query
 * @param {string} sql - SQL query to execute
 * @returns {Promise} Promise resolving to query result
 */
const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = initDatabase;
