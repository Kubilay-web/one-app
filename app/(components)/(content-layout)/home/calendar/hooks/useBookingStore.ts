"use client";
import { create } from "zustand";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

interface BookingState {
  selectedDate: CalendarDate | null;
  selectedSlot: string | null;
  next: boolean;
  timezone: string;
  hourType: "12h" | "24h";

  setSelectedDate: (date: CalendarDate) => void;
  setSelectedSlot: (slot: string | null) => void;
  setNext: (value: boolean) => void;
  setHourType: (type: "12h" | "24h") => void;

  handleSelectDate: (date: CalendarDate) => void;
  handleSelectSlot: (slot: string | null) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedDate: null,
  selectedSlot: null,
  next: false,
  timezone: getLocalTimeZone(),
  hourType: "24h",

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setNext: (value) => set({ next: value }),
  setHourType: (type) => set({ hourType: type }),

  handleSelectDate: (date) => set({ selectedDate: date, selectedSlot: null }),
  handleSelectSlot: (slot) => set({ selectedSlot: slot }),
  handleNext: () => set({ next: true }),
  handleBack: () => set({ next: false }),
}));
