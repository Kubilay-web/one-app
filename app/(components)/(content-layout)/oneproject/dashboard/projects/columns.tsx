"use client";




import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import DateColumn from "../../components/DataTableColumns/DateColumn";
import ImageColumn from "../../components/DataTableColumns/ImageColumn";
import SortableColumn from "../../components/DataTableColumns/SortableColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "../../components/DataTableColumns/ActionColumn";
import { Project } from "@prisma/client";
import Link from "next/link";
import ProjectDeadline from "../../components/DataTableColumns/ProjectDeadline";
import PublicityBtn from "../../components/DataTableColumns/PublicityBtn";
import DisplayCurrency from "../../components/DataTableColumns/DisplayCurrency";




// export interface Row extends TanStackRow<Project> {
//   original: Project;
//   getIsSelected: () => boolean;
//   toggleSelected: (value: boolean) => void;
// }
// interface Project {
//   id: string;
//   thumbnail: string;
//   name: string;
//   budget: number | null;
//   deadline: Date;
//   startDate: Date;
//   slug: string;
//   // Add any other properties that your Project model has
// }
export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnail",
    header: "Project Image",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="thumbnail" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableColumn column={column} title="Name" />,
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const project = row.original;
      return <DisplayCurrency project={project} />;
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline(days)",
    cell: ({ row }) => <ProjectDeadline row={row} />,
  },
  {
    accessorKey: "startDate",
    header: "Project Start Date",
    cell: ({ row }) => <DateColumn row={row} accessorKey="startDate" />,
  },
  {
    accessorKey: "isPublic",
    header: "Portfolio",
    cell: ({ row }) => {
      const project = row.original;
      return <PublicityBtn id={project.id} status={project.isPublic} />;
    },
  },
  {
    accessorKey: "startDate",
    header: "View",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Button size={"sm"} asChild>
          <Link href={`/oneproject/project/${project.slug}`}>View</Link>
        </Button>
      );
    },
  },

  // {
  //   accessorKey: "createdAt",
  //   header: "Date Created",
  //   cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <ActionColumn
          row={row}
          model="project"
          editEndpoint={`/oneproject/dashboard/projects/update/${project.id}`}
          id={project.id}
        />
      );
    },
  },
];
