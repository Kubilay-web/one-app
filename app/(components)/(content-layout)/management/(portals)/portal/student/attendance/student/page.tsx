import { getServerSchool } from "../../../../../actions/auth";
import StudentView from "./components/student-view";
import { getAllBriefStudents, getAllStudents } from "../../../../../actions/students";

export default async function StudentViewPage() {
  const school = await getServerSchool();
  const students = (await getAllBriefStudents(school?.id ?? "")) || [];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Student Attendance View</h1>
      <p className="text-muted-foreground mb-6">
        View your attendance records for all subjects on a selected day.
      </p>
      <StudentView students={students} />
    </div>
  );
}
