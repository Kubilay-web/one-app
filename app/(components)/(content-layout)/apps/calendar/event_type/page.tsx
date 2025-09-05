"use client";

import { useEffect, useState } from "react";
import UserSection from "./components/user-section";
import EventListSection from "./components/event-list-section";
import PageTitle from "../components/PageTitle";
import { getEventListQueryFn } from "../lib/api";
import Loader from "@/shared/layouts-components/loader/loader";
import EmptyState from "./components/empty-state";
import { ErrorAlert } from "../components/ErrorAlert";

const EventType = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getEventListQueryFn();

        setEvents(data?.data?.events || []);
        setUsername(data?.data?.username ?? "");
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col !gap-8">
      <PageTitle title="Event types" />

      <ErrorAlert isError={!!error} error={error} />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : events.length === 0 ? (
        <div>
          <EmptyState />
        </div>
      ) : (
        <div className="w-full">
          <UserSection username={username} />
          <EventListSection events={events} username={username} />
        </div>
      )}
    </div>
  );
};

export default EventType;
