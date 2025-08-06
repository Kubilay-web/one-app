const ROUTES = {
  HOME: "/forum",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/forum/ask-question",
  PROFILE: (id: string) => `/forum/profile/${id}`,
  QUESTION: (id: string) => `/forum/questions/${id}`,
  COMMUNITY: "/forum/community",
  COLLECTION: "/forum/collection",
  TAG: (id: string) => `/forum/tags/${id}`,
  TAGS: "/forum/tags",
};
export default ROUTES;
