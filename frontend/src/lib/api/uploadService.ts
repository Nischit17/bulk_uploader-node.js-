"use client";

import { apiClient } from "./config";

/**
 * Response interface for upload operations
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileInfo?: {
      originalName: string;
      size: number;
      mimetype: string;
    }[];
    rowsProcessed?: number;
    errorCount?: number;
  };
  errors?: string[];
}

/**
 * Upload history entry interface
 */
export interface UploadHistoryEntry {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  status: "success" | "failed" | "processing";
  rowsProcessed?: number;
  errorCount?: number;
}

// Define pagination interface
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Service for handling file upload operations
 */
export const uploadService = {
  /**
   * Upload files to the server
   * @param files - The files to upload
   * @param onProgress - Optional callback for upload progress
   * @returns Promise with the upload response
   */
  uploadFiles: async (
    files: File[],
    onProgress?: (percentage: number) => void
  ): Promise<UploadResponse> => {
    try {
      const formData = new FormData();

      // Append each file to the form data
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.post<UploadResponse>(
        "/api/upload/multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  },

  /**
   * Get upload history
   * @returns Promise with the upload history
   */
  getUploadHistory: async (): Promise<{
    success: boolean;
    history: UploadHistoryEntry[];
    pagination?: Pagination;
  }> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        history: UploadHistoryEntry[];
        pagination?: Pagination;
      }>("/api/upload/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching upload history:", error);
      throw error;
    }
  },

  /**
   * Download a single file by ID
   * @param id - The ID of the file to download
   */
  downloadFile: async (id: string): Promise<void> => {
    try {
      // Use fetch API with blob response type
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/download/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download file");
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Get filename from content-disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "download.xlsx";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  /**
   * Download multiple files as a ZIP archive
   * @param ids - Array of file IDs to download
   */
  downloadMultipleFiles: async (ids: string[]): Promise<void> => {
    try {
      // Use fetch API with blob response type
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/download-multiple`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileIds: ids }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download files");
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Get filename from content-disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "bulk-download.zip";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
      throw error;
    }
  },
};
