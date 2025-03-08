"use client";

import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  uploadFiles,
  setFiles,
  resetUploadState,
} from "@/store/slices/uploadSlice";
import { toast } from "sonner";

/**
 * Custom hook for file upload functionality
 * Provides an API to handle file uploads with progress tracking and error handling
 */
export function useFileUpload() {
  const dispatch = useAppDispatch();
  const { files, isLoading, isSuccess, error, uploadProgress, uploadResults } =
    useAppSelector((state) => state.upload);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  /**
   * Handle file selection from file input
   */
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (!newFiles?.length) return;

      const filesArray = Array.from(newFiles);
      setSelectedFiles(filesArray);
      dispatch(setFiles(filesArray));
    },
    [dispatch]
  );

  /**
   * Start file upload process
   */
  const startUpload = useCallback(async () => {
    if (!selectedFiles.length) {
      toast.error("Please select files to upload");
      return;
    }

    try {
      const result = await dispatch(uploadFiles(selectedFiles)).unwrap();
      if (result.success) {
        toast.success("Files uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload files");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during upload";
      toast.error(errorMessage);
    }
  }, [dispatch, selectedFiles]);

  /**
   * Reset upload state and clear selected files
   */
  const resetUpload = useCallback(() => {
    setSelectedFiles([]);
    dispatch(resetUploadState());
  }, [dispatch]);

  /**
   * Validates if a file is valid (can be extended with type, size checks, etc.)
   */
  const isValidFile = useCallback((file: File): boolean => {
    // Example validation - can be extended as needed
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (file.size > maxSize) {
      toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(`File ${file.name} is not an Excel file.`);
      return false;
    }

    return true;
  }, []);

  return {
    files,
    selectedFiles,
    isLoading,
    isSuccess,
    error,
    uploadProgress,
    uploadResults,
    handleFileSelect,
    startUpload,
    resetUpload,
    isValidFile,
  };
}
