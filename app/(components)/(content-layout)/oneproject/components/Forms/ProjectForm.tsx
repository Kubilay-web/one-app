"use client";

import { Card, CardContent } from "../../components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";


import { generateSlug } from "../../lib/generateSlug";
import toast from "react-hot-toast";
import { Project, User } from "@prisma/client";
import { ProjectProps } from "../../types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";

import FormSelectInput from "../FormInputs/FormSelectInput";
import { createProject,updateProjectById } from "../../actions/projects";
import { convertDateToIso } from "../../lib/convertDateToIso";
import { convertIsoToDateString } from "../../lib/convertISODateToNorma";
import useCurrencySettings from "../../hooks/useCurrencySettings";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ProjectFormProps = {
  editingId?: string | undefined;
  initialData?: Project | undefined | null;
  userId: string;
  clients: SelectOptionProps[];
};
export default function ProjectForm({
  editingId,
  initialData,
  userId,
  clients,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      name: initialData?.name,
      description: initialData?.description || "",
      budgetLocal: initialData?.budgetLocal || 0,
      startDate: initialData
        ? convertIsoToDateString(initialData?.startDate)
        : null,
      endDate: initialData
        ? convertIsoToDateString(initialData?.endDate ?? "")
        : null,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.thumbnail || "/thumbnail.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const initialClientId = initialData?.clientId;
  const initialClient = clients.find((user) => user.value === initialClientId);
  const [selectedClient, setSelectedClient] = useState<any>(initialClient);
  async function saveProject(data: ProjectProps) {
    try {
      setLoading(true);
      const myStartDate = new Date(data.startDate);
      const myEndDate = new Date(data.endDate);
      const differenceInTime = myEndDate.getTime() - myStartDate.getTime();
      const deadlineInDays = differenceInTime / (1000 * 60 * 60 * 24);
      data.deadline = Math.round(deadlineInDays);
      data.slug = generateSlug(data.name);
      data.thumbnail = imageUrl;
      data.userId = userId;
      data.clientId = selectedClient.value;
      data.startDate = convertDateToIso(data.startDate);
      data.endDate = convertDateToIso(data.endDate);
      const localBudget = Number(data.budgetLocal);
      const convertedBudget = (localBudget / exchangeRate).toFixed(2);
      data.budget = Number(convertedBudget);
      data.budgetLocal = Number(data.budgetLocal);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);

        toast.success("Updated Successfully!");

        reset();

        router.push("/dashboard/projects");
        setImageUrl("/placeholder.svg");
      } else {
        const res = await createProject(data);
        if (res?.status === 409) {
          toast.error(res.error);
        } else if (res?.status === 200) {
          setLoading(false);

          toast.success("Successfully Created!");

          reset();
          setImageUrl("/thumbnail.png");

          router.push("/dashboard/projects");
        } else {
          toast.error("Something went wrong");
        }
      }
      console.log(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  const { localCurrency, exchangeRate } = useCurrencySettings();
  return (
    <form className="" onSubmit={handleSubmit(saveProject)}>
      <FormHeader
        href="/projects"
        parent=""
        title="Project"
        editingId={editingId}
        loading={loading}
      />
      <p className="text-sm text-red-500 font-semibold text-center py-1 mt-2">
        Note : 1 USD = {exchangeRate} {localCurrency}
      </p>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-12  gap-4 pt-4">
                  <div className="lg:col-span-8 col-span-full">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Project Name"
                      name="name"
                    />
                  </div>
                  <div className="col-span-full lg:col-span-4">
                    <TextInput
                      register={register}
                      errors={errors}
                      label={`Project Budget (in ${localCurrency})`}
                      name="budgetLocal"
                      type="number"
                      placeholder="10000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    type="date"
                    label="Project Start Date"
                    name="startDate"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    type="date"
                    label="Project End Date"
                    name="endDate"
                  />
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Project Budget"
                    name="budget"
                    placeholder="8000"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Project Deadline"
                    name="deadline"
                    placeholder="eg 8 weeks"
                  />
                </div> */}
                <div className="grid gap-3">
                  <FormSelectInput
                    label="Clients"
                    options={clients}
                    option={selectedClient}
                    setOption={setSelectedClient}
                    toolTipText="Add New Client"
                    href="/dashboard/clients/new"
                  />
                </div>
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Project Description"
                    name="description"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="Project Thumbnail"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              // endpoint="projectThumbnail"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/projects"
        editingId={editingId}
        loading={loading}
        title="Project"
        parent=""
      />
    </form>
  );
}
