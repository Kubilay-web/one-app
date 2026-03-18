"use client";
import { Card, CardContent } from "../../../components/ui/card";
import React from "react";
import SubjectsByClassListing from "../SubjectsByClassListing";
import SubjectForm from "../forms/academics/subject-form";
import { DepartmentBrief, Subject } from "../../../types/types";
import { EmptyState } from "../../../components/empty-state";
import { BookOpen } from "lucide-react";

export default function SubjectListing({
  departments,
  subjects,
  schoolId
}: {
  departments: DepartmentBrief[];
  subjects: Subject[];
  schoolId:string
}) {
  return (
    <Card className="border-blue-100 border-t-4 border-t-blue-600">
      <CardContent className="">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg border-b border-blue-50 font-semibold">
              {subjects.length} Subjects
            </h3>
            <SubjectForm
              departments={departments.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
              schoolId={schoolId} 
            />
          </div>

          {subjects && subjects.length > 0 ? (
            <SubjectsByClassListing subjects={subjects} />
          ) : (
            <div className=" flex items-center justify-center">
              <EmptyState
                icon={BookOpen}
                title="No subjects yet"
                description="Create your first subject to get started "
                className="min-h-[300px] h-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
