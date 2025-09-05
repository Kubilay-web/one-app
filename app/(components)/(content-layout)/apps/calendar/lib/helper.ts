import { format, addMinutes, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Format Selected Date & slot time to human-readable format
export const formatSelectedSlot = (
  slot: string | null,
  duration: number,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  if (!slot) return null;
  const decodedSlot = decodeURIComponent(slot);
  const startTime = parseISO(decodedSlot);
  const zonedStartTime = toZonedTime(startTime, timezone);
  const zonedEndTime = addMinutes(zonedStartTime, duration);

  const formattedDate = format(zonedStartTime, "EEEE, MMMM d, yyyy");
  const timeFormat = hourType === "12h" ? "h:mm a" : "HH:mm";
  const formattedTime = `${format(zonedStartTime, timeFormat)} – ${format(
    zonedEndTime,
    timeFormat
  )}`;

  return `${formattedDate}, ${formattedTime}`;
};

// Format Slot to timeZone and return in 24 or 12 hours
export const formatSlot = (
  slot: string, // ISO string
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  const parsedTime = parseISO(slot); // ISO string
  if (isNaN(parsedTime.getTime())) return "Invalid Slot";

  const zonedTime = toZonedTime(parsedTime, timezone);
  return hourType === "12h" ? format(zonedTime, "h:mm a") : format(zonedTime, "HH:mm");
};

// Decode the Selected Time Slot and return formatted time
export const decodeSlot = (
  encodedSlot: string | null,
  timezone: string = "UTC",
  hourType: "12h" | "24h" = "24h"
) => {
  if (!encodedSlot) return null;
  const decodedSlot = decodeURIComponent(encodedSlot);
  const slotDate = parseISO(decodedSlot);
  if (isNaN(slotDate.getTime())) return null;

  const zonedSlotDate = toZonedTime(slotDate, timezone);
  return hourType === "12h" ? format(zonedSlotDate, "h:mm a") : format(zonedSlotDate, "HH:mm");
};
