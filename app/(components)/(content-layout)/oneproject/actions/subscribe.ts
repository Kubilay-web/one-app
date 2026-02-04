"use server";

import { SubscriberProps } from "../components/Forms/SubscribeForm";

import { isEmailBlacklisted } from "../lib/isEmailBlackListed";
import db from "@/app/lib/db";
import { revalidatePath } from "next/cache";
export async function createSubscription(data: SubscriberProps) {
  const { userId, email } = data;
  if (userId) {
    if (isEmailBlacklisted(email)) {
      return {
        error: `Please use a valid, non-temporary email address.`,
        status: 409,
        data: null,
      };
    }
    const existingSub = await db.subscriber.findFirst({
      where: {
        email,
      },
    });
    if (existingSub) {
      return {
        error: `You have already Subscribed`,
        status: 409,
        data: null,
      };
    }
    try {
      const subscriber = await db.subscriber.create({
        data,
      });
      console.log(subscriber);
      revalidatePath("/oneproject/dashboard/subscribers");
      return {
        error: null,
        status: 200,
        data: subscriber,
      };
    } catch (error) {
      console.log(error);
      return {
        error: `Something Went wrong`,
        status: 500,
        data: null,
      };
    }
  }
}

export async function getUserSubscribers(userId: string) {
  try {
    const data = await db.subscriber.findMany({
      where: {
        userId,
      },
    });
    revalidatePath("/oneproject/dashboard/subscribers");
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const deletedSub = await db.subscriber.delete({
      where: {
        id,
      },
    });
    revalidatePath("/oneproject/dashboard/subscribers");
    return {
      ok: true,
      data: deletedSub,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      data: null,
    };
  }
}
