import { z } from "zod";
import { addMinutes, parseISO } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { useState, Fragment } from "react";
import { CheckIcon, ExternalLink } from "lucide-react";
import { scheduleMeetingMutationFn } from "../../lib/api";
import { toast } from "sonner";
import { Loader } from "../../components/loader";
import { useBookingStore } from "../../hooks/useBookingStore";

interface BookingFormProps {
  eventId?: string;
  duration: number;
  userId?: string;
}

const BookingForm = ({ eventId, duration, userId }: BookingFormProps) => {
  const [meetLink, setMeetLink] = useState("");
  const { selectedDate, selectedSlot, isSuccess, handleSuccess } =
    useBookingStore();

  const { mutate, isPending } = useMutation({
    mutationFn: scheduleMeetingMutationFn,
  });

  const schema = z.object({
    guestName: z.string().min(1, "Name is required"),
    guestEmail: z.string().email("Invalid email address"),
    additionalInfo: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      additionalInfo: "",
    },
  });

  const onSubmit = (values: any) => {
    if (!selectedSlot || !selectedDate) {
      toast.error("Please select a time slot first");
      return;
    }

    const startTime = parseISO(decodeURIComponent(selectedSlot));
    const endTime = addMinutes(startTime, duration);

    const payload = {
      ...values,
      eventId,
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    if (isPending) return;

    mutate(payload, {
      onSuccess: (res: any) => {
        setMeetLink(res.data.meetLink); // ✅ API response ile uyumlu
        handleSuccess(true);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to schedule event");
      },
    });
  };

  return (
    <div className="max-w-md pt-6 px-6">
      {isSuccess ? (
        <div className="text-center pt-4">
          <h2 className="text-2xl flex items-center justify-center gap-2 font-bold mb-4">
            <span className="flex items-center justify-center rounded-full bg-green-700 p-1">
              <CheckIcon className="w-3 h-3 text-white" />
            </span>
            You are scheduled
          </h2>
          <p className="mb-4">Your meeting has been scheduled successfully.</p>
          <p className="flex items-center text-sm justify-center gap-2 mb-4">
            Copy link:{" "}
            <span className="font-normal text-primary">{meetLink}</span>
          </p>
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            <Button>
              <ExternalLink className="w-4 h-4 mr-1" />
              Join Google Meet
            </Button>
          </a>
        </div>
      ) : (
        <Fragment>
          <h2 className="text-xl font-bold mb-6">Enter Details</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                name="guestName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold text-[#0a2540]">Name</Label>
                    <FormControl className="mt-1">
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="guestEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold text-[#0a2540]">Email</Label>
                    <FormControl className="mt-1">
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Info */}
              <FormField
                name="additionalInfo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-semibold text-[#0a2540]">
                      Additional notes
                    </Label>
                    <FormControl className="mt-1">
                      <Textarea
                        placeholder="Please share anything that will help prepare for our meeting."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending || !selectedSlot}>
                {isPending ? <Loader color="white" /> : "Schedule Meeting"}
              </Button>
            </form>
          </Form>
        </Fragment>
      )}
    </div>
  );
};

export default BookingForm;
