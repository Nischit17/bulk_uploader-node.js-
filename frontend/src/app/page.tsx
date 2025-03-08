"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExcelTemplateInfo } from "@/components/common/ExcelTemplateInfo";

/**
 * Home page component
 * Serves as the landing page for the application
 */
export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Bulk Upload Application
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            A powerful tool for uploading and processing Excel files in bulk
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload Excel files for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload your Excel files for bulk processing. The system supports
                .xls and .xlsx formats and can handle multiple files at once.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/upload" className="w-full">
                <Button className="w-full">Go to Upload</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View History</CardTitle>
              <CardDescription>Check your upload history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View your upload history, including file details, processing
                status, and any errors that occurred during processing. You can
                also download individual files or select multiple files for
                batch download.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/history" className="w-full">
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Excel Template Structure */}
        <div className="w-full mb-12">
          <ExcelTemplateInfo />
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Upload Files</h3>
              <p className="text-gray-600 text-center">
                Select or drag and drop your Excel files to the upload area
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Processing</h3>
              <p className="text-gray-600 text-center">
                The system processes your files and validates the data
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Results</h3>
              <p className="text-gray-600 text-center">
                View the processing results and any errors that occurred
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
