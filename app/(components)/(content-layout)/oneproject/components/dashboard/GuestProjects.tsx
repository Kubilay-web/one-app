"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { GuestProject } from "@prisma/client";

export default function GuestProjects({
  projects,
  isOwner = false,
}: {
  projects: GuestProject[];
  isOwner?: boolean;
}) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{isOwner ? "Members" : "Guest Projects"}</CardTitle>
          <CardDescription>
            {isOwner
              ? "These are Members You have  Invited to Collaborate with"
              : "These are Projects You have been Invited to Collaborate"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Details</TableHead>
              <TableHead className="text-right">Project Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const link = project.projectLink.split("=")[1];
              console.log(link);
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.projectName}</div>
                    {isOwner ? (
                      <div className="text-sm text-muted-foreground">
                        Member : {project.guestName}
                      </div>
                    ) : (
                      <div className=" text-sm text-muted-foreground ">
                        From : {project.projectOwner}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button asChild size="sm" className="ml-auto gap-1">
                      <Link href={link}>
                        View Project
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
