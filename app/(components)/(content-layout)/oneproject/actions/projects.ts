"use server";

import db from "@/app/lib/db";
import {
  CategoryProps,
  ProjectData,
  ProjectProps,
  ProjectWithPayments,
} from "../types/types";


import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectProps) {
  const slug = data.slug;
  try {
    const existingProject = await db.project.findUnique({
      where: {
        slug,
      },
    });
    if (existingProject) {
      return {
        status: 409,
        error: `Project Name ( ${data.name})  Already exists`,
        data: null,
      };
    }
    const newProject = await db.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        clientId: data.clientId,
        userId: data.userId,
        deadline: data.deadline,
        endDate: data.endDate,
        budget: data.budget,
        budgetLocal: data.budgetLocal,
      },
    });
    console.log(newProject);
    revalidatePath("/oneproject/dashboard/projects");
    return {
      status: 200,
      error: null,
      data: newProject,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserProjects(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        include: {
          payments: true,
        },
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserProjectsCount(userId: string | undefined) {
  if (userId) {
    try {
      const count = await db.project.count({
        where: {
          userId,
        },
      });
      return count;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserGuestProjects(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          gustId: userId,
        },
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserMembers(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ownerId: userId,
        },
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getDetailedUserProjects(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          payments: true,
        },
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserRecentProjects(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        take: 3,
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserPublicFeaturedProjects(
  userId: string | undefined
) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
          isPublic: true,
        },
        include: {
          user: true,
        },
        take: 4,
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserPublicOtherProjects(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
          isPublic: true,
        },
        include: {
          user: true,
        },
        skip: 4,
      });

      return projects;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function updateProjectById(id: string, data: ProjectProps) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data,
    });
    console.log(updatedProject);
    revalidatePath("/oneproject/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectById(id: string) {
  try {
    const project = await db.project.findUnique({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectDetailsBySlug(
  slug: string
): Promise<ProjectData | null> {
  try {
    const project = await db.project.findUnique({
      where: {
        slug,
      },
      include: {
        modules: true,
        comments: true,
        members: true,
        invoices: true,
        payments: true,
        user: true,
      },
    });

    if (!project) {
      return null;
    }

    const client = await db.user.findFirst({
      where: {
        id: project.clientId,
        roleproject: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        image: true,
        country: true,
        location: true,
        plain: true,
        companyName: true,
        companyDescription: true,
      },
    });

    if (!client) {
      throw new Error("Client not found");
    }
    return {
      ...project,
      client,
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
}
export async function deleteProject(id: string) {
  try {
    const deletedProject = await db.project.delete({
      where: {
        id,
      },
    });
    revalidatePath("/oneproject/dashboard/projects");
    return {
      ok: true,
      data: deletedProject,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateProjectPublicity(id: string, isPublic: boolean) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        isPublic,
      },
    });
    revalidatePath("/oneproject/dashboard/projects");
    return {
      data: updatedProject,
      ok: true,
    };
  } catch (error) {
    return {
      data: null,
      ok: false,
    };
    console.log(error);
  }
}
