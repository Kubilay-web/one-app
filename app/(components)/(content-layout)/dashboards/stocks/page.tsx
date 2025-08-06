"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import SpkSwiperJs from "@/shared/@spk-reusable-components/spk-packages/spk-swiperjs";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import * as stocksdata from "@/shared/data/dashboard/stocksdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Stocks = () => {

    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Stocks" />
                <Pageheader Heading="Stocks" breadcrumbs={['Dashboards']} currentpage="Stocks" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <SpkSwiperJs slides={stocksdata.StockSlides} className="swiper-basic swiper-initialized swiper-horizontal swiper-backface-hidden mySwiper" slidesPerView={3}
                            spaceBetween={20}
                            freemode={true}
                            autoplay={true}
                            breakpoint={stocksdata.breakpoints} />
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    {stocksdata.stocks.map((idx) => (
                        <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12" key={idx.id}>
                            <div className="box">
                                <div className="box-body">
                                    <div className="flex items-start gap-2 mb-6 flex-wrap">
                                        <div className="leading-none">
                                            <span className="avatar avatar-md">
                                                <Image fill src={idx.src} alt="" className={idx.srcclass} />
                                            </span>
                                        </div>
                                        <div className="flex-grow leading-none">
                                            <span className="block mb-2">{idx.title}</span>
                                            <span className="block text-[0.75rem]">{idx.lable}</span>
                                        </div>
                                        <div id="apple-stock-chart">
                                            <Spkapexcharts chartOptions={idx.chartOptions} chartSeries={idx.chartSeries} type="line" width={100} height={20} />
                                        </div>
                                    </div>
                                    <div className="mb-0 flex items-center justify-between flex-wrap">
                                        <h4 className="font-medium leading-none mb-0">{idx.price}<span className={`text-${idx.textColor} ms-2 align-middle text-[0.75rem] inline-block`}>{idx.text}</span></h4>
                                        <span className="text-[0.75rem]">{idx.stocks} Stocks
                                            <SpkOverlay customClass="[--trigger:hover] [--placement:left]">
                                                <Link scroll={false} className="ms-1 svg-secondary" href="#!" >
                                                    <i className="ri-information-2-line"></i>
                                                    <span
                                                        className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                                        role="tooltip">
                                                        Share value fluctuates timely.
                                                    </span>
                                                </Link>
                                            </SpkOverlay>

                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TOTAL INVESTMENTS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div className="flex alilgn-items-center justify-between gap-4 p-4 bg-light flex-wrap rounded-md">
                                    <div className="flex flex-wrap flex-grow gap-4">
                                        <div>
                                            <span className="block text-textmuted dark:text-textmuted/50 mb-1">Invested Value</span>
                                            <span className="block font-medium"> $1,290.94 <span className="text-success ms-1 text-[0.75rem]"><i className="ti ti-chevron-up"></i> 1.22%</span></span>
                                            <div className="block text-textmuted dark:text-textmuted/50 text-[0.6875rem] mt-4">Jun 17, 2024 11:25 AM UTC +5:30</div>
                                        </div>
                                        <div>
                                            <span className="block text-textmuted dark:text-textmuted/50 mb-1">Total Returns</span>
                                            <span className="block font-medium">$25,458.20 <span className="text-success ms-1 text-[0.75rem]"><i className="ti ti-chevron-up"></i> 10.14%</span></span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-end">
                                        <div>
                                            <span className="block text-textmuted dark:text-textmuted/50 mb-1">Today Change</span>
                                            <span className="block font-medium"> $112.09</span>
                                        </div>
                                        <div>
                                            <span className="block text-textmuted dark:text-textmuted/50 mb-1">Change In %</span>
                                            <span className="block font-medium">+0.01% <span className="text-success ms-1 text-[0.75rem]"><i className="ti ti-chevron-up"></i> 0.21%</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div id="totalInvestmentsStats">
                                    <Spkapexcharts chartOptions={stocksdata.InvestmentsOptions} chartSeries={stocksdata.InvestmentsSeries} type="area" width={'100%'} height={390} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    WATCHLIST
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head ti-striped-table" header={[{ title: 'Symbol' }, { title: 'Last Price', }, { title: 'Change' }]}>
                                        {stocksdata.Watchlist.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="avatar avatar-xs">
                                                            <Image fill src={idx.src} alt="" className={idx.imgcls} />
                                                        </span>
                                                        <Link scroll={false} href="#!" className="font-medium">{idx.symbol}</Link>
                                                    </div>
                                                </td>
                                                <td>{idx.lastPrice}</td>
                                                <td>
                                                    <span className={`text-${idx.changeClass}`}>{idx.change}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-4 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TRENDING STOCKS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50 py-1"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush">
                                    {stocksdata.TRENDING.map((stock, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <div className="flex gap-2 flex-wrap items-start justify-between mb-2">
                                                <div className="flex flex-grow items-center">
                                                    <div className="me-2">
                                                        <span className="avatar avatar-md">
                                                            <Image fill src={stock.imageSrc} alt={stock.name} className={stock.imgcls} />
                                                        </span>
                                                    </div>
                                                    <div className="leading-none">
                                                        <span className="font-semibold block mb-2 text-default">{stock.name}</span>
                                                        <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem]">{stock.price}</span>
                                                    </div>
                                                </div>
                                                <div className="text-success text-[0.75rem] text-end">
                                                    <span className="block">{stock.changePercent}<i className="ti ti-arrow-bear-right"></i></span>
                                                    <span className="block">{stock.changeAmount}</span>
                                                </div>
                                            </div>
                                            <div className="btn-list text-end">
                                                <button type="button" className="ti-btn ti-btn-sm btn-wave ti-btn-danger ti-btn-w-sm !m-0 !me-2 !mb-2 sm:!mb-0">Short</button>
                                                <button type="button" className="ti-btn ti-btn-sm btn-wave ti-btn-success me-0 ti-btn-w-sm !m-0 !mb-2 sm:!mb-0">Buy</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-8 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    MY STOCKS
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
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Stock' }, { title: 'Open', }, { title: 'Price' }, { title: 'Close', }, { title: 'Change' }, { title: 'Marketcap' }, { title: 'Volume' }]}>
                                        {stocksdata.MyStocks.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-sm avatar-rounded"><Image fill src={idx.src} className={idx.imgcls} alt="..." /></span>
                                                        </div>
                                                        <div className="ms-2">
                                                            <p className="font-semibold fs-13 mb-0 flex items-center"><Link scroll={false} href="#!">{idx.stock}</Link></p>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.company}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.open} </td>
                                                <td>{idx.price}</td>
                                                <td>{idx.close}</td>
                                                <td> <span className={`badge bg-${idx.changeClass}/[0.15] text-${idx.changeClass}`}>{idx.change}</span></td>
                                                <td>{idx.marketcap}</td>
                                                <td>{idx.volume}</td>
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

export default Stocks;