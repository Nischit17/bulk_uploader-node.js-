# Bulk Upload Application

A full-stack application for bulk uploading, processing, and downloading Excel files with a MySQL database backend and Next.js frontend.

## System Architecture

The application consists of two main components:

1. **Backend** - Node.js/Express server that handles file processing and database operations
2. **Frontend** - Next.js application with a modern UI for uploading and managing files

## Technologies Used

### Backend

- Node.js & Express.js
- MySQL for data storage
- Multer for file uploads
- XLSX for Excel file processing
- Archiver for ZIP file creation

### Frontend

- Next.js 15+ with App Router
- TypeScript for type safety
- Redux Toolkit for state management
- Shadcn UI components
- Tailwind CSS for styling
- Axios for API requests

## Features

### File Upload

- Upload single or multiple Excel files
- Drag and drop interface
- Progress tracking during upload
- Automatic data validation
- Excel date format conversion

### File Management

- View upload history with detailed information
- Sort and filter uploaded files
- Check processing status and results

### File Download

- Download individual files as Excel
- Batch download multiple files as a ZIP archive
- Seamless browser-based download experience

### Data Processing

- Automatic data extraction from Excel
- Validation before database insertion
- Error tracking and reporting

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MySQL credentials:

   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=bulk_testing

   # File Upload Configuration
   MAX_FILE_SIZE=10485760 # 10MB in bytes
   ```

5. Create the required database and tables:

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

   CREATE TABLE upload_history (
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
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file:

   ```
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000

   # Application Configuration
   NEXT_PUBLIC_APP_NAME=Bulk Upload Application
   NEXT_PUBLIC_MAX_FILE_SIZE=10485760 # 10MB in bytes
   ```

## Running the Application

### Backend

Development mode:

```
cd backend
npm run dev
```

Production mode:

```
cd backend
npm start
```

### Frontend

Development mode:

```
cd frontend
npm run dev
```

Production build:

```
cd frontend
npm run build
npm start
```

## API Documentation

### Upload Endpoints

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

### History Endpoints

#### Get upload history

```
GET /api/upload/history
```

- Query parameters:
  - `limit`: Number of records to return (default: 50)
  - `page`: Page number (default: 1)
  - `status`: Filter by status (success, failed, processing)

#### Get specific history entry

```
GET /api/upload/history/:id
```

- URL parameter: `id` - The history record ID

### Download Endpoints

#### Download a single file

```
GET /api/upload/download/:id
```

- URL parameter: `id` - The history record ID

#### Download multiple files as ZIP

```
POST /api/upload/download-multiple
```

- Request body: `{ "fileIds": ["id1", "id2", ...] }`

## Example Excel File Format

Your Excel file should have the following columns:

- name (required)
- age
- email
- phone_number
- salary
- joining_date
- department

## Project Structure

### Backend

```
backend/
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
└── package.json        # Project dependencies
```

### Frontend

```
frontend/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   │   ├── common/     # Common components
│   │   ├── forms/      # Form components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components from shadcn
│   ├── lib/            # Utility functions and hooks
│   │   ├── api/        # API services
│   │   ├── hooks/      # Custom React hooks
│   │   └── utils/      # Utility functions
│   ├── store/          # Redux store
│   │   ├── slices/     # Redux slices
│   │   └── index.ts    # Store configuration
│   └── providers.tsx   # Provider components
├── .env.local          # Environment variables
└── package.json        # Project dependencies
```

## Error Handling

The application includes comprehensive error handling for:

- File upload errors
- Excel parsing errors
- Data validation errors
- Database errors
- Network and API errors
- Download failures

## User Workflow

1. **Upload Files**:

   - Navigate to the Upload page
   - Drag and drop Excel files or click to select
   - Click "Upload Files" button
   - View upload progress and status notifications

2. **View History**:

   - Navigate to the History page
   - See a list of all uploaded files with details
   - Check status, size, and processing results

3. **Download Files**:
   - On the History page, click the "Download" button for a single file
   - Or select multiple files using checkboxes and click "Download Selected"
   - Files are downloaded in their original format or as a ZIP archive

## Troubleshooting

### Backend Issues

- Check MySQL connection and credentials
- Ensure the uploads directory is writable
- Verify the port is not in use by another application

### Frontend Issues

- Ensure the API URL is correctly set in .env.local
- Check browser console for JavaScript errors
- Verify that the backend server is running
