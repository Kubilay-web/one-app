"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { VideoConferencingPlatform, locationOptions } from "../../lib/types";
import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { PROTECTED_ROUTES } from "../../routes/common/routePaths";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkIntegrationQueryFn } from "../../lib/api";
import { toast } from "sonner";

const Loader = ({ size = "sm", color = "gray" }) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-t-transparent",
      size === "sm" && "w-4 h-4",
      size === "md" && "w-6 h-6",
      size === "lg" && "w-8 h-8",
      color === "gray" && "border-gray-400",
      color === "white" && "border-white"
    )}
  />
);

const NewEventDialog = (props: { btnVariant?: string }) => {
  const { btnVariant } = props;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateEventMutationFn,
  });

  const [selectedLocationType, setSelectedLocationType] =
    useState<VideoConferencingPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [appConnected, setAppConnected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const eventSchema = z.object({
    title: z.string().min(1, "Event name is required"),
    duration: z.number().min(1, "Duration is required"),
    description: z.string().optional(),
    locationType: z.enum([
      VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR,
      VideoConferencingPlatform.ZOOM_MEETING,
      VideoConferencingPlatform.MICROSOFT_TEAMS,
    ]),
  });

  type EventFormData = z.infer<typeof eventSchema>;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: { title: "", duration: 30, description: "" },
  });

  const { isValid } = form.formState;

  const handleLocationTypeChange = async (value: VideoConferencingPlatform) => {
    setSelectedLocationType(value);
    setAppConnected(false);
    if (value === VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR) {
      setIsChecking(true);
      try {
        const { isConnected } = await checkIntegrationQueryFn(
          VideoConferencingPlatform.GOOGLE_MEET_AND_CALENDAR
        );
        if (!isConnected) {
          setError(
            `Google Meet is not connected. <a href=${PROTECTED_ROUTES.INTEGRATIONS} target="_blank" class='underline text-primary'>Visit the integration page</a>`
          );
          return;
        }
        setError(null);
        setAppConnected(true);
        form.setValue("locationType", value);
        form.trigger("locationType");
      } catch {
        setError("Failed to check Google Meet integration status.");
      } finally {
        setIsChecking(false);
      }
    } else {
      setError(null);
      form.setValue("locationType", value);
    }
  };

  const onSubmit = (data: EventFormData) => {
    mutate(
      { ...data, description: data.description || "" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["event_list"] });
          setSelectedLocationType(null);
          setIsOpen(false);
          setAppConnected(false);
          form.reset();
          toast.success("Event created successfully");
        },
        onError: () => toast.error("Failed to create event"),
      }
    );
  };

  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition hover:bg-slate-100",
          btnVariant ? "bg-blue-600 text-white border-blue-600" : "border-slate-400 text-slate-900"
        )}
      >
        <PlusIcon className="w-4 h-4" />
        <span>New Event Type</span>
      </button>

      {/* Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Add a new event type</h2>
              <p className="text-sm text-slate-600">
                Create a new event type for people to book times with.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-base font-semibold">Event name</label>
                <input
                  type="text"
                  placeholder="Name your event"
                  {...form.register("title")}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-semibold">Description</label>
                <textarea
                  placeholder="Description"
                  {...form.register("description")}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-base font-semibold">Duration</label>
                <input
                  type="number"
                  {...form.register("duration", { valueAsNumber: true })}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                {form.formState.errors.duration && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.duration.message}
                  </p>
                )}
              </div>

              {/* Location Type */}
              <div>
                <label className="block text-base font-semibold">Location Type</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {locationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isChecking}
                      onClick={() => handleLocationTypeChange(option.value)}
                      className={cn(
                        "h-[70px] border rounded-md flex flex-col items-center justify-center text-sm px-2 py-1 transition",
                        "hover:bg-slate-50",
                        selectedLocationType === option.value && "border-blue-500 bg-blue-50",
                        !option.isAvailable &&
                          "pointer-events-none text-gray-400 opacity-60 grayscale",
                        selectedLocationType === option.value &&
                          !!error &&
                          "border-red-500 bg-red-50",
                        appConnected &&
                          selectedLocationType === option.value &&
                          "border-green-500 bg-green-50"
                      )}
                    >
                      {isChecking && selectedLocationType === option.value ? (
                        <Loader size="sm" />
                      ) : (
                        <>
                          <img src={option.logo as string} alt={option.label} width="20" height="20" />
                          <span className="mt-1">{option.label}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                {error && (
                  <p
                    className="text-sm text-red-500 mt-1"
                    dangerouslySetInnerHTML={{ __html: error }}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end border-t border-slate-200 pt-4 bg-slate-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? <Loader size="sm" color="white" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewEventDialog;

function CreateEventMutationFn(variables: void): Promise<unknown> {
  throw new Error("Function not implemented.");
}
