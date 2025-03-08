"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  uploadService,
  UploadHistoryEntry,
  Pagination,
} from "@/lib/api/uploadService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, PackageCheck } from "lucide-react";

/**
 * History page component
 * Displays the upload history with file details and status
 */
export default function HistoryPage() {
  const [history, setHistory] = useState<UploadHistoryEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await uploadService.getUploadHistory();

        if (response.success) {
          setHistory(response.history);
          if (response.pagination) {
            setPagination(response.pagination);
          }
          setError(null);
        } else {
          setError("Failed to load history data");
          toast.error("Failed to load history data");
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load upload history. Please try again later.");
        toast.error("Failed to load upload history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  // Handle single file download
  const handleDownload = async (id: string) => {
    try {
      toast.info("Starting download...");
      await uploadService.downloadFile(id);
      toast.success("Download initiated");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file");
    }
  };

  // Handle multiple file selection
  const handleSelectFile = (id: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fileId) => fileId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle multiple file download
  const handleMultipleDownload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("No files selected for download");
      return;
    }

    setIsDownloading(true);
    try {
      toast.info(`Starting download of ${selectedFiles.length} files...`);
      await uploadService.downloadMultipleFiles(selectedFiles);
      toast.success("Download initiated");
      // Clear selection after successful download
      setSelectedFiles([]);
    } catch (err) {
      console.error("Multiple download error:", err);
      toast.error("Failed to download files");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload History</h1>
          <p className="text-gray-600">
            View your file upload history and processing results
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Uploads</CardTitle>
            {selectedFiles.length > 0 && (
              <Button
                onClick={handleMultipleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <PackageCheck size={16} />
                Download Selected ({selectedFiles.length})
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : history.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No upload history found. Start by uploading some files.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">Select</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rows Processed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(entry.id)}
                          onChange={() => handleSelectFile(entry.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.fileName}
                      </TableCell>
                      <TableCell>{formatDate(entry.uploadDate)}</TableCell>
                      <TableCell>{formatFileSize(entry.fileSize)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entry.status === "success"
                              ? "bg-green-100 text-green-800"
                              : entry.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {entry.status.charAt(0).toUpperCase() +
                            entry.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{entry.rowsProcessed || "N/A"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(entry.id)}
                          disabled={entry.status !== "success"}
                          className="flex items-center gap-1"
                        >
                          <Download size={14} />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination info */}
            {pagination && history.length > 0 && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <div>
                  Showing {history.length} of {pagination.total} entries
                </div>
                <div>
                  Page {pagination.page} of {pagination.totalPages}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
