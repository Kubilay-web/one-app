"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Exam } from "../../../types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

// Mock data for demonstration
const mockExams = [
  {
    id: 1,
    title: "End of Term 1 Examination 2024",
    type: "Regular",
    term: "1",
    startDate: "2024-04-15",
  },
  {
    id: 2,
    title: "Mid-Term Mathematics Test",
    type: "Mock",
    term: "2",
    startDate: "2024-05-20",
  },
  // Add more mock exams as needed
];
const formatExamType = (type: string) => {
  return type.charAt(0) + type.slice(1).toLowerCase();
};

const formatExamCategory = (category: string) => {
  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};
export default function ExamListing({ exams }: { exams: Exam[] }) {
  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit exam with id:", id);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    // setExams(exams.filter((exam) => exam.id !== id));
  };
  const handleView = (id: string) => {
    // Implement delete functionality
    // setExams(exams.filter((exam) => exam.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Exam Listing</h2>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Exam Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.title}</TableCell>
              <TableCell>{formatExamType(exam.examType)}</TableCell>
              <TableCell>{formatExamCategory(exam.examCategory)}</TableCell>
              <TableCell>Term {exam.termName}</TableCell>
              <TableCell>{exam.academicYear}</TableCell>
              <TableCell>
                {new Date(exam.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(exam.id)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Details</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(exam.id)}
                          className="hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Exam</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exam.id)}
                          className="hover:bg-gray-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Exam</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
