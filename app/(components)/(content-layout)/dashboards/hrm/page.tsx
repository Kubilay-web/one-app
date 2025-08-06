"use client"
import SpkHrmCard from "@/shared/@spk-reusable-components/dashboards/spk-hrm-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as hrmdata from "@/shared/data/dashboard/hrmdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Hrm = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="HRM" />
                <Pageheader Heading="HRM" breadcrumbs={['Dashboards']} currentpage="HRM" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-4 xl:col-span-12 lg:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {hrmdata.cardData.map((card: any, index: any) => (
                                <div key={index} className="xxl:col-span-6 xl:col-span-6 lg:col-span-3 md:col-span-3 sm:col-span-6 col-span-12">
                                    <SpkHrmCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="xxl:col-span-5 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SUBSCRIPTIONS OVERVIEW
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body !px-0 !pb-0">
                                <div id="subscriptions-overview">
                                    <Spkapexcharts chartOptions={hrmdata.SubscriptionsOverviewOptions} chartSeries={hrmdata.SubscriptionsOverviewSries} type="bar" width={'100%'} height={345} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    LEAVE REQUESTS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="ti-list-unstyled hrm-leave-requests-list">
                                    {hrmdata.leaveRequests.map((request, index) => (
                                        <li key={index}>
                                            <Link scroll={false} href="#!" className="stretched-link"></Link>
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <div>
                                                    <span className="font-medium">{request.name}</span>
                                                    <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem]">{request.leaveType}</span>
                                                </div>
                                                <div className="ti-btn-list">
                                                    <button
                                                        className="ti-btn ti-btn-sm ti-btn-soft-success ti-btn-icon btn-wave waves-effect waves-light"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-custom-classname="tooltip-dark"
                                                        aria-label="Accept"
                                                        data-bs-original-title="Accept">
                                                        <i className="ri-check-line"></i>
                                                    </button>
                                                    <button
                                                        className="ti-btn ti-btn-sm ti-btn-soft-danger ti-btn-icon btn-wave waves-effect waves-light"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-custom-classname="tooltip-dark"
                                                        aria-label="Reject"
                                                        data-bs-original-title="Reject">
                                                        <i className="ri-close-fill"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">EVENTS LIST</div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush hrm-events-list">
                                    {hrmdata.events.map((event, index) => (
                                        <li key={index} className={`ti-list-group-item ${event.category}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className={`block font-medium mb-1 fs-13 ${event.color}`}>{event.name}</span>
                                                    <span className="block font-medium text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-[0.15rem]">
                                                        {event.date}
                                                    </span>
                                                    <span className="text-[0.6875rem]">{event.type}</span>
                                                </div>
                                                <div className="hs-tooltip ti-main-tooltip">
                                                    <Link scroll={false} href="#!" className="p-1 hs-tooltip-toggle">
                                                        <i className="ri-arrow-right-s-line text-[1.25rem] leading-none rtl:!rotate-180 inline-flex"></i>
                                                        <span
                                                            className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                            role="tooltip">
                                                            {event.tooltip}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    EMPLOYEE STATUS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Name' }, { title: 'Role', }, { title: 'Status' }, { title: 'Score', }]}>
                                        {hrmdata.EmployeeStatus.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image fill src={idx.src} alt="" />
                                                        </span>
                                                        <span className="font-medium">{idx.name}</span>
                                                    </div>
                                                </td>
                                                <td> {idx.role}</td>
                                                <td>
                                                    <span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor} !rounded-full min-w-badge max-w-fit flex items-center justify-center`}>{idx.status}</span>
                                                </td>
                                                <td>{idx.score} </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header">
                                <div className="box-title">
                                    WORKING FORMAT
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div id="working-format" className="p-4">
                                    <Spkapexcharts chartOptions={hrmdata.FormatOptions} chartSeries={hrmdata.FormatSries} type="radialBar" width={'100%'} height={220} />
                                </div>
                                <ul className="ti-list-group ti-list-group-flush !border-t !rounded-none">
                                    <li className="ti-list-group-item">
                                        <div className="flex items-start justify-between">
                                            <div className="working-format-type leading-none office">
                                                <div className="font-medium mb-1">Office</div>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block font-semibold mb-0">1,754</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item">
                                        <div className="flex items-start justify-between">
                                            <div className="working-format-type leading-none home">
                                                <div className="font-medium mb-1">Home</div>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block font-semibold mb-0">634</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item">
                                        <div className="flex items-start justify-between">
                                            <div className="working-format-type remote leading-none">
                                                <div className="font-medium mb-1">Remote</div>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block font-semibold mb-0">878</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">RECENT JOB REQUESTS</div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                     <SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" showCheckbox={true} Customcheckclass="text-center" header={[{ title: 'Name' }, { title: 'Position', }, { title: 'Date' }, { title: 'Work Experience', headerClassname: 'text-center' }, { title: 'Skills' }, { title: 'Work Type' }, { title: 'Action' },]}>
                                        {hrmdata.RecentJobs.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" aria-label="..." defaultChecked={idx.checked} /></td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-sm avatar-rounded"><Image fill src={idx.src} className="" alt="..." /></span>
                                                        </div>
                                                        <div className="ms-2">
                                                            <p className="font-semibold text-[0.8125rem] mb-0 flex items-center"><Link scroll={false} href="#!">{idx.name}</Link></p>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.position}</td>
                                                <td>{idx.date}</td>
                                                <td className="text-center">{idx.experience} </td>
                                                <td>
                                                    {idx.skills.map((skill) => (
                                                        <span className={`badge ${skill.color} me-1`} key={skill.name}>{skill.name}</span>
                                                    ))}
                                                </td>
                                                <td>{idx.workType}</td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave">
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-secondary btn-wave">
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
                </div>
                {/* <!-- End:: row-3 --> */}
            </div>
        </Fragment>
    );
};

export default Hrm;