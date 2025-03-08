/**
 * Database configuration module
 * Handles MySQL connection setup and provides a connection instance
 */
const mysql = require("mysql2");
require("dotenv").config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "niisch123",
  database: process.env.DB_NAME || "bulk_testing",
};

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Successfully connected to MySQL database!");
});

module.exports = connection;
