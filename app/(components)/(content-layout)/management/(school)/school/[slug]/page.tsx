import { getServerUser, SchoolUser } from "../../../actions/auth";
import { getSchoolById } from "../../../actions/schools";

import EnableSite from "../../../components/dashboard/EnableSite";

import HeadmasterQuote from "../../../components/school/headmaster-quote";
import SchoolHeader from "../../../components/school/school-header";
import SchoolAboutSection from "../../../components/school/SchoolAboutSection";
import SchoolAdmissionSection from "../../../components/school/SchoolAdmissionSection";
import SchoolContactForm from "../../../components/school/SchoolContactForm";
import SchoolEvents from "../../../components/school/SchoolEvents";
import SchoolFooter from "../../../components/school/SchoolFooter";
import SchoolGallerySection from "../../../components/school/SchoolGallerySection";
import SchoolHeroSection from "../../../components/school/SchoolHeroSection";

import SchoolNews from "../../../components/school/SchoolNews";

import React, { Suspense } from "react";
import HeaderLoader from "../suspense-loaders/HeaderLoader";
import {
  getSectionByType,
  getSiteGalleryCategories,
  getSiteGalleryImages,
  getSiteRecentEvents,
  getSiteRecentNews,
} from "../../../actions/site";
import { SectionType } from "../../../lib/sectionTypes";
import { validateRequest } from "@/app/auth";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolById(slug, "slug");


  console.log("school",school)

  // if (
  //   !slug ||
  //   !school ||
  //   !school.siteEnabled ||
  //   !(school.siteCompletion > 50)
  // ) {
  //   return <NotFound />;
  // }


  if (!slug || !school) {
    return <div>School not found.</div>;
  }



    const { user } = await validateRequest();
  
    if (!user) return null;


  
  // const user = await getServerUser();




  if (!school.siteEnabled && user) {
    return <EnableSite schoolSlug={school.slug} schoolId={school.id} />;
  }
  const headerSection = await getSectionByType(
    school?.id,
    SectionType.LOGO_NAVIGATION
  );
  const heroSection = await getSectionByType(school?.id, SectionType.HERO);
  const aboutSection = await getSectionByType(school?.id, SectionType.ABOUT);
  const headTeacherQuoteSection = await getSectionByType(
    school?.id,
    SectionType.HEADMASTER_QUOTE
  );
  const admissionSection = await getSectionByType(
    school?.id,
    SectionType.ADMISSION
  );
  const contactSection = await getSectionByType(
    school?.id,
    SectionType.CONTACT
  );
  const footerSection = await getSectionByType(school?.id, SectionType.FOOTER);
  const gallerySection = await getSectionByType(
    school?.id,
    SectionType.GALLERY
  );
  const newsSection = await getSectionByType(school?.id, SectionType.NEWS);
  const eventSection = await getSectionByType(school?.id, SectionType.EVENTS);
  const recentNews = (await getSiteRecentNews(school.id)) || [];
  const recentEvents = (await getSiteRecentEvents(school.id)) || [];

  // const gallerySection = await getSectionByType(school?.id, SectionType.GALLERY);
  const galleryCategories =
    (await getSiteGalleryCategories(school?.id ?? "")) || [];
  const galleryImages = (await getSiteGalleryImages(school?.id ?? "")) || [];
  // console.log(recentEvents);
  return (
    <div className="flex flex-col min-h-screen">
      {/* <TopBar /> */}

      <Suspense fallback={<HeaderLoader />}>
        <SchoolHeader section={headerSection} />
      </Suspense>

      <main>
        {/* Hero Section */}

        <Suspense fallback={<HeaderLoader />}>
          <SchoolHeroSection section={heroSection} />
        </Suspense>

        {/* About Our School */}

        <Suspense fallback={<HeaderLoader />}>
          <SchoolAboutSection section={aboutSection} />
        </Suspense>

        {/* Headmaster's Quote */}

        <Suspense fallback={<HeaderLoader />}>
          <HeadmasterQuote section={headTeacherQuoteSection} />
        </Suspense>

        <Suspense fallback={<HeaderLoader />}>
          <SchoolGallerySection
            galleryCategories={galleryCategories}
            galleryImages={galleryImages}
            section={gallerySection}
          />
        </Suspense>

        {/* School News & Updates */}

        <Suspense fallback={<HeaderLoader />}>
          {recentNews.length > 0 && (
            <SchoolNews recentNews={recentNews} section={newsSection} />
          )}
        </Suspense>

        {/* Apply for Admission */}

        <Suspense fallback={<HeaderLoader />}>
          <SchoolAdmissionSection section={admissionSection} />
        </Suspense>

        {/* Upcoming Events */}

        <Suspense fallback={<HeaderLoader />}>
          {recentEvents.length > 0 && (
            <SchoolEvents recentEvents={recentEvents} section={eventSection} />
          )}
        </Suspense>

        {/* Contact Form */}

        <Suspense fallback={<HeaderLoader />}>
          <SchoolContactForm section={contactSection} />
        </Suspense>
      </main>

      {/* Footer */}

      <Suspense fallback={<HeaderLoader />}>
        <SchoolFooter section={footerSection} />
      </Suspense>
    </div>
  );
}
