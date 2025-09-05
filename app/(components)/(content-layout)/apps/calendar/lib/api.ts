import {
  AvailabilityType,
  CreateMeetingType,
  PeriodType,
  UserEventListResponse,
  UserMeetingsResponseType,
  ToggleEventVisibilityResponseType,
  GetAllIntegrationResponseType,
  PublicEventResponseType,
  PublicSingleEventDetailResponseType,
  PublicAvailabilityEventResponseType,
  UserAvailabilityResponseType,
} from "@/app/(components)/(content-layout)/apps/calendar/types/api.type";
import { IntegrationAppType, VideoConferencingPlatform } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



export const toggleEventVisibilityMutationFn = async (data: {
  eventId: string;
}): Promise<ToggleEventVisibilityResponseType> => {
  const res = await fetch(`${BASE_URL}/api/calendar/events/toggle-privacy`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to toggle event visibility");
  return res.json();
};

export const getEventListQueryFn = async (): Promise<UserEventListResponse> => {
  const res = await fetch(`${BASE_URL}/api/calendar/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch event list");
  return res.json();
};

//*********** Integration
export const checkIntegrationQueryFn = async (
  appType: VideoConferencingPlatform
) => {
  const res = await fetch(`${BASE_URL}/api/calendar/integrations/check/${appType}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to check integration");
  return res.json();
};

export const getAllIntegrationQueryFn =
  async (): Promise<GetAllIntegrationResponseType> => {
    const res = await fetch(`${BASE_URL}/api/calendar/integrations`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch integrations");
    return res.json();
  };

export const connectAppIntegrationQueryFn = async (
  appType: IntegrationAppType
) => {
  const res = await fetch(`${BASE_URL}/api/calendar/integrations/connect/${appType}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to connect app integration");
  return res.json();
};

//*********** Availability
export const getUserAvailabilityQueryFn =
  async (): Promise<UserAvailabilityResponseType> => {
    const res = await fetch(`${BASE_URL}/api/calendar/availability`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch availability");
    return res.json();
  };

export const updateUserAvailabilityMutationFn = async (
  data: AvailabilityType
) => {
  const res = await fetch(`${BASE_URL}/api/calendar/availability`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to update availability");
  return res.json();
};

//*********** Meeting
export const getUserMeetingsQueryFn = async (
  filter: PeriodType
): Promise<UserMeetingsResponseType> => {
  const res = await fetch(
    `${BASE_URL}/api/calendar/meetings/user/${filter ? `?filter=${filter}` : ""}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
};

export const cancelMeetingMutationFn = async (meetingId: string) => {
  const res = await fetch(`${BASE_URL}/api/calendar/meetings/${meetingId}`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to cancel meeting");
  return res.json();
};

//*********** Public APIs
export const getAllPublicEventQueryFn = async (
  username: string
): Promise<PublicEventResponseType> => {
  const res = await fetch(`${BASE_URL}/api/calendar/events/user/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch public events");
  return res.json();
};

export const getSinglePublicEventBySlugQueryFn = async (data: {
  username: string;
  slug: string;
}): Promise<PublicSingleEventDetailResponseType> => {
  const res = await fetch(
    `${BASE_URL}/api/calendar/events/user/${data.username}/${data.slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch public event detail");
  return res.json();
};

export const getPublicAvailabilityByEventIdQueryFn = async (
  eventId: string
): Promise<PublicAvailabilityEventResponseType> => {
  const res = await fetch(
    `${BASE_URL}/api/calendar/availability/${eventId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch public availability");
  return res.json();
};

export const scheduleMeetingMutationFn = async (data: CreateMeetingType) => {
  const res = await fetch(`${BASE_URL}/api/calendar/meetings/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to schedule meeting");
  return res.json();
};
