import { NextResponse } from "next/server";
import db from "@/lib/db";
import queryString from "query-string";

export async function GET(req: Request) {
  try {
    const { query } = queryString.parseUrl(req.url);
    const { country, state, city, organization_type_id, industry_type_id } =
      query || {};

    // Prisma filtreleme objesi
    const filters: any = {};

    if (organization_type_id) {
      filters.organizationTypeId = String(organization_type_id);
    }

    if (industry_type_id) {
      filters.industryTypeId = String(industry_type_id);
    }

    if (country) {
      filters.country = {
        name: String(country),
      };
    }

    if (state) {
      filters.state = {
        statename: String(state),
      };
    }

    if (city) {
      filters.city = {
        name: String(city),
      };
    }

    const companies = await db.company.findMany({
      where: filters,
      include: {
        industryType: true,
        organizationType: true,
        teamType: true,
        country: true,
        state: true,
        city: true,
      },
    });

    return NextResponse.json(companies);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Bir hata oluştu" },
      { status: 500 },
    );
  }
}
