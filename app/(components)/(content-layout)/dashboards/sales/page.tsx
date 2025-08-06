"use client"
import Spkcardscomponent from "@/shared/@spk-reusable-components/dashboards/spk-cards";
import SpkActivityCard from "@/shared/@spk-reusable-components/dashboards/spk-recentacticvecard";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import * as salesdata from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const Sales = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7); // Default range: Today → Next 7 Days

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([today, nextWeek]);
    const [startDate, endDate] = dateRange;


    return (
        <Fragment>

            <Seo title={"Sales"} />
            <div className="container-fluid">
                {/*<!-- Start::page-header -->*/}
                <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
                    <div>
                        <p className="font-medium text-[1.25rem] text-defaulttextcolor dark:text-defaulttextcolor/80 !!mb-0 ">Hello
                            there, Jack Miller</p>
                        <p className="font-normal text-textmuted dark:text-textmuted/50 text-[0.8125rem]">Let's make today a productive one!</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="form-group">
                            <div className="input-group custom-sales">
                                <div className="input-group-text !bg-primary/[0.15] !text-primary !border-e-0"> <i className="ri-calendar-line"></i>
                                </div>
                                <SpkDatepickr className="form-control datepicker-input" placeholderText="Select date range" startDate={startDate} endDate={endDate} selectsRange={true} onChange={(update: any) => setDateRange(update)} />
                            </div>
                        </div>
                        <div className="btn-list">
                            <SpkButton variant="soft-secondary" customClass="ti-btn btn-wave !me-[0.375rem] !py-[0.35rem">
                                <i className="ri-upload-cloud-line align-middle me-1 leading-none"></i> Export Report
                            </SpkButton>
                            <SpkButton variant="success" customClass="ti-btn ti-btn-icon  btn-wave">
                                <i className="ri-filter-3-line"></i>
                            </SpkButton>
                        </div>
                    </div>
                </div>
                {/*<!-- End::page-header -->*/}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    {salesdata.cardData.map((card: any, index: any) => (
                        <div key={index} className="xxxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                            <Spkcardscomponent card={card} />
                        </div>
                    ))}
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box overflow-hidden sales-statistics-card">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SALES STATISTICS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body relative !p-0">
                                <div id="sales-statistics">
                                    <Spkapexcharts chartOptions={salesdata.StatisticsOptions} chartSeries={salesdata.StatisticsSeries} type="bar" width={"100%"} height={220} />
                                </div>
                                <div id="sales-statistics1">
                                    <Spkapexcharts chartOptions={salesdata.StatisticsOptions1} chartSeries={salesdata.StatisticsSeries1} type="line" width={"100%"} height={295} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    TOP SELLING CATEGORIES
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="top-categories">
                                    <Spkapexcharts chartOptions={salesdata.CategoriesOptions} chartSeries={salesdata.CategoriesSeries} type="radar" width={"100%"} height={285} />
                                </div>
                                <div className="grid grid-cols-12 mt-0">
                                    <div className="sm:col-span-6 col-span-12 border-e border-dashed border-defaultborder dark:border-defaultborder/10 text-center">
                                        <p className="text-textmuted dark:text-textmuted/50 mb-1 text-[0.75rem]">This Month</p>
                                        <h6 className="text-success">+74.83%</h6>
                                    </div>
                                    <div className="sm:col-span-6 col-span-12 text-center">
                                        <p className="text-textmuted dark:text-textmuted/50 mb-1 text-[0.75rem]">Last Month</p>
                                        <h6 className="text-primary">+56.90%</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    RECENT ACTIVITY
                                </div>
                            </div>
                            <div className="box-body">
                                <ul className="list-unstyled recent-activity-list">
                                    {salesdata.activityData.map((activity, index) => (
                                        <SpkActivityCard showTime={true} key={index} activityCard={activity} Salesdashboard={true} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    RECENT TRANSACTIONS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" tableRowclass="" header={[{ title: 'Order ID' }, { title: 'Payment Mode' }, { title: 'Amount Paid' }, { title: 'Status' }]}>
                                        {salesdata.RecentTransactions.map((idx) => (
                                            <tr key={idx.orderId}>
                                                <td><Link scroll={false} href="#!" className="font-medium text-[0.8125rem]">{idx.orderId}</Link></td>
                                                <td>
                                                    <div className="flex items-start gap-2">
                                                        <div>
                                                            <span className={`avatar avatar-sm bg-${idx.iconBg}/[0.15] text-${idx.iconBg}`}>
                                                                <i className={`${idx.icon} text-[1.125rem]`}></i>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block font-medium mb-1">{idx.paymentMode}</span>
                                                            <span className="block text-[0.6875rem] text-textmuted dark:text-textmuted/50">{idx.transaction}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="block font-medium mb-1">{idx.amountPaid}</span>
                                                        <span className="block text-[0.6875rem] text-textmuted dark:text-textmuted/50">{idx.date}</span>
                                                    </div>
                                                </td>
                                                <td><span className={`text-${idx.statusColor}`}>{idx.status}</span></td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    TOP COUNTRY SALES
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <salesdata.SalesCountries/>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    RECENT ORDERS
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <salesdata.SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                   <salesdata.SalesTable/>
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

export default Sales;