import { useState } from "react";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const useBookingState = () => {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [next, setNext] = useState<boolean>(false);
  const [timezone, setTimezone] = useState<string>(getLocalTimeZone());
  const [hourType, setHourType] = useState<"12h" | "24h">("24h");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSelectDate = (date: CalendarDate) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Seçilen tarih değişince slot sıfırlansın
  };


  const handleSelectSlot = (slot: string | null) => {
  if (!slot) {
    setSelectedSlot(null);
    return;
  }
  try {
    // Slot zaten ISO string formatında geliyor
    const slotDate = new Date(slot); // veya parseISO(slot)
    if (isNaN(slotDate.getTime())) {
      console.error("Invalid slot date:", slot);
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(encodeURIComponent(slotDate.toISOString()));
  } catch (error) {
    console.error("Error parsing slot:", slot, error);
    setSelectedSlot(null);
  }
};


  const handleNext = () => setNext(true);
  const handleBack = () => setNext(false);
  const handleSuccess = (value?: boolean) => setIsSuccess(value ?? true);

  return {
    selectedDate,
    selectedSlot,
    next,
    timezone,
    hourType,
    isSuccess,
    handleSelectDate,
    handleSelectSlot,
    handleNext,
    handleBack,
    handleSuccess,
    setTimezone,
    setHourType,
  };
};
