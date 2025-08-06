"use client"
import SpkNftcards from "@/shared/@spk-reusable-components/apps/spk-nftcards";
import SpkNftCard from "@/shared/@spk-reusable-components/dashboards/spk-nft-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import * as nftdata from "@/shared/data/dashboard/nftdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Nft = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="NFT" />
                <Pageheader Heading="NFT" breadcrumbs={['Dashboards']} currentpage="NFT" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-7 col-span-12">
                        <div className="box nft-custom-card bg-gradient-to-br from-primary to-secondary !border-0">
                            <div className="box-body !p-6">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xxl:col-span-8 xl:col-span-6 lg:col-span-6 md:col-span-6 col-span-12">
                                        <h2 className="text-white mb-4 leading-[1.5] font-medium sm:text-[2rem] text-[1.1rem]">Discover, Collect, Sell And Create Your Own NFT</h2>
                                        <button className="ti-btn ti-btn-secondary ti-btn-lg btn-wave">Discover Now</button>
                                    </div>
                                    <div className="xxl:col-span-4 xl:col-span-6 lg:col-span-6 md:col-span-6 md:block hidden">
                                        <div className="text-center nft-main-image">
                                            <Image width={260} height={267} src="../../assets/images/nft-images/1.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-5 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {nftdata.cardData.map((card: any, index: any) => (
                                <div key={index} className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                    <SpkNftCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                            <h6 className="font-medium mb-0">Trending NFT'S :</h6>
                            <div className="inline-flex rounded-sm">
                                <SpkButton variant="primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] text-white">1D</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem]">1W</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem]">1M</SpkButton>
                                <SpkButton variant="soft-primary" buttontype="button" customClass="ti-btn-group !border-0 !text-[0.8rem] !py-1 !px-[0.8rem] !rounded-s-none">1Y</SpkButton>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <div className="nft-tag nft-tag-primary active">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-world fs-16"></i></span>
                                <span className="nft-tag-text">All</span>
                            </div>
                            <div className="nft-tag nft-tag-secondary">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-flame fs-16"></i></span>
                                <span className="nft-tag-text">New Trends</span>
                            </div>
                            <div className="nft-tag nft-tag-info">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-palette fs-16"></i></span>
                                <span className="nft-tag-text">Art Work</span>
                            </div>
                            <div className="nft-tag nft-tag-success">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-device-gamepad-2 fs-16"></i></span>
                                <span className="nft-tag-text">Games</span>
                            </div>
                            <div className="nft-tag nft-tag-danger">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-tie fs-16"></i></span>
                                <span className="nft-tag-text">Fashion</span>
                            </div>
                            <div className="nft-tag nft-tag-purple">
                                <Link scroll={false} href="#!" className="stretched-link"></Link>
                                <span className="nft-tag-icon"><i className="ti ti-music fs-16"></i></span>
                                <span className="nft-tag-text">Music</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-x-6">
                            {nftdata.Marketplacedata.map((idx, index) => (
                                <div key={index} className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                    <div className="box">
                                        <SpkNftcards ethlogo="../../assets/images/crypto-currencies/crypto-icons/ethereum-eth-logo.svg" imgSrc={idx.image} time={idx.auctionTime} title={idx.title} clientName={idx.name} count={idx.currentBid} />
                                    </div>
                                </div>
                            ))}

                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            LIVE AUCTION
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
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Item' }, { title: 'Open Price', }, { title: 'Auction Time' }, { title: 'Your Bid', }, { title: 'Last Bid', }, { title: 'Actions', }]}>
                                                {nftdata.LiveAuction.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td>
                                                            <div className="flex items-center gap-3">
                                                                <span className="avatar custom-img avatar-md">
                                                                    <Image fill src={idx.image} alt="" />
                                                                </span>
                                                                <div>
                                                                    <span className="block font-medium">{idx.name}</span>
                                                                    <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">by {idx.author}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{idx.openPrice}</td>
                                                        <td><span className={`badge bg-${idx.auctionTimeColor}/[0.15] text-${idx.auctionTimeColor}`}>{idx.auctionTime}</span></td>
                                                        <td>{idx.yourBid}</td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <span className="avatar avatar-xs avatar-rounded">
                                                                    <Image fill src={idx.lastBidderImage} alt="" />
                                                                </span>
                                                                <span>{idx.lastBid}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button className="ti-btn ti-btn-soft-primary ti-btn-sm btn-wave">
                                                                View <i className="ti ti-arrow-narrow-right ms-1 inline-block"></i>
                                                            </button>
                                                        </td>
                                                    </tr>

                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="flex items-center">
                                            <div> Showing 5 Entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i> </div>
                                            <div className="ms-auto">
                                                <nav aria-label="Page navigation" className="pagination-style-2">
                                                    <ul className="ti-pagination mb-0 flex-wrap">
                                                        <li className="page-item disabled">
                                                            <Link scroll={false} className="page-link px-3 py-[0.375rem] !border-0"
                                                                href="#!">
                                                                Prev
                                                            </Link>
                                                        </li>
                                                        <li className="page-item"><Link scroll={false} className="page-link active px-3 py-[0.375rem] !border-0"
                                                            href="#!">1</Link></li>
                                                        <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem] !border-0"
                                                            href="#!">2</Link>
                                                        </li>
                                                        <li className="page-item">
                                                            <Link scroll={false} className="page-link px-3 py-[0.375rem] !text-primary !border-0"
                                                                href="#!">
                                                                next
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box orders-card overflow-hidden">
                                    <div className="box-body !p-0">
                                        <div className="flex absolute px-4 pt-4 gap-3 w-full">
                                            <div className="avatar avatar-md avatar-rounded bg-secondary/[0.15] text-secondary">
                                                <i className="ti ti-trending-up text-[1.25rem]"></i>
                                            </div>
                                            <div className="flex-grow flex items-start justify-between">
                                                <div>
                                                    <span className="text-[0.6875rem] mb-2 block font-medium">TOTAL REVENUE</span>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h5 className="font-medium mb-0">3,543 ETH</h5>
                                                    </div>
                                                    <span className="text-[0.75rem] opacity-80">Increased by</span><span className="text-success text-[0.75rem] ms-2 opacity-[1]"><i className="ti ti-trending-up align-middle ms-1 me-1"></i>0.57%</span>
                                                </div>
                                                <SpkDropdown Linktag={true} Linkclass=""
                                                    Icon={true} IconClass="ri-more-fill text-[1.125rem] text-textmuted dark:text-textmuted/50">
                                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Total</Link></li>
                                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
                                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                                </SpkDropdown>
                                            </div>
                                        </div>
                                        <div id="revenue1">
                                            <Spkapexcharts chartOptions={nftdata.RevenueOption} chartSeries={nftdata.RevenueSeries} type="bar" width={'100%'} height={100} />

                                        </div>
                                        <div id="revenue">
                                            <Spkapexcharts chartOptions={nftdata.RevenueOption1} chartSeries={nftdata.RevenueSeries1} type="area" width={'100%'} height={100} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-12 xl:col-span-12 md:col-span-6 sm:col-span-12 col-span-12">
                                <div className="box overflow-hidden">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            TOP COLLECTIONS
                                        </div>
                                        <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="box-body !p-0">
                                        <ul className="ti-list-group ti-list-group-flush">
                                            {nftdata.nfts.map((nft, index) => (
                                                <li key={index} className="ti-list-group-item">
                                                    <Link scroll={false} href="#!" className="stretched-link"></Link>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="leading-none">
                                                            <span className="avatar top-nft avatar-md">
                                                                <Image fill src={nft.image} alt={nft.title} />
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <span className="mb-0 block font-medium leading-none">{nft.title}</span>
                                                            <Link scroll={false} href="#!">
                                                                <span className="text-[0.75rem]">by {nft.creator}</span>
                                                            </Link>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href="#!"
                                                                className="p-1"
                                                                data-bs-toggle="tooltip"
                                                                title="View"
                                                                data-bs-custom-classname="tooltip-dark"
                                                            >
                                                                <i className="ri-arrow-right-s-line text-[1.25rem] leading-none rtl:!rotate-180 inline-flex"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-12 xl:col-span-12 md:col-span-6 sm:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            TOP SELLERS
                                        </div>
                                        <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="box-body">
                                        <ul className="list-unstyled nft-top-sellers-list">
                                            {nftdata.users.map((user, index) => (
                                                <li key={index}>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="leading-none">
                                                            <span className={`avatar avatar-md avatar-rounded ${user.color}`}>
                                                                <Image fill src={user.avatar} alt={user.name} />
                                                            </span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <Link scroll={false} href="#!" className="mb-0 block font-medium leading-none">{user.name}</Link>
                                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">
                                                                {user.username}
                                                                <i className="bi bi-patch-check-fill text-gray opacity-50 ms-1 text-[0.875rem]"></i>
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <SpkOverlay>
                                                                <Link scroll={false} href="#!" className={`ti-btn ti-btn-${user.usercolor} ti-btn-sm !rounded-full ti-btn-icon`}>
                                                                    <i className="ti ti-user-plus"></i>
                                                                    <span
                                                                        className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                                                        role="tooltip">
                                                                        Follow
                                                                    </span>
                                                                </Link>
                                                            </SpkOverlay>

                                                            <SpkDropdown Linktag={true} Linkclass="ti-btn ti-btn-light ti-btn-icon ti-btn-sm !rounded-full"
                                                                Icon={true} IconClass="ri-more-2-fill">
                                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Week</Link></li>
                                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Day</Link></li>
                                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Year</Link></li>
                                                            </SpkDropdown>
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
                </div>
                {/* <!-- End:: row-2 --> */}
            </div>
        </Fragment>
    );
};

export default Nft;