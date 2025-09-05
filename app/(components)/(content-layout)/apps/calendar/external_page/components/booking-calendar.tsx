import { format, addMinutes } from "date-fns";
import { Calendar } from "../../components/calendar";
import { CalendarDate, DateValue } from "@internationalized/date";
import { formatSlot, decodeSlot } from "../../lib/helper";
import { getPublicAvailabilityByEventIdQueryFn } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert } from "../../components/ErrorAlert";
import { Loader } from "../../components/loader";
import HourButton from "../../components/HourButton";
import { useBookingStore } from "../../hooks/useBookingStore";

interface BookingCalendarProps {
  eventId: string;
  minValue?: DateValue;
  defaultValue?: DateValue;
}

const BookingCalendar = ({ eventId, minValue, defaultValue }: BookingCalendarProps) => {
  const {
    timezone,
    hourType,
    selectedDate,
    selectedSlot,
    handleSelectDate,
    handleSelectSlot,
    handleNext,
    setHourType,
  } = useBookingStore();

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["availability_single_event", eventId],
    queryFn: () => getPublicAvailabilityByEventIdQueryFn(eventId),
  });

  const availability = data?.data || {};
  const days = availability.days || [];
  const timeGap = availability.timeGap || 30;

  const timeSlots = selectedDate
    ? (() => {
        const dayOfWeek = format(selectedDate.toDate(timezone), "EEEE").toUpperCase();
        const selectedDay = days.find((d) => d.day === dayOfWeek && d.isAvailable);
        if (!selectedDay) return [];

        const slots: string[] = [];
        let current = new Date(selectedDay.startTime);
        const end = new Date(selectedDay.endTime);

        while (current < end) {
          slots.push(current.toISOString());
          current = addMinutes(current, timeGap);
        }
        return slots;
      })()
    : [];

  const isDateUnavailable = (date: DateValue) => {
    const dayOfWeek = format(date.toDate(timezone), "EEEE").toUpperCase();
    const day = days.find((d) => d.day === dayOfWeek);
    return !day?.isAvailable;
  };

  const handleChangeDate = (newDate: DateValue) => {
    handleSelectDate(newDate as CalendarDate);
  };

  const selectedTime = selectedSlot ? decodeSlot(selectedSlot, timezone, hourType) : null;

  return (
    <div className="relative lg:flex-[1_1_50%] w-full flex-shrink-0 transition-all duration-220 ease-out p-4 pr-0">
      {isFetching && (
        <div className="flex bg-white/60 !z-30 absolute w-[95%] h-full items-center justify-center">
          <Loader size="lg" color="black" />
        </div>
      )}

      <div className="flex flex-col h-full mx-auto pt-[25px]">
        <h2 className="text-xl mb-5 font-bold">Select a Date & Time</h2>
        <div className="w-full flex flex-col md:flex-row lg:flex-[1_1_300px]">
          <div className="w-full flex justify-start max-w-xs md:max-w-full lg:max-w-sm">
            <Calendar
              className="w-auto md:w-full lg:!w-auto"
              minValue={minValue}
              defaultValue={defaultValue}
              value={selectedDate}
              timezone={timezone}
              onChange={handleChangeDate}
              isDateUnavailable={isDateUnavailable}
            />
          </div>

          {selectedDate && days.length > 0 && (
            <div className="w-full flex-shrink-0 mt-3 lg:mt-0 max-w-xs md:max-w-[40%] pt-0 overflow-hidden md:ml-[-15px]">
              <div className="w-full pb-3 flex flex-col md:flex-row justify-between pr-8">
                <h3 className="mt-0 mb-[10px] font-normal text-base leading-[38px]">
                  {format(selectedDate.toDate(timezone), "EEEE d")}
                </h3>
                <div className="flex h-9 w-full max-w-[107px] items-center border rounded-sm">
                  <HourButton
                    label="12h"
                    isActive={hourType === "12h"}
                    onClick={() => setHourType("12h")}
                  />
                  <HourButton
                    label="24h"
                    isActive={hourType === "24h"}
                    onClick={() => setHourType("24h")}
                  />
                </div>
              </div>

              <div className="flex-[1_1_100px] pr-[8px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-track-transparent h-[400px]">
                {timeSlots.map((slot, i) => {
                  const formattedSlot = formatSlot(slot, timezone, hourType);
                  const isSelected = selectedTime === formattedSlot;

                  return (
                    <div role="list" key={i}>
                      <div role="listitem" className="m-[10px_10px_10px_0] relative text-[15px]">
                        {/* Selected Time + Next */}
                        <div
                          className={`absolute inset-0 z-20 flex items-center gap-1.5 justify-between
                             transform transition-all duration-400 ease-in-out ${
                               isSelected ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                             }`}
                        >
                          <button
                            type="button"
                            className="w-full h-[52px] text-white rounded-[4px] bg-black/60 font-semibold disabled:opacity-100 disabled:pointer-events-none tracking-wide"
                            disabled
                          >
                            {formattedSlot}
                          </button>
                          <button
                            type="button"
                            className="w-full cursor-pointer h-[52px] bg-[rgb(0,105,255)] text-white rounded-[4px] hover:bg-[rgba(0,105,255,0.8)] font-semibold tracking-wide"
                            onClick={handleNext}
                          >
                            Next
                          </button>
                        </div>

                        {/* Slot Button */}
                        <button
                          type="button"
                          className={`w-full h-[52px] cursor-pointer border border-[rgba(0,105,255,0.5)] text-[rgb(0,105,255)] rounded-[4px] font-semibold hover:border-2 hover:border-[rgb(0,105,255)] tracking-wide transition-all duration-400 ease-in-out ${
                            isSelected ? "opacity-0" : "opacity-100"
                          }`}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          {formattedSlot}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ErrorAlert isError={isError} error={error} />
    </div>
  );
};

export default BookingCalendar;
