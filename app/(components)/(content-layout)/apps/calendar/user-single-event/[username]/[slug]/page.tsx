"use client"

import { Fragment } from "react";
import { useParams } from "next/navigation";
import { today } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "../../../external_page/components/page-container";
import BookingCalendar from "../../../external_page/components/booking-calendar";
import BookingForm from "../../../external_page/components/booking-form";
import { useBookingState } from "../../../hooks/use-booking-state";
import EventDetails from "../../../external_page/components/event-details";
import { getSinglePublicEventBySlugQueryFn } from "../../../lib/api";
import { cn } from "@/app/lib/utils";
import { ErrorAlert } from "../../../components/ErrorAlert";
import { Loader } from "../../../components/loader";
import { useBookingStore } from "../../../hooks/useBookingStore";



const UserSingleEventPage = () => {
  const param = useParams();
  const username = param.username as string;
  const slug = param.slug as string;

const { next, timezone, selectedDate } = useBookingStore();

  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["public_single_event"],
    queryFn: () =>
      getSinglePublicEventBySlugQueryFn({
        username,
        slug,
      }),
  });

  const event = data?.event;

  return (
    <PageContainer
      isLoading={isLoading}
      className={cn(
        `!min-w-auto sm:!w-auto`,
        isFetching || isError ? "sm:!min-w-[72%]" : "",
        selectedDate && "sm:!w-[98%]"
      )}
    >
      {/* {Error Alert } */}
      <ErrorAlert isError={isError} error={error} />

      {isFetching || isError ? (
        <div className="flex items-center justify-center min-h-[15vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : (
        event && (
          <div className="w-full flex flex-col lg:flex-row items-stretch justify-stretch p-0 px-1">
            {/* {Event Details} */}
            <EventDetails
              eventTitle={event?.title}
              description={event?.description}
              user={event?.user}
              eventLocationType={event?.locationType}
              username={username || ""}
              duration={event?.duration}
            />
            {/* {Calendar & Booking form} */}
            {/* {Calendar & Booking form} */}
            <div className="min-w-sm max-w-3xl flex-shrink-0 flex-1">
              {next ? (
                  <BookingForm eventId={event.id} duration={event.duration} />
              ) : (
                  <BookingCalendar
                    eventId={event.id}
                    minValue={today(timezone)}
                    defaultValue={today(timezone)}
                  />
              )}
            </div>
          </div>
        )
      )}
    </PageContainer>
  );
};

export default UserSingleEventPage;