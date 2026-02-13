"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TimeWindow = { start: string; end: string };
type DayAvailability = TimeWindow[];
type AvailabilityState = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  DayAvailability
>;

const initialAvailability: AvailabilityState = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function AvailabilityForm({
  doctorProfile
}: {
  doctorProfile: string;
}) {
  const [availability, setAvailability] =
    useState<AvailabilityState>(initialAvailability);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log("doctorProfile",doctorProfile)

  const doctorProfileId=doctorProfile?.id;

  const handleAddWindow = (day: keyof AvailabilityState) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "", end: "" }],
    }));
  };

  const handleRemoveWindow = (day: keyof AvailabilityState, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const handleChangeWindow = (
    day: keyof AvailabilityState,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    setAvailability((prev) => {
      const dayWindows = [...prev[day]];
      dayWindows[index][field] = value;
      return { ...prev, [day]: dayWindows };
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Prisma uyumlu string[] formatı
      const formattedAvailability = Object.fromEntries(
        Object.entries(availability).map(([day, windows]) => [
          day,
          windows.map((w) => `${w.start}-${w.end}`), // start-end string
        ]),
      );

      const res = await fetch("/api/onemedical/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorProfileId,
          availability: formattedAvailability,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Uygunluk başarıyla kaydedildi!");
        router.refresh();
      } else {
        toast.error(data.error || "Hata oluştu");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası");
    } finally {
      setIsLoading(false);
    }
  };

  const days: (keyof AvailabilityState)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day} className="border p-4 rounded-lg">
          <h2 className="font-bold capitalize mb-2">{day}</h2>
          {availability[day].map((window, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="time"
                value={window.start}
                onChange={(e) =>
                  handleChangeWindow(day, idx, "start", e.target.value)
                }
                className="border p-1 rounded w-24"
              />
              <span className="self-center">–</span>
              <input
                type="time"
                value={window.end}
                onChange={(e) =>
                  handleChangeWindow(day, idx, "end", e.target.value)
                }
                className="border p-1 rounded w-24"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveWindow(day, idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAddWindow(day)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Window
          </Button>
        </div>
      ))}

      <div className="flex justify-center mt-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Kaydet ve Devam Et"}
        </Button>
      </div>
    </div>
  );
}
