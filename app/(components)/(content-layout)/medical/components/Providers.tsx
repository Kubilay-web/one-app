// "use client";

// import SessionProvider from "@/app/SessionProvider";
// import { Toaster } from "react-hot-toast";
// import { ReactNode } from "react";
// import { Session, User } from "lucia";

// export default function Providers({
//   children,
//   session,
//   user,
// }: {
//   children: ReactNode;
//   session: Session | null;
//   user: User | null;
// }) {
//   return (
//     <SessionProvider value={{ session, user }}>
//       <Toaster position="top-center" reverseOrder={false} />
//       {children}
//     </SessionProvider>
//   );
// }
// s