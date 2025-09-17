"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { BuySellStatisticsOptions, BuySellStatisticsSeries, Data1, Data2 } from "@/shared/data/apps/crypto/buy-sell-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const BuySell = () => {
    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Buy & Sell" />
            <Pageheader Heading="Buy & Sell" breadcrumbs={['Apps', 'Crypto']} currentpage="Buy & Sell" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-4 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Buy Crypto
                            </div>
                        </div>
                        <div className="box-body">
                            <div>
                                <div className="input-group mb-3 flex-nowrap buy-sell-crypto">
                                    <input type="text" className="form-control !border-s !border-e-0" aria-label="crypto buy select" placeholder="Select Currency" />
                                    <SpkSelect name="colors" option={Data1} mainClass="basic-multi-select buysell" placeholder="BTC"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data1[0]]}
                                    />
                                </div>
                                <div className="input-group mb-3 flex-nowrap buy-sell-crypto">
                                    <input type="text" className="form-control  !border-s !border-e-0" aria-label="crypto buy select" />
                                    <SpkSelect name="colors" option={Data2} mainClass="basic-multi-select buysell" placeholder="USD"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data2[0]]}
                                    />
                                </div>
                                <div>
                                    <div className="text-[0.875rem] py-2"><span className="font-medium text-dark">Price: </span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem] d-inline-block"> 6.003435</span><span className="text-dark font-medium float-end">BTC</span></div>
                                    <div className="text-[0.875rem] py-2"><span className="font-medium text-dark">Amount: </span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem] d-inline-block"> 2,34,4543.00</span><span className="text-dark font-medium float-end">LTC</span></div>
                                    <div className="font-medium text-[0.875rem] py-2"> Total: <span className="text-[0.875rem] d-inline-block"> 22.00 BTC</span></div>
                                    <div className="text-[0.75rem] text-success mb-4"> Additional Charges: 0.32%(0.0001231 BTC)</div>
                                    <label className="font-medium text-[0.75rem] mt-4 mb-4">SELECT PAYMENT METHOD :</label>
                                    <div className="grid grid-cols-12 gap-2 mt-4">
                                        <div className="xl:col-span-6 col-span-12">
                                            <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md">
                                                <div className="form-check !flex items-center mb-0">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                                                    <label className="form-check-label text-[0.75rem]" htmlFor="flexRadioDefault1">
                                                        Credit / Debit Cards
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xl:col-span-6 col-span-12">
                                            <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md">
                                                <div className="form-check !flex items-center mb-0">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                    <label className="form-check-label text-[0.75rem]" htmlFor="flexRadioDefault2">
                                                        Paypal
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md">
                                                <div className="form-check !flex items-center mb-0">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                                    <label className="form-check-label text-[0.75rem]" htmlFor="flexRadioDefault3">
                                                        Wallet
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid mt-6 pt-1">
                                    <SpkButton variant="primary" buttontype="button" customClass="ti-btn ti-btn-lg">BUY</SpkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Sell Crypto
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="tab-pane border-0 p-0" id="sell-crypto1" role="tabpanel"
                                aria-labelledby="sell-crypto1">
                                <div className="input-group mb-3 flex-nowrap buy-sell-crypto">
                                    <input type="text" className="form-control  !border-s !border-e-0" aria-label="crypto buy select" placeholder="Select Currency" />
                                    <SpkSelect name="colors" option={Data1} mainClass="basic-multi-select buysell" placeholder="BTC"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data1[0]]}
                                    />
                                </div>
                                <div className="input-group mb-3 flex-nowrap buy-sell-crypto">
                                    <input type="text" className="form-control  !border-s !border-e-0" aria-label="crypto buy select" />
                                    <SpkSelect name="colors" option={Data2} mainClass="basic-multi-select buysell" placeholder="USD"
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data2[0]]}
                                    />
                                </div>
                                <div className="mb-3">
                                    <span className="ti-form-label">Crypto Value :</span>
                                    <div className="relative">
                                        <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md flex items-center justify-between gap-3 mt-1">
                                            <div className="gap-2 flex items-center">
                                                <div className="leading-none">
                                                    <span className="avatar bg-light p-2">
                                                        <Image priority fill src="../../../assets/images/crypto-currencies/regular/Bitcoin.svg" alt="" />
                                                    </span>
                                                </div>
                                                <div className="font-medium">Bitcoin - BTC</div>
                                            </div>
                                            <div className="text-end">
                                                <span className="font-medium block">0.374638535 BTC</span>
                                                <span className="text-textmuted dark:text-textmuted/50">$5,364.65</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="ti-form-label">Deposit To :</span>
                                    <div className="relative">
                                        <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md flex items-center gap-2 mt-1">
                                            <div className="leading-none">
                                                <span className="avatar bg-light p-2">
                                                    <i className="ri-bank-line text-info text-[1.25rem]"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium block">Banking</span>
                                                <span className="text-textmuted dark:text-textmuted/50">Checking ...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[0.875rem] py-2">
                                        <div className="inline-flex">
                                            <span className="font-medium text-dark">Price:</span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem]">6.003435</span>
                                        </div>
                                        <span className="text-dark font-medium float-end">BTC</span>
                                    </div>
                                    <div className="text-[0.875rem] py-2">
                                        <div className="inline-flex">
                                            <span className="font-medium text-dark">Amount:</span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem]">2,34,4543.00</span>
                                        </div>
                                        <span className="text-dark font-medium float-end">LTC</span>
                                    </div>
                                </div>
                                <div className="grid mt-6">
                                    <SpkButton variant="danger" buttontype="button" customClass="ti-btn ti-btn-lg">SELL</SpkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Quick Secure Transfer
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="tab-pane border-0 p-0" id="sell-crypto" role="tabpanel"
                                aria-labelledby="sell-crypto">
                                <div className="mb-3">
                                    <span className="ti-form-label">Crypto Value :</span>
                                    <div className="relative">
                                        <Link scroll={false} href="#!" className="stretched-link"></Link>
                                        <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md flex items-center justify-between gap-3 mt-1">
                                            <div className="gap-2 flex items-center">
                                                <div className="leading-none">
                                                    <span className="avatar bg-light p-2">
                                                        <Image fill priority src="../../../assets/images/crypto-currencies/regular/Bitcoin.svg" alt="" />
                                                    </span>
                                                </div>
                                                <div className="font-medium">Bitcoin - BTC</div>
                                            </div>
                                            <div className="text-end">
                                                <span className="font-medium block">0.374638535 BTC</span>
                                                <span className="text-textmuted dark:text-textmuted/50">$5,364.65</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="ti-form-label">Deposit To :</span>
                                    <div className="relative">
                                        <Link scroll={false} href="#!" className="stretched-link"></Link>
                                        <div className="p-2 border border-defaultborder dark:border-defaultborder/10 rounded-md flex items-center gap-2 mt-1">
                                            <div className="leading-none">
                                                <span className="avatar bg-light p-2">
                                                    <i className="ri-bank-line text-info text-[1.25rem]"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium block">Banking</span>
                                                <span className="text-textmuted dark:text-textmuted/50">Checking ...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="block font-medium">Amount :</span>
                                    <div className="flex items-center justify-between text-textmuted dark:text-textmuted/50">
                                        <div>Weekly Bank Limit</div>
                                        <div>$10,000 remaining</div>
                                    </div>
                                </div>
                                <div className="input-group mb-3 flex-nowrap buy-sell-crypto">
                                    <input type="text" className="form-control  !border-s !border-e-0" aria-label="crypto buy select" />
                                    <SpkSelect name="colors" option={Data2} mainClass="basic-multi-select buysell" placeholder="USD"
                                        menuplacement='auto' classNameprefix="Select2"
                                    />
                                </div>
                                <div>
                                    <div className="text-[0.875rem] py-2">
                                        <div className="inline-flex">
                                            <span className="font-medium text-dark">Price:</span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem]">6.003435</span>
                                        </div>
                                        <span className="text-dark font-medium float-end">BTC</span>
                                    </div>
                                    <div className="text-[0.875rem] py-2">
                                        <div className="inline-flex">
                                            <span className="font-medium text-dark">Amount:</span><span className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.875rem]">2,34,4543.00</span>
                                        </div>
                                        <span className="text-dark font-medium float-end">LTC</span>
                                    </div>
                                </div>
                                <div className="grid mt-6">
                                    <SpkButton variant="success" buttontype="button" customClass="ti-btn ti-btn-lg">Transfer</SpkButton>

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
                                Buy & Sell Statistics
                            </div>
                            <div className="inline-flex rounded-sm">
                                <SpkButton variant="primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] btn-wave text-white waves-effect waves-light">1W</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-[0.45rem] !px-[0.75rem]  btn-wave waves-effect waves-light">1M</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-[0.45rem] !px-[0.75rem] btn-wave waves-effect waves-light">3M</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-[0.45rem] !px-[0.75rem] btn-wave waves-effect waves-light">6M</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-[0.45rem] !px-[0.75rem] btn-wave !rounded-s-none waves-effect waves-light">1Y</SpkButton>
                            </div>
                        </div>
                        <div className="box-body xl:p-0">
                            <div className="grid grid-cols-12 sm:gap-x-6">
                                <div className="xl:col-span-8 col-span-12 pe-0 border-e border-dashed border-defaultborder dark:border-defaultborder/10">
                                    <div className="flex flex-wrap items-center border-bottom border-block-end-dashed mb-3 p-3 gap-4 ps-5 justify-between">
                                        <div>
                                            <span className="block text-[0.75rem]">Total Buy</span>
                                            <span className="block font-medium fs-15 text-success">$324.25 USD</span>
                                        </div>
                                        <div>
                                            <span className="block text-[0.75rem]">Total Sell</span>
                                            <span className="block font-medium fs-15 text-danger">$4,235.25 USD</span>
                                        </div>
                                        <div>
                                            <span className="block text-[0.75rem]">Available Balance</span>
                                            <span className="block font-medium fs-15 text-primary">$22,803.92 USD</span>
                                        </div>
                                        <div>
                                            <span className="block text-[0.75rem]">Total Crypto Asset Value</span>
                                            <span className="block font-medium fs-15 text-warning">$4,56,683.00 USD</span>
                                        </div>
                                        <div></div>
                                    </div>
                                    <div id="buy_sell-statistics" className="px-3">
                                        <Spkapexcharts chartOptions={BuySellStatisticsOptions} chartSeries={BuySellStatisticsSeries} type="bar" width={"100%"} height={300} />
                                    </div>
                                </div>
                                <div className="xl:col-span-4 col-span-12 xl:ps-0">
                                    <div className="p-3">
                                        <div className="box !bg-light shadow-none">
                                            <div className="box-body">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-2">BTC/USD</span>
                                                        <span className="font-medium h6 mb-0">27.53612</span>
                                                        <span className="text-danger block text-[0.75rem] mt-1">-0.06%</span>
                                                    </div>
                                                    <div>
                                                        <span className="avatar avatar-xl avatar-rounded">
                                                            <Image fill priority src="../../../assets/images/crypto-currencies/square-color/Bitcoin.svg" alt="" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box !bg-light shadow-none">
                                            <div className="box-body">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-2">ETH/USD</span>
                                                        <span className="font-medium h6 mb-0">20.6782</span>
                                                        <span className="text-success block text-[0.75rem] mt-1">+2.86%</span>
                                                    </div>
                                                    <div>
                                                        <span className="avatar avatar-xl avatar-rounded">
                                                            <Image fill src="../../../assets/images/crypto-currencies/square-color/Ethereum.svg" alt="" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box !bg-light shadow-none mb-0">
                                            <div className="box-body">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-2">LTC/USD</span>
                                                        <span className="font-medium h6 mb-0">54.2912</span>
                                                        <span className="text-success block text-[0.75rem] mt-1">+15.93%</span>
                                                    </div>
                                                    <div>
                                                        <span className="avatar avatar-xl avatar-rounded">
                                                            <Image fill src="../../../assets/images/crypto-currencies/square-color/Litecoin.svg" alt="" />
                                                        </span>
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
        </Fragment>
    );
};

export default BuySell;