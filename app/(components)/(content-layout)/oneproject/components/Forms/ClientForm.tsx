"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User as PrismaUser } from "@prisma/client";

import { Card, CardContent } from "../../components/ui/card";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import ImageInput from "../FormInputs/ImageInput";

import { createUser, updateUserById } from "../../actions/users";
import { UserProps } from "../../types/types";

import {
  Headset,
  Mail,
  User,
  Lock,
  Flag,
  MapPin,
  Pencil,
  Building,
} from "lucide-react";

type ClientFormProps = {
  editingId?: string;
  userId?: string;
  initialData?: PrismaUser | null;
};



export default function ClientForm({
  editingId,
  initialData,
  userId,
}: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  const initialImage =
    initialData?.image ||
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d";

  const [imageUrl, setImageUrl] = useState(initialImage);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      username: initialData?.username,
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      country: initialData?.country || "",
      location: initialData?.location || "",
      companyName: initialData?.companyName || "",
      companyDescription: initialData?.companyDescription || "",
    },
  });

  async function onSubmit(data: UserProps) {
    setLoading(true);

    const payload: UserProps = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      image: imageUrl,
      roleproject: "CLIENT",
      userId,
    };

    try {
      if (editingId) {
        await updateUserById(editingId, payload);
        toast.success("Updated successfully");
      } else {
        const res = await createUser(payload);

        if (res?.status === 409) {
          setEmailErr(res.error);
          return;
        }

        toast.success("Client created successfully");
      }

      reset();
      router.push("/oneproject/dashboard/clients");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader
        href="/clients"
        title="Client"
        editingId={editingId}
        loading={loading}
        parent=""
      />

      <div className="grid grid-cols-12 gap-6 py-8">
        {/* LEFT */}
        <div className="lg:col-span-8 col-span-full">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="First Name"
                  name="firstName"
                  placeholder="First name"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Last Name"
                  name="lastName"
                  placeholder="Last name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Username"
                  name="username"
                  placeholder="Enter a username"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                />
                {emailErr && (
                  <p className="text-xs text-red-500 mt-1">{emailErr}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Phone"
                  name="phone"
                  placeholder="+1 555 123 4567"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Country"
                  name="country"
                  placeholder="USA"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Location"
                  name="location"
                  placeholder="New York"
                />
                {!editingId && (
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Password"
                    name="password"
                    placeholder="••••••••"
                  />
                )}
              </div>

              <div className="space-y-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Company Name"
                  name="companyName"
                  placeholder="Space Corp"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Company Description"
                  name="companyDescription"
                  placeholder="Leading space exploration company"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 col-span-full">
          <ImageInput
            title="Client Profile Image"
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
        </div>
      </div>

      <FormFooter
        href="/clients"
        title="Client"
        editingId={editingId}
        loading={loading}
        parent=""
      />
    </form>
  );
}