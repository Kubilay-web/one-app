"use client"
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Isotope from "isotope-layout";

import Image from "next/image";
import Link from "next/link";

const PosSystem = () => {
    const isotope = useRef<Isotope | null>(null); // For Isotope instance
    const grid = useRef<HTMLDivElement | null>(null); // For grid element
    const [activeFilter, setActiveFilter] = useState("*"); // State for active filter

    useEffect(() => {
        let Isotope: any; // Declare variable for Isotope

        const initializeIsotope = async () => {
            const module = await import("isotope-layout"); // Dynamically import Isotope
            Isotope = module.default;
            if (grid.current) {
                isotope.current = new Isotope(grid.current, {
                    itemSelector: ".card-item",
                    layoutMode: "masonry",
                    fitWidth: true, // Automatically adjusts item widths based on container size
                    percentPosition: true,
                });
            }
        };

        initializeIsotope();

        // Cleanup on component unmount
        return () => {
            isotope.current?.destroy();
            isotope.current = null;
        };
    }, []);

    const handleTabClick = (filter: string) => {
        setActiveFilter(filter); // Update active filter state
        isotope.current?.arrange({ filter }); // Trigger Isotope filtering
    };

    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="POS System" />
                <Pageheader Heading="POS System" breadcrumbs={['Dashboards']} currentpage="POS System" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="font-medium mb-0">CATEGORY</h6>
                            <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i
                                className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                        </div>
                        <div className="grid grid-cols-12 gap-x-6 pos-category" id="filter" ref={grid}>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="frst" onClick={() => handleTabClick("*")}>
                                <div className={`box ${activeFilter === "*" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter="*">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/1.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">All Menu</span>
                                                    <span
                                                        className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">180
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="sec" onClick={() => handleTabClick(".Main-Courses")}>
                                <div className={`box ${activeFilter === ".Main-Courses" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter=".Main-Courses">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/2.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">Main Courses</span>
                                                    <span className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">36
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="third" onClick={() => handleTabClick(".Beverages")}>
                                <div className={`box ${activeFilter === ".Beverages" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter=".Beverages">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/3.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">Beverages</span>
                                                    <span className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">25
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="fourth" onClick={() => handleTabClick(".Desserts")}>
                                <div className={`box ${activeFilter === ".Desserts" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter=".Desserts">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/4.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">Desserts</span>
                                                    <span className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">43
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="five" onClick={() => handleTabClick(".Salads")}>
                                <div className={`box ${activeFilter === ".Salads" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter=".Salads">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/5.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">Salads</span>
                                                    <span className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">58
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="xxl:col-span-2 xl:col-span-3 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12" key="six" onClick={() => handleTabClick(".Cakes")}>
                                <div className={`box ${activeFilter === ".Cakes" ? "active" : ""} `}>
                                    <div className="box-body">
                                        <Link scroll={false} href="#!" className="stretched-link categories"
                                            data-filter=".Cakes">
                                            <div className="text-center">
                                                <span className="avatar avatar-xl">
                                                    <Image fill src="../../assets/images/pos-system/6.png" alt="" />
                                                </span>
                                                <div>
                                                    <span className="font-medium">Cakes</span>
                                                    <span className="text-[0.75rem] block font-medium text-textmuted dark:text-textmuted/50">38
                                                        Items</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-8 col-span-12">
                        <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium mb-0">SELECT ITEM</h6>
                            <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i
                                className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                        </div>
                        <div className="grid grid-cols-12 gap-x-6 list-wrapper" ref={grid}>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Desserts"
                                data-category="Desserts">
                                <div className="box">
                                    <img  src="../../assets/images/pos-system/16.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Blueberry
                                                Bliss
                                                Burst</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Ice Creams</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$4.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$5.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Salads"
                                data-category="Salads">
                                <div className="box out-of-stock">
                                    <img src="../../assets/images/pos-system/17.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Garden
                                                Delights</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Main Course</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$29.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$34.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Desserts"
                                data-category="Desserts">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/19.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Temptation
                                                Tidbits</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Desserts</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$7.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$9.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Main-Courses"
                                data-category="Main-Courses">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/18.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Herbivore
                                                Haven</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Main Course</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$19.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$24.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Cakes"
                                data-category="Cakes">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/11.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Strawberry
                                                Symphony</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Cakes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$34.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$49.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Main-Courses"
                                data-category="Main-Courses">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/15.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Veggie
                                                Delight
                                                Fusion</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Sandwich</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$2.79</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$2.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Beverages"
                                data-category="Beverages">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/13.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Iced
                                                Cinnamon
                                                Swirl</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Beverages</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$1.29</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$1.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Salads"
                                data-category="Salads">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/14.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Culinary
                                                Greens</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Main Course</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$24.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$29.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 card-item Beverages"
                                data-category="Beverages">
                                <div className="box">
                                    <img src="../../assets/images/pos-system/10.jpg" className="card-img-top" alt="..." />
                                    <div className="box-body">
                                        <div className="mb-2">
                                            <Link scroll={false} href="#!" className="font-medium text-[1rem]">Berry
                                                Basil
                                                Fizz</Link>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">Beverages</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0">$3.99</h5>
                                                <span
                                                    className="text-textmuted dark:text-textmuted/50 text-[0.8125rem] line-through">$4.99</span>
                                            </div>
                                            <div className="hs-tooltip ti-main-tooltip">
                                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-icon ti-btn-sm btn-wave hs-tooltip-toggle">
                                                    <i className="ri-add-fill"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                        role="tooltip">
                                                        Add To Cart
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <nav aria-label="..." className="">
                            <ul className="ti-pagination mb-6 !p-0 justify-end float-end">
                                <li className="page-item disabled"> <Link href="#!" scroll={false} className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-tr-none !rounded-br-none">Previous</Link></li>
                                <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-none" href="#!">1</Link></li>
                                <li className="page-item " aria-current="page"> <Link scroll={false} className="page-link active px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-none" href="#!">2</Link></li>
                                <li className="page-item"> <Link scroll={false} className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-tl-none !rounded-bl-none" href="#!">Next</Link> </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    ORDER SUMMARY
                                </div>
                                <span className="badge bg-info/[0.15] text-info !rounded-full">
                                    05 Items
                                </span>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group mb-0 !border-0 !rounded-0">
                                    <li className="ti-list-group-item !border-t-0 !border-s-0 !border-e-0">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leadign-none">
                                                <span className="avatar avatar-md bg-light">
                                                    <Image fill src="../../assets/images/pos-system/10.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="mb-0 font-medium">Berry Basil Fizz</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Quantity : 1 <span
                                                    className="badge bg-success/[0.15] ms-3 text-success">30% Off</span></p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end">
                                                    <Link scroll={false} aria-label="anchor" href="#!">
                                                        <i className="ri-close-line text-[1rem] text-textmuted dark:text-textmuted/50"></i>
                                                    </Link>
                                                </p>
                                                <p className="mb-0 text-[0.875rem] font-medium">$3.99<span
                                                    className="ms-1 text-textmuted dark:text-textmuted/50 text-[0.6875rem] inline-block"><s>$4.99</s></span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item  border-b border-dashed border-defaultborder dark:border-defaultborder/10 !border-s-0 !border-e-0">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leadign-none">
                                                <span className="avatar avatar-lg bg-light">
                                                    <Image fill src="../../assets/images/pos-system/15.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="mb-0 font-medium">Veggie Delight Fusion</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Quantity : 2
                                                    <span className="badge bg-success/[0.15] ms-3 text-success">10% Off</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end">
                                                    <Link scroll={false} aria-label="anchor" href="#!">
                                                        <i className="ri-close-line text-[1rem] text-textmuted dark:text-textmuted/50"></i>
                                                    </Link>
                                                </p>
                                                <p className="mb-0 text-[0.875rem] font-medium">$2.79
                                                    <span className="ms-1 text-textmuted dark:text-textmuted/50 text-[0.6875rem] inline-block"><s>$2.99</s></span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item  border-b border-dashed border-defaultborder dark:border-defaultborder/10  !border-s-0 !border-e-0">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leadign-none">
                                                <span className="avatar avatar-lg bg-light">
                                                    <Image fill src="../../assets/images/pos-system/11.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="mb-0 font-medium">Strawberry Symphony</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Quantity : 1 <span
                                                    className="badge bg-success/[0.15] ms-3 text-success">10% Off</span></p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end">
                                                    <Link scroll={false} aria-label="anchor" href="#!">
                                                        <i className="ri-close-line text-[1rem] text-textmuted dark:text-textmuted/50"></i>
                                                    </Link>
                                                </p>
                                                <p className="mb-0 text-[0.875rem] font-medium">$34.99<span
                                                    className="ms-1 text-textmuted dark:text-textmuted/50 text-[0.6875rem] inline-block"><s>$49.99</s></span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item  border-b border-dashed  border-defaultborder dark:border-defaultborder/10  !border-s-0 !border-e-0">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leadign-none">
                                                <span className="avatar avatar-lg bg-light">
                                                    <Image fill src="../../assets/images/pos-system/16.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="mb-0 font-medium">Blueberry Bliss Burst</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Quantity : 2 <span
                                                    className="badge bg-success/[0.15] ms-3 text-success">10% Off</span></p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end">
                                                    <Link scroll={false} aria-label="anchor" href="#!">
                                                        <i className="ri-close-line text-[1rem] text-textmuted dark:text-textmuted/50"></i>
                                                    </Link>
                                                </p>
                                                <p className="mb-0 text-[0.875rem] font-medium">$4.99<span
                                                    className="ms-1 text-textmuted dark:text-textmuted/50 text-[0.6875rem] inline-block"><s>$5.99</s></span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item  border-b border-dashed  border-defaultborder dark:border-defaultborder/10  !border-s-0 !border-e-0">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leadign-none">
                                                <span className="avatar avatar-lg bg-light">
                                                    <Image fill src="../../assets/images/pos-system/13.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="mb-0 font-medium">Iced Cinnamon Swirl</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Quantity : 1 <span
                                                    className="badge bg-success/[0.15] ms-3 text-success">10% Off</span></p>
                                            </div>
                                            <div>
                                                <p className="mb-0 text-end">
                                                    <Link scroll={false} aria-label="anchor" href="#!">
                                                        <i className="ri-close-line text-[1rem] text-textmuted dark:text-textmuted/50"></i>
                                                    </Link>
                                                </p>
                                                <p className="mb-0 text-[0.875rem] font-medium">$1.29 <span
                                                    className="ms-1 text-textmuted dark:text-textmuted/50 text-[0.6875rem] inline-block"><s>$1.99</s></span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="p-4 border-b !border-t border-dashed border-defaultborder dark:border-defaultborder/10 ">
                                    <div className="flex items-center justify-between flex-wrap">
                                        <div
                                            className="text-[0.75rem] font-medium bg-primary/[0.15] text-primary p-1 px-2 rounded-md">
                                            SPRUKO25</div>
                                        <div className="!text-success">COUPON APPLIED</div>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10 ">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-textmuted dark:text-textmuted/50">Sub Total</div>
                                        <div className="font-medium text-[0.875rem]">$318</div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-textmuted dark:text-textmuted/50">Discount</div>
                                        <div className="font-medium text-[0.875rem]">10% - $31.8</div>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-textmuted dark:text-textmuted/50">Delivery Charges</div>
                                        <div className="font-medium text-[0.875rem]">- $29</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-textmuted dark:text-textmuted/50">Service Tax (18%)</div>
                                        <div className="font-medium text-[0.875rem]">- $45.29</div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[0.9375rem]">Total :</div>
                                        <div className="font-semibold text-[1rem] text-dark"> $1,387</div>
                                    </div>
                                    <div className="btn-list grid mt-6">
                                        <button className="ti-btn ti-btn-soft-secondary btn-wave">Save For Later</button>
                                        <button className="ti-btn ti-btn-primary btn-wave">Pay Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}
            </div>
        </Fragment>
    );
};

export default PosSystem;