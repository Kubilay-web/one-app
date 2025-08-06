"use client"
import SpkCoursesCard from "@/shared/@spk-reusable-components/dashboards/spk-courses-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as coursesdata from "@/shared/data/dashboard/coursesdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Courses = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Courses" />
                <Pageheader Heading="Courses" breadcrumbs={['Dashboards']} currentpage="Courses" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-7 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box card-bg-primary !border-0 !shadow-none overflow-hidden courses-banner-card">
                                    <div className="box-body !p-6">
                                        <div className="grid grid-cols-12 gap-x-6">
                                            <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 md:col-span-8 sm:col-span-8 col-span-12">
                                                <h4 className="text-white mb-3">Master Your Skills With Our Courses !</h4>
                                                <p className="mb-4 text-white opacity-80">Fuel your growth with bite-sized lessons on us. Elevate your skills at your own pace, anywhere, anytime</p>
                                                <button className="ti-btn ti-btn-secondary btn-wave">Learn More</button>
                                            </div>
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 sm:block hidden">
                                                <div>
                                                    <Image width={250} height={250} src="../../assets/images/media/media-67.png" alt="" className="absolute" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-content-between">
                                        <div className="box-title">
                                            LEARNING ACTIVITY
                                        </div>
                                        <SocialDropdown />
                                    </div>
                                    <div className="box-body">
                                        <div id="learning-activity">
                                            <Spkapexcharts chartOptions={coursesdata.LearningActivityOptions} chartSeries={coursesdata.LearningActivitySries} type="line" width={'100%'} height={280} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {coursesdata.cardData.map((card: any, index: any) => (
                                <div key={index} className="xxl:col-span-6 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                    <SpkCoursesCard card={card} />
                                </div>
                            ))}
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-content-between">
                                        <div className="box-title">
                                            PAYOUTS
                                        </div>
                                        <SocialDropdown />
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12">
                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 my-auto ">
                                                <div id="payouts">
                                                    <Spkapexcharts chartOptions={coursesdata.PayoutsOptions} chartSeries={coursesdata.PayoutsSries} type="donut" width={'100%'} height={160} />
                                                </div>
                                            </div>
                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 my-auto">
                                                <div className="grid grid-cols-12 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="flex items-center">
                                                            <div className="me-3">
                                                                <span className="avatar radius-5 bg-success/[0.15] text-success"><i className="ti ti-cash text-[1.125rem]"></i></span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="mb-1 text-[0.75rem] font-medium">Total Payouts</p>
                                                                <span className="text-[1rem] font-medium flex items-center">$89,700<span className="badge bg-success/[0.15] text-success text-[0.625rem] ms-2">0.54%<i className="ri-arrow-up-s-line ms-1"></i></span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="flex items-center">
                                                            <div className="me-3">
                                                                <span className="avatar radius-5 bg-primary/[0.15] text-primary"><i className="ti ti-cash text-[1.125rem]"></i></span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="mb-1 text-[0.75rem] font-medium">Paid</p>
                                                                <span className="text-[1rem] font-medium flex items-center">$68,400<span className="badge bg-danger/[0.15] text-danger text-[0.625rem] ms-2">-1.34%<i className="ri-arrow-down-s-line ms-1"></i></span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="flex items-center">
                                                            <div className="me-3">
                                                                <span className="avatar radius-5 bg-secondary/[0.15] text-secondary"><i className="ti ti-x text-[1.125rem]"></i></span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="mb-1 text-[0.75rem] font-medium">Unpaid</p>
                                                                <span className="text-[1rem] font-medium flex items-center">$21,300<span className="badge bg-success/[0.15] text-success text-[0.625rem] ms-2">1.89%<i className="ri-arrow-up-s-line ms-1"></i></span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    TOP CATEGORIES
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush">
                                    {coursesdata.courses.map((course, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className={`avatar avatar-md ${course.background} text-white`}>
                                                        {course.avatar}
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <span className="font-semibold">{course.title}</span>
                                                    <span className="block font-medium text-textmuted dark:text-textmuted/50 text-[0.75rem]">
                                                        {course.coursesCount} Courses
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className={`badge ${course.badgeColor} ${course.badgeTextColor}`}>
                                                        {course.classesCount} classes
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    POPULAR CLASSES
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush">
                                    {coursesdata.POPULAR.map((course, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <div className="flex align-items-start flex-wrap">
                                                <Link scroll={false} href="#!" className="pe-4 inline-block leading-none">
                                                    <span className="avatar avatar-xl">
                                                        <Image width={64} height={64} src={course.image} alt="img" />
                                                    </span>
                                                </Link>
                                                <div className="flex-grow font-medium">
                                                    <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 block mb-1 text-[0.625rem]" title="Category">
                                                        <i className="ti ti-tag fs-11 align-middle"></i>&nbsp;{course.category}
                                                    </Link>
                                                    <Link scroll={false} href="#!" className="block mb-2 text-[0.875rem]">{course.title}</Link>
                                                    <div className="flex items-center flex-wrap gap-3">
                                                        <div className="flex items-center">
                                                            <Link scroll={false} href="#!" className="me-2 leading-none">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <Image fill src={course.instructorImage} alt="img" />
                                                                </span>
                                                            </Link>
                                                            <Link scroll={false} href="#!" className="flex-grow text-[0.75rem]">{course.instructor}</Link>
                                                        </div>
                                                        <div className="text-[0.75rem] inline-flex items-center">
                                                            <span className="me-2">{course.views}</span>
                                                            <span>
                                                                <i className="ri-star-fill text-[1rem] text-warning me-1"></i>({course.rating})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    COURSES STATISTICS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="course-statistics">
                                    <Spkapexcharts chartOptions={coursesdata.CourseOptions} chartSeries={coursesdata.CourseSries} type="bar" width={'100%'} height={338} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    ONGOING COURSES
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Instructor' }, { title: 'Course Title', }, { title: 'Date Started' }, { title: 'Progress', }, { title: 'Students', headerClassname: 'text-center' }, { title: 'Action' }]}>
                                        {coursesdata.OngoingCourses.map((idx) => (
                                            <tr key={idx.progress}>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-sm avatar-rounded"><Image fill src={idx.instructor.avatar} className="" alt="..." /></span>
                                                        </div>
                                                        <div className="ms-2">
                                                            <p className="font-semibold text-[0.8125rem] mb-0 flex items-center"><Link scroll={false} href="#!">{idx.instructor.name}</Link></p>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.instructor.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.courseTitle}</td>
                                                <td>{idx.dateStarted}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="progress progress-animate progress-xs w-full" role="progressbar" aria-valuenow={idx.progress} aria-valuemin={0} aria-valuemax={100}>
                                                            <div className={`progress-bar progress-bar-striped progress-bar-animated !bg-${idx.progressColor}`} style={{ width: `${idx.progress}%` }}></div>
                                                        </div>
                                                        <div className="ms-2">{idx.progress}%</div>
                                                    </div>
                                                </td>
                                                <td className="text-center">{idx.students}</td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave !m-0 !me-1">
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-secondary btn-wave !m-0">
                                                            <i className="ri-edit-line"></i>
                                                        </button>
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
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    TOP INSTRUCTORS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="ti-list-unstyled top-instructors-list">
                                    {coursesdata.users.map((user, index) => (
                                        <li key={index}>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div>
                                                    <span className={`avatar avatar-md avatar-rounded ${user.bgColor}`}>
                                                        <Image fill src={user.avatar} alt={user.name} />
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <Link scroll={false} href="#!" className={`font-medium  block`}>{user.name}</Link>
                                                    <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">{user.role}</span>
                                                </div>
                                                <div className="text-end">
                                                    <span className={`font-medium ${user.nameclass} block`}>{user.coursesCount}</span>
                                                    <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">{user.specialization}</span>
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

export default Courses;