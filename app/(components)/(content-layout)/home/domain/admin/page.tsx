"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import SpkSwiperJs from "@/shared/@spk-reusable-components/spk-packages/spk-swiperjs";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { MarketCap, MarketCapOptions, MarketCapSeries, MarketDepth, PropertiesStatisticsOptions, PropertiesStatisticsSeries, RecentAddedListings, RecentRegisteredUsers, TopCountryUsers } from "@/shared/data/apps/domain/admindata";
import { SalesReportOptions, SalesReportSeries } from "@/shared/data/apps/ecommers/admin/reportsdata";
import { ReviewSwiper, data } from "@/shared/data/apps/real-estate/admindata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Admin = () => {

    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Admin" />
                <Pageheader Heading="Admin" breadcrumbs={['Apps', 'Domain']} currentpage="Admin" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {data.map((item: any, index: any) => (
                                <div className="xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12" key={index}>
                                    <div className="box icon-overlay">
                                        <span className={`icon svg-${item.iconColor}`}>
                                            {item.svg}
                                        </span>
                                        <div className="box-body !p-6">
                                            <div className="flex items-top flex-wrap gap-3">
                                                <div className={`main-card-icon ${item.iconColor}`}>
                                                    <div className={`avatar avatar-lg bg-${item.iconBg}/[0.15] border border-${item.iconBg}/10 `}>
                                                        <div className="avatar avatar-sm svg-white">
                                                            {item.icon}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="font-semibold mb-1">{item.title}</h5>
                                                    <div className="flex items-top">
                                                        <p className="mb-0 me-2">{item.subtitle}</p>
                                                        <div className={`${item.textColor} font-semibold`}>
                                                            {item.trend == "up" ? (
                                                                <i className={`ri-arrow-up-s-fill align-middle`}></i>
                                                            ) : (
                                                                <i className={`ri-arrow-down-s-fill align-middle`}></i>
                                                            )
                                                            }
                                                            {item.change}
                                                        </div>
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
                                        <div className="box-title">Domains Statistics</div>
                                        <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                            Toggletext="Sort By" Arrowicon={true}>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                        </SpkDropdown>
                                    </div>
                                    <div className="box-body !p-0">
                                        <div className="grid grid-cols-12 gap-x-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-4 sm:border-end border-dashed text-center border-defaultborder dark:border-defaultborder/10">
                                                    <p className="text-[1.25rem] font-semibold mb-0">1,117</p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Domains</p>
                                                </div>
                                            </div>
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-4 sm:border-end border-dashed text-center border-defaultborder dark:border-defaultborder/10">
                                                    <p className="text-[1.25rem] font-semibold mb-0">742</p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Websites</p>
                                                </div>
                                            </div>
                                            <div
                                                className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-4 text-center">
                                                    <p className="text-[1.25rem] font-semibold mb-0">259</p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Sales</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2" id="products-overview">
                                            <Spkapexcharts chartOptions={PropertiesStatisticsOptions} chartSeries={PropertiesStatisticsSeries} type="line" width={"100%"} height={280} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="lg:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">Page Views</div>
                                    </div>
                                    <div className="box-body !ps-0 !pb-0">
                                        <div id="page-views">
                                            <Spkapexcharts chartOptions={SalesReportOptions} chartSeries={SalesReportSeries} type="line" width={"100%"} height={210} />
                                        </div>
                                    </div>
                                </div>
                                <div className="box overflow-hidden">
                                    <div className="box-header justify-between">
                                        <div className="box-title">Top Country Users</div>
                                        <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="box-body !p-0">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full table-country" header={[{ title: 'Country' }, { title: 'Total Users', headerClassname: 'text-center' }]}>
                                                {TopCountryUsers.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <th scope="row">
                                                            <div className="flex items-center">
                                                                <div className="me-2 leading-none">
                                                                    <span className="avatar  custom-img avatar-xs avatar-rounded">
                                                                        <Image fill src={idx.src} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">{idx.country} </span>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <td className="text-center">{idx.totalUsers}</td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-6 col-span-12">
                                <div className="box earning-card">
                                    <div className="box-body text-white">
                                        <div className="flex gap-3 align-items-start">
                                            <span className="avatar avatar-lg p-2 bg-white/[0.15] svg-white shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="!text-white !fill-white" viewBox="0 0 24 24">
                                                    <path d="M14,11H10a2,2,0,0,1,0-4h5a1,1,0,0,1,1,1,1,1,0,0,0,2,0,3,3,0,0,0-3-3H13V3a1,1,0,0,0-2,0V5H10a4,4,0,0,0,0,8h4a2,2,0,0,1,0,4H9a1,1,0,0,1-1-1,1,1,0,0,0-2,0,3,3,0,0,0,3,3h2v2a1,1,0,0,0,2,0V19h1a4,4,0,0,0,0-8Z"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <h5 className="font-semibold d-block earning-text text-white">Total Earnings</h5>
                                                <span className="mb-0 text-white">Increase by <span className="badge bg-white/[0.15] mx-1">+4.2%</span> this month</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title flex-grow-1">
                                            Auction Ending Soon
                                        </div>
                                        <div className="min-w-fit-content">
                                            <Link scroll={false} href="#!" className="text-primary font-semibold">View<i className="ti ti-arrow-right ms-1"></i></Link>
                                        </div>
                                    </div>
                                    <div className="box-body ">
                                        <SpkSwiperJs slides={ReviewSwiper} direction={'vertical'} loop={true}
                                            autoplay={{
                                                delay: 1500,
                                                disableOnInteraction: false,
                                            }} spaceBetween={30} slidesPerView={9} className="swiper mySwiper5 swiper-pointer-events swiper-vertical !h-[490px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    Market Cap
                                </div>
                                <div>
                                    <input className="form-control form-control-sm" type="text" placeholder="Search Any Stock Here" aria-label=".form-control-sm example" />
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xl:col-span-7 col-span-12 border-e border-defaultborder dark:border-defaultborder/10">
                                        <div className="p-4 pb-0">
                                            <div className="flex flex-wrap items-center justify-between">
                                                <div className="flex flex-grow gap-4 ms-4">
                                                    <div>
                                                        <h5 className="font-semibold text-primary">$12,390.02
                                                            <span className="text-[0.75rem] ms-1 text-danger">0.14%
                                                                <i className="ti ti-trending-down ms-1"></i>
                                                            </span>
                                                        </h5>
                                                        <span className="d-block text-textmuted dark:text-textmuted/50 mb-1 text-[0.75rem]">
                                                            <span className="text-danger me-1">-89.75</span> . Today
                                                        </span>
                                                        <span className="d-block text-textmuted dark:text-textmuted/50 fs-11"> Jun 17, 2024 11:25 AM UTC +5:30
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex text-end">
                                                    <div>
                                                        <h6 className="font-semibold">GITUHB</h6>
                                                        <span className="d-block text-textmuted dark:text-textmuted/50 fs-11 mb-1">GTHB INDEXNSE</span>
                                                        <span className="d-block"><Link scroll={false} href="#!" className="text-primary font-semibold"> + Compare</Link></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="stocks-marketcap">
                                                <Spkapexcharts chartOptions={MarketCapOptions} chartSeries={MarketCapSeries} type="candlestick" width={"100%"} height={400} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-5 col-span-12">
                                        <div className="p-4">
                                            <div className="table-responsive mb-[3rem]">
                                                <Spktables tableClass="table whitespace-nowrap table-sm !text-start table-borderless text-textmuted dark:text-textmuted/50 min-w-full">
                                                    {MarketCap.map((idx) => (
                                                        <tr key={idx.id}>
                                                            <th scope="row" className="text-start p-[0.3rem] !font-normal">{idx.label}</th>
                                                            <td className="text-start p-[0.3rem]">{idx.value}</td>
                                                            <td className="text-start p-[0.3rem]">{idx.label2}</td>
                                                            <td className="text-start p-[0.3rem]">{idx.value2}</td>
                                                        </tr>
                                                    ))}
                                                </Spktables>
                                            </div>
                                            <div>
                                                <h6 className="font-semibold mb-2">
                                                    Market Depth:
                                                </h6>
                                                <div className="grid grid-cols-12 gap-x-6">
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <div className="table-responsive">
                                                            <Spktables headerClass="!text-dark" tableClass="table whitespace-nowrap table-sm text-center table-borderless text-textmuted dark:text-textmuted/50 min-w-full" header={[{ title: 'Qty', headerClassname: 'p-[0.3rem] !font-normal' }, { title: 'Orders', headerClassname: 'p-[0.3rem] !font-normal' }, { title: 'Bid', headerClassname: 'p-[0.3rem] !font-normal' }]}>
                                                                {MarketDepth.map((idx) => (
                                                                    <tr key={idx.id}>
                                                                        <th scope="row">
                                                                            <span className="text-success p-[0.3rem] !font-normal">{idx.qty}</span>
                                                                        </th>
                                                                        <td className="p-[0.3rem] !font-normal">{idx.orders}</td>
                                                                        <td className="p-[0.3rem] !font-normal">{idx.bid}</td>
                                                                    </tr>
                                                                ))}
                                                            </Spktables>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <div className="table-responsive mb-3">
                                                            <Spktables headerClass="!text-dark" tableClass="table whitespace-nowrap table-sm text-center table-borderless text-textmuted dark:text-textmuted/50 min-w-full" header={[{ title: 'Qty', headerClassname: 'p-[0.3rem] !font-normal' }, { title: 'Orders', headerClassname: 'p-[0.3rem] !font-normal' }, { title: 'Bid', headerClassname: 'p-[0.3rem] !font-normal' }]}>
                                                                {MarketDepth.map((idx) => (
                                                                    <tr key={idx.id}>
                                                                        <th scope="row">
                                                                            <span className="text-danger p-[0.3rem] !font-normal">{idx.qty}</span>
                                                                        </th>
                                                                        <td className="p-[0.3rem] !font-normal">{idx.orders}</td>
                                                                        <td className="p-[0.3rem] !font-normal">{idx.bid}</td>
                                                                    </tr>
                                                                ))}
                                                            </Spktables>
                                                        </div>
                                                        <div className="sm:text-end">
                                                            <button className="ti-btn ti-btn-primary btn-wave">View All
                                                                <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex "></i>
                                                            </button>
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
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start::row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-8  col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    Recent Added Listings
                                </div>
                                <div className="flex">
                                    <div className="me-3">
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <SpkDropdown Linktag={true} Linkclass="ti-btn ti-btn-primary ti-btn-sm !m-0 btn-wave" Toggletext="Sort By" Arrowicon={true}>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">New</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Popular</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Relevant</Link></li>
                                    </SpkDropdown>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables headerClass="!text-dark" tableClass="ti-custom-table ti-custom-table-hover ti-custom-table-head w-full" showCheckbox={true} Customcheckclass="ps-6" header={[{ title: 'Name' }, { title: 'Category' }, { title: 'Bids' }, { title: 'Status' }, { title: 'Industry' }, { title: 'Posted On' }, { title: '' },]}>
                                        {RecentAddedListings.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="ps-6">
                                                    <input className="form-check-input" type="checkbox" id="checkboxNoLabelproducts2" value="" aria-label="..." defaultChecked={idx.checked} />
                                                </td>
                                                <td>
                                                    <div className="flex">
                                                        <div className={`avatar avatar-sm bg-${idx.bgColor}/[0.15] svg-${idx.textColor} `}>
                                                            {idx.src ? (
                                                                <Image fill src={idx.src} alt="domain" className="img-fluid w-full rounded-1" />
                                                            ) : idx.svg ? (idx.svg) : null}
                                                        </div>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0">{idx.title}</p>
                                                            <small className="text-textmuted dark:text-textmuted/50">{idx.lable}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge !rounded-full badge-sm bg-${idx.categoryColor}/[0.15] text-${idx.categoryColor}`}>{idx.category}</span>
                                                </td>
                                                <td>10</td>
                                                <td><span className={`badge !rounded-full badge-sm bg-${idx.statusColor}/[0.15]  text-${idx.statusColor}`}>{idx.status}</span>
                                                </td>
                                                <td>{idx.industry} </td>
                                                <td>{idx.posted}</td>
                                                <td>
                                                    <div className="ti-dropdown hs-dropdown">
                                                        <Link scroll={false} aria-label="anchor" className="ti-btn ti-btn-soft-primary ti-btn-icon ti-btn-sm" href="#!" data-bs-toggle="dropdown">
                                                            <i className="ri-more-2-fill"></i>
                                                        </Link>
                                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-eye-line me-1"></i>View</Link></li>
                                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-pencil-line me-1"></i>Edit</Link></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="flex items-center flex-wrap overflow-auto">
                                    <div className="mb-2 mb-sm-0">
                                        Showing <b>1</b> to <b>10</b> of <b>10</b> entries <i
                                            className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i>
                                    </div>
                                    <div className="ms-auto">
                                        <nav aria-label="Page navigation" className="pagination-style-4 me-1">
                                            <ul className="ti-pagination mb-0">
                                                <li className="page-item"> <Link scroll={false} className="page-link disabled" href="#!"> Prev </Link> </li>
                                                <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">4</Link></li>
                                                <li className="page-item"> <Link scroll={false} className="page-link text-primary" href="#!"> next </Link> </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-4  col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    Recent Registered Users
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false} href="#!" className="text-[0.75rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                        Sort By<i className="ri-arrow-down-s-line align-middle ms-2"></i>
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
                                    <Spktables headerClass="!text-dark" tableClass="ti-custom-table ti-custom-table-hover ti-custom-table-head w-full" header={[{ title: 'User Name' }, { title: 'Plan' }, { title: 'Action' }]}>
                                        {RecentRegisteredUsers.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-sm avatar-rounded me-2">
                                                                <Image fill src={idx.src} alt="" />
                                                            </span>
                                                        </div>
                                                        <div className="items-center">
                                                            <p className="mb-0 font-semibold">{idx.name}
                                                                <span className="ms-1 hs-tooltip ti-main-tooltip">
                                                                    <Link scroll={false} href="#!" className="p-1 hs-tooltip-toggle">
                                                                        <i className="bi bi-check-circle-fill text-success !text-[0.875rem]"></i>
                                                                        <span className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                                            Verified User
                                                                        </span>
                                                                    </Link>
                                                                </span>
                                                            </p>
                                                            <span className="text-[0.8125rem] text-textmuted dark:text-textmuted/50">{idx.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className={`badge bg-${idx.plancolor}/[0.15] text-${idx.plancolor}`}><i className="ri-vip-crown-2-line me-1"></i> {idx.plan}</span></td>
                                                <td>
                                                    <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave  me-1">
                                                        <i className="ri-eye-line"></i>
                                                    </button>
                                                    <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-danger btn-wave !m-0">
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                                <nav aria-label="Page navigation" className="pagination-style-4 float-end">
                                    <ul className="ti-pagination mb-0">
                                        <li className="page-item"> <Link scroll={false} className="page-link disabled" href="#!"> Prev </Link> </li>
                                        <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">4</Link> </li>
                                        <li className="page-item"> <Link scroll={false} className="page-link text-primary" href="#!"> next </Link> </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End::row-3 --> */}
            </div>
        </Fragment>
    );
};

export default Admin;