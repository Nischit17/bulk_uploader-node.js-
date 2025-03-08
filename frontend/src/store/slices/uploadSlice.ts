"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types for response data
interface UploadResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Define types for our state
interface UploadState {
  files: File[] | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  uploadProgress: number;
  uploadResults: UploadResult | null;
}

// Define the initial state
const initialState: UploadState = {
  files: null,
  isLoading: false,
  isSuccess: false,
  error: null,
  uploadProgress: 0,
  uploadResults: null,
};

/**
 * Async thunk to upload files to the backend
 */
export const uploadFiles = createAsyncThunk(
  "upload/files",
  async (files: File[], { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
      }

      // Adjust API URL based on your backend configuration
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              dispatch(setUploadProgress(percentCompleted));
            }
          },
        }
      );

      return response.data as UploadResult;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

// Create the upload slice
const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    resetUploadState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.uploadProgress = 0;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.uploadResults = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to upload files";
      });
  },
});

// Export actions and reducer
export const { setFiles, resetUploadState, setUploadProgress } =
  uploadSlice.actions;
export default uploadSlice.reducer;
