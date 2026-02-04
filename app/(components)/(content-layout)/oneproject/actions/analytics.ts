"use server";

import db from "@/app/lib/db";
import {
  DollarSign,
  LayoutGrid,
  LucideProps,
  Users,
  Users2,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
export type AnalyticsProps = {
  title: string;
  total: number;
  href: string;
  icon: any;
  isCurrency?: boolean;
};
export async function getDashboardOverview(userId: string | undefined) {
  if (userId) {
    try {
      const projects = await db.project.findMany({
        where: {
          userId,
        },
      });
      const clientLength = await db.user.count({
        where: {
          userId,
          roleproject: "CLIENT",
        },
      });
      const subscriberLength = await db.subscriber.count();
      const totalRevenue =
        projects && projects.length > 0
          ? projects.reduce((acc, item) => {
              return acc + (item.budget || 0);
            }, 0)
          : 0;
      const analytics = [
        {
          title: "Projects",
          total: projects.length,
          href: "/oneproject/dashboard/projects",
          icon: LayoutGrid,
        },
        {
          title: "Total Revenue",
          total: totalRevenue,
          href: "/oneproject/dashboard/projects",
          icon: DollarSign,
          isCurrency: true,
        },
        {
          title: "Clients",
          total: clientLength,
          href: "/oneproject/dashboard/clients",
          icon: Users,
        },
        {
          title: "Subscribers",
          total: subscriberLength,
          href: "/oneproject/dashboard/subscribers",
          icon: Users2,
        },
      ];

      return analytics;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
