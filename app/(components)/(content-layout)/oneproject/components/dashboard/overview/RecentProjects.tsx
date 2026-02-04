"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Project } from "@prisma/client";
import Link from "next/link";

export default function RecentProjects({
  recentProjects,
}: {
  recentProjects: Project[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>The are your Recent Projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>

              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProjects.map((project, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className=" table-cell">
                    <Image
                      alt="Project Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={project.thumbnail ?? "/placeholder.svg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>

                  <TableCell>
                    <Button variant={"outline"} size={"sm"}>
                      <Link href={`/oneproject/project/${project.slug}`}>
                        {" "}
                        View details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
