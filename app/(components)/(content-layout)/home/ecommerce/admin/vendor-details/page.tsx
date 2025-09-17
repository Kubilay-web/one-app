"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { OrderSummaryOptions, OrderSummarySeries } from "@/shared/data/apps/ecommers/admin/customer-details-data";
import { SalesReportOptions, SalesReportSeries } from "@/shared/data/apps/ecommers/admin/reportsdata";
import { RecemtInvoiceData, RecentAddedProducts, RecentOrdersdata, cards, countries, stats } from "@/shared/data/apps/ecommers/admin/vendor-details-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const VendorDetails = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Vendor Details" />
                <Pageheader Heading="Vendor Details" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Vendor Details" />
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
                                                    <div className="mb-2">{item.title}</div>
                                                    <div className="text-textmuted dark:text-textmuted/50 mb-0 text-[0.75rem] flex flex-wrap items-center">
                                                        <h5 className={`${item.textClass}`}>{item.count}</h5>
                                                        <Link scroll={false} href={item.link} className="text-primary font-semibold text-xs">
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
                                        <div className="grid grid-cols-12 gap-x-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-6 border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
                                                    <p className="text-[1.25rem] font-medium mb-0">1,117</p>
                                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">Total Orders</p>
                                                </div>
                                            </div>
                                            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                                                <div className="p-6 border-e border-dashed dark:border-defaultborder/10 sm:text-start text-center">
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
                                            <Spkapexcharts chartOptions={OrderSummaryOptions} chartSeries={OrderSummarySeries} type="line" width={"100%"} height={350} />
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
                                    <div className="box-header">
                                        <div className="box-title">MONTHLY SALES REPORT</div>
                                    </div>
                                    <div className="box-body !ps-0 !pb-0">
                                        <div id="sales-report">
                                            <Spkapexcharts chartOptions={SalesReportOptions} chartSeries={SalesReportSeries} type="line" width={"100%"} height={245} />
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
                                                    <div className={`avatar avatar-lg bg-${card.trend1}/[0.15] border ${card.trendBorder}`}>
                                                        <div className="avatar avatar-sm svg-white">
                                                            {card.icon}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="font-semibold mb-1">{card.count}</h5>
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
                                                <h5 className="font-medium block text-white mb-1">Total Earnings</h5>
                                                <span className="mb-0 text-white">Increase by <span className="badge bg-white/[0.15] text-white mx-1">+4.2%</span> this month</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">TOP COUNTRY SALES</div>
                                        <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                            Toggletext="View All" Arrowicon={true}>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Today</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                        </SpkDropdown>
                                    </div>
                                    <div className="box-body !p-0">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full table-country" header={[{ title: 'Country' }, { title: 'No. Of Sales', headerClassname: "text-center" },]}>

                                                {countries.map((country, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <div className="flex items-center">
                                                                <div className="me-2 leading-none">
                                                                    <span className="avatar custom-img avatar-xs avatar-rounded">
                                                                        <Image
                                                                            fill
                                                                            src={`../../../../assets/images/flags/${country.flag}`}
                                                                            alt={`${country.name} flag`}
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">{country.name}</span>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <td className="text-center">{country.value}</td>
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
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    RECENT ORDERS
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
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full whitespace-nowrap" header={[{ title: 'Order Id' }, { title: 'Product', }, { title: 'Customer', }, { title: 'Payment Mode' }, { title: 'Cost' }, { title: 'Status' }, { title: 'Action' }]}>
                                        {RecentOrdersdata.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>{idx.id}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="avatar custom-img avatar-sm avatar-square bg-gray-300 dark:bg-light"><Image fill src={idx.productSrc} alt="..." /></span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="#!">{idx.productName}</Link></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="avatar avatar-sm me-2 avatar-rounded">
                                                            <Image fill src={idx.customerSrc} alt="" />
                                                        </span>{idx.customerName}
                                                    </div>
                                                </td>
                                                <td>{idx.paymentMode}</td>
                                                <td className="font-semibold">{idx.cost}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                                <td>
                                                    <button className="ti-btn ti-btn-sm ti-btn-outline-light btn-wave ti-btn-icon !m-0">
                                                        <i className="fe fe-eye text-textmuted dark:text-textmuted/50 text-[0.775rem]"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    RECENT INVOICES
                                </div>
                                <Link scroll={false} href="#!" className="ti-btn ti-btn-soft-primary ti-btn-sm !m-0">
                                    View All
                                </Link>
                            </div>
                            <div className="box-body !p-0">
                                {RecemtInvoiceData.map((idx) => (
                                    <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10 flex items-top flex-wrap gap-2" key={idx.invoiceId}>
                                        <div className="svg-icon-background bg-info/[0.15] me-2 svg-info">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="!text-info !fill-info" data-name="Layer 1" viewBox="0 0 24 24"><path d="M13,16H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM9,10h2a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,2H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Zm-7-7H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"></path></svg>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="mb-0 font-semibold">{idx.invoiceId}
                                                <span className={`badge badge-sm bg-${idx.badgeColr}/[0.15] text-${idx.badgeColr} ms-2`}>{idx.badge}</span>
                                            </p>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 me-2 inline-block">{idx.date}</span>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> 09:40am</span>
                                        </div>
                                        <div>
                                            <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave !m-0 !me-1">
                                                <i className="ri-eye-line"></i>
                                            </button>
                                            <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-secondary ti-btn-wave !m-0">
                                                <i className="ri-download-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
                                    RECENLTY ADDED PRODUCTS
                                </div>
                                <div className="flex">
                                    <div className="me-3">
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                    <div className="ti-dropdown hs-dropdown">
                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-primary ti-btn-sm btn-wave !m-0" data-bs-toggle="dropdown" aria-expanded="false">
                                            Sort By<i className="ri-arrow-down-s-line align-middle ms-2"></i>
                                        </Link>
                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">New</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Popular</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Relevant</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full whitespace-nowrap" showCheckbox={true} Customcheckclass="ps-6" header={[{ title: 'Product' }, { title: 'Category', }, { title: 'Status', }, { title: 'Stock Qty' }, { title: 'Total Sales' }, { title: 'Added Date' }, { title: 'Price' }, { title: 'Action' },]}>
                                        {RecentAddedProducts.map((idx) => (
                                            <tr key={idx.totalSales}>
                                                <td className="ps-6"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                                <td>
                                                    <div className="flex">
                                                        <span className="avatar custom-img avatar-md avatar-square bg-gray-300 dark:bg-light"><Image fill src={idx.productSrc} className="" alt="..." /></span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="#!">{idx.productName}</Link></p>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.productBrand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.category}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                                <td>{idx.qty} </td>
                                                <td>{idx.totalSales} </td>
                                                <td>{idx.date}</td>
                                                <td className="font-semibold">{idx.price}</td>
                                                <td>
                                                    <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave !m-0 !me-1">
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
                                <div className="flex items-center flex-wrap">
                                    <div className="mb-2 mb-sm-0">
                                        Showing <b>1</b> to <b>4</b> of <b>10</b> entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i>
                                    </div>
                                    <div className="ms-auto">
                                        <nav aria-label="Page navigation" className="pagination-style-4 float-end">
                                            <ul className="ti-pagination mb-0">
                                                <li className="page-item"><Link scroll={false} className="page-link disabled" href="#!">Prev </Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                                <li className="page-item"> <Link scroll={false} className="page-link" href="#!"> <i className="bi bi-three-dots"></i></Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">16</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link text-primary" href="#!"> next</Link></li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End::row-3 --> */}
            </div>
        </Fragment>
    );
};

export default VendorDetails;