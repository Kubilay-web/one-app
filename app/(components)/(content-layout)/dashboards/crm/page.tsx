"use client"
import SpkCrmCard from "@/shared/@spk-reusable-components/dashboards/spk-crm-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import * as crmdata from "@/shared/data/dashboard/crmdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Crm = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="CRM" />
                <Pageheader Heading="CRM" breadcrumbs={['Dashboards']} currentpage="CRM" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    {crmdata.cardData.map((card: any, index: any) => (
                        <div key={index} className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                            <SpkCrmCard card={card} />
                        </div>
                    ))}

                    <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                        <div className="box card-bg-primary overflow-hidden earnings-card">
                            <div className="box-body !p-0">
                                <div className="px-4 absolute total-earnings-content">
                                    <span className="text-[0.6875rem] !mb-1 block leading-none font-medium text-white ">TOTAL EARNINGS</span>
                                    <h2 className="mb-0 text-white  font-medium">$32,198</h2>
                                    <span className="text-[0.75rem] text-white  opacity-80">Increased by</span><span className="!text-success text-[0.75rem] ms-2 !opacity-[1]"><i className="ti ti-trending-up align-middle ms-1 me-1"></i>0.25%</span>
                                </div>
                                <div id="earnings-report1">
                                    <Spkapexcharts chartOptions={crmdata.EarningsReportOptions1} chartSeries={crmdata.EarningsReportSeries1} type="area" width={'100%'} height={150} />

                                </div>
                                <div id="earnings-report">
                                    <Spkapexcharts chartOptions={crmdata.EarningsReportOptions} chartSeries={crmdata.EarningsReportSeries} type="bar" width={'100%'} height={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    REVENUE ANALYTICS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="revenue-analytics">
                                    <Spkapexcharts chartOptions={crmdata.RevenueAnalyticsOption} chartSeries={crmdata.RevenueAnalyticsSeries} type="line" width={'100%'} height={310} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    CONTACTS BY SOURCE
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body ">
                                <div id="contacts-source">
                                    <Spkapexcharts chartOptions={crmdata.ContactBySourceOptions} chartSeries={crmdata.ContactBySourceSeries} type="polarArea" width={'100%'} height={320} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-3 xl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    LEADS BY SOURCE
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body sm:!px-4 !px-1">
                                <div id="leadsBySource">
                                    <Spkapexcharts chartOptions={crmdata.leadsBySourceOptions} chartSeries={crmdata.leadsBySourceSeries} type="bar" width={'100%'} height={317} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-8 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOP DEALS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Deal', }, { title: 'Value', }, { title: 'Probability', headerClassname: 'text-center' }, { title: 'Status', }]}>
                                        {crmdata.TopDeals.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="me-2">
                                                            {idx.icon ? (
                                                                <span className={`avatar-sm avatar ${idx.avatar}`}>
                                                                    <i className={`fe ${idx.icon} !text-white`}></i>
                                                                </span>
                                                            ) : (
                                                                <span className={`avatar-sm avatar ${idx.avatar}`}>
                                                                    {idx.initials}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Link scroll={false} href="#!" className="font-medium">{idx.deal}</Link>
                                                    </div>
                                                </td>
                                                <td>{idx.value}</td>
                                                <td className="text-center">{idx.probability}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    ACTIVE CUSTOMERS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush active-customers-list">
                                    {crmdata.countries.map((country, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <div className="flex items-center justify-between flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar custom-img avatar-xs avatar-rounded">
                                                            <Image fill src={country.flag} alt={country.name} />
                                                        </span>
                                                    </div>
                                                    <div className="font-medium">{country.name}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">{country.sales}</span>
                                                    <span className={`${country.trendClass} text-[0.75rem] ms-1 inline-flex`}>
                                                        <i className={`ti ti-trending-${country.trendDirection} me-1 align-middle`}></i>
                                                        {country.trend}
                                                    </span>
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

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    DEAL STATISTICS
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm py-2" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'S.No', headerClassname: 'text-center' }, { title: 'Deal', }, { title: 'Sales Rep' }, { title: 'Mail', }, { title: 'Amount', }, { title: 'Location', }, { title: 'Sales Cycle length', }, { title: 'Action', }]}>
                                        {crmdata.DealStatistics.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center">
                                                    <span> {idx.id} </span>
                                                </td>
                                                <td>
                                                    <span>{idx.deal}</span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="me-2 leading-none">
                                                            <span className="avatar avatar-xs">
                                                                <Image fill src={idx.salesRepavatar} alt="" />
                                                            </span>
                                                        </div>
                                                        <div className="text-[0.875rem]">{idx.salesRepname}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.email}
                                                </td>
                                                <td>
                                                    <span className="font-medium text-[0.875rem]">{idx.amount}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${idx.locationColor}/[0.15] text-${idx.locationColor}`}>{idx.location}</span>
                                                </td>
                                                <td>
                                                    <span className="">{idx.salesCycle}</span>
                                                </td>
                                                <td>
                                                    <div className="">
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm !me-2 ti-btn-soft-success btn-wave"><i className="ri-download-2-line"></i></Link>
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-secondary btn-wave"><i className="ri-edit-line"></i></Link>
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
                {/* <!-- End:: row-4 --> */}

            </div>
        </Fragment>
    );
};

export default Crm;