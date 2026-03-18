// "use server";

// import { ContactProps } from "../components/frontend/contact-us";
// import {
//   Contact,
//   MarkSheetResponse,
//   MarkSheetStudent,
//   Parent,
//   Student,
// } from "../types/types";
// import { ParentProps } from "../components/dashboard/forms/users/parent-form";
// import { StudentProps } from "../components/dashboard/forms/students/student-form";
// import { revalidatePath } from "next/cache";
// import { StudentByClassProps } from "../components/dashboard/StudentListingByClass";
// import { GuardianFormData } from "../components/dashboard/forms/students/GuadianForm";
// import { MarkSheetCreateProps } from "../components/dashboard/exams/MarkSheetForm";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// // CREATE STUDENT
// export async function createStudent(data: StudentProps) {
//   try {
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//       cache: "no-store",
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to create student");
//     }

//     revalidatePath("/dashboard/students");
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // CREATE GUARDIAN
// export async function createGuardian(data: GuardianFormData) {
//   try {
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to create Guardian");
//     }

//     revalidatePath("/dashboard/students");
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // UPDATE GUARDIAN
// export async function updatedGuardian(id: string, data: GuardianFormData) {
//   try {
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to update Guardian");
//     }

//     revalidatePath("/dashboard/students");
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // DELETE STUDENT
// export async function deleteStudent(id: string) {
//   try {
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students}`, {
//       method: "DELETE",
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to delete student");
//     }

//     revalidatePath("/dashboard/students");
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // GET ALL STUDENTS
// export async function getAllStudents(schoolId: string) {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/schoolmanage/students`,
//       { cache: "no-store" }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch students");
//     }

//     return result as Student[];
//   } catch (error) {
//     console.error(error);
//   }
// }

// // GET BRIEF STUDENTS
// export async function getAllBriefStudents(schoolId: string) {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/schoolmanage/students`,
//       { cache: "no-store" }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch students");
//     }

//     return result as {
//       id: string;
//       name: string;
//       regNo: string;
//     }[];
//   } catch (error) {
//     console.error(error);
//   }
// }

// // GET STUDENTS BY CLASS


// // GET STUDENTS BY CLASS
// export async function getStudentsByClass(data: StudentByClassProps) {
//   try {
//     console.log("Fetching students with data:", data);
    
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         type: 'by-class',  // Bu önemli!
//         ...data
//       }),
//       cache: "no-store"
//     });

//     const result = await response.json();
//     console.log("API Response:", result);

//     if (!response.ok) {
//       throw new Error(result?.error || "Failed to fetch students");
//     }

//     revalidatePath("/dashboard/students");
//     return result.data as Student[];
//   } catch (error) {
//     console.error("Error in getStudentsByClass:", error);
//     return [];
//   }
// }

// // GET NEXT STUDENT SEQUENCE
// export async function getStudentNextSequence(schoolId: string) {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/schoolmanage/students`
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch sequence");
//     }

//     return result as number;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // GET STUDENT BY ID
// export async function getStudentById(studentId: string) {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/schoolmanage/students}`,
//       { cache: "no-store" }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch student");
//     }

//     return result as Student;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// // GET STUDENT BY USER ID
// export async function getStudentByUserId(studentUserId: string) {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/api/schoolmanage/students`,
//       { cache: "no-store" }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch student");
//     }

//     return result as Student;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// // GET BRIEF STUDENTS FOR MARKSHEET
// export async function getBriefStudentsByClassId(data: MarkSheetCreateProps) {
//   try {
//     const response = await fetch(`${BASE_URL}/api/schoolmanage/students`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result?.message || "Failed to fetch students");
//     }

//     return result as MarkSheetResponse;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }



"use server";

import { ContactProps } from "../components/frontend/contact-us";
import {
  Contact,
  MarkSheetResponse,
  MarkSheetStudent,
  Parent,
  Student,
} from "../types/types";
import { ParentProps } from "../components/dashboard/forms/users/parent-form";
import { StudentProps } from "../components/dashboard/forms/students/student-form";
import { revalidatePath } from "next/cache";
import { StudentByClassProps } from "../components/dashboard/StudentListingByClass";
import { GuardianFormData } from "../components/dashboard/forms/students/GuadianForm";
import { MarkSheetCreateProps } from "../components/dashboard/exams/MarkSheetForm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Helper fetcher fonksiyonu
async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    console.error("API Error:", result);
    return { data: null, error: result?.error || result?.message || "Request failed" };
  }

  return result;
}

// CREATE STUDENT
export async function createStudent(data: StudentProps) {
  try {
    const result = await fetcher<Student>(`${BASE_URL}/api/schoolmanage/students`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.error) {
      throw new Error(result.error);
    }

    revalidatePath("/dashboard/students");
    return result.data;
  } catch (error: any) {
    console.error("Create student error:", error);
    throw new Error(error.message || "Failed to create student");
  }
}

// CREATE GUARDIAN
export async function createGuardian(data: GuardianFormData) {
  try {
    const result = await fetcher<any>(`${BASE_URL}/api/schoolmanage/students`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.error) {
      throw new Error(result.error);
    }

    revalidatePath("/dashboard/students");
    return result.data;
  } catch (error: any) {
    console.error("Create guardian error:", error);
    throw new Error(error.message || "Failed to create guardian");
  }
}

// UPDATE GUARDIAN
export async function updatedGuardian(id: string, data: GuardianFormData) {
  try {
    const result = await fetcher<any>(`${BASE_URL}/api/schoolmanage/students?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (result.error) {
      throw new Error(result.error);
    }

    revalidatePath("/dashboard/students");
    return result.data;
  } catch (error: any) {
    console.error("Update guardian error:", error);
    throw new Error(error.message || "Failed to update guardian");
  }
}

// DELETE STUDENT
export async function deleteStudent(id: string) {
  try {
    const result = await fetcher<{ message: string }>(`${BASE_URL}/api/schoolmanage/students?id=${id}`, {
      method: "DELETE",
    });

    if (result.error) {
      throw new Error(result.error);
    }

    revalidatePath("/dashboard/students");
    return result.data;
  } catch (error: any) {
    console.error("Delete student error:", error);
    throw new Error(error.message || "Failed to delete student");
  }
}

// GET ALL STUDENTS
export async function getAllStudents(schoolId: string) {
  try {
    const result = await fetcher<Student[]>(`${BASE_URL}/api/schoolmanage/students?schoolId=${schoolId}`);

    if (result.error) {
      console.error("Get all students error:", result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Get all students error:", error);
    return [];
  }
}

// GET BRIEF STUDENTS
export async function getAllBriefStudents(schoolId: string) {
  try {
    const result = await fetcher<{ id: string; name: string; regNo: string; }[]>(
      `${BASE_URL}/api/schoolmanage/students?schoolId=${schoolId}&brief=true`
    );

    console.log("getAllBriefStudents raw result:", result);

    if (result.error) {
      console.error("Get brief students error:", result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Get brief students error:", error);
    return [];
  }
}

// GET STUDENTS BY CLASS
export async function getStudentsByClass(data: StudentByClassProps) {
  try {
    console.log("Fetching students with data:", data);
    
    const result = await fetcher<Student[]>(`${BASE_URL}/api/schoolmanage/students?schoolId=${data.schoolId}&classId=${data.classId}&streamId=${data.streamId}`);

    console.log("getStudentsByClass result:", result);

    if (result.error) {
      console.error("Get students by class error:", result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Error in getStudentsByClass:", error);
    return [];
  }
}

// GET NEXT STUDENT SEQUENCE
export async function getStudentNextSequence(schoolId: string) {
  try {
    const result = await fetcher<{ sequence: number }>(
      `${BASE_URL}/api/schoolmanage/students/sequence?schoolId=${schoolId}`
    );

    if (result.error) {
      console.error("Get student sequence error:", result.error);
      return 1;
    }

    return result.data?.sequence || 1;
  } catch (error) {
    console.error("Get student sequence error:", error);
    return 1;
  }
}

// GET STUDENT BY ID
export async function getStudentById(studentId: string) {
  try {
    const result = await fetcher<Student>(`${BASE_URL}/api/schoolmanage/students?id=${studentId}`);

    if (result.error) {
      console.error("Get student by id error:", result.error);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error("Get student by id error:", error);
    return null;
  }
}

// GET STUDENT BY USER ID
export async function getStudentByUserId(studentUserId: string) {
  try {
    const result = await fetcher<Student>(`${BASE_URL}/api/schoolmanage/students?userId=${studentUserId}`);

    if (result.error) {
      console.error("Get student by user id error:", result.error);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error("Get student by user id error:", error);
    return null;
  }
}

// GET BRIEF STUDENTS FOR MARKSHEET
export async function getBriefStudentsByClassId(data: MarkSheetCreateProps) {
  try {
    const result = await fetcher<MarkSheetResponse>(
      `${BASE_URL}/api/schoolmanage/students/marksheet?classId=${data.classId}&subjectId=${data.subjectId}&examId=${data.examId}&termId=${data.termId}&schoolId=${data.schoolId}`
    );

    if (result.error) {
      console.error("Get brief students for marksheet error:", result.error);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error("Get brief students for marksheet error:", error);
    return null;
  }
}