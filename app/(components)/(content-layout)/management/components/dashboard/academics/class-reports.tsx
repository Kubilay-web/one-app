"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { ChevronLeft, ChevronRight, FileDown, Printer } from "lucide-react";
import useSchoolStore from "../../../store/school";
import { generateClassTeacherComment } from "../../../lib/generateClassTeacherComment";

// Define types for our data structures
type Subject = {
  name: string;
  beginningTerm: number;
  midTerm: number;
  endTerm: number;
  grade: string;
  comment: string;
};

type Student = {
  name: string;
  admissionNumber: string;
  class: string;
  stream: string;
  subjects: Subject[];
  teacherComment: string;
};

export type ClassData = {
  className: string;
  term: string;
  year: string;
  teacher: string;
  students: Student[];
};

// Props type for StudentReportCard component
interface StudentReportCardProps {
  student: Student;
  term: string;
  year: string;
}

export default function ClassReports({
  classData,
}: {
  classData: ClassData;
}): JSX.Element {
  // Sample class data with multiple students
  // const classData: ClassData = {
  //   className: "Form 4 Science",
  //   term: "First Term",
  //   year: "2024/2025",
  //   teacher: "Ms. Jane Smith",
  //   students: [
  //     {
  //       name: "John Smith",
  //       admissionNumber: "ADM/2021/0042",
  //       class: "Form 4",
  //       stream: "Science",
  //       subjects: [
  //         {
  //           name: "Mathematics",
  //           beginningTerm: 78,
  //           midTerm: 82,
  //           endTerm: 85,
  //           grade: "A",
  //           comment: "Excellent performance",
  //         },
  //         {
  //           name: "English Language",
  //           beginningTerm: 75,
  //           midTerm: 70,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Good progress",
  //         },
  //         {
  //           name: "Physics",
  //           beginningTerm: 68,
  //           midTerm: 72,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Consistent improvement",
  //         },
  //         {
  //           name: "Chemistry",
  //           beginningTerm: 70,
  //           midTerm: 75,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Strong analytical skills",
  //         },
  //         {
  //           name: "Biology",
  //           beginningTerm: 65,
  //           midTerm: 70,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Good understanding of concepts",
  //         },
  //         {
  //           name: "History",
  //           beginningTerm: 72,
  //           midTerm: 68,
  //           endTerm: 74,
  //           grade: "B",
  //           comment: "Good research skills",
  //         },
  //         {
  //           name: "Geography",
  //           beginningTerm: 70,
  //           midTerm: 75,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Excellent map work",
  //         },
  //         {
  //           name: "Computer Studies",
  //           beginningTerm: 85,
  //           midTerm: 88,
  //           endTerm: 90,
  //           grade: "A+",
  //           comment: "Outstanding performance",
  //         },
  //         {
  //           name: "Business Studies",
  //           beginningTerm: 68,
  //           midTerm: 72,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Good analytical thinking",
  //         },
  //         {
  //           name: "Physical Education",
  //           beginningTerm: 80,
  //           midTerm: 82,
  //           endTerm: 85,
  //           grade: "A",
  //           comment: "Excellent teamwork",
  //         },
  //         {
  //           name: "Art & Design",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Creative and innovative",
  //         },
  //         {
  //           name: "Music",
  //           beginningTerm: 70,
  //           midTerm: 72,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Good progress",
  //         },
  //       ],
  //       teacherComment:
  //         "John has shown remarkable progress this term. He demonstrates strong analytical skills and contributes positively to class discussions. He should continue to work on time management to further improve his performance.",
  //     },
  //     {
  //       name: "Sarah Johnson",
  //       admissionNumber: "ADM/2021/0043",
  //       class: "Form 4",
  //       stream: "Science",
  //       subjects: [
  //         {
  //           name: "Mathematics",
  //           beginningTerm: 85,
  //           midTerm: 88,
  //           endTerm: 90,
  //           grade: "A+",
  //           comment: "Outstanding performance",
  //         },
  //         {
  //           name: "English Language",
  //           beginningTerm: 82,
  //           midTerm: 85,
  //           endTerm: 88,
  //           grade: "A",
  //           comment: "Excellent writing skills",
  //         },
  //         {
  //           name: "Physics",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 82,
  //           grade: "A-",
  //           comment: "Good problem-solving skills",
  //         },
  //         {
  //           name: "Chemistry",
  //           beginningTerm: 78,
  //           midTerm: 80,
  //           endTerm: 85,
  //           grade: "A",
  //           comment: "Excellent lab work",
  //         },
  //         {
  //           name: "Biology",
  //           beginningTerm: 80,
  //           midTerm: 82,
  //           endTerm: 85,
  //           grade: "A",
  //           comment: "Strong understanding of concepts",
  //         },
  //         {
  //           name: "History",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Excellent research skills",
  //         },
  //         {
  //           name: "Geography",
  //           beginningTerm: 78,
  //           midTerm: 80,
  //           endTerm: 82,
  //           grade: "A-",
  //           comment: "Good analytical thinking",
  //         },
  //         {
  //           name: "Computer Studies",
  //           beginningTerm: 90,
  //           midTerm: 92,
  //           endTerm: 95,
  //           grade: "A+",
  //           comment: "Exceptional programming skills",
  //         },
  //         {
  //           name: "Business Studies",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Good business acumen",
  //         },
  //         {
  //           name: "Physical Education",
  //           beginningTerm: 85,
  //           midTerm: 88,
  //           endTerm: 90,
  //           grade: "A+",
  //           comment: "Excellent sportsmanship",
  //         },
  //         {
  //           name: "Art & Design",
  //           beginningTerm: 70,
  //           midTerm: 75,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Creative thinking",
  //         },
  //         {
  //           name: "Music",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Good musical skills",
  //         },
  //       ],
  //       teacherComment:
  //         "Sarah is an exceptional student who consistently demonstrates a strong work ethic and dedication to her studies. She actively participates in class discussions and helps her peers. She should continue to challenge herself with more complex problems.",
  //     },
  //     {
  //       name: "Michael Chen",
  //       admissionNumber: "ADM/2021/0044",
  //       class: "Form 4",
  //       stream: "Science",
  //       subjects: [
  //         {
  //           name: "Mathematics",
  //           beginningTerm: 90,
  //           midTerm: 92,
  //           endTerm: 95,
  //           grade: "A+",
  //           comment: "Exceptional mathematical skills",
  //         },
  //         {
  //           name: "English Language",
  //           beginningTerm: 70,
  //           midTerm: 75,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Good improvement in writing",
  //         },
  //         {
  //           name: "Physics",
  //           beginningTerm: 85,
  //           midTerm: 88,
  //           endTerm: 90,
  //           grade: "A+",
  //           comment: "Excellent understanding of concepts",
  //         },
  //         {
  //           name: "Chemistry",
  //           beginningTerm: 82,
  //           midTerm: 85,
  //           endTerm: 88,
  //           grade: "A",
  //           comment: "Strong analytical skills",
  //         },
  //         {
  //           name: "Biology",
  //           beginningTerm: 75,
  //           midTerm: 78,
  //           endTerm: 80,
  //           grade: "A-",
  //           comment: "Good practical skills",
  //         },
  //         {
  //           name: "History",
  //           beginningTerm: 68,
  //           midTerm: 72,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Improving research skills",
  //         },
  //         {
  //           name: "Geography",
  //           beginningTerm: 70,
  //           midTerm: 75,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Good map work",
  //         },
  //         {
  //           name: "Computer Studies",
  //           beginningTerm: 95,
  //           midTerm: 96,
  //           endTerm: 98,
  //           grade: "A+",
  //           comment: "Outstanding programming skills",
  //         },
  //         {
  //           name: "Business Studies",
  //           beginningTerm: 72,
  //           midTerm: 75,
  //           endTerm: 78,
  //           grade: "B+",
  //           comment: "Good analytical thinking",
  //         },
  //         {
  //           name: "Physical Education",
  //           beginningTerm: 78,
  //           midTerm: 80,
  //           endTerm: 82,
  //           grade: "A-",
  //           comment: "Good teamwork",
  //         },
  //         {
  //           name: "Art & Design",
  //           beginningTerm: 65,
  //           midTerm: 68,
  //           endTerm: 72,
  //           grade: "B",
  //           comment: "Improving creativity",
  //         },
  //         {
  //           name: "Music",
  //           beginningTerm: 68,
  //           midTerm: 70,
  //           endTerm: 75,
  //           grade: "B",
  //           comment: "Good progress",
  //         },
  //       ],
  //       teacherComment:
  //         "Michael excels in STEM subjects and shows exceptional talent in computer studies and mathematics. He should work on improving his performance in humanities subjects by dedicating more time to reading and research. Overall, he has great potential for further academic growth.",
  //     },
  //   ],
  // };

  // State to track current student index
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);

  const currentStudent: Student = classData.students[currentStudentIndex];

  // Navigation functions
  const goToNextStudent = (): void => {
    if (currentStudentIndex < classData.students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
      // Scroll to top when changing students
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStudent = (): void => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
      // Scroll to top when changing students
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Placeholder function for PDF export
  const exportAllReportsToPDF = (): void => {
    alert("Exporting all reports to PDF...");
    // In a real implementation, this would generate PDFs for all students
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with title and export button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">
            Class Report Cards
          </h1>
          <p className="text-lg text-muted-foreground">
            {classData.className} - {classData.term} {classData.year}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-blue-300"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            <span>Print Current</span>
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700"
            onClick={exportAllReportsToPDF}
          >
            <FileDown className="h-4 w-4" />
            <span>Export All as PDF</span>
          </Button>
        </div>
      </div>

      {/* Student navigation indicator */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={goToPreviousStudent}
          disabled={currentStudentIndex === 0}
          className="text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Student
        </Button>
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Student {currentStudentIndex + 1} of {classData.students.length}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={goToNextStudent}
          disabled={currentStudentIndex === classData.students.length - 1}
          className="text-blue-800"
        >
          Next Student
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Current student's report card */}
      <StudentReportCard
        student={currentStudent}
        term={classData.term}
        year={classData.year}
      />

      {/* Bottom navigation buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <Button
          variant="outline"
          onClick={goToPreviousStudent}
          disabled={currentStudentIndex === 0}
          className="border-blue-300"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Student
        </Button>
        <Button
          onClick={goToNextStudent}
          disabled={currentStudentIndex === classData.students.length - 1}
          className="bg-blue-800 hover:bg-blue-700"
        >
          Next Student
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Type for grade points mapping
type GradePoints = {
  [key: string]: number;
};

// Component to display a single student's report card
export function StudentReportCard({
  student,
  term,
  year,
}: StudentReportCardProps): JSX.Element {
  // Calculate totals
  const { school } = useSchoolStore();
  const totalBeginningTerm: number = student.subjects.reduce(
    (sum, subject) => sum + subject.beginningTerm,
    0
  );
  const totalMidTerm: number = student.subjects.reduce(
    (sum, subject) => sum + subject.midTerm,
    0
  );
  const totalEndTerm: number = student.subjects.reduce(
    (sum, subject) => sum + subject.endTerm,
    0
  );
  const totalMarks: number = totalBeginningTerm + totalMidTerm + totalEndTerm;
  let numberOfEXams = 0;
  if (totalBeginningTerm > 0) {
    numberOfEXams++;
  }
  if (totalMidTerm > 0) {
    numberOfEXams++;
  }
  if (totalEndTerm > 0) {
    numberOfEXams++;
  }
  const averageMark: number = Math.round(
    totalMarks / (student.subjects.length * numberOfEXams)
  );

  // Calculate aggregates (sum of grade points, assuming A+=1, A=2, etc.)
  const gradePoints: GradePoints = {
    "A+": 1,
    A: 2,
    "A-": 3,
    "B+": 4,
    B: 5,
    "B-": 6,
    "C+": 7,
    C: 8,
    "C-": 9,
    "D+": 10,
    D: 11,
    E: 12,
  };
  const totalAggregates: number = student.subjects.reduce(
    (sum, subject) => sum + (gradePoints[subject.grade] || 0),
    0
  );

  return (
    <Card className="max-w-5xl mx-auto border-2 border-blue-300 shadow-lg bg-white rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b-2 border-blue-300 p-6 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {/* <img
                  src={school?.logo ?? ""}
                  alt="School Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                /> */}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-blue-800 ">
                  {school?.name.toUpperCase()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  123 Education Avenue, Academic Heights
                </p>
                <p className="text-sm text-muted-foreground">
                  Tel: +123 456 7890 | Email: info../../..excellenceacademy.edu
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-blue-800">
                STUDENT REPORT CARD
              </h2>
              <p className="text-sm text-muted-foreground">
                {term} - {year}
              </p>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b pb-4">
            <div>
              <p>
                <span className="font-semibold">Student Name:</span>{" "}
                {student.name}
              </p>
              <p>
                <span className="font-semibold">Admission Number:</span>{" "}
                {student.admissionNumber}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Class:</span> {student.class}
              </p>
              <p>
                <span className="font-semibold">Stream:</span> {student.stream}
              </p>
            </div>
          </div>

          {/* Academic Results Table */}
          <div className="overflow-hidden rounded-lg border border-blue-200 mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-900">
                  <th className="p-3 text-left text-white font-semibold border-r border-blue-700">
                    Subject
                  </th>
                  <th className="p-3 text-center text-white font-semibold border-r border-blue-700">
                    Beginning Term
                  </th>
                  <th className="p-3 text-center text-white font-semibold border-r border-blue-700">
                    Mid Term
                  </th>
                  <th className="p-3 text-center text-white font-semibold border-r border-blue-700">
                    End Term
                  </th>
                  <th className="p-3 text-center text-white font-semibold border-r border-blue-700">
                    Average
                  </th>
                  <th className="p-3 text-center text-white font-semibold border-r border-blue-700">
                    Grade
                  </th>
                  <th className="p-3 text-left text-white font-semibold">
                    Teacher's Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((subject, index) => {
                  const average: number = Math.round(
                    (subject.beginningTerm +
                      subject.midTerm +
                      subject.endTerm) /
                      numberOfEXams
                  );
                  return (
                    <tr key={index} className="border-b border-blue-100">
                      <td className="p-3 font-medium border-r">
                        {subject.name}
                      </td>
                      <td className="p-3 text-center border-r">
                        {subject.beginningTerm}
                      </td>
                      <td className="p-3 text-center border-r">
                        {subject.midTerm}
                      </td>
                      <td className="p-3 text-center border-r">
                        {subject.endTerm}
                      </td>
                      <td className="p-3 text-center font-medium border-r">
                        {average}
                      </td>
                      <td className="p-3 text-center font-bold border-r">
                        {subject.grade}
                      </td>
                      <td className="p-3 text-sm line">{subject.comment}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="border rounded-lg p-3 bg-white border-blue-300 shadow-sm">
                <p className="text-sm font-semibold text-blue-800">
                  Total Marks
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {totalMarks} / {student.subjects.length * 3 * 100}
                </p>
              </div>
              <div className="border rounded-lg p-3 bg-white border-blue-300 shadow-sm">
                <p className="text-sm font-semibold text-blue-800">
                  Average Mark
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {averageMark}%
                </p>
              </div>
              <div className="border rounded-lg p-3 bg-white border-blue-300 shadow-sm">
                <p className="text-sm font-semibold text-blue-800">
                  Total Aggregates
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {totalAggregates}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher's Comment */}
          <div className="mt-6 border-t pt-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-blue-800">
                Class Teacher's Comment:
              </h3>
              <div className="border rounded-lg p-3 min-h-[80px] border-blue-300 bg-white">
                <p>{generateClassTeacherComment(averageMark, student.name)}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-blue-200 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="font-semibold text-blue-800">
                  Next Term Begins:{" "}
                  <span className="font-normal text-blue-900">
                    September 5, 2025
                  </span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="border-b-2 border-blue-800 w-[200px] mb-1"></div>
                <p className="text-center text-blue-800">
                  Principal's Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
