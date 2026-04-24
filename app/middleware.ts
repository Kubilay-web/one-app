// import { NextRequest, NextResponse } from "next/server";
// import { getUserCountry } from "@/app/lib/utils";
// import { serialize } from "cookie";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   const authToken = req.cookies.get("auth_session");
//   const userCountryCookie = req.cookies.get("userCountry");

//   if (authToken) {
//     // Eğer cookie yoksa, sadece o zaman set et
//     if (!userCountryCookie) {
//       const country = await getUserCountry(req);

//       const cookie = serialize("userCountry", JSON.stringify(country), {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7, // 7 gün
//         httpOnly: false,
//       });

//       res.headers.set("Set-Cookie", cookie);
//     }
//   } else {
//     // auth_session yoksa userCountry cookie'sini sil
//     const deleteCookie = serialize("userCountry", "", {
//       path: "/",
//       maxAge: 0,
//     });

//     res.headers.set("Set-Cookie", deleteCookie);
//   }

//   return res;
// }







import { NextRequest, NextResponse } from "next/server";
import { getUserCountry } from "@/app/lib/utils";
import { serialize } from "cookie";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const hostname = req.nextUrl.hostname;

  const authToken = req.cookies.get("auth_session");
  const userCountryCookie = req.cookies.get("userCountry");

  // 🌍 MULTI DOMAIN DETECT (SEO CORE)
  let site = "global";

  if (hostname.includes("cleververwaltet.de")) {
    site = "de";
  } else if (hostname.includes("cleververwaltet.at")) {
    site = "at";
  }

  // 🔥 SEO + SSR DATA HEADER (layout.tsx kullanır)
  res.headers.set("x-site", site);
  res.headers.set("x-hostname", hostname);

  // 🌐 COUNTRY COOKIE LOGIC (senin mevcut sistemin)
  if (authToken) {
    if (!userCountryCookie) {
      const country = await getUserCountry(req);

      const cookie = serialize("userCountry", JSON.stringify(country), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
      });

      res.headers.append("Set-Cookie", cookie);
    }
  } else {
    const deleteCookie = serialize("userCountry", "", {
      path: "/",
      maxAge: 0,
    });

    res.headers.append("Set-Cookie", deleteCookie);
  }

  return res;
}