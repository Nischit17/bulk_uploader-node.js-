"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { FileUploadForm } from "@/components/forms/FileUploadForm";

/**
 * Upload page component
 * Provides the interface for uploading Excel files
 */
export default function UploadPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload Excel Files</h1>
          <p className="text-gray-600">
            Upload your Excel files for bulk processing. The system will
            validate and process the data.
          </p>
        </div>

        <FileUploadForm />

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Files must be in Excel format (.xls or .xlsx)</li>
            <li>Maximum file size is 10MB per file</li>
            <li>
              Make sure your Excel files follow the required template structure
            </li>
            <li>The system will validate the data and report any errors</li>
            <li>You can upload multiple files at once</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
