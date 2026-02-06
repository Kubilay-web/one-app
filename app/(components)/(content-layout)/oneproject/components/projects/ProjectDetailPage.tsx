"use client";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import parse from "html-react-parser";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

// import emptyFolder from "../../public/empty-folder.png";


import emptyFolder from "../../../../../../public/oneproject/empty-folder.png"
import {
  CalendarDays,
  ChevronLeft,
  DollarSign,
  Edit,
  Eye,
  MessageSquare,
  Pen,
  Plus,
  Trash,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { ProjectData } from "../../types/types";
import Image from "next/image";
import TextArea from "../FormInputs/TextAreaInput";
import DescriptionForm from "../Forms/DescriptionForm";
import NotesForm from "../Forms/NotesForm";
import ProjectBanner from "./ProjectBanner";
import AuthenticatedAvatar from "../global/AuthenticatedAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { ModeToggle } from "../mode-toggle";
import PaymentForm from "../Forms/PaymentForm";
import Link from "next/link";
import BudgetProgressBar from "./BudgetProgressBar";
import CommentForm from "../Forms/CommentForm";
import { getInitials } from "../../lib/generateInitials";
import ModuleForm from "../Forms/ModuleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { deleteModule } from "../../actions/modules";
import toast from "react-hot-toast";
import InviteClient from "../DataTableColumns/InviteClient";
import LogoutBtn from "../global/LogoutBtn";
import InviteMembers from "./InviteMembers";
import { ExistingUser } from "../../actions/users";
import DomainCard from "./DomainCard";
import PaymentDeleteButton from "./PaymentDeleteButton";
import useCurrencySettings from "../../hooks/useCurrencySettings";
import { formatCurrency } from "../../lib/formatCurrency";
import { useSession } from "@/app/SessionProvider";

type SafeUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl:string;
};

export default function ProjectDetailPage({
  projectData,
  existingUsers,
}: {
  projectData: ProjectData;
  existingUsers: ExistingUser[];
}) {
  const { defaultCurrency, exchangeRate } = useCurrencySettings();



  // const formatCurrency = (amount: number) => {
  //   const convertedAmount = amount * exchangeRate;
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: defaultCurrency,
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(convertedAmount);
  // };

  const session= useSession();
  const user=session.user;


  const role=user?.roleproject


  if (user?.id !== projectData.user.id) {
    role = "MEMBER";
  }
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const paidAmount = projectData.payments.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);
  const remainingAmount = projectData.budget
    ? projectData.budget - paidAmount
    : 0;

  function calculateDaysDifference(endDate: string | Date): number {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  function formatTimeDifference(days: number): string {
    const absDay = Math.abs(days);
    const years = Math.floor(absDay / 365);
    const remainingDays = absDay % 365;

    let result = "";
    if (years > 0) {
      result += `${years} year${years !== 1 ? "s" : ""}`;
      if (remainingDays > 0) {
        result += ` and ${remainingDays} day${remainingDays !== 1 ? "s" : ""}`;
      }
    } else {
      result = `${absDay} day${absDay !== 1 ? "s" : ""}`;
    }

    if (days > 0) {
      return `${result} remaining`;
    } else if (days < 0) {
      return `${result} past deadline`;
    } else {
      return "Deadline is today";
    }
  }
  const [daysDifference, setDaysDifference] = useState(0);
  useEffect(() => {
    // Calculate initial days difference
    if (projectData.endDate) {
      setDaysDifference(calculateDaysDifference(projectData.endDate));
    }

    // Set up an interval to update days difference every day
    const intervalId = setInterval(() => {
      if (projectData.endDate) {
        setDaysDifference(calculateDaysDifference(projectData.endDate));
      }
    }, 24 * 60 * 60 * 1000); // Update every 24 hours

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [projectData.endDate]);

  async function handleModuleDelete(id: string) {
    try {
      const res = await deleteModule(id);
      if (res.ok) {
        toast.success("Module Deleted");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      {/* Back to Projects Button */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/oneproject/dashboard/projects">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Projects
          </Link>
        </Button>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
          <ModeToggle />
          <AuthenticatedAvatar user={user} />
        </div>
      </div>

      {/* Project Banner */}
      <ProjectBanner
        editingId={projectData.id}
        name={projectData.name}
        bannerImage={projectData.bannerImage}
        bg={projectData.gradient}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Description */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Project Description</CardTitle>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="ghost"
                size="icon"
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <DescriptionForm
                  editingId={projectData.id}
                  initialDescription={projectData.description}
                />
              ) : (
                <p>{projectData.description || "No description available."}</p>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="modules" className="w-full">
            <TabsList>
              <TabsTrigger value="modules">Project Modules</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="modules">
              {/* Modules */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <h2>Project Modules</h2>
                      <ModuleForm
                        projectId={projectData.id}
                        userId={user?.id}
                        userName={user?.username}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {projectData.modules.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {projectData.modules.map((module) => (
                          <Card
                            key={module.id}
                            className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-indigo-50 to-cyan-50 group"
                          >
                            <CardHeader className="p-4">
                              <CardTitle className="text-sm flex items-center justify-between space-x-2">
                                {module.name}
                                <div className="flex items-center gap-3">
                                  <ModuleForm
                                    editingId={module.id}
                                    initialContent={module.name}
                                    projectId={projectData.id}
                                    userId={user?.id}
                                    userName={user?.username}
                                  />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash className="w-4 h-4 text-red-500" />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          <div className="flex items-center text-red-600">
                                            <TriangleAlert className="w-5 h-5 mr-2 font-bold" />
                                            Are you absolutely sure?
                                          </div>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete your Module.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                          <button
                                            onClick={() =>
                                              handleModuleDelete(module.id)
                                            }
                                          >
                                            Continue and Delete
                                          </button>
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Link
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    href={`/oneproject/project/modules/${module.id}?pId=${module.projectId}&&slug=${projectData.slug}`}
                                  >
                                    <Eye className="w-4 h-4 " />
                                  </Link>
                                </div>
                              </CardTitle>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="space-y-4">
                          {/* <h2>No Modules Yet</h2> */}
                          <Image
                            src={emptyFolder}
                            alt="No Modules"
                            className="w-36 h-auto"
                          />
                          <ModuleForm
                            projectId={projectData.id}
                            userId={user?.id}
                            userName={user?.username}
                          />
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              {/* Notes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Notes (Use / to start writing)</CardTitle>
                  <Button
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                    variant="ghost"
                    size="icon"
                  >
                    {isEditingNotes ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Edit className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose lg:prose-xl">
                    {isEditingNotes ? (
                      <NotesForm
                        isEditable={true}
                        editingId={projectData.id}
                        initialNotes={JSON.parse(
                          projectData.notes ??
                            '{"welcome": "Welcome to the Project, Please Add Here project Notes"}'
                        )}
                      />
                    ) : (
                      <>
                        {projectData.notes ? (
                          <NotesForm
                            isEditable={false}
                            editingId={projectData.id}
                            initialNotes={JSON.parse(projectData.notes)}
                          />
                        ) : (
                          <p>No notes available.</p>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments">
              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex  items-center justify-between">
                      <h2>Comments</h2>
                      <CommentForm
                        projectId={projectData.id}
                        userId={user?.id}
                        userName={user?.username}
                        userRole={user?.roleproject}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                {projectData.comments.length > 0 ? (
                  <CardContent className="space-y-4">
                    {projectData.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-4 group cursor-pointer"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(comment.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex ">
                            <p className="font-semibold">{comment.userName}</p>
                            <CommentForm
                              projectId={projectData.id}
                              userId={user?.id}
                              userName={user?.username}
                              userRole={user?.roleproject}
                              editingId={comment.id}
                              initialContent={comment.content}
                            />
                          </div>
                          <div className="prose ">{parse(comment.content)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                ) : (
                  <CardFooter>
                    <div className="flex flex-col gap-3 justify-center">
                      <p>No Comments Yet</p>
                      <CommentForm
                        projectId={projectData.id}
                        userId={user?.id}
                        userName={user?.username}
                        userRole={user?.roleproject}
                      />
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            <TabsContent value="payments">
              {/* Invoices and Payments */}
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center justify-between">
                        <h2>Invoices & Payments</h2>
                        {role === "USER" ||
                          (role === "ADMIN" && (
                            <PaymentForm
                              projectId={projectData.id}
                              userId={projectData.userId}
                              clientId={projectData.clientId}
                              remainingAmount={remainingAmount}
                            />
                          ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="payments">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="payments">Payments</TabsTrigger>
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                      </TabsList>
                      <TabsContent value="invoices" className="space-y-4">
                        {projectData.payments.length > 0 ? (
                          <>
                            {projectData.payments.map((invoice) => (
                              <div
                                key={invoice.id}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-semibold">
                                    #{invoice.invoiceNumber}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Due:{" "}
                                    {new Date(
                                      invoice.date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="">
                                  <h2>{invoice.title}</h2>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary">
                                    {/* ${invoice.amount.toLocaleString()} */}
                                    {formatCurrency(
                                      invoice.amount,
                                      defaultCurrency,
                                      exchangeRate
                                    )}
                                  </Badge>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link
                                      href={`/oneproject/project/invoice/${invoice.id}?project=${projectData.slug}`}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-sm">
                            <p>No Invoices Yet</p>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="payments" className="space-y-4">
                        {projectData.payments.length > 0 ? (
                          <>
                            {projectData.payments.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex justify-between items-center"
                              >
                                <span>
                                  {new Date(payment.date).toLocaleDateString()}
                                </span>
                                <p>{payment.title}</p>
                                <div className="flex items-center">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100"
                                  >
                                    {formatCurrency(
                                      payment.amount,
                                      defaultCurrency,
                                      exchangeRate
                                    )}
                                  </Badge>
                                  {/* Delete Button */}
                                  <PaymentDeleteButton paymentId={payment.id} />
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="text-sm">
                            <p>No Payments Yet</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    {/* <Progress value={70} className="w-full" /> */}
                    {projectData.budget && (
                      <BudgetProgressBar
                        budget={projectData.budget}
                        paidAmount={paidAmount}
                      />
                    )}
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Project Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                  <span className="font-semibold">Budget:</span>
                  <span className="ml-2">
                    {/* ${projectData.budget?.toLocaleString() || "N/A"} */}
                    {formatCurrency(
                      projectData?.budget ?? 0,
                      defaultCurrency,
                      exchangeRate
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                  <span className="font-semibold">Total Paid :</span>
                  <span className="ml-2">
                    {/* ${paidAmount?.toLocaleString() || "N/A"} */}
                    {formatCurrency(paidAmount, defaultCurrency, exchangeRate)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 border-b pb-3">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                  <span className="font-semibold">Timeline:</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Start:{" "}
                      {new Date(projectData.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      End:{" "}
                      {projectData.endDate
                        ? new Date(projectData.endDate).toLocaleDateString()
                        : "Ongoing"}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      daysDifference < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    Status:{" "}
                    {projectData.endDate
                      ? formatTimeDifference(daysDifference)
                      : "Ongoing"}
                  </div>
                </div>
              </div>
              {role === "USER" && (
                <div>
                  <div className="flex items-center mb-2">
                    <Users className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="font-semibold">Members:</span>
                  </div>
                  <div className="flex -space-x-2">
                    {projectData.members.length > 0 ? (
                      <>
                        {projectData.members.map((member, index) => (
                          <Avatar key={member.id}>
                            <AvatarFallback>
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </>
                    ) : (
                      <div className="">
                        <InviteMembers
                          allMembers={existingUsers.filter(
                            (member) => member.id !== user?.id
                          )}
                          projectData={projectData}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {role === "USER" || role === "ADMIN" ? "Client" : "User"}{" "}
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {role === "USER" || role === "ADMIN" ? (
                    <Avatar className="h-12 w-12">
                      {projectData.client.image ? (
                        <AvatarImage src={projectData.client.image} />
                      ) : (
                        <AvatarFallback>
                          {projectData.client.name
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ) : (
                    <Avatar className="h-12 w-12">
                      {user?.id ? (
                        <AvatarImage
                          src={projectData.user.avatarUrl ?? "/placeholder.svg"}
                        />
                      ) : (
                        <AvatarFallback>
                          {projectData.user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  {role === "USER" || role === "ADMIN" ? (
                    <div>
                      <p className="font-semibold">{projectData.client.name}</p>
                      <p className="text-sm text-gray-500">
                        {projectData.client.companyName || "Individual Client"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">{projectData.user?.username}</p>
                      <p className="text-sm text-gray-500">
                        {projectData.user.companyName || "Individual Client"}
                      </p>
                    </div>
                  )}
                </div>
                {role === "USER" ||
                  (role === "ADMIN" && <InviteClient row={projectData} />)}
              </div>

              {role == "USER" || role === "ADMIN" ? (
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {projectData.client.firstName} {projectData.client.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {projectData.client.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {projectData.client.phone}
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {projectData.user.firstName} {projectData.user.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {projectData.user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {projectData.user.phone}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <DomainCard projectData={projectData} />
        </div>
      </div>
    </div>
  );
}
