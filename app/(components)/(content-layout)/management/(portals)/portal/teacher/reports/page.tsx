import { getServerSchool } from "../../../../actions/auth";
import { getBriefClasses } from "../../../../actions/classes";
import { getAllPeriods } from "../../../../actions/communications";
import { getExamsByAcademicYear } from "../../../../actions/exams";
import ReportCardsListing from "../../../../components/dashboard/academics/report-card-listing";
import React from "react";

export default async function page() {
  const school = await getServerSchool();
  const classes = (await getBriefClasses(school?.id ?? "")) || [];

  const allTerms = (await getAllPeriods(school?.id ?? "")) || [];
  const currentYear = new Date().getFullYear();
  const terms = allTerms.filter((item) => item.year === currentYear);

  const exams =
    (await getExamsByAcademicYear(school?.id ?? "", currentYear.toString())) ||
    [];
  return (
    <div className="p-8">
      <ReportCardsListing exams={exams} terms={terms} classes={classes} />
    </div>
  );
}
