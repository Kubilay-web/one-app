"use client"
import SpkSchoolCard from "@/shared/@spk-reusable-components/dashboards/spk-school-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'), { ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as schooldata from "@/shared/data/dashboard/schooldata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";

const School = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="School" />
                <Pageheader Heading="School" breadcrumbs={['Dashboards']} currentpage="School" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-3 xl:col-span-6 col-span-12">
                                <div className="grid grid-cols-12">
                                    {schooldata.cardData.map((card: any, index: any) => (
                                        <div key={index} className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                            <SpkSchoolCard card={card} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="xxl:col-span-5 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            ATTENDANCE OVERVIEW
                                        </div>
                                        <div className="ti-dropdown hs-dropdown">
                                            <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50" data-bs-toggle="dropdown" aria-expanded="true"> Sort By <i className="ri-arrow-down-s-line align-middle ms-2 d-inline-block"></i> </Link>
                                            <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu" data-popper-placement="bottom-end">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div id="attendance-overview">
                                            <Spkapexcharts chartOptions={schooldata.AttendanceOverviewOptions} chartSeries={schooldata.AttendanceOverviewSeries} type="bar" width={'100%'} height={295} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-4 xl:col-span-12 lg:col-span-6 md:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            NOTICE BOARD
                                        </div>
                                        <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="box-body">
                                        <ul className="ti-list-unstyled notice-board-list">
                                            <li>
                                                <div className="flex items-start gap-4">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-md bg-primary/[0.15] svg-primary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="!fill-primary !text-primary" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="144" r="40" opacity="0.2" /><circle cx="64" cy="88" r="32" opacity="0.2" /><circle cx="192" cy="88" r="32" opacity="0.2" /><path d="M192,120a59.91,59.91,0,0,1,48,24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M16,144a59.91,59.91,0,0,1,48-24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="144" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M72,216a65,65,0,0,1,112,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M161,80a32,32,0,1,1,31,40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M64,120A32,32,0,1,1,95,80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <span className="text-primary font-medium text-[0.75rem]">04:24PM</span>
                                                        <span className="font-medium block my-1 leading-none">Office Meeting</span>
                                                        <div className="text-[0.75rem] flex text-textmuted dark:text-textmuted/50 items-center justify-between">
                                                            <span>By Jhon Doe</span>
                                                            <span><i className="ri-time-line me-1"></i>45 Mins ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-start gap-3">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-md bg-secondary/[0.15] svg-secondary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="!fill-secondary !text-secondary" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="96" opacity="0.2" /><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="92" cy="108" r="12" /><circle cx="164" cy="108" r="12" /><path d="M168,152c-8.3,14.35-22.23,24-40,24s-31.7-9.65-40-24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <span className="text-secondary font-medium text-[0.75rem]">24 Feb 2024</span>
                                                        <span className="font-medium block my-1 leading-none">Holiday</span>
                                                        <div className="text-[0.75rem] flex text-textmuted dark:text-textmuted/50 items-center justify-between">
                                                            <span>By Jhon Doe</span>
                                                            <span><i className="ri-time-line me-1"></i>2 Hrs ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-start gap-3">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-md bg-success/[0.15] svg-success">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="!fill-success !text-success" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54a8,8,0,0,1,2.62,5.92V208a8,8,0,0,1-8,8H160A8,8,0,0,1,152,208Z" opacity="0.2" /><path d="M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54a8,8,0,0,1,2.62,5.92V208a8,8,0,0,1-8,8H160A8,8,0,0,1,152,208Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <span className="text-success font-medium text-[0.75rem]">15 Apr 2024 - 05 Jun 2024</span>
                                                        <span className="font-medium block my-1 leading-none">Summer Holiday</span>
                                                        <div className="text-[0.75rem] flex text-textmuted dark:text-textmuted/50 items-center justify-between">
                                                            <span>By Jhon Doe</span>
                                                            <span><i className="ri-time-line me-1"></i>8 Days ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-start gap-3">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-md bg-orangemain/[0.15]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="!fill-orangemain !text-orangemain" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M101.11,197.11,58.89,154.89l-18.4,50.63a7.79,7.79,0,0,0,10,10Z" opacity="0.2" /><path d="M78.09,102.09l75.82,75.82,41-14.9a7.79,7.79,0,0,0,2.85-12.84L105.83,58.29A7.79,7.79,0,0,0,93,61.14Z" opacity="0.2" /><path d="M40.49,205.52,93,61.14a7.79,7.79,0,0,1,12.84-2.85l91.88,91.88A7.79,7.79,0,0,1,194.86,163L50.48,215.51A7.79,7.79,0,0,1,40.49,205.52Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M168,72s0-24,24-24,24-24,24-24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="144" y1="16" x2="144" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="216" y1="112" x2="232" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="216" y1="80" x2="240" y2="72" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="78.09" y1="102.09" x2="153.91" y2="177.91" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="101.11" y1="197.11" x2="58.89" y2="154.89" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <span className="text-orange font-medium text-[0.75rem]">19 Dec 2024</span>
                                                        <span className="font-medium block my-1 leading-none">School Anniversary</span>
                                                        <div className="text-[0.75rem] flex text-textmuted dark:text-textmuted/50 items-center justify-between">
                                                            <span>By Jhon Doe</span>
                                                            <span><i className="ri-time-line me-1"></i>12 Days ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header">
                                <div className="box-title">OVERALL ATTENDANCE</div>
                            </div>
                            <div className="box-body !p-0">
                                <div id="overall-attendance" className="py-3">
                                    <Spkapexcharts chartOptions={schooldata.AttendanceOverallOptions} chartSeries={schooldata.AttendanceOverallSeries} type="radialBar" width={'100%'} height={210} />
                                </div>
                                <ul className="ti-list-group ti-list-group-flush !border-t !rounded-none overall-attendance-list">
                                    <li className="ti-list-group-item boys">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Boys</span>
                                            <span className="text-[1rem] font-medium">72%</span>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item girls">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Girls</span>
                                            <span className="text-[1rem] font-medium">84%</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    UPCOMING ASSIGNMENTS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="ti-list-unstyled upcoming-assignments-list">
                                    {schooldata.tasks.map((task, index) => (
                                        <li key={index}>
                                            <div className="flex items-start justify-between flex-wrap">
                                                <div>
                                                    <Link scroll={false} href="#!" className="font-medium block mb-1">
                                                        {task.title}
                                                    </Link>
                                                    <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] flex items-center gap-4">
                                                        {task.dateRange}
                                                        <span className={`badge ${task.badgeClass}`}>{task.badgeText}</span>
                                                    </span>
                                                </div>
                                                <div>
                                                    <button className="ti-btn ti-btn-light ti-btn-icon ti-btn-sm">
                                                        <i className="ri-arrow-right-s-line rtl:!rotate-180 inline-flex"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-8 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">EARNINGS REPORT</div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="school-earnings">
                                    <Spkapexcharts chartOptions={schooldata.EarningsOptions} chartSeries={schooldata.EarningsSeries} type="line" width={'100%'} height={290} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    STUDENTS MARKS
                                </div>
                                <div className="flex items-center gap-2 flex-wrap students-marks-customclass">
                                    <div>
                                        <SpkSelect name="colors" option={schooldata.Classesdata} mainClass="select2 class-select m-0"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[schooldata.Classesdata[0]]} />
                                    </div>
                                    <div>
                                        <SpkSelect name="colors" option={schooldata.Sectionsdata} mainClass="select2 section-select m-0"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[schooldata.Sectionsdata[0]]} />
                                    </div>
                                    <div>
                                        <SpkSelect name="colors" option={schooldata.Subjectsdata} mainClass="select2 marks-select m-0"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[schooldata.Subjectsdata[0]]} />
                                    </div>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'S.No' }, { title: 'Student', }, { title: 'ID' }, { title: 'Class', }, { title: 'Section' }, { title: 'Marks In %' }, { title: 'Marks In GPA' }, { title: 'Status' }, { title: 'Actions' },]}>
                                        {schooldata.StudentsMarks.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center">{idx.id}</td>
                                                <td className="text-center">
                                                    <div className="flex items-center">
                                                        <Link scroll={false} href="#!" className="avatar avatar-xs avatar-rounded me-2">
                                                            <Image fill src={idx.src} alt="img" />
                                                        </Link>
                                                        <Link scroll={false} href="#!">{idx.name}</Link>
                                                    </div>
                                                </td>
                                                <td className="text-center">{idx.rollNo}</td>
                                                <td className="text-center">{idx.class}</td>
                                                <td className="text-center">{idx.section}</td>
                                                <td className="text-center">{idx.marksPercentage}</td>
                                                <td className="text-center">{idx.marksGPA}</td>
                                                <td className="text-center">
                                                    <span className={`badge bg-${idx.statusClass} !rounded-full text-white`}>{idx.status}</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="ti-dropdown hs-dropdown">
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-light btn-wave !m-0" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></Link>
                                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden">
                                                            <li><Link scroll={false} href="#!" className="ti-dropdown-item">Action</Link></li>
                                                            <li><Link scroll={false} href="#!" className="ti-dropdown-item">Another Action</Link></li>
                                                            <li><Link scroll={false} href="#!" className="ti-dropdown-item">Something Else Here</Link></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                                <SocialPagination />
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TEACHERS LIST
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush">
                                    {schooldata.teachers.map((teacher, index) => (
                                        <li className="ti-list-group-item" key={index}>
                                            <div className="flex items-start gap-4 justify-between flex-wrap">
                                                <div className="leading-none">
                                                    <span className="avatar avatar-sm">
                                                        <Image
                                                            fill
                                                            src={`../../assets/images/faces/${teacher.img}`}
                                                            alt={`${teacher.name} photo`}
                                                        />
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <Link scroll={false} href="#!" className="font-medium">
                                                        {teacher.name}
                                                    </Link>
                                                    <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block">
                                                        {teacher.degree}
                                                    </span>
                                                </div>
                                                <div className={`${teacher.subjectColor} font-medium`}>
                                                    {teacher.subject}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}
            </div>
        </Fragment>
    );
};

export default School;