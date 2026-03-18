import { getServerSchool } from "../../../../../actions/auth";
import { getSectionByType, getSiteRecentEvents } from "../../../../../actions/site";
import CustomizePageHeader from "../../../../../components/school/CustomizePageHeader";
import EventsSectionForm from "../../../../../components/school/section-forms/events-section-form";
import HeroSectionForm from "../../../../../components/school/section-forms/hero-section-form";
import { SectionType } from "../../../../../lib/sectionTypes";
import React from "react";

export default async function page() {
  const school = await getServerSchool();
  const section = await getSectionByType(school?.id, SectionType.EVENTS);
  const recentEvents = (await getSiteRecentEvents(school?.id ?? "")) || [];
  return (
    <main className="min-h-screen bg-background ">
      <CustomizePageHeader
        subtitle="Customize your school's events section"
        title="Events Section Customization"
        sectionId={section?.id}
        isComplete={section?.isComplete}
      />
      {section && section.id ? (
        <EventsSectionForm recentEvents={recentEvents} section={section} />
      ) : (
        <div className="">
          <p>No Section Found</p>
        </div>
      )}
    </main>
  );
}
