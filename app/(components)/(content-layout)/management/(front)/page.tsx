import { getPublicStats } from "../actions/analytics";
import { getSchoolNames } from "../actions/schools";
import CTA from "../components/frontend/cta";
import { DashboardPreview } from "../components/frontend/dashboard-preview";
import FAQ from "../components/frontend/faq-section";
import Features from "../components/frontend/features-section";
import GridFeatures from "../components/frontend/grid-features";
import HeroSection from "../components/frontend/hero-section";
import Hero from "../components/frontend/hero-section-i";
import StatisticsSection from "../components/frontend/impact";
import SchoolMarquee from "../components/frontend/logo-cloud";
import Pricing from "../components/frontend/pricing";
import TabbedFeatures from "../components/frontend/tabbed-features";
import React from "react";

export default async function Home() {
	const stats = (await getPublicStats()) || {
		students: 0,
		teachers: 0,
		schools: 0,
		parents: 0,
	};
	const schools = (await getSchoolNames()) || [];
	console.log(schools, stats);
	return (
		<main className="">
			{/* <HeroSection /> */}
			<Hero />
			{schools && schools.length > 0 && <SchoolMarquee schools={schools} />}
			{/* <LogoCloud /> */}
			{stats && stats.schools && stats.schools > 0 && (
				<StatisticsSection data={stats} />
			)}
			<DashboardPreview />
			<Features />

			{/* <GridFeatures /> */}
			<TabbedFeatures />
			<div className="p-4">
				<CTA />
			</div>
			<Pricing />
			<FAQ />
		</main>
	);
}
