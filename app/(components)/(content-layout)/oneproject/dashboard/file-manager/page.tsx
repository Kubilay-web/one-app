import { validateRequest } from "@/app/auth";
import { getUserFolders } from "../../actions/fileManager";
import { getUserProjects,getDetailedUserProjects } from "../../actions/projects";
import FileManager from "../../components/dashboard/FileManger";
import ProjectPayments from "../../components/dashboard/ProjectPayments";



import React from "react";

export default async function page() {
  const {user} = await validateRequest();
  const userId = user?.id ?? "";
  const userFolders = (await getUserFolders(userId)) || [];
  return (
    <div>
      <FileManager userFolders={userFolders} userId={userId} />
    </div>
  );
}
