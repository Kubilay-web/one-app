"use server";

import db from "@/app/lib/db";
import {
  CategoryProps,
  CommentProps,
  ModuleProps,
  PortfolioProps,
  TaskProps,
} from "../types/types";


import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
export async function createPortfolioProfile(data: PortfolioProps) {
  try {
    const newPortfolio = await db.portfolioProfile.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/oneproject/portfolio");
    return newPortfolio;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updatePortfolioById(id: string, data: PortfolioProps) {
  try {
    const updatedPo = await db.portfolioProfile.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/oneproject/portfolio");
    return updatedPo;
  } catch (error) {
    console.log(error);
  }
}
export async function getPortfolioByUserId(userId: string) {
  try {
    const data = await db.portfolioProfile.findUnique({
      where: {
        userId,
      },
    });
    revalidatePath("/oneproject/portfolio");
    return data;
  } catch (error) {
    console.log(error);
  }
}
