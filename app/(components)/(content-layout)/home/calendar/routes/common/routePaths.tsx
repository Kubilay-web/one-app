export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  EVENT_TYPES: "/apps/calendar/event_type",
  INTEGRATIONS: "/apps/calendar/integrations",
  AVAILBILITIY: "/apps/calendar/availability/schedules",
  MEETINGS: "/apps/calendar/scheduled_events",
};

export const PUBLIC_ROUTES = {
  USER_EVENTS: "/:username",
  USER_SINGLE_EVENT: "/:username/:slug",
};
