"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import { OrderSummaryOptions, OrderSummarySeries } from "@/shared/data/apps/ecommers/admin/customer-details-data";
import * as reportsData from "@/shared/data/apps/ecommers/admin/reportsdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";
import React, { Fragment } from "react";

const Reports = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Reports" />
                <Pageheader Heading="Reports" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Reports" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">ORDERS SUMMARY</div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false}href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="grid grid-cols-12 gap-x-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 sm:border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
                                        <div className="p-4">
                                            <p className="text-[1.25rem] font-semibold mb-0">1,117</p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Orders</p>
                                        </div>
                                    </div>
                                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 sm:border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
                                        <div className="p-4">
                                            <p className="text-[1.25rem] font-semibold mb-0"><span className="basic-subscription">742</span></p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50">Delivered Orders</p>
                                        </div>
                                    </div>
                                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                        <div className="p-4 sm:text-start text-center">
                                            <p className="text-[1.25rem] font-semibold mb-0"><span className="basic-subscription">259</span></p>
                                            <p className="mb-0 text-textmuted dark:text-textmuted/50">Cancelled Orders</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2" id="order-summary">
                                    <Spkapexcharts chartOptions={OrderSummaryOptions} chartSeries={OrderSummarySeries} type="line" width={"100%"} height={300} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    PRODUCTS OVERVIEW
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false}href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2 inline-block"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="products-overview">
                                    <Spkapexcharts chartOptions={reportsData.ProductsOverviewOptions} chartSeries={reportsData.ProductsOverviewSeries} type="line" width={"100%"} height={367} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/* <!--Start::row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    MOST USED BROWSERS
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false}href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">This Week</Link>
                                        </li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Last Week</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="used-browsers" className="p-4">
                                    <Spkapexcharts chartOptions={reportsData.MostUsedBrowserOptions} chartSeries={reportsData.MostUsedBrowserSeries} type="donut" width={"100%"} height={245} />
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="grid grid-cols-12">
                                    <div className="lg:col-span-3 col-span-12 !p-0 md:col-span-3">
                                        <div className="text-center">
                                            <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-1 hrm-jobs-legend published inline-block">Chrome</span>
                                            <div><span className="text-[1rem] font-semibold">1,624</span></div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3 col-span-12 !p-0 md:col-span-3">
                                        <div className="text-center">
                                            <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-1 hrm-jobs-legend private inline-block ms-2">Firefox</span>
                                            <div><span className="text-[1rem] font-semibold">1,267</span></div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3 col-span-12 !p-0 md:col-span-3">
                                        <div className="text-center">
                                            <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-1 hrm-jobs-legend closed inline-block ms-2">Safari</span>
                                            <div><span className="text-[1rem] font-semibold">1,153</span> </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3 col-span-12 !p-0 md:col-span-3">
                                        <div className="text-center">
                                            <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-1 hrm-jobs-legend onhold inline-block ms-2">Opera</span>
                                            <div><span className="text-[1rem] font-semibold">1,153</span> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">TOTAL VENDORS</div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false}href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div id="totalvendors-chart" className="p-3">
                                    <Spkapexcharts chartOptions={reportsData.TotalvendorsOptions} chartSeries={reportsData.TotalvendorsSeries} type="donut" width={"100%"} height={255} />
                                </div>
                                <div className="grid grid-cols-12 gap-x-6 lg:gap-x-1 border-t border-dashed  dark:border-defaultborder/10">
                                    <div className="lg:col-span-6 col-span-12 md:col-span-6">
                                        <div className="p-4">
                                            <div className="text-textmuted dark:text-textmuted/50 mb-1"> Active
                                            </div>
                                            <div className="flex items-center">
                                                <span className="me-2 text-[1.375rem] font-semibold">1,754</span>
                                                <span className="text-success text-[0.6875rem]"><i className="ti ti-caret-up align-middle me-1"></i>0.23%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 md:col-span-6">
                                        <div className="p-4 border-e border-dashed dark:border-defaultborder/10">
                                            <div className="text-textmuted dark:text-textmuted/50 mb-1">Inactive
                                            </div>
                                            <div className="flex items-center">
                                                <span className="me-2 text-[1.375rem] font-semibold">1,234</span>
                                                <span className="text-danger text-[0.6875rem]"><i className="ri-arrow-down-s-fill align-middle me-1"></i>0.11%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header">
                                <div className="box-title">MONTHLY SALES REPORT</div>
                            </div>
                            <div className="box-body">
                                <div id="sales-report">
                                    <Spkapexcharts chartOptions={reportsData.SalesReportOptions} chartSeries={reportsData.SalesReportSeries} type="line" width={"100%"} height={285} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">TOTAL CUSTOMERS</div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false}href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false}className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div id="total-customers" className="p-3">
                                    <Spkapexcharts chartOptions={reportsData.TotalvendorsOptions} chartSeries={reportsData.TotalCustomerSeries} type="donut" width={"100%"} height={255} />
                                </div>
                                <div className="grid grid-cols-12 gap-x-6 lg:gap-x-1 border-t border-dashed  dark:border-defaultborder/10">
                                    <div className="lg:col-span-6 col-span-12  md:col-span-6">
                                        <div className="pt-3 p-4 border-e border-dashed  dark:border-defaultborder/10">
                                            <div className="text-textmuted dark:text-textmuted/50 mb-1">Active
                                            </div>
                                            <div className="flex items-center">
                                                <span className="me-2 text-[1.375rem] font-semibold">576</span>
                                                <span className="text-success text-[0.6875rem]"><i className="ti ti-caret-up align-middle me-1"></i>0.23%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12  md:col-span-6">
                                        <div className="pt-3 p-4">
                                            <div className="text-textmuted dark:text-textmuted/50 mb-1">Inactive
                                            </div>
                                            <div className="flex items-center">
                                                <span className="me-2 text-[1.375rem] font-semibold">876</span>
                                                <span className="text-danger text-[0.6875rem]"><i className="ri-arrow-down-s-fill align-middle me-1"></i>0.11%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-2 --> */}
            </div>
        </Fragment>
    );
};

export default Reports;