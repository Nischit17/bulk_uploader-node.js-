"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

/**
 * Component to display Excel template structure information
 * Provides details about the required Excel format and allows downloading a template
 */
export function ExcelTemplateInfo() {
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample data structure for Excel template
  const templateStructure = [
    {
      column: "name",
      required: true,
      type: "string",
      description: "Full name of the person",
    },
    {
      column: "age",
      required: false,
      type: "number",
      description: "Age in years",
    },
    {
      column: "email",
      required: false,
      type: "string",
      description: "Email address",
    },
    {
      column: "phone_number",
      required: false,
      type: "string",
      description: "Contact number",
    },
    {
      column: "salary",
      required: false,
      type: "decimal",
      description: "Salary amount",
    },
    {
      column: "joining_date",
      required: false,
      type: "date",
      description: "Date of joining (YYYY-MM-DD)",
    },
    {
      column: "department",
      required: false,
      type: "string",
      description: "Department name",
    },
  ];

  // Generate and download Excel template
  const handleDownloadTemplate = () => {
    setIsGenerating(true);

    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();

      // Create headers and sample data
      const headers = templateStructure.map((item) => item.column);

      // Sample data row
      const sampleData = [
        "John Doe",
        30,
        "john.doe@example.com",
        "123-456-7890",
        50000,
        "2023-01-15",
        "Engineering",
      ];

      // Create worksheet with headers and sample data
      const wsData = [headers, sampleData];
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Generate Excel file
      XLSX.writeFile(workbook, "excel_upload_template.xlsx");
    } catch (error) {
      console.error("Error generating template:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Excel Template Structure</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download Template
          </Button>
        </CardTitle>
        <CardDescription>
          Make sure your Excel files follow this required structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templateStructure.map((item) => (
              <TableRow key={item.column}>
                <TableCell className="font-medium">{item.column}</TableCell>
                <TableCell>
                  {item.required ? (
                    <span className="text-red-500 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium mb-1">Important Notes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              The <span className="font-semibold">name</span> column is required
              for all rows
            </li>
            <li>Date format should follow YYYY-MM-DD (e.g., 2023-12-31)</li>
            <li>Excel files can be in .xls or .xlsx format</li>
            <li>Maximum file size is 10MB per file</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
