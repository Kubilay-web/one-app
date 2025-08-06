"use client"
import SpkEcommerceCard from "@/shared/@spk-reusable-components/dashboards/spk-ecommerce-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as ecommercedata from "@/shared/data/dashboard/ecommercedata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Ecommerce = () => {
    return (
        <Fragment>

            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Ecommerce" />
                <Pageheader Heading="Ecommerce" breadcrumbs={['Dashboards']} currentpage="Ecommerce" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {ecommercedata.cardData.map((card: any, index: any) => (
                                <div key={index} className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-6 col-span-12">
                                    <SpkEcommerceCard card={card} />
                                </div>
                            ))}
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            ORDERS STATUS
                                        </div>
                                        <SocialDropdown />
                                    </div>
                                    <div className="box-body">
                                        <div id="order-status">
                                            <Spkapexcharts chartOptions={ecommercedata.OrdersStatusOptions} chartSeries={ecommercedata.OrdersStatusSeries} type="line" width={"100%"} height={300} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="grid grid-cols-12 xxl:gap-x-6 md:!gap-x-6">
                            <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-6 col-span-12">
                                <div className="box !border-0 overflow-hidden audience-report-card">
                                    <div className="box-header">
                                        <div className="box-title">
                                            AUDIENCE REPORT
                                        </div>
                                    </div>
                                    <div className="box-body !p-0">
                                        <div className="flex items-center justify-between p-4 audience-report-content flex-wrap gap-3">
                                            <div>
                                                <span className="!text-white block text-[0.75rem] audience male">Male</span>
                                                <h6 className="mb-0 font-medium !text-white">10,182</h6>
                                            </div>
                                            <div>
                                                <span className="!text-white block text-[0.75rem] audience female">Female</span>
                                                <h6 className="mb-0 font-medium !text-white">6,352</h6>
                                            </div>
                                            <div>
                                                <span className="!text-white block text-[0.75rem] audience others">Others</span>
                                                <h6 className="mb-0 font-medium !text-white">1,234</h6>
                                            </div>
                                        </div>
                                        <div id="audience-report">
                                            <Spkapexcharts chartOptions={ecommercedata.Audiencesoptions} chartSeries={ecommercedata.Audienceserices} type="area" width={"100%"} height={263} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            Recent Orders
                                        </div>
                                        <SocialDropdown />
                                    </div>
                                    <div className="box-body !py-3">
                                        <div className="grid grid-cols-12 gap-0">
                                            <div className="xxl:col-span-6 xl:col-span-12 col-span-12 my-auto">
                                                <span className="block mb-3 recent-orders-content delivered text-[0.8125rem]">Delivered - <span className="font-medium">1754</span></span>
                                                <span className="block mb-3 recent-orders-content cancelled text-[0.8125rem]">Cancelled - <span className="font-medium">1234</span></span>
                                                <span className="block recent-orders-content pending text-[0.8125rem]">Pending - <span className="font-medium">878</span></span>
                                            </div>
                                            <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                                                <div id="recent-orders">
                                                    <Spkapexcharts chartOptions={ecommercedata.RecentordersOptions} chartSeries={ecommercedata.RecentordersSeries} type="donut" width={"100%"} height={150} />
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
                    <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TRANSACTIONS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="list-unstyled transactions-list">
                                    {ecommercedata.transactions.map((transaction, index) => (
                                        <li key={index}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex align-items-start flex-wrap gap-2">
                                                    <div>
                                                        <span className={`avatar avatar-sm ${transaction.bgClass} ${transaction.iconColor}`}>
                                                            <i className={`${transaction.icon} text-[1.125rem]`}></i>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link scroll={false} href="#!">
                                                            <span className="block font-medium mb-1">{transaction.method}</span>
                                                        </Link>
                                                        <span className="block text-[0.6875rem] text-textmuted dark:text-textmuted/50">{transaction.date}</span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <span className="block font-medium">{transaction.amount}</span>
                                                    <span className={`text-[0.75rem] ${transaction.statusClass}`}>{transaction.status}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOP SELLING CATEGORIES
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body !py-0">
                                <div id="top-selling-categories">
                                    <Spkapexcharts chartOptions={ecommercedata.SellingCategoriesOptions} chartSeries={ecommercedata.SellingCategoriesSeries} type="bar" width={"100%"} height={305} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOP SELLING PRODUCTS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'S.No', headerClassname: 'text-center' }, { title: 'Product', }, { title: 'Price', }, { title: 'Category', }]}>
                                        {ecommercedata.TopSelling.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center">
                                                    <span>{idx.id}</span>
                                                </td>
                                                <td>
                                                    <Link scroll={false} href="#!">
                                                        <div className="flex items-center">
                                                            <div className="me-2 leading-none">
                                                                <span className="avatar avatar-sm">
                                                                    <Image fill src={idx.src} alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="text-[0.875rem]">{idx.name}</div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className="font-medium text-[0.875rem]">{idx.price}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${idx.categoryColor}/[0.15] text-${idx.categoryColor}`}>{idx.category}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
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
                                <div className="box-title">RECENT INVOICES</div>
                                <div className="flex items-center flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" Customcheckclass="!text-center" showCheckbox={true} header={[{ title: 'Order Id', }, { title: 'Customer', }, { title: 'Quantity', headerClassname: '!text-center' }, { title: 'Price', }, { title: 'Status', }, { title: 'Ordered Date', }, { title: 'Action', }]}>
                                        {ecommercedata.RecentInvoice.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center">
                                                    <span>
                                                        <input className="form-check-input" type="checkbox" id="order_1" value="" aria-label="..." />
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-semibold">{idx.orderId}</span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="me-2 leading-none">
                                                            <span className="avatar avatar-sm">
                                                                <Image fill src={idx.customerSrc} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link scroll={false} href="#!" className="text-[0.875rem]  font-medium">{idx.customerName}</Link>
                                                            <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem]">{idx.customerEmail}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {idx.quantity}
                                                </td>
                                                <td>
                                                    <span className="font-semibold text-[0.875rem]">{idx.price}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span>
                                                </td>
                                                <td>
                                                    <span className="text-textmuted dark:text-textmuted/50">{idx.date}</span>
                                                </td>
                                                <td>
                                                    <div className="">
                                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-success btn-wave custom-icon"><i className="ri-download-2-line"></i></Link>
                                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info btn-wave"><i className="ri-edit-line"></i></Link>
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

export default Ecommerce;