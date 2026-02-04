"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { generateSlug } from "../../lib/generateSlug";
import toast from "react-hot-toast";
import { PortfolioProfile, User as PrismaUser, User } from "@prisma/client";
import { CategoryProps, PortfolioProps, UserProps } from "../../types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
// import { createUser, updateUserById } from "@/actions/users";
import PasswordInput from "../FormInputs/PasswordInput";
import {
  Headset,
  Mail,
  User,
  Lock,
  Flag,
  MapPin,
  Pencil,
  Building,
  Headphones,
  LayoutGrid,
  Link,
  Linkedin,
  Twitter,
  Youtube,
  Github,
} from "lucide-react";
import {
  createPortfolioProfile,
  updatePortfolioById,
} from "../../actions/portfolio";


export type SelectOptionProps = {
  label: string;
  value: string;
};


type SafeUser = {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
};


type ClientFormProps = {
  editingId?: string | undefined;
  initialData?: PortfolioProfile | undefined | null;
  user: SafeUser | null;
  count: number;
};
export default function PortfolioForm({
  editingId,
  initialData,
  user,
  count,
}: ClientFormProps) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioProps>({
    defaultValues: {
      email: initialData?.email || user?.email,
      location: initialData?.location || "",
      description: initialData?.description || "",
      name: initialData?.name || user?.name,
      projectCount: initialData?.projectCount ?? count,
      bookingLink: initialData?.bookingLink || "",
      twitterUrl: initialData?.twitterUrl || "",
      youtubeUrl: initialData?.youtubeUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      githubUrl: initialData?.githubUrl || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const initialImage =
    initialData?.profileImage ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  async function onSubmit(data: PortfolioProps) {
    setLoading(true);
    data.profileImage = imageUrl;
    data.userId = user?.id;
    data.projectCount = Number(data.projectCount);
    try {
      if (editingId) {
        await updatePortfolioById(editingId, data);
        setLoading(false);

        toast.success("Updated Successfully!");
        reset();
      } else {
        const res = await createPortfolioProfile(data);
        setLoading(false);
        toast.success("Updated Successfully!");
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Email Address"
                    name="email"
                    icon={Mail}
                    placeholder=""
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Location"
                    name="location"
                    icon={Flag}
                    placeholder="eg Kampala Uganda"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Full Name"
                    name="name"
                    icon={User}
                    placeholder="John Doe"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Number of Projects"
                    name="projectCount"
                    type="number"
                    icon={LayoutGrid}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Google Calendar Booking Link"
                    name="bookingLink"
                    icon={Link}
                    placeholder=""
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Twitter"
                    name="twitterUrl"
                    icon={Twitter}
                    placeholder=""
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Linkedin Link"
                    name="linkedinUrl"
                    icon={Linkedin}
                    placeholder=""
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Instagram"
                    name="instagramUrl"
                    icon={LayoutGrid}
                    placeholder=""
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Youtube Link"
                    name="youtubeUrl"
                    icon={Youtube}
                    placeholder=""
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Github"
                    name="githubUrl"
                    icon={Github}
                    placeholder=""
                  />
                </div>

                <div className="space-y-4">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Write a summary Statement"
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
              title="Profile Image"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="profileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/brand-settings"
        editingId={editingId}
        loading={loading}
        title="Portfolio Profile"
        parent=""
      />
    </form>
  );
}
