"use server";

import db from "@/app/lib/db";
import {
  CategoryProps,
  CommentProps,
  FileProps,
  FolderProps,
  ModuleProps,
  TaskProps,
  UserFolder,
} from "../types/types";


import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
export async function createFolder(data: FolderProps) {
  try {
    const newFolder = await db.folder.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/oneproject/dashboard/file-manager");
    return newFolder;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updateFolderById(id: string, data: FolderProps) {
  try {
    const updatedFolder = await db.folder.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/oneproject/dashboard/file-manager");
    return updatedFolder;
  } catch (error) {
    console.log(error);
  }
}
export async function updateFileById(id: string, data: FileProps) {
  try {
    const updatedFile = await db.file.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/oneproject/dashboard/file-manager");
    return updatedFile;
  } catch (error) {
    console.log(error);
  }
}
export async function createFile(data: FileProps) {
  try {
    const newFile = await db.file.create({
      data,
    });
    console.log(newFile);
    revalidatePath("/oneproject/dashboard/file-manager");
    return newFile;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function createMultipleFiles(files: FileProps[]) {
  try {
    const createdFiles = await Promise.all(
      files.map(async (file) => {
        return await createFile(file);
      })
    );

    // Filter out any failed file creations (if any)
    const successfulFiles = createdFiles.filter((file) => file !== null);

    console.log("Files successfully created:", successfulFiles);
    revalidatePath("/oneproject/dashboard/file-manager");
    return successfulFiles;
  } catch (error) {
    console.log("Error creating files:", error);
    return [];
  }
}
export async function getUserFolders(userId: string | undefined) {
  if (userId) {
    try {
      const folders = await db.folder.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        include: {
          files: true,
        },
      });

      return folders as UserFolder[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export async function deleteFolder(id: string) {
  try {
    const deletedFolder = await db.folder.delete({
      where: {
        id,
      },
    });
    revalidatePath("/oneproject/dashboard/file-manager");
    return {
      ok: true,
      data: deletedFolder,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      data: null,
    };
  }
}
export async function deleteFile(id: string) {
  try {
    const deletedFile = await db.file.delete({
      where: {
        id,
      },
    });
    revalidatePath("/oneproject/dashboard/file-manager");
    return {
      ok: true,
      data: deletedFile,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      data: null,
    };
  }
}
