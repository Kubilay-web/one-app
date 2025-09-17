"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { RecentAds, OrderSummaryOptions, OrderSummarySeries, RecentOrdersData, RecentUsers, TopCountrywiseAds, cards, stats } from "@/shared/data/apps/classifieds/admindata";
import { SalesReportOptions, SalesReportSeries } from "@/shared/data/apps/ecommers/admin/reportsdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Admin = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Classifieds Admin" />
            <Pageheader Heading="Classifieds Admin" breadcrumbs={['Apps', 'Classifieds']} currentpage="Classifieds Admin" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        {stats.map((item, index) => (
                            <div key={index} className="sm:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-body !p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`main-card-icon ${item.bgColor} p-0`}>
                                                <div className={`avatar avatar-lg bg-${item.bgColor}/[0.15] border border-${item.bgColor}/10`}>
                                                    <div className="avatar avatar-sm svg-white">{item.icon}</div>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="mb-2">{item.title}</div>
                                                <div className="text-textmuted dark:text-textmuted/50 mb-0 text-[0.75rem] flex flex-wrap items-center">
                                                    <h5 className={`${item.textClass}`}>{item.count}</h5>
                                                    <Link scroll={false} href={item.link} className="text-primary font-semibold text-[0.75rem]">
                                                        View All <i className="fe fe-arrow-right text-[0.75rem]"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="sm:col-span-12 col-span-12">
                            <div className="box overflow-hidden">
                                <div className="box-header justify-between">
                                    <div className="box-title">Ads Statistics</div>
                                    <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                        Toggletext="View All" Arrowicon={true}>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                    </SpkDropdown>

                                </div>
                                <div className="box-body !p-0">
                                    <div className="grid grid-cols-12 gap-x-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                        <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                            <div className="p-6 sm:border-e border-dashed border-defaultborder dark:border-defaultborder/10 sm:text-start text-center">
                                                <p className="text-[1.25rem] font-semibold mb-0">1,117</p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Ads</p>
                                            </div>
                                        </div>
                                        <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                            <div className="p-6 sm:border-e border-dashed border-defaultborder dark:border-defaultborder/10 sm:text-start text-center">
                                                <p className="text-[1.25rem] font-semibold mb-0"><span className="basic-subscription">742</span></p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50">Active Ads</p>
                                            </div>
                                        </div>
                                        <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                            <div className="p-6 text-sm-start text-center">
                                                <p className="text-[1.25rem] font-semibold mb-0"><span className="pro-subscription">259</span></p>
                                                <p className="mb-0 text-textmuted dark:text-textmuted/50">Inactive Ads</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2" id="adsStats">
                                        <Spkapexcharts chartOptions={OrderSummaryOptions} chartSeries={OrderSummarySeries} type="line" width={"100%"} height={323} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                            <div className="box overflow-hidden">
                                <div className="box-header">
                                    <div className="box-title">Ads Views</div>
                                </div>
                                <div className="box-body !ps-0 !pb-0">
                                    <div id="ads-views">
                                        <Spkapexcharts chartOptions={SalesReportOptions} chartSeries={SalesReportSeries} type="line" width={"100%"} height={223} />
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
                                                <div className={`avatar avatar-lg bg-${card.trend}/[0.15] border border-${card.trend}/10`}>
                                                    <div className="avatar avatar-sm svg-white">
                                                        {card.icon}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="font-semibold mb-1">{card.count}</h5>
                                                <div className="flex align-items-top">
                                                    <p className="mb-0 me-2">{card.title}</p>
                                                    <div className={`text-${card.trend} font-semibold`}>
                                                        <i className={`ri-${card.trendIcon} align-middle`}></i>
                                                        {card.percentage}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                            <div className="box earning-card">
                                <div className="box-body text-fixed-white">
                                    <div className="flex gap-4 items-center">
                                        <span className="avatar avatar-lg p-2 bg-white/[0.15] shadow-sm svg-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="!text-white !fill-white" viewBox="0 0 24 24"><path d="M14,11H10a2,2,0,0,1,0-4h5a1,1,0,0,1,1,1,1,1,0,0,0,2,0,3,3,0,0,0-3-3H13V3a1,1,0,0,0-2,0V5H10a4,4,0,0,0,0,8h4a2,2,0,0,1,0,4H9a1,1,0,0,1-1-1,1,1,0,0,0-2,0,3,3,0,0,0,3,3h2v2a1,1,0,0,0,2,0V19h1a4,4,0,0,0,0-8Z" /></svg>
                                        </span>
                                        <div>
                                            <h5 className="font-semibold block mb-2 text-white">Total Earnings</h5>
                                            <span className="mb-0 text-white">Increase by <span className="badge bg-white/[0.15] text-white">+4.2%</span> this month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box overflow-hidden">
                                <div className="box-header justify-between">
                                    <div className="box-title">Top Countrywise Ads</div>
                                    <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                </div>
                                <div className="box-body !p-0">
                                    <div className="table-responsive">
                                        <Spktables tableClass="ti-custom-table ti-custom-table-head w-full table-country" header={[{ title: 'Country' }, { title: 'Total Ads', headerClassname: '!text-center' }]}>
                                            {TopCountrywiseAds.map((idx) => (
                                                <tr key={idx.id}>
                                                    <th scope="row">
                                                        <div className="flex items-center">
                                                            <div className="me-2 leading-none">
                                                                <span className="avatar custom-img avatar-xs avatar-rounded">
                                                                    <Image fill src={idx.flag} alt="" />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold">{idx.name}</span>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <td className="text-center">{idx.ads}</td>
                                                </tr>
                                            ))}
                                        </Spktables>
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
                <div className="xl:col-span-5 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Recent Users
                            </div>
                            <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                Toggletext="Sort By" Arrowicon={true}>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                            </SpkDropdown>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables tableClass="ti-custom-table ti-custom-table-head w-full ti-custom-table-hover" header={[{ title: 'User Name' }, { title: 'Email', }, { title: 'Status' }]}>
                                    {RecentUsers.map((idx) => (
                                        <tr key={idx.id}>
                                            <td>
                                                <div className="flex items-center font-semibold">
                                                    <span className="avatar avatar-sm me-2 avatar-rounded">
                                                        <Image fill src={idx.avatar} alt="img" />
                                                    </span>{idx.name}
                                                </div>
                                            </td>
                                            <td>{idx.email}</td>
                                            <td>
                                                <span className={`badge ${idx.status === 'Active' ? 'bg-success/[0.15] text-success' : 'bg-danger/[0.15] text-danger'}`}>
                                                    {idx.status}
                                                </span>
                                            </td>
                                        </tr>

                                    ))}
                                </Spktables>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-7 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Recent Orders
                            </div>
                            <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                Toggletext="Sort By" Arrowicon={true}>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                            </SpkDropdown>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables tableClass="ti-custom-table ti-custom-table-head w-full ti-custom-table-hover" header={[{ title: 'Order Id' }, { title: 'User', }, { title: 'Subscription' }, { title: 'Payment' }, { title: 'Cost' }, { title: 'Status' },]}>
                                    {RecentOrdersData.map((idx) => (
                                        <tr key={idx.id}>
                                            <td>{idx.orderId}</td>
                                            <th scope="row">
                                                <div className="flex items-center">
                                                    <div className="me-2">
                                                        <span className="avatar avatar-md p-1 bg-light avatar-rounded">
                                                            <Image fill src={idx.companyLogo} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-0">{idx.companyName}</p>
                                                    </div>
                                                </div>
                                            </th>
                                            <td>
                                                <span className="">{idx.subscription}</span>
                                            </td>
                                            <td>{idx.payment}</td>
                                            <td>{idx.cost}</td>
                                            <td><span className={`badge ${idx.status === 'Paid' ? ' bg-success/[0.15] text-success' : 'bg-warning/[0.15] text-warning'}`}>{idx.status}</span></td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End::row-2 --> */}

            {/* <!-- Start::row-3 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Recent Ads
                            </div>
                            <div className="flex">
                                <div className="me-3">
                                    <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Linktag={true} Linkclass="ti-btn ti-btn-primary ti-btn-sm !m-0 btn-wave"
                                    Toggletext="Sort By" Arrowicon={true}>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">New</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Popular</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Relevant</Link></li>
                                </SpkDropdown>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables tableClass="ti-custom-table ti-custom-table-head w-full ti-custom-table-hover" showCheckbox={true} Customcheckclass="ps-6" header={[{ title: 'Ad Title' }, { title: 'Category', }, { title: 'Status' }, { title: 'Location' }, { title: 'Published Date' }, { title: 'Price' }, { title: 'Action' },]}>
                                    {RecentAds.map((idx) => (
                                        <tr key={idx.id}>
                                            <td className="ps-6"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                            <td>
                                                <div className="flex">
                                                    <span className="avatar custom-img avatar-md avatar-square bg-primary bg-opacity-10"><Image fill src={idx.src} className="" alt="..." /></span>
                                                    <div className="ms-2">
                                                        <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="#!"> {idx.title}</Link></p>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.lable}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {idx.category}
                                            </td>
                                            <td><span className={`badge !rounded-full bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                            <td>
                                                <div className="inline-flex items-center">
                                                    <i className="ri-map-pin-fill text-info me-1 align-middle"></i>
                                                    <span className="ms-1">{idx.location}</span>
                                                </div>
                                            </td>
                                            <td>{idx.date}</td>
                                            <td>{idx.price}</td>
                                            <td>
                                                <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave">
                                                    <i className="ri-eye-line"></i>
                                                </button>
                                                <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-danger btn-wave">
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div className="flex items-center flex-wrap overflow-auto">
                                <div className="mb-2 mb-sm-0">
                                    Showing <b>1</b> to <b>5</b> of <b>10</b> entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i>
                                </div>
                                <div className="ms-auto rtl:me-2">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <ul className="ti-pagination mb-0">
                                            <li className="page-item"> <Link scroll={false} className="page-link disabled" href="#!"> Prev </Link> </li>
                                            <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">4</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">5</Link></li>
                                            <li className="page-item"> <Link scroll={false} className="page-link text-primary" href="#!"> next </Link> </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End::row-3 --> */}

        </Fragment>
    );
};

export default Admin;