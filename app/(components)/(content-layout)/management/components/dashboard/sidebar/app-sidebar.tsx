import React from "react";
import {
  BarChart2,
  BookOpen,
  Building,
  Bus,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Key,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  UserCog,
  Users,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "../../../components/ui/sidebar";
import Logo from "../../../components/logo";

import UserMenu from "./user-menu";
import { getServerSchool } from "../../../actions/auth";

export default async function AppSidebar() {
  const school = await getServerSchool();
  const sidebarLinks = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Logs",
          url: "/dashboard/logs",
        },
      ],
    },
    {
      title: "Student Management",
      url: "/students",
      icon: Users,
      items: [
        {
          title: "All Students",
          url: "/dashboard/students",
        },
        {
          title: "Fees",
          url: "/dashboard/students/fees",
        },
        {
          title: "Student Ids",
          url: "/dashboard/students/ids",
        },
      ],
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: Users,
      items: [
        {
          title: "Attendance",
          url: "/dashboard/attendance",
        },
        {
          title: "View Class Attendances",
          url: "/dashboard/attendance/by-class",
        },
        {
          title: "View Student Attendances",
          url: "/dashboard/attendance/student",
        },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Parents",
          url: "/dashboard/users/parents",
        },
        {
          title: "Teachers",
          url: "/dashboard/users/teachers",
        },
        {
          title: "Staff Members",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Academics",
      url: "/dashboard/academics",
      icon: GraduationCap,
      items: [
        {
          title: "Terms",
          url: "/dashboard/academics/terms",
        },
        {
          title: "Classes and streams",
          url: "/dashboard/academics/classes",
        },
        {
          title: "Subjects",
          url: "/dashboard/academics/subjects",
        },
        {
          title: "Departments",
          url: "/dashboard/academics/departments",
        },
        {
          title: "Timetable",
          url: "/academics/timetable",
        },
        {
          title: "Examinations",
          url: "/dashboard/academics/exams",
        },
        {
          title: "Assignments",
          url: "/academics/assignments",
        },
        {
          title: "Report Cards",
          url: "/dashboard/academics/reports",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "/staff",
      icon: UserCog,
      items: [
        {
          title: "Staff Directory",
          url: "/staff/directory",
        },
        {
          title: "Attendance",
          url: "/staff/attendance",
        },
        {
          title: "Leave Management",
          url: "/staff/leave",
        },
        {
          title: "Performance",
          url: "/staff/performance",
        },
      ],
    },
    {
      title: "Communication",
      url: "/communication",
      icon: MessageSquare,
      items: [
        {
          title: "Reminders",
          url: "/dashboard/communication/reminders",
        },
        {
          title: "Announcements",
          url: "/communication/announcements",
        },
        {
          title: "Notice Board",
          url: "/communication/notices",
        },
        {
          title: "Emergency Alerts",
          url: "/communication/alerts",
        },
        {
          title: "Website Messages",
          url: "/dashboard/communication/website-messages",
        },
      ],
    },
    {
      title: "Finance",
      url: "/finance",
      icon: DollarSign,
      items: [
        {
          title: "Fee Management",
          url: "/dashboard/finance/fees",
        },
        {
          title: "Payments",
          url: "/dashboard/finance/payments",
        },
        {
          title: "Scholarships",
          url: "/finance/scholarships",
        },
        {
          title: "Reports",
          url: "/finance/reports",
        },
      ],
    },
    {
      title: "Transport",
      url: "/transport",
      icon: Bus,
      items: [
        {
          title: "Routes",
          url: "/transport/routes",
        },
        {
          title: "Tracking",
          url: "/transport/tracking",
        },
        {
          title: "Drivers",
          url: "/transport/drivers",
        },
        {
          title: "Maintenance",
          url: "/transport/maintenance",
        },
      ],
    },
    {
      title: "Resources",
      url: "/resources",
      icon: BookOpen,
      items: [
        {
          title: "Library",
          url: "/resources/library",
        },
        {
          title: "Inventory",
          url: "/resources/inventory",
        },
        {
          title: "Facilities",
          url: "/resources/facilities",
        },
        {
          title: "Assets",
          url: "/resources/assets",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "/reports",
      icon: BarChart2,
      items: [
        {
          title: "Academic Reports",
          url: "/reports/academic",
        },
        {
          title: "Financial Reports",
          url: "/reports/financial",
        },
        {
          title: "Custom Reports",
          url: "/reports/custom",
        },
        {
          title: "Analytics Dashboard",
          url: "/reports/analytics",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "School Profile",
          url: "/settings/profile",
        },
        {
          title: "User Management",
          url: "/settings/users",
        },
        {
          title: "System Settings",
          url: "/settings/system",
        },
        {
          title: "Backup & Security",
          url: "/settings/security",
        },
      ],
    },
    {
      title: "Admin Only",
      url: "/dashboard/admin",
      icon: Key,
      items: [
        {
          title: "Contacts",
          url: "/dashboard/admin/contacts",
        },
      ],
    },
    {
      title: "Website",
      url: "/sch/school-site",
      icon: Building,
      items: [
        {
          title: "Live Website",
          url: `/sch/${school?.slug ?? ""}`,
        },
        {
          title: "Customize Website",
          url: `/sch/${school?.slug ?? ""}/customize`,
        },
      ],
    },
  ];
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo href="/dashboard" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarLinks.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
