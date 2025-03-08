-- Create upload_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS upload_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('success', 'failed', 'processing') NOT NULL,
  rows_processed INT DEFAULT 0,
  error_count INT DEFAULT 0,
  error_message TEXT,
  uploaded_by VARCHAR(100) DEFAULT 'system',
  additional_info JSON
);

-- If you haven't created the bulk_testing table yet
CREATE TABLE IF NOT EXISTS bulk_testing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  email VARCHAR(255),
  phone_number VARCHAR(20),
  salary DECIMAL(12, 2),
  joining_date DATE,
  department VARCHAR(100)
); 