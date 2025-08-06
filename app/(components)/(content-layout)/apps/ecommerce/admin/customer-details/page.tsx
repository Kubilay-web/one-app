"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { OrderSummaryOptions, OrderSummarySeries, RecentOrders, cards, stats } from "@/shared/data/apps/ecommers/admin/customer-details-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const CustomerDetails = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Customer Details" />
                <Pageheader Heading="Customer Details" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Customer Details" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {stats.map((item, index) => (
                                <div key={index} className="lg:col-span-6 col-span-12">
                                    <div className="box">
                                        <div className="box-body !p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`main-card-icon ${item.bgColor} p-0`}>
                                                    <div className={`avatar avatar-lg bg-${item.bgColor}/[0.15] border border-${item.bgColor}/10`}>
                                                        <div className="avatar avatar-sm svg-white">{item.icon}</div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="mb-1">{item.title}</div>
                                                    <div className="text-textmuted dark:text-textmuted/50 mb-0 text-[0.75rem] flex flex-wrap items-center">
                                                        <h5 className={`${item.textClass}`}>{item.count}</h5>
                                                        <Link scroll={false} href={item.link} className="text-primary font-semibold custom-details">
                                                            View All <i className="fe fe-arrow-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box overflow-hidden">
                                    <div className="box-header justify-between">
                                        <div className="box-title">ORDER SUMMARY</div>
                                        <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                            Toggletext="View All" Arrowicon={true}>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                        </SpkDropdown>
                                    </div>
                                    <div className="box-body !p-0">
                                        <div className="grid grid-cols-12 gap-x-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
                                                <div className="p-6">
                                                    <p className="text-[1.25rem] font-medium mb-0">1,117</p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Orders</p>
                                                </div>
                                            </div>
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
                                                <div className="p-6">
                                                    <p className="text-[1.25rem] font-medium mb-0"><span className="basic-subscription">742</span></p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Delivered Orders</p>
                                                </div>
                                            </div>
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-6 sm:text-start text-center">
                                                    <p className="text-[1.25rem] font-medium mb-0"><span className="pro-subscription">259</span></p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Cancelled Orders</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2" id="order-summary">
                                            <Spkapexcharts chartOptions={OrderSummaryOptions} chartSeries={OrderSummarySeries} type="line" width={"100%"} height={315} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                                <div className="box overflow-hidden">
                                    <div className="box-body !p-0">
                                        <div className="sm:flex items-center p-4 border-b border-defaultborder dark:border-defaultborder/10 flex-wrap xxl:flex-nowrap gap-2">
                                            <div>
                                                <span className="avatar avatar-lg avatar-rounded online">
                                                    <Image fill src="../../../../assets/images/faces/9.jpg" alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-grow main-profile-info">
                                                <div className="font-semibold mb-1 h6">Jack Miller  <div className="hs-tooltip ti-main-tooltip">
                                                    <Link scroll={false} href="#!" className="p-1 hs-tooltip-toggle">
                                                        <i className="bi bi-check-circle-fill text-success text-[0.875rem]"></i>
                                                        <span
                                                            className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                            role="tooltip">
                                                            Verified User
                                                        </span>
                                                    </Link>
                                                </div></div>
                                                <p className="mb-0">Member Since 2005</p>
                                            </div>
                                            <button className="ti-btn ti-btn-sm ti-btn-soft-primary btn-wave">
                                                <i className="ri-edit-line"></i> Edit
                                            </button>
                                        </div>
                                        <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                            <div className="flex mb-0 justify-center flex-wrap gap-4">
                                                <div>
                                                    <h6 className="font-semibold mb-0">113</h6>
                                                    <p className="mb-0 text-[0.75rem] text-textmuted dark:text-textmuted/50">Orders</p>
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold mb-0">12.2k</h6>
                                                    <p className="mb-0 text-[0.75rem] text-textmuted dark:text-textmuted/50">Delivered</p>
                                                </div>
                                                <div>
                                                    <h6 className="font-semibold mb-0">128</h6>
                                                    <p className="mb-0 text-[0.75rem] text-textmuted dark:text-textmuted/50">Cancelled</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-[0.75rem]">
                                                <p className="mb-2 flex items-center">
                                                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-default border dark:border-defaultborder/10">
                                                        <i className="ri-community-line align-middle text-[0.875rem]"></i>
                                                    </span>
                                                    jackmiller@gmail.com
                                                </p>
                                                <p className="mb-2 flex items-center">
                                                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-default border dark:border-defaultborder/10">
                                                        <i className="ri-briefcase-2-line align-middle text-[0.875rem]"></i>
                                                    </span>
                                                    +91 7658543897
                                                </p>
                                                <p className="mb-0 flex items-center">
                                                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-default border dark:border-defaultborder/10">
                                                        <i className="ri-map-pin-line align-middle text-[0.875rem]"></i>
                                                    </span>
                                                    USA,20071
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {cards.map((card, index) => (
                                    <div key={index} className="box icon-overlay">
                                        <span className={`icon ${card.trend}`}>
                                            {card.svgicon}
                                        </span>
                                        <div className="box-body">
                                            <div className="flex align-items-top">
                                                <div className={`main-card-icon ${card.trend} me-3`}>
                                                    <div className={`avatar avatar-lg bg-${card.trend1}/[0.15] border ${card.trendborder}`}>
                                                        <div className="avatar avatar-sm svg-white">
                                                            {card.icon}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="font-medium mb-0">{card.count}</h5>
                                                    <div className="flex align-items-top">
                                                        <p className="mb-0 me-2">{card.title}</p>
                                                        <div className={`${card.trendIcon === 'ri-arrow-down-s-fill' ? 'text-danger' : 'text-success'} font-semibold`}>
                                                            <i className={` ${card.trendIcon}  align-middle`}></i>
                                                            {card.percentage}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                                <div className="box earning-card">
                                    <div className="box-body text-white">
                                        <div className="flex gap-4 items-start">
                                            <span className="avatar avatar-lg p-2 bg-white/[0.15] avatar-square shadow-sm svg-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="!text-white !fill-white" viewBox="0 0 24 24"><path d="M14,11H10a2,2,0,0,1,0-4h5a1,1,0,0,1,1,1,1,1,0,0,0,2,0,3,3,0,0,0-3-3H13V3a1,1,0,0,0-2,0V5H10a4,4,0,0,0,0,8h4a2,2,0,0,1,0,4H9a1,1,0,0,1-1-1,1,1,0,0,0-2,0,3,3,0,0,0,3,3h2v2a1,1,0,0,0,2,0V19h1a4,4,0,0,0,0-8Z" /></svg>
                                            </span>
                                            <div>
                                                <h5 className="font-medium block text-white mb-1">Wallet Summary</h5>
                                                <p className="mb-0 text-white text-[0.75rem]">Total Recharge : <span className="font-medium">$567.00</span></p>
                                                <p className="mb-0 text-white text-[0.75rem]">Total Balance : <span className="font-medium">$345.00</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            ORDER TRACKING
                                        </div>
                                        <div>
                                            ID : <Link scroll={false} href="#!" className="text-primary">#115876</Link>
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="flex items-center gap-4 mb-5">
                                            <p className="mb-0">
                                                <span className="">Product :</span>
                                                <span className="text-primary"> Men's Sports Shoes</span>
                                            </p>
                                        </div>
                                        <div className="order-track">
                                            <div className="hs-accordion-group" data-hs-accordion-always-open>
                                                <div className="hs-accordion mb-2 active" id="order-heading-one">
                                                    <Link scroll={false} href="#!" className="hs-accordion-toggle group pb-2 items-center gap-x-3 w-full font-semibold text-start transition"
                                                        aria-controls="order-collapse-one">
                                                        <div className="flex mb-0">
                                                            <div className="me-2">
                                                                <span className="avatar avatar-md avatar-rounded p-2 bg-light">
                                                                    <Image fill src="../../../../assets/images/ecommerce/png/18.png" alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow flex items-center justify-between">
                                                                <p className="font-semibold mb-0 text-[0.875rem]">Order Placed</p>
                                                                <span className="font-normal text-success">Nov 03</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div id="order-collapse-one" className="space-y-3 hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="order-heading-one">
                                                        <div className="accordion-body !pt-0 !py-1 !ps-[3rem]">
                                                            <p className="mb-0">Order placed successfully by <Link scroll={false} href="#!" className="font-semibold text-primary">Sansa Taylor</Link></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="hs-accordion mb-2 active" id="order-heading-two">
                                                    <Link scroll={false} href="#!" className="hs-accordion-toggle group pb-2 items-center gap-x-3 w-full font-semibold text-start transition"
                                                        aria-controls="order-collapse-two">
                                                        <div className="flex mb-0">
                                                            <div className="me-2">
                                                                <span className="avatar avatar-md avatar-rounded p-2 bg-light">
                                                                    <Image fill src="../../../../assets/images/ecommerce/png/8.png" alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow flex items-center justify-between">
                                                                <p className="font-semibold mb-0 text-[0.875rem]">Picked</p>
                                                                <span className="text-[0.75rem] font-normal">Nov 03, 15:10</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div id="order-collapse-two"
                                                        className="space-y-3 hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                                                        aria-labelledby="order-heading-two">
                                                        <div className="accordion-body !pt-0 !py-1 !ps-[3rem]">
                                                            <p className="mb-0">Your order has been picked up by <span className="font-semibold">Smart Good Services</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="hs-accordion mb-2 active" id="order-heading-three">
                                                    <Link scroll={false} href="#!" className="hs-accordion-toggle group pb-2 items-center gap-x-3 w-full font-semibold text-start transition" aria-controls="order-collapse-three">
                                                        <div className="flex mb-0">
                                                            <div className="me-2">
                                                                <span className="avatar avatar-md avatar-rounded p-2 bg-light">
                                                                    <Image fill src="../../../../assets/images/ecommerce/png/19.png" alt="" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow flex items-center justify-between">
                                                                <p className="font-semibold mb-0 text-[0.875rem]">Shipping</p>
                                                                <span className="text-[0.75rem] font-normal">Nov 03, 15:10</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div id="order-collapse-three" className="space-y-3 hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="order-heading-three">
                                                        <div className="accordion-body !pt-0  !py-1 !ps-[3rem]">
                                                            <p className="mb-0">picked up by <span className="font-semibold">SGS Agent</span> and on the way to Hyderabad</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="hs-accordion" id="order-heading-four">
                                                    <Link scroll={false} href="#!" className="hs-accordion-toggle group pb-4 inline-flex items-center gap-x-3 w-full font-semibold text-start transition">
                                                        <div className="flex mb-0">
                                                            <div className="me-2">
                                                                <span className="avatar avatar-md avatar-rounded bg-light !text-dark border !border-light"><i className="fe fe-package text-[0.75rem]"></i></span>
                                                            </div>
                                                            <div className="flex-grow flex items-center justify-between flex-wrap">
                                                                <p className="font-semibold mb-0 text-[0.875rem]">Out For Delivery</p>
                                                                <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] font-normal">Nov 03, 15:10 (expected)</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div id="order-collapse-four" className="space-y-3 hs-accordion-content hidden  w-full overflow-hidden transition-[height] duration-300" aria-labelledby="order-heading-four">
                                                        <div className="accordion-body !pt-0 !ps-[3rem]">
                                                            <div className="mb-1">
                                                                <p className="mb-0">Your order is out for delivery</p>
                                                                <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem] ms-2">Nov 03, 2022, 15:36</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="hs-accordion" id="order-heading-five">
                                                    <Link scroll={false} href="#!" className="hs-accordion-toggle group pb-2 items-center gap-x-3 w-full font-semibold text-start transition">
                                                        <div className="flex mb-0">
                                                            <div className="me-2">
                                                                <span className="avatar avatar-md avatar-rounded bg-light !text-dark border !border-light">
                                                                    <i className="fe fe-package text-[0.75rem]"></i>
                                                                </span>
                                                            </div>
                                                            <div className="flex-grow flex items-center justify-between">
                                                                <p className="font-semibold mb-0 text-[0.875rem]">Delivered</p>
                                                                <span className="text-[0.75rem] font-normal">Nov 03, 18:42</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/* <!-- Start::row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-8 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    RECENT ORDERS
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false} href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        View All<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Order Id' }, { title: 'Product', }, { title: 'Ordered Date', }, { title: 'Payment Mode' }, { title: 'Cost' }, { title: 'Status' }, { title: 'Action' },]}>
                                        {RecentOrders.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>{idx.id}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="avatar avatar-sm avatar-square bg-gray-300 dark:bg-light"><Image fill src={idx.productsrc} className="" alt="..." /></span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="#!">{idx.productName}</Link></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.orderDate}</td>
                                                <td>{idx.paymentMode}</td>
                                                <td className="font-semibold">{idx.cost}</td>
                                                <td><span className={`badge bg-${idx.statusClass}/[0.15] text-${idx.statusClass}`}>{idx.status}</span></td>
                                                <td>
                                                    <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-sm ti-btn-outline-light btn-wave !m-0">
                                                        <i className="fe fe-eye text-textmuted dark:text-textmuted/50 text-[0.75rem]"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title flex-grow">
                                    SHIPPING ADDRESS
                                </div>
                                <Link scroll={false} href="#!" className="text-primary font-medium"><u>View Address</u></Link>
                            </div>
                            <div className="box-body !p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <div className="min-w-fit">
                                                <span className="avatar bg-primary text-white !rounded-full"><i className="ti ti-home !text-[1rem]"></i></span>
                                            </div>
                                            <h6 className="text-[1rem] mb-0 font-semibold">Home</h6>
                                        </div>
                                    </div>
                                    <div className="min-w-fit">
                                        <div className="ti-btn ti-btn-sm ti-btn-light ti-btn-icon !border"><i className="ri-edit-line"></i></div>
                                    </div>
                                </div>
                                <h6 className="mb-2 font-semibold">Ruby Disousa</h6>
                                <p className="mb-2 font-medium text-[0.8125rem]">rubyakuner@ginna.mail</p>
                                <p className="mb-2 font-medium text-[0.8125rem]">+11-23-1116773</p>
                                <p className="mb-0">
                                    H.No: 3-116/458, Golden Park, Marias St.,
                                    Near 12Amet Residency, 14756, United States Of America
                                </p>
                            </div>
                            <div className="box-footer text-end">
                                <div className="ti-btn ti-btn-primary"><i className="ti ti-plus me-1"></i>Add New Address</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End::row-2 --> */}
            </div>
        </Fragment>
    );
};

export default CustomerDetails;