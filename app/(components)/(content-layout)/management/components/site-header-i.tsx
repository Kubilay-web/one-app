"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

import {
	DollarSign,
	Bell,
	Users,
	GraduationCap,
	MessageSquare,
	ClipboardList,
	Bus,
	BarChart2,
	BookOpen,
	CalendarDays,
	FileText,
	Shield,
} from "lucide-react";

const features = [
	{
		icon: Users,
		title: "Student Management",
		description:
			"Comprehensive student information system for managing enrollments, profiles, and academic records with ease",
		href: "/features/student-management",
	},
	{
		icon: GraduationCap,
		title: "Academic Management",
		description:
			"Streamline curriculum planning, examinations, grading, and report card generation in one unified system",
		href: "/features/academic-management",
	},
	{
		icon: MessageSquare,
		title: "Communication Hub",
		description:
			"Integrated messaging system with multi-channel notifications for seamless school-wide communication",
		href: "/features/communication",
	},
	{
		icon: DollarSign,
		title: "Financial Management",
		description:
			"Complete fee management system with online payments, invoicing, and comprehensive financial reporting",
		href: "/features/finance",
	},
	{
		icon: ClipboardList,
		title: "Staff Management",
		description:
			"Efficient tools for managing staff records, attendance, performance evaluation, and payroll processing",
		href: "/features/staff-management",
	},
	{
		icon: Bus,
		title: "Transport Management",
		description:
			"Real-time transport tracking, route management, and automated notifications for safe student transportation",
		href: "/features/transport",
	},
	{
		icon: BarChart2,
		title: "Analytics & Reports",
		description:
			"Powerful analytics tools for data-driven decisions with customizable reporting and insights",
		href: "/features/analytics",
	},
	{
		icon: BookOpen,
		title: "Resource Management",
		description:
			"Digital library system, inventory tracking, and facility scheduling in one integrated platform",
		href: "/features/resources",
	},
	{
		icon: CalendarDays,
		title: "Attendance System",
		description:
			"Automated attendance tracking for students and staff with instant notification capabilities",
		href: "/features/attendance",
	},
	{
		icon: FileText,
		title: "Examination Portal",
		description:
			"Complete examination management system from scheduling to result publication with secure access",
		href: "/features/examinations",
	},
	{
		icon: Bell,
		title: "Notice Board",
		description:
			"Digital notice board for announcements, events, and important updates with targeted distribution",
		href: "/features/announcements",
	},
	{
		icon: Shield,
		title: "Security & Access",
		description:
			"Role-based access control with data encryption and secure backups for complete peace of mind",
		href: "/features/security",
	},
];

interface NavItem {
	name: string;
	href: string;
}

const navItems: NavItem[] = [
	{ name: "Home", href: "/management" },
	// { name: "Features", href: "/management/features" },
	{ name: "Pricing", href: "/management/pricing" },
	{ name: "How It Works", href: "/management/how-it-works" },
];

export default function Header2() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const containerVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: -10 },
		visible: { opacity: 1, y: 0 },
	};

	const mobileMenuVariants: Variants = {
		closed: {
			opacity: 0,
			x: "100%",
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
		open: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				staggerChildren: 0.1,
			},
		},
	};

	const mobileItemVariants = {
		closed: { opacity: 0, x: 20 },
		open: { opacity: 1, x: 0 },
	};

	return (
		<>
			<motion.header
				className={` transition-all duration-500  mx-auto max-w-6xl ${
					isScrolled ? "" : "bg-transparent"
				}`}
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-w">
					<div className="flex h-16 items-center justify-between">
						<motion.div
							className="flex items-center space-x-3"
							variants={itemVariants}
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
						>
							<Logo />
							<NavigationMenu className="hidden md:flex">
								<NavigationMenuList>
									<NavigationMenuItem>
										<Link href="/" legacyBehavior passHref>
											<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
												Home
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<NavigationMenuTrigger>Features</NavigationMenuTrigger>
										<NavigationMenuContent>
											<div className="w-[800px] p-4">
												<div className="flex items-center justify-between mb-4 pb-2 border-b">
													<h4 className="text-lg font-medium">Features</h4>
													<Link
														href="/features"
														className="text-sm text-blue-500 hover:underline"
													>
														View all
													</Link>
												</div>
												<div className="grid gap-4 md:grid-cols-3 ">
													{features.map((feature, index) => (
														<Link
															key={index}
															href={`/feature/${feature.title
																.toLowerCase()
																.replace(/\s+/g, "-")}`}
															className="block group"
														>
															<div className="flex items-start gap-4">
																<div className="p-2 bg-muted rounded-md group-hover:bg-muted/80">
																	<feature.icon className="h-6 w-6 text-blue-500" />
																</div>
																<div>
																	<h5 className="font-medium mb-1 group-hover:text-blue-500">
																		{feature.title}
																	</h5>
																	<p className="text-sm text-muted-foreground line-clamp-2">
																		{feature.description}
																	</p>
																</div>
															</div>
														</Link>
													))}
												</div>
												<div className="mt-6 pt-4 border-t">
													<div className="flex items-center justify-between">
														<div>
															<h4 className="font-medium mb-1">Get started</h4>
															<p className="text-sm text-muted-foreground">
																Their food sources have decreased, and their
																numbers
															</p>
														</div>
														<Button asChild variant="secondary">
															<Link href="/contact-us">Get started</Link>
														</Button>
													</div>
												</div>
											</div>
										</NavigationMenuContent>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<Link href="/#pricing" legacyBehavior passHref>
											<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
												Pricing
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<Link href="/how-it-works" legacyBehavior passHref>
											<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
												How it Works
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>
						</motion.div>

						{/* <nav className="hidden items-center space-x-1 lg:flex">
							{navItems.map((item, index) => (
								<motion.div
									key={item.name}
									variants={itemVariants}
									className="relative"
									onMouseEnter={() => setHoveredItem(item.name)}
									onMouseLeave={() => setHoveredItem(null)}
								>
									<Link
										href={item.href}
										className="relative rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
									>
										{hoveredItem === item.name && (
											<motion.div
												className="absolute inset-0 rounded-lg bg-muted"
												layoutId="navbar-hover"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 30,
												}}
											/>
										)}
										<span className="relative z-10">{item.name}</span>
									</Link>
								</motion.div>
							))}
						</nav> */}

						<motion.div
							className="hidden items-center space-x-3 lg:flex"
							variants={itemVariants}
						>
							{/* <motion.button
								className="rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Search className="h-5 w-5" />
							</motion.button> */}

							<Link
								href="/login"
								className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground"
							>
								Login
							</Link>

							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button>
									<Link href="/contact-us">Book Demo</Link>
								</Button>
							</motion.div>
						</motion.div>

						<motion.button
							className="rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-muted lg:hidden"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							variants={itemVariants}
							whileTap={{ scale: 0.95 }}
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</motion.button>
					</div>
				</div>
			</motion.header>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						<motion.div
							className="fixed inset-0 z-40 bg-black/20  lg:hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
						/>
						<motion.div
							className="fixed right-4 top-28 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl lg:hidden"
							variants={mobileMenuVariants}
							initial="closed"
							animate="open"
							exit="closed"
						>
							<div className="space-y-6 p-6 bg-white text-black">
								<div className="space-y-1 ">
									{navItems.map((item) => (
										<motion.div key={item.name} variants={mobileItemVariants}>
											<Link
												href={item.href}
												className="block rounded-lg px-4 py-3 font-medium text-foreground transition-colors duration-200 hover:bg-muted"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												{item.name}
											</Link>
										</motion.div>
									))}
								</div>

								<motion.div
									className="space-y-3 border-t border-border pt-6"
									variants={mobileItemVariants}
								>
									<Link
										href="/login"
										className="block w-full rounded-lg py-3 text-center font-medium text-foreground transition-colors duration-200 hover:bg-muted"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Sign In
									</Link>
									<Button
										className="w-full"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<Link href="/contact-us">Book Demo</Link>
									</Button>
								</motion.div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
