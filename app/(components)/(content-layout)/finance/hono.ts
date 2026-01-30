import { hc } from "hono/client";

import { AppType } from "@/app/api/onefinance/[[...route]]/route";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL!);
