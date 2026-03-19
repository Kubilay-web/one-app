import { validateRequest } from "@/app/auth";
import { getServerSchool, SchoolUser } from "../../../../actions/auth";
import { getBriefClasses } from "../../../../actions/classes";
import { getExamsByAcademicYear } from "../../../../actions/exams";
import { getAllPeriods } from "../../../../actions/periods";
import { getBriefSubjects } from "../../../../actions/subjects";
import ExamManager from "../../../../components/dashboard/exams/ExamManager";
import React from "react";

export default async function page() {
 
  const { user } = await validateRequest();

  if (!user) return null;

  const school = await SchoolUser(user.id);


  const classes = (await getBriefClasses(school?.id ?? "")) || [];
  const subjects = (await getBriefSubjects(school?.id ?? "")) || [];

  const allTerms = (await getAllPeriods(school?.id ?? "")) || [];
  const currentYear = new Date().getFullYear();
  const terms = allTerms.filter((item) => item.year === currentYear);
  const exams =
    (await getExamsByAcademicYear(school?.id ?? "", currentYear.toString())) ||
    [];
  // console.log(exams);
  return (
    <div className="p-8">
      <ExamManager
        exams={exams}
        terms={terms}
        subjects={subjects}
        classes={classes}
        schoolId={school.id}
      />
    </div>
  );
}
