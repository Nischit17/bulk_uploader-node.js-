# Bulk Upload Frontend

A modern, responsive frontend application for the Bulk Upload system. This application allows users to upload Excel files for processing, view upload history, and manage bulk data operations.

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: For state management
- **Shadcn UI**: Component library built on Tailwind CSS
- **Axios**: For API requests
- **Tailwind CSS**: For styling

## Features

- File upload with drag and drop support
- Upload progress tracking
- Upload history viewing
- Responsive design for all devices
- Error handling and validation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

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
└── README.md           # Project documentation
```

## API Integration

The frontend communicates with the backend API using Axios. The API base URL is configured in the `.env.local` file. API services are organized in the `src/lib/api` directory.

## State Management

Redux Toolkit is used for state management. The store is configured in `src/store/index.ts` and slices are organized in the `src/store/slices` directory.

## Styling

The application uses Tailwind CSS for styling with components from Shadcn UI. Custom styles can be added in the `src/app/globals.css` file.
