// import { validateRequest } from "@/app/auth";
// import { SchoolUser } from "../../../../actions/auth";
// import { getBriefClasses } from "../../../../actions/classes";
// import { getExamsByAcademicYear } from "../../../../actions/exams";
// import { getAllPeriods } from "../../../../actions/periods";
// import { getBriefSubjects } from "../../../../actions/subjects";
// import ExamManager from "../../../../components/dashboard/exams/ExamManager";

// import React from "react";

// export default async function Page() {
//   const { user } = await validateRequest();
//   if (!user) return null;

//   const school = await SchoolUser(user.id);
//   const schoolId = school?.id ?? "";

//   // Tüm verileri paralel olarak çek
//   const [classesData, subjectsData, allTermsData, examsData] = await Promise.all([
//     getBriefClasses(schoolId),
//     getBriefSubjects(schoolId),
//     getAllPeriods(schoolId),
//     getExamsByAcademicYear(schoolId, new Date().getFullYear().toString())
//   ]);

//   // Her bir veriyi normalize et - data propertysi varsa onu al, yoksa direkt kendisini kullan
//   const classes = classesData?.data || classesData || [];
//   const subjects = subjectsData?.data || subjectsData || [];
//   const allTerms = allTermsData?.data || allTermsData || [];
//   const exams = examsData?.data || examsData || [];


//   const currentYear = new Date().getFullYear();
//   const terms = allTerms.filter((item) => item?.year === currentYear);

//   return (
//     <div className="p-8">
//       <ExamManager
//         exams={exams}
//         terms={terms}
//         subjects={subjects}
//         classes={classes}
//         schoolId={schoolId}
//       />
//     </div>
//   );
// }














import { validateRequest } from "@/app/auth";
import { SchoolUser } from "../../../../actions/auth";
import { getBriefClasses } from "../../../../actions/classes";
import { getExamsByAcademicYear } from "../../../../actions/exams";
import { getAllPeriods } from "../../../../actions/periods";
import { getBriefSubjects } from "../../../../actions/subjects";
import ExamManager from "../../../../components/dashboard/exams/ExamManager";
import React from "react";

export default async function Page() {
  // 1️⃣ Kullanıcı doğrulama (Server-side)
  const { user } = await validateRequest();
  if (!user) return null;

  // 2️⃣ School fetch (Server-side)
  const school = await SchoolUser(user.id);
  const schoolId = school?.id ?? "";

  // 3️⃣ Tüm verileri paralel fetch et
  const [classesData, subjectsData, allTermsData, examsData] = await Promise.all([
    getBriefClasses(schoolId),
    getBriefSubjects(schoolId),
    getAllPeriods(schoolId),
    getExamsByAcademicYear(schoolId, new Date().getFullYear().toString()),
  ]);

  // 4️⃣ Data normalize et ve fallback ekle
  const classes = classesData?.data || classesData || [];
  const subjects = subjectsData?.data || subjectsData || [];
  const allTerms = allTermsData?.data || allTermsData || [];
  const exams = examsData?.data || examsData || [];

  // 5️⃣ Sadece bu yılın dönemlerini filtrele
  const currentYear = new Date().getFullYear();
  const terms = allTerms.filter((item) => item?.year === currentYear);

  // 6️⃣ Render
  return (
    <div className="p-2">
      <ExamManager
        exams={exams}
        terms={terms}
        subjects={subjects}
        classes={classes}
        schoolId={schoolId}
      />
    </div>
  );
}