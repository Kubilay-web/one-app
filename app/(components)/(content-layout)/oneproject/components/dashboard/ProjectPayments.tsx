"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { FileText } from "lucide-react";

// import { Payment, Project } from "../..prisma/client";


import { DetailedUserProjects, ProjectWithPayments } from "../../types/types";
import { useSearchParams } from "next/navigation";
import { cn } from "../../lib/utils";
import useCurrencySettings from "../../hooks/useCurrencySettings";
import { formatCurrency } from "../../lib/formatCurrency";

export default function ProjectPayments({
  userProjects,
}: {
  userProjects: DetailedUserProjects;
}) {
  const params = useSearchParams();
  const selectedProjectId = params.get("pId") ?? "";
  const selectedProject =
    userProjects.find((project) => project.id === selectedProjectId) ||
    userProjects[0];
  const { defaultCurrency, exchangeRate } = useCurrencySettings();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Project Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Select a project to view payments</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              {userProjects.map((project) => (
                <Link
                  href={`/dashboard/payments?pId=${project.id}`}
                  key={project.id}
                  className="block mb-4"
                >
                  {/* className={`hover:bg-accent transition-colors ${
                      
                    }`} */}
                  <Card
                    className={cn(
                      "hover:bg-accent transition-colors",
                      project.id === selectedProjectId
                        ? "bg-blue-50 ring-1 ring-blue-600 text-blue-800 hover:bg-blue-100"
                        : ""
                    )}
                  >
                    <CardContent className="p-4 flex items-center">
                      <div className="w-16 h-16 mr-4 relative overflow-hidden rounded-md">
                        <Image
                          src={project.thumbnail ?? "/placeholder.svg"}
                          alt={project.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold line-clamp-1">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {project.payments.length ?? 0} payments
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedProject?.name}</CardTitle>
            <CardDescription>
              {selectedProject
                ? "View payment details for the selected project"
                : "Click on a project to view its payments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProject ? (
              <ScrollArea className="h-[calc(100vh-250px)]">
                {selectedProject.payments.map((payment) => (
                  <div key={payment.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div className="hidden lg:block">
                        <p className="font-medium">9/22/2024</p>
                        <p className="text-sm text-muted-foreground">
                          Invoice: {payment.invoiceNumber}
                        </p>
                      </div>
                      <h2>{payment.title}</h2>
                      <div className="flex items-center">
                        <p className="font-medium mr-4">
                          {/* ${payment.amount.toLocaleString()} */}
                          {formatCurrency(
                            payment.amount,
                            defaultCurrency,
                            exchangeRate
                          )}
                        </p>
                        <Button size="sm" asChild>
                          <Link
                            href={`/project/invoice/${payment.id}?project=${selectedProject.slug}`}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="hidden lg:inline-block lg:mr-2">
                              View
                            </span>{" "}
                            Invoice
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-250px)]">
                <p className="text-muted-foreground">No project selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
