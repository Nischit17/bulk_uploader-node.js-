# Bulk Upload Application

A Node.js application for bulk uploading and processing Excel files into a MySQL database.

## Features

- Upload single or multiple Excel files
- Automatic data validation
- Excel date format conversion
- Proper error handling
- Production-ready folder structure
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd bulk_upload
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MySQL credentials.

5. Create the required database and table:

   ```sql
   CREATE DATABASE bulk_testing;
   USE bulk_testing;

   CREATE TABLE bulk_testing (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     age INT,
     email VARCHAR(255),
     phone_number VARCHAR(20),
     salary DECIMAL(10, 2),
     joining_date DATE,
     department VARCHAR(100)
   );
   ```

## Usage

### Start the server

Development mode:

```
npm run dev
```

Production mode:

```
npm start
```

### API Endpoints

#### Upload a single file

```
POST /api/upload/single
```

- Form field: `file` (Excel file)

#### Upload multiple files

```
POST /api/upload/multiple
```

- Form field: `files` (Multiple Excel files, max 10)

### Example Excel File Format

Your Excel file should have the following columns:

- name (required)
- age
- email
- phone_number
- salary
- joining_date
- department

## Project Structure

```
bulk_upload/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── app.js          # Application entry point
├── uploads/            # Temporary upload directory
├── .env                # Environment variables
├── .env.example        # Example environment file
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Error Handling

The application includes comprehensive error handling for:

- File upload errors
- Excel parsing errors
- Data validation errors
- Database errors

## License

ISC
