"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { Options1, Options2, cryptoData } from "@/shared/data/apps/crypto/currency-exchange-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import React, { Fragment } from "react";

const CurrencyExchange = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Currency Exchange" />
            <Pageheader Heading="Currency Exchange" breadcrumbs={['Apps', 'Crypto']} currentpage="Currency Exchange" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box currency-exchange-card">
                        <div className="box-body !p-[3rem] flex items-center justify-center">
                            <div className="container">
                                <h3 className="text-white text-center">Buy and Sell Coins without additional fees</h3>
                                <span className="block text-[1rem] text-white text-center opacity-80 mb-6">
                                    Buy now and get +50% extra bonus Minimum pre-sale amount 100 Crypto Coin. We
                                    accept BTC crypto-currency..
                                </span>
                                <div className="p-4 mb-6 rounded-md currency-exchange-area">
                                    <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                        <div className="xxl:col-span-3 col-span-12">
                                            <input type="text" className="form-control" defaultValue="0.0453"
                                                placeholder="Enter Amount" />
                                        </div>
                                        <div className="xxl:col-span-2 col-span-12">
                                            <div>
                                                <SpkSelect name="colors" option={Options1}
                                                    placeholder="Bitcoin" classNameprefix='Select2' mainClass="multi-select"
                                                    defaultvalue={[Options1[0]]} menuplacement='auto' />

                                            </div>
                                        </div>
                                        <div className="xxl:col-span-2 col-span-12">
                                            <div className="text-[2rem] text-white text-center opacity-80 leading-[2.5rem]">
                                                =
                                            </div>
                                        </div>
                                        <div className="xxl:col-span-3 col-span-12">
                                            <input type="text" className="form-control" defaultValue="1350.93"
                                                placeholder="Exchange Amount" />
                                        </div>
                                        <div className="xxl:col-span-2 col-span-12">
                                            <SpkSelect name="colors" option={Options2} mainClass="basic-multi-select "
                                                defaultvalue={[Options2[0]]} menuplacement='auto' classNameprefix="Select2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <SpkButton variant="success" customClass="ti-btn  btn-wave">Exchange Now</SpkButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}
            <div className="grid grid-cols-12 gap-x-6 justify-center">
                {cryptoData.map((idx) => (
                    <div className="xl:col-span-3 col-span-12" key={idx.id}>
                        <div className="box overflow-hidden">
                            <div className="box-body mb-3">
                                <div className="flex items-top justify-between mb-3 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="leading-none">
                                                <span className="avatar avatar-rounded avatar-xs">
                                                    <Image fill src={idx.src} alt="" />
                                                </span>
                                            </div>
                                            <h6 className="font-medium mb-0">{idx.name}</h6>
                                        </div>
                                        <span className="text-[1.5625rem] flex items-center mb-3">{idx.percentChange}<span
                                            className="text-[0.75rem] text-warning opacity-70 ms-2">+0.59<i
                                                className="ti ti-arrow-big-up-line ms-1 d-inline-flex"></i></span><span
                                                    className="badge bg-success-transparent fs-10 ms-2">{idx.badge}</span></span>
                                    </div>
                                    <div className="text-end mb-2">
                                        <span className={`block text-[0.875rem] mb-1 text-${idx.color}`}>{idx.amount}</span>
                                        <span className="block text-success font-medium">{idx.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div id={idx.chartId} className="mt-1 w-full">
                                <Spkapexcharts chartOptions={idx.chartOptions} chartSeries={idx.chartSeries} type="line" width={"100%"} height={50} />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="xl:col-span-12 col-span-12">
                    <div className="text-center my-4">
                        <SpkButton variant="soft-primary" customClass="ti-btn  !border !border-primary" type="button" disabled>
                            <span className="ti-spinner  !w-[1rem] !h-[1rem] align-middle" role="status" aria-hidden="true"></span> Loading...
                        </SpkButton>
                    </div>
                </div>
            </div>
            {/* <!-- End:: row-2 --> */}
        </Fragment>
    );
};

export default CurrencyExchange;