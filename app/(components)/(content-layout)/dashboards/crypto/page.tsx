"use client"
import SpkCryptoCard from "@/shared/@spk-reusable-components/dashboards/spk-crypto-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import * as cryptodata from "@/shared/data/dashboard/cryptodata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";

const Crypto = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Crypto" />
                <Pageheader Heading="Crypto" breadcrumbs={['Dashboards']} currentpage="Crypto" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    {cryptodata.cardData.map((card: any, index: any) => (
                        <div key={index} className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                            <SpkCryptoCard card={card} />
                        </div>
                    ))}
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    COIN STATISTICS
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <div className="inline-flex rounded-sm">
                                        <SpkButton buttontype="button" variant="" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] ti-btn-primary btn-wave text-white">1D</SpkButton>
                                        <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave">1W</SpkButton>
                                        <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave">1M</SpkButton>
                                        <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave !rounded-s-none">1Y</SpkButton>
                                    </div>
                                    <div
                                        className="ti-btn-group-sm ti-dropdown hs-dropdown p-0 border-0 !m-0">
                                        <button type="button" className="ti-btn ti-btn-outline-light !text-[0.8rem] !text-dark !m-0 border border-defaultborder dark:border-defaultborder/10 ti-btn-sm dropdown-toggle !py-1 !px-[0.8rem]" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="avatar avatar-xs avatar-rounded me-2 align-middle">
                                                <Image fill src="../../assets/images/crypto-currencies/crypto-icons/bitcoin-btc-logo.svg" alt="" />
                                            </span>
                                            Bitcoin <i className="ri-arrow-down-s-line align-middle"></i>
                                        </button>
                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden">
                                            <li>
                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                    <span className="avatar avatar-xs avatar-rounded me-2 align-middle">
                                                        <Image fill src="../../assets/images/crypto-currencies/crypto-icons/ethereum-eth-logo.svg" alt="" />
                                                    </span>
                                                    Etherium
                                                </Link>
                                            </li>
                                            <li>
                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                    <span className="avatar avatar-xs avatar-rounded me-2 align-middle">
                                                        <Image fill src="../../assets/images/crypto-currencies/crypto-icons/tether-usdt-logo.svg" alt="" />
                                                    </span>Tether
                                                </Link>
                                            </li>
                                            <li>
                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                    <span className="avatar avatar-xs avatar-rounded me-2 align-middle">
                                                        <Image fill src="../../assets/images/crypto-currencies/crypto-icons/xrp-xrp-logo.svg" alt="" />
                                                    </span>XRP
                                                </Link>
                                            </li>
                                            <li>
                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                    <span className="avatar avatar-xs avatar-rounded me-2 align-middle">
                                                        <Image fill src="../../assets/images/crypto-currencies/crypto-icons/tron-trx-logo.svg" alt="" />
                                                    </span>TRON
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="p-4 flex items-center gap-4 border border-dashed border-defaultborder dark:border-defaultborder/10 rounded flex-wrap">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="avatar avatar-sm">
                                            <Image fill src="../../assets/images/crypto-currencies/crypto-icons/bitcoin-btc-logo.svg" alt="" />
                                        </span>
                                        <div><span className="font-medium">Bitcoin</span> - <span className="text-textmuted dark:text-textmuted/50">BTC</span></div>
                                    </div>
                                    <h6 className="font-medium mb-0">$42,761.32 USD<span className="text-success mx-2">0.14%</span>(24H)</h6>
                                    <div className="flex gap-4 items-center flex-wrap">
                                        <div>Open - <span className="text-success font-medium">6612.98</span></div>
                                        <div>High - <span className="text-success font-medium">6625.97</span></div>
                                        <div>Low - <span className="text-danger font-medium">6612.34</span></div>
                                        <div>Close - <span className="text-success font-medium">6623.45</span></div>
                                    </div>
                                </div>
                                <div id="coin-statistics">
                                    <Spkapexcharts chartOptions={cryptodata.StatiisticsOptions} chartSeries={cryptodata.StatiisticsSeries} type="candlestick" width={'100%'} height={320} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    MY ASSETS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body !p-0">
                                <div id="assets" className="p-4 border-b border-defaultborder dark:border-defaultborder/10">
                                    <Spkapexcharts chartOptions={cryptodata.AssetsOptions} chartSeries={cryptodata.AssetsSeries} type="donut" width={'100%'} height={165} />
                                </div>
                                <div>
                                    <ul className="ti-list-group ti-list-group-flush">
                                        {cryptodata.cryptoData.map((crypto, index) => (
                                            <li key={index} className="ti-list-group-item">
                                                <div className="flex items-start flex-wrap gap-2 leading-none">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-sm">
                                                            <Image fill src={crypto.logo} alt={crypto.name} />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow leading-none">
                                                        <span className="block font-medium mb-1">{crypto.name}</span>
                                                        <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">{crypto.symbol}</span>
                                                    </div>
                                                    <div className="text-end leading-none">
                                                        <span className="font-semibold block mb-1">{crypto.price}</span>
                                                        <span className={`text-[0.75rem] ${crypto.priceChangeClass}`}>{crypto.percentage}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
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
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TRANSACTIONS
                                </div>
                                <Link scroll={false} href="#!" className="ti-btn ti-btn-light ti-btn-sm !m-0"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="ti-list-unstyled mb-0 my-assets-list">
                                    {cryptodata.cryptoTransactions.map((transaction, index) => (
                                        <li key={index}>
                                            <Link scroll={false} href="#!">
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center">
                                                        <div className="me-2">
                                                            <span className="avatar avatar-sm">
                                                                <Image fill src={transaction.logo} alt={transaction.name} />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="mb-0 font-medium">{transaction.name}</p>
                                                            <p className="mb-0 text-[0.75rem]">{transaction.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <p className={`mb-0 font-medium ${transaction.priceChangeClass}`}>
                                                            {transaction.priceChange}
                                                        </p>
                                                        <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">
                                                            {transaction.symbol}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    CURRENCY EXCHANGE
                                </div>
                            </div>
                            <div className="box-body">
                                <label className="form-label">Select Coin</label>
                                <div className="input-group mb-4 flex flex-nowrap mt-2 crypto-input">
                                    <input type="text" className="form-control form-control-sm !border-s border-e-0 crypto-buy-sell-input"
                                        aria-label="crypto buy select" placeholder="Select Currency" />
                                    <SpkSelect name="state" option={cryptodata.Coindata} mainClass="currency-select" defaultvalue={[cryptodata.Coindata[0]]}
                                        menuplacement='auto' classNameprefix="Select2" searchable />
                                </div>
                                <label className="form-label">Select Currency</label>
                                <div className="input-group mb-4 flex flex-nowrap mt-2 crypto-input">
                                    <input type="text"
                                        className="form-control form-control-sm !border-s border-e-0 crypto-buy-sell-input"
                                        aria-label="crypto buy select" placeholder="36,335.00" />
                                    <SpkSelect name="state" option={cryptodata.Currencydata} mainClass="currency-select" defaultvalue={[cryptodata.Currencydata[0]]}
                                        menuplacement='auto' classNameprefix="Select2" searchable />
                                </div>
                                <span className="block text-textmuted dark:text-textmuted/50 font-normal text-[0.75rem] mb-1 pt-2">Track real-time
                                    crypto prices and seamlessly exchange currencies here..</span>
                            </div>
                            <div className="box-footer">
                                <div className="grid">
                                    <button type="button" className="ti-btn ti-btn-primary btn-wave">CONVERT</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    MY BALANCE
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Currency', headerClassname: 'text-center' }, { title: 'Coins Possessed', }, { title: 'USD Price' }, { title: '24H change', },]}>
                                        {cryptodata.MyBlance.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="avatar avatar-xs avatar-rounded">
                                                            <Image fill src={idx.logo} alt="" />
                                                        </span>
                                                        <Link scroll={false} href="#!" className="font-medium">{idx.currency} -
                                                            <span className="text-textmuted dark:text-textmuted/50"> {idx.symbol}</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>{idx.coinsPossessed} </td>
                                                <td>
                                                    <span className="font-medium text-[0.875rem]">{idx.usdPrice}</span>
                                                </td>
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
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between flex-wrap items-center gap-1">
                                <div className="box-title">
                                    CRYPTO RANKINGS
                                </div>
                                <div className="inline-flex rounded-md shadow-sm" role="group" >
                                    <SpkButton buttontype="button" variant="" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] ti-btn-primary btn-wave text-white">1D</SpkButton>
                                    <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave">1W</SpkButton>
                                    <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave">1M</SpkButton>
                                    <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave">3M</SpkButton>
                                    <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave custom-crypto-end">6M</SpkButton>
                                    <SpkButton buttontype="button" variant="soft-primary" customClass="ti-btn-group !border-0 !py-1 !px-[0.8rem] !text-[0.8rem] !rounded-s-none  btn-wave">1Y</SpkButton>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'S.No', headerClassname: '!text-center' }, { title: 'Coin Name', }, { title: 'Price' }, { title: 'Market Cap', }, { title: 'Price Change', }, { title: 'Price Graph', }, { title: 'Volume', },]}>
                                        {cryptodata.ranking.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center">{idx.id}</td>
                                                <td>
                                                    <div className="leading-none flex items-center">
                                                        <span className="avatar avatar-xs avatar-rounded me-1">
                                                            <Image fill src={idx.coinSrc} alt="" />
                                                        </span>{idx.coinName}
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.price}
                                                </td>
                                                <td>
                                                    {idx.marketCap}
                                                </td>
                                                <td>
                                                    <span className={`text-${idx.textColor}`}>{idx.priceChange}</span>
                                                </td>
                                                <td>
                                                    <div id="bitcoin-price-graph">
                                                        <Spkapexcharts chartOptions={idx.chartOptions} chartSeries={idx.chartSeries} type="area" width={120} height={20} />
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.volume}
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

export default Crypto;