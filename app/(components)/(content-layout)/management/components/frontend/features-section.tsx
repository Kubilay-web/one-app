"use client";

import { useTheme } from "next-themes";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Geist } from "next/font/google";
import { cn } from "../../lib/utils";
import FeaturesBadge from "../ui/features-badge";
import Image from "next/image";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-carlito",
	weight: "400",
});

const schoolProFeatures = [
	{
		title: "📚 Academic Dashboard",
		description:
			"Centralized access to attendance, grades, schedules, and class materials for both students and staff.",
		image:
			"https://img.freepik.com/free-vector/admin-dashboard-panel-template-with-flat-design_23-2147868394.jpg?w=740",
	},
	{
		title: "📝 Exam Management",
		description:
			"Plan, schedule, and publish exams with automated grading and real-time analytics.",
		image:
			"https://img.freepik.com/free-vector/flat-university-background_23-2148168523.jpg?w=740",
	},
	{
		title: "📖 Learning Materials",
		description:
			"Upload and organize course notes, e-books, assignments, and videos in structured modules.",
		image:
			"https://img.freepik.com/premium-photo/collection-colorful-pencils-pens-pencils-are-arranged-circle_1292816-2183.jpg?w=740",
	},
	{
		title: "👩‍🏫 Teacher Portal",
		description:
			"A complete teaching toolkit with class lists, performance tracking, and communication tools.",
		image:
			"https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4755.jpg?w=740",
	},
	{
		title: "📊 Reports & Analytics",
		description:
			"Visualize academic performance, attendance, and system usage with intelligent reports.",
		image:
			"https://img.freepik.com/premium-photo/purple-tablet-with-graph-it-graph-it_1197721-134076.jpg?w=740",
	},
	{
		title: "🔔 Notifications & Alerts",
		description:
			"Automated reminders for upcoming exams, events, or announcements via SMS and email.",
		image:
			"https://img.freepik.com/free-vector/3d-vector-yellow-bell-alert-symbol-social-media-red-exclamation-mark-notification-icon-isolated_40876-3504.jpg?w=740",
	},
];

export default function Features() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.1 });
	const { theme } = useTheme();
	const [isHovering, setIsHovering] = useState(false);

	const [baseColor, setBaseColor] = useState<[number, number, number]>(
		theme === "dark" ? [1, 0, 0.3] : [1, 1, 1]
	);

	const [glowColor, setGlowColor] = useState<[number, number, number]>(
		theme === "dark" ? [1, 0, 0.4] : [1, 0.3, 0.4]
	);

	const [dark, setDark] = useState<number>(theme === "dark" ? 1 : 0);

	useEffect(() => {
		if (theme === "dark") {
			setBaseColor([1, 0, 0.3]);
			setDark(1);
			setGlowColor([1, 0, 0.4]);
		} else {
			setBaseColor([1, 1, 1]);
			setDark(0);
			setGlowColor([1, 0.3, 0.4]);
		}
	}, [theme]);

	return (
		<section
			id="features"
			className="relative overflow-hidden py-10 text-foreground sm:py-16 md:py-24 bg-white text-black z-10"
		>
			<div className="absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 select-none rounded-full bg-primary opacity-40 blur-3xl"></div>
			<div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all ease-in-out"></div>
			<motion.div
				className="flex justify-center"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, delay: 0.1 }}
			>
				<FeaturesBadge />
			</motion.div>

			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 50 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="container mx-auto mt-10 flex flex-col items-center gap-6 sm:gap-12"
			>
				<motion.h1
					className={cn(
						"text-center text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-foreground/60 via-foreground to-foreground/60 bg-clip-text sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl",
						geist.className
					)}
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.75, delay: 0.2 }}
				>
					All-in-One School Management Platform
				</motion.h1>

				<motion.p
					className="mx-auto -mt-4 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.75, delay: 0.3 }}
				>
					Streamline your entire school operations with our comprehensive suite
					of integrated modules designed for modern education.
				</motion.p>

				<div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 xl:grid-cols-3 max-w-6xl w-full">
					{schoolProFeatures.map((feature, index) => (
						<motion.div
							key={index}
							className="group relative flex flex-col overflow-hidden rounded-xl border border-secondary/30 bg-background p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl"
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							viewport={{ once: true }}
						>
							<h3 className="text-xl font-semibold">{feature.title}</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{feature.description}
							</p>
							<div className="mt-6 pointer-events-none flex items-center justify-center">
								<Image
									src={feature.image}
									alt={feature.title}
									width={300}
									height={300}
									className="w-full max-w-[300px] h-auto rounded-md object-contain shadow-md dark:opacity-90"
									loading="lazy"
								/>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>
		</section>
	);
}
