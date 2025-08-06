import { NextRequest, NextResponse } from "next/server";
import { getUserCountry } from "@/app/lib/utils";
import { serialize } from "cookie";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const authToken = req.cookies.get("auth_session");
  const userCountryCookie = req.cookies.get("userCountry");

  if (authToken) {
    // Eğer cookie yoksa, sadece o zaman set et
    if (!userCountryCookie) {
      const country = await getUserCountry(req);

      const cookie = serialize("userCountry", JSON.stringify(country), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 gün
        httpOnly: false,
      });

      res.headers.set("Set-Cookie", cookie);
    }
  } else {
    // auth_session yoksa userCountry cookie'sini sil
    const deleteCookie = serialize("userCountry", "", {
      path: "/",
      maxAge: 0,
    });

    res.headers.set("Set-Cookie", deleteCookie);
  }

  return res;
}
