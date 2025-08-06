"use client"
import SpkJobsCard from "@/shared/@spk-reusable-components/dashboards/spk-jobs-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as jobsdata from "@/shared/data/dashboard/jobsdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown } from "@/shared/data/dashboard/social-media-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Jobs = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Jobs" />
                <Pageheader Heading="Jobs" breadcrumbs={['Dashboards']} currentpage="Jobs" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    {jobsdata.cardData.map((card: any, index: any) => (
                        <div key={index} className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                            <SpkJobsCard card={card} />
                        </div>
                    ))}
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    JOB APPLICATION STATISTICS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="application-statistics">
                                    <Spkapexcharts chartOptions={jobsdata.ApplicationStatisticsOptions} chartSeries={jobsdata.ApplicationStatisticsSeries} type="area" width={'100%'} height={330} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    JOB APPLICANTS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="job-applicants">
                                    <Spkapexcharts chartOptions={jobsdata.JobStatisticsOptions} chartSeries={jobsdata.JobStatisticsSeries} type="radar" width={'100%'} height={280} />
                                </div>
                                <div className="grid grid-cols-12 mt-0">
                                    <div className="xl:col-span-6 col-span-12 border-e border-dashed border-defaultborder dark:border-defaultborder/10 text-center">
                                        <p className="text-textmuted dark:text-textmuted/50 mb-1 text-[0.75rem]">Male</p>
                                        <h6 className="text-primary font-medium">12.34K</h6>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12 text-center">
                                        <p className="text-textmuted dark:text-textmuted/50 mb-1 text-[0.75rem]">Female</p>
                                        <h6 className="text-secondary font-medium">10.19K</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOTAL REVENUE
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="total-revenue">
                                    <Spkapexcharts chartOptions={jobsdata.TotalRevenueOptions} chartSeries={jobsdata.TotalRevenueSeries} type="bar" width={'100%'} height={265} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-5 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOP HIRING COMPANIES
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i
                                    className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Company' }, { title: 'Vacancies', }, { title: 'Hired' }, { title: 'Subscription', }]}>
                                        {jobsdata.TopHiring.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="avatar avatar-sm avatar-rounded">
                                                            <Image fill src={idx.logo} alt="" />
                                                        </span>
                                                        <Link scroll={false} href="#!" className="font-medium">{idx.name}</Link>
                                                    </div>
                                                </td>
                                                <td>{idx.vacancies} </td>
                                                <td>{idx.hired} </td>
                                                <td>
                                                    {
                                                        idx.subscription ? (
                                                            <span className={`badge bg-${idx.subscriptionColor} rounded-pill !text-${idx.textColor}`}>
                                                                {idx.subscription}
                                                            </span>
                                                        ) : (
                                                            "-" // or any fallback content you want to show
                                                        )
                                                    }

                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div
                            className="box  premium-recruiters-card !border-0 !shadow-none text-white">
                            <div className="box-body">
                                <div className="flex items-top mb-2">
                                    <div className="flex-grow">
                                        <p className="mb-0 opacity-70 text-white">Premium Recruiters</p>
                                    </div>
                                    <div className="ms-2">
                                        <span className="avatar avatar-md bg-secondary svg-white !shadow-md">
                                            <svg className="!fill-white !text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                <rect width="256" height="256" fill="none" />
                                                <path
                                                    d="M208,40H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40ZM57.78,216A72,72,0,0,1,128,160a40,40,0,1,1,40-40,40,40,0,0,1-40,40,72,72,0,0,1,70.22,56Z"
                                                    opacity="0.2" />
                                                <circle cx="128" cy="120" r="40" fill="none" stroke="currentColor"
                                                    strokeLinecap="round" strokeLinejoin="round"
                                                    strokeWidth="16" />
                                                <rect x="40" y="40" width="176" height="176" rx="8" fill="none"
                                                    stroke="currentColor" strokeLinecap="round"
                                                    strokeLinejoin="round" strokeWidth="16" />
                                                <path d="M57.78,216a72,72,0,0,1,140.44,0" fill="none"
                                                    stroke="currentColor" strokeLinecap="round"
                                                    strokeLinejoin="round" strokeWidth="16" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[1.25rem] font-medium text-white">9,231</span>
                                <span className="text-[0.75rem] opacity-70 ms-2 text-white"><i
                                    className="ti ti-trending-up me-1 inline-block"></i>0.5%</span>
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-body">
                                <div className="flex items-center mb-4">
                                    <span
                                        className="avatar avatar-md avatar-rounded bg-secondary/[0.15] svg-secondary me-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="!fill-secondary !text-secondary" viewBox="0 0 256 256">
                                            <rect width="256" height="256" fill="none" />
                                            <circle cx="84" cy="108" r="52" opacity="0.2" />
                                            <path d="M10.23,200a88,88,0,0,1,147.54,0" fill="none"
                                                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="16" />
                                            <path d="M172,160a87.93,87.93,0,0,1,73.77,40" fill="none"
                                                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="16" />
                                            <circle cx="84" cy="108" r="52" fill="none" stroke="currentColor"
                                                strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                                            <path d="M152.69,59.7A52,52,0,1,1,172,160" fill="none"
                                                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="16" />
                                        </svg>
                                    </span>
                                    <p className="mb-0 flex-grow">Active Members</p>
                                    <button className="ti-btn ti-btn-light ti-btn-icon ti-btn-sm !ms-2"><i
                                        className="ri-arrow-right-s-line rtl:rotate-180 inline-flex"></i></button>
                                </div>
                                <div className="flex items-center">
                                    <h4 className="font-medium mb-2">$12,897</h4>
                                    <span className="text-[0.75rem] text-success ms-1"><i
                                        className="ti ti-trending-up me-1 inline-block"></i>3.5%</span>
                                </div>
                                <div className="font-normal flex items-center mb-2 mt-3">
                                    <p className="mb-0 flex-grow text-textmuted dark:text-textmuted/50">Active Candidates</p>
                                    <span className="font-medium">3,274</span>
                                </div>
                                <div className="progress progress-xs mb-3">
                                    <div className="progress-bar !bg-secondary progress-bar-striped progress-bar-animated"
                                        role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0}
                                        aria-valuemax={100}></div>
                                </div>
                                <div className="font-normal flex items-center mb-2">
                                    <p className="mb-0 flex-grow text-textmuted dark:text-textmuted/50">Active Recruiters</p>
                                    <span className="font-medium">8,726</span>
                                </div>
                                <div className="progress progress-xs mb-2">
                                    <div className="progress-bar !bg-secondary progress-bar-striped progress-bar-animated"
                                        role="progressbar" style={{ width: '75%' }} aria-valuenow={75} aria-valuemin={0}
                                        aria-valuemax={100}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    PENDING REQUEST APPROVALS
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
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Position' }, { title: 'Experience', }, { title: 'Department' }, { title: 'Status', }, { title: 'No.of Vacancies', headerClassname: 'text-center' }, { title: 'Apply Date', }, { title: 'Action', },]}>
                                        {jobsdata.PendingRequest.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className={`avatar avatar-sm me-2 bg-${idx.iconColor}/[0.15] !text-${idx.iconColor}`}>
                                                            <i className={`ri-${idx.icon} text-[0.875rem]`}></i>
                                                        </div>
                                                        <div className="leading-none">
                                                            <p className="font-semibold mb-0">{idx.position}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.experience}</td>
                                                <td><span className={`text-${idx.departmentColor}`}>{idx.department}</span></td>
                                                <td>
                                                    <span className={`badge bg-${idx.statusColor} text-default`}>{idx.status}</span>
                                                </td>
                                                <td className="text-center">{idx.vacancies}</td>
                                                <td>{idx.applyDate}</td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button type="button" className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave !m-0 !me-1">
                                                            <i className="ri-check-line"></i>
                                                        </button>
                                                        <button type="button" className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-secondary btn-wave !m-0">
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    ACQUISITIONS
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="progress progress-md mb-6 mt-4">
                                    <div className="progress-bar bg-primary !rounded-tl-sm !rounded-bl-sm" role="progressbar" style={{ width: '52%' }}
                                        aria-valuenow={52} aria-valuemin={0} aria-valuemax={100}></div>
                                    <div className="progress-bar !bg-secondary !rounded-none" role="progressbar" style={{ width: '12%' }}
                                        aria-valuenow={12} aria-valuemin={0} aria-valuemax={100}></div>
                                    <div className="progress-bar !bg-success !rounded-none" role="progressbar" style={{ width: '16%' }}
                                        aria-valuenow={16} aria-valuemin={0} aria-valuemax={100}></div>
                                    <div className="progress-bar !bg-warning !rounded-none" role="progressbar" style={{ width: '12%' }}
                                        aria-valuenow={12} aria-valuemin={0} aria-valuemax={100}></div>
                                    <div className="progress-bar !bg-danger !rounded-tl-none !rounded-bl-none rtl:!rounded-tr-none rtl:!rounded-tl-sm rtl:!rounded-bl-sm rtl:!rounded-br-none !rounded-tr-sm !rounded-br-sm" role="progressbar" style={{ width: '8%' }}
                                        aria-valuenow={8} aria-valuemin={0} aria-valuemax={100}></div>
                                </div>
                                <ul className="ti-list-group acquisitions-list">
                                    <li className="ti-list-group-item">
                                        Total Applications
                                        <span className="badge float-end bg-primary/[0.15] text-primary">1,982</span>
                                    </li>
                                    <li className="ti-list-group-item">
                                        Recruited
                                        <span className="badge float-end bg-secondary/[0.15] text-secondary">214</span>
                                    </li>
                                    <li className="ti-list-group-item">
                                        Short Listed
                                        <span className="badge float-end bg-success/[0.15] text-success">262</span>
                                    </li>
                                    <li className="ti-list-group-item">
                                        Rejected
                                        <span className="badge float-end bg-warning/[0.15] text-warning">395</span>
                                    </li>
                                    <li className="ti-list-group-item">
                                        Blocked
                                        <span className="badge float-end bg-danger/[0.15] text-danger">79</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-4 --> */}
            </div>
        </Fragment>
    );
};

export default Jobs;