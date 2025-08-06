"use client"
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { wallets, wallets1 } from "@/shared/data/apps/crypto/walletdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import React, { Fragment } from "react";

const Wallet = () => {

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Wallet" />
            <Pageheader Heading="Wallet" breadcrumbs={['Apps', 'Crypto']} currentpage="Wallet" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-8 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            {wallets1.map((wallet, index) => (
                                <div className="box" key={index}>
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            {wallet.name} Wallet Address
                                        </div>
                                        <div>
                                            <SpkButton variant="outline-primary" customClass="ti-btn btn-wave !m-0">Connect</SpkButton>
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="flex items-center flex-wrap justify-between gap-4 mb-4">
                                            <div className="flex-grow">
                                                <label htmlFor="btc-wallet-address1" className="ti-form-label">Wallet Address</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control !border-s" id="btc-wallet-address1" defaultValue="afb0dc8bc84625587b85415c86ef43ed8df" placeholder="Placeholder" />

                                                    <SpkButton variant="primary" customClass="ti-btn !m-0">Copy</SpkButton>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="avatar avatar-xxl border border-defaultborder dark:border-defaultborder/10">
                                                    <Image fill priority src="../../../assets/images/media/media-68.png" className="p-1 qr-image dark:invert-[1]" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 gap-y-4 sm:gap-x-6">
                                            <div className="xl:col-span-4 col-span-12">
                                                <div className="rounded-sm p-4 bg-light">
                                                    <div className="flex items-center gap-4">
                                                        <div className="leading-none">
                                                            <span className="avatar bg-success/[0.15] text-success">
                                                                <i className="ti ti-arrow-narrow-down text-[1.25rem]"></i>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-textmuted dark:text-textmuted/50">Received</span>
                                                            <span className="block font-medium">6.2834 <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 font-normal">{wallet.name}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="xl:col-span-4 col-span-12">
                                                <div className="rounded-sm p-4 bg-light">
                                                    <div className="flex items-center gap-4">
                                                        <div className="leading-none">
                                                            <span className="avatar bg-danger/[0.15] text-danger">
                                                                <i className="ti ti-caret-up text-[1.25rem]"></i>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-textmuted dark:text-textmuted/50">Sent</span>
                                                            <span className="block font-medium">2.7382 <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 font-normal">{wallet.name}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="xl:col-span-4 col-span-12">
                                                <div className="rounded-sm p-4 bg-light">
                                                    <div className="flex items-center gap-4">
                                                        <div className="leading-none">
                                                            <span className="avatar bg-secondary/[0.15] text-secondary">
                                                                <i className="ti ti-wallet text-[1.25rem]"></i>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block text-textmuted dark:text-textmuted/50">Wallet Balance</span>
                                                            <span className="block font-medium">12.5232 <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 font-normal">{wallet.name}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                    {wallets.map((wallet, index) => (
                        <div className="box" key={index}>
                            <div className="box-header">
                                <div className="box-title">{wallet.name} WALLET </div>
                            </div>
                            <div className="box-body">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="leading-none">
                                            <span className="avatar avatar-rounded">
                                                <Image fill src={wallet.image} alt={wallet.name} />
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] font-normal">
                                                Available {wallet.name}
                                            </span>
                                            <span className="font-medium">{wallet.available} {wallet.name}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">{wallet.usdValue} USD</span>
                                        <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem] font-normal">In USD</span>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="btn-list text-center flex gap-2 justify-center flex-wrap">
                                    <SpkButton variant="soft-primary" customClass="ti-btn !m-0 w-[9.375rem] btn-wave">Deposit </SpkButton>
                                    <SpkButton variant="soft-success" customClass="ti-btn w-[9.375rem] btn-wave !m-0">  Withdraw  </SpkButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <!--End::row-1 --> */}
        </Fragment>
    );
};

export default Wallet;