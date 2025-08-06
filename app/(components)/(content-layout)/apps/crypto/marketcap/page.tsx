"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { CryptoMarketCap, marketcapData } from "@/shared/data/apps/crypto/marketcapdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Marketcap = () => {
    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Marketcap" />
            <Pageheader Heading="Marketcap" breadcrumbs={['Apps', 'Crypto']} currentpage="Marketcap" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                {marketcapData.map((idx) => (
                    <div key={idx.marketRank} className="xxl:col-span-3 xl:col-span-6 lg:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-body">
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        <div className="me-2">
                                            <span className="avatar avatar-md avatar-rounded bg-light p-2">
                                                <Image fill src={idx.imgSrc} alt='' />
                                            </span>
                                        </div>
                                        <div className="mb-0 font-medium">
                                            {idx.name} - {idx.symbol}
                                        </div>
                                    </div>
                                    <div className="ms-auto">
                                        <div id={idx.chartId}>
                                            <Spkapexcharts chartOptions={idx.chartOptions} chartSeries={idx.chartSeries} type="line" width={120} height={30} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <div>
                                        <p className="mb-1">{idx.symbol} / USD</p>
                                        <p className="text-[1.25rem] mb-0 font-medium leading-none text-primary">{idx.price}</p>
                                    </div>
                                    <div className="ms-auto text-end">
                                        <p className="mb-0">{idx.text}</p>
                                        <p className="mb-0 text-textmuted dark:text-textmuted/50">
                                            <span className="text-textmuted dark:text-textmuted/50">Vol: </span> {idx.volume}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer !p-0">
                                <div className="list-group border-0">
                                    <Link scroll={false} href="#!" className="py-3 !px-[1.25rem] flex flex-col items-start border-t-0 border-x-0 !border-b dark:border-defaultborder/10">
                                        <div className="sm:flex w-full justify-between items-center">
                                            <p className="tx-14 mb-0 font-weight-semibold text-dark">
                                                Price Change
                                                <span className={`badge ${idx.priceChangeStatus === "Increased" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"} ms-4`}>
                                                    {idx.priceChangeStatus}
                                                </span>
                                            </p>
                                            <p className="text-success mb-0 font-weight-normal tx-13">
                                                <span className="numberfont">{idx.change}</span> <i className="fa fa-arrow-up"></i> today
                                            </p>
                                        </div>
                                    </Link>
                                    <Link scroll={false} href="#!" className="py-3 px-[1.25rem] flex flex-col items-start border-t-0 border-x-0">
                                        <div className="flex w-full justify-between items-center">
                                            <p className="tx-14 mb-0 font-weight-semibold text-dark">Market Rank
                                                {idx.badge && (
                                                    <span className="badge bg-secondary/10 text-secondary ms-4">3 Years</span>
                                                )}
                                            </p>
                                            <p className="text-dark mb-0 tx-15">
                                                <span className="numberfont">{idx.marketRank}</span>
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="xxl:col-span-3 xl:col-span-6 lg:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                My Top Currencies
                            </div>
                            <div>
                                <Link scroll={false} href="#!"
                                    className="font-medium text-success text-[0.8125rem] underline">View All</Link>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <ul className="ti-list-group ti-list-group-flush">
                                <li className="ti-list-group-item">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="avatar avatar-sm p-1 bg-light">
                                                    <Image fill src="../../../assets/images/crypto-currencies/regular/Bitcoin.svg" alt="" />
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block font-medium">Bitcoin</span>
                                                <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] font-normal">$29,948.80</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 text-nowrap">Max Limit</span>
                                            <span className="font-medium block">50 BTC</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">My Volume</span>
                                            <span className="font-medium block text-nowrap">31.2450 BTC</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="ti-list-group-item">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="avatar avatar-sm p-1 bg-light">
                                                    <Image fill src="../../../assets/images/crypto-currencies/regular/litecoin.svg" alt="" />
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block font-medium">Litecon</span>
                                                <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] font-normal">$9332.98</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">Max Limit</span>
                                            <span className="font-medium block">200 LTC</span>
                                        </div>
                                        <div className="text-end">
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">My Volume</span>
                                            <span className="font-medium block">38.0023 LTC</span>
                                        </div>
                                    </div>
                                </li>
                                <li className="ti-list-group-item">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <span className="avatar avatar-sm p-1 bg-light">
                                                    <Image fill src="../../../assets/images/crypto-currencies/regular/Ethereum.svg" alt="" />
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block font-medium">Etherium</span>
                                                <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] font-normal">$1,895.96</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 text-nowrap">Max Limit</span>
                                            <span className="font-medium block">100 ETH</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">My Volume</span>
                                            <span className="font-medium block text-nowrap">69.2412 BTC</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}

            {/* <!-- Start::row-2  --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Crypto MarketCap
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div>
                                    <input className="form-control form-control-sm" type="text"
                                        placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false} href="#!"
                                        className="ti-btn ti-btn-primary ti-btn-sm !m-0 btn-wave waves-effect waves-light"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        Sort By<i className="ri-arrow-down-s-line align-middle ms-2 d-inline-block"></i>
                                    </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Market Cap</Link> </li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Price</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Trading Volume</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Price Change (24h)</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Rank</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">A - Z</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">All-Time High (ATH)</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <SpkButton variant="secondary" buttontype="button" customClass="ti-btn ti-btn-sm btn-wave waves-effect waves-light !m-0">View All</SpkButton>
                                </div>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: '' }, { title: '#', headerClassname: 'font-medium' }, { title: 'Crypto Name' }, { title: 'MarketCap', }, { title: 'Price', }, { title: '1h Change', }, { title: '24h Change', }, { title: 'Volume (24h)', }, { title: 'Circulating Supply', }, { title: 'last 1Week', }, { title: 'Trade', },]}>
                                    {CryptoMarketCap.map((idx) => (
                                        <tr key={idx.id}>
                                            <td className="text-center">
                                                <Link scroll={false} href="#!"><i className="ri-star-line text-[1rem] text-textmuted dark:text-textmuted/50"></i></Link>
                                            </td>
                                            <td>{idx.id}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image fill src={idx.src} alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="font-medium"><Link scroll={false} href="#!">{idx.name}</Link></div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-medium">{idx.marketCap}</span>
                                            </td>
                                            <td>
                                                <span className="font-medium">
                                                    <Link scroll={false} href="#!">{idx.price}</Link>
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`text-${idx.color1} font-medium`}>
                                                    <i className={`ti ti-arrow-narrow-${idx.arrowdir} text-[0.9375rem] font-medium`}></i>{idx.marketChange1h}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`text-${idx.color2} font-medium`}>
                                                    <i className={`ti ti-arrow-narrow-${idx.arrowdir1} text-[0.9375rem] font-medium`}></i>{idx.marketChange24h}
                                                </span>
                                            </td>
                                            <td>
                                                <Link scroll={false} href="#!">
                                                    <span className="block font-medium">{idx.volume}</span>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link scroll={false} href="#!">
                                                    <span className="font-medium block mb-2">
                                                        {idx.circulation}
                                                    </span>
                                                    {idx.value1 && (
                                                        <div className="progress-stacked progress-xs w-[75%] mb-4 flex">
                                                            <div className={`progress-bar !bg-success opacity-[0.5] w-[${idx.value1}%]`} role="progressbar" aria-valuenow={idx.value1} aria-valuemin={0} aria-valuemax={100}></div>
                                                            <div className={`progress-bar !rounded-s-none !rounded-e-full !bg-danger opacity-[0.5] w-[${idx.value2}%]`} role="progressbar" aria-valuenow={idx.value2} aria-valuemin={0} aria-valuemax={100}></div>
                                                        </div>
                                                    )}

                                                </Link>
                                            </td>
                                            <td>
                                                <div id="btc-chart">
                                                    <Spkapexcharts chartOptions={idx.chartOptions} chartSeries={idx.chartSeries} type="line" width={120} height={30} />
                                                </div>
                                            </td>
                                            <td>
                                                <SpkButton variant="soft-success" buttontype="button" customClass="ti-btn ti-btn-sm !m-0">Trade</SpkButton>

                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer">
                            <nav aria-label="Page navigation">
                                <ul className="ti-pagination mb-0 float-end">
                                    <li className="page-item disabled">
                                        <Link href="#!" scroll={false} className="page-link">Previous</Link>
                                    </li>
                                    <li className="page-item"><Link scroll={false} className="page-link" href="#!">1</Link></li>
                                    <li className="page-item active" aria-current="page">
                                        <Link scroll={false} className="page-link" href="#!">2</Link>
                                    </li>
                                    <li className="page-item"><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                    <li className="page-item">
                                        <Link scroll={false} className="page-link" href="#!">Next</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End::row-2  --> */}

        </Fragment>
    );
};

export default Marketcap;