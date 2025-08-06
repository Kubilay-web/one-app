"use client"
import SpkAnalyticsCard from "@/shared/@spk-reusable-components/dashboards/spk-analytics-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import * as analyticsdata from "@/shared/data/dashboard/analyticsdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Analytics = () => {
    return (
        <Fragment>

            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Analytics" />
                <Pageheader Heading="Analytics" breadcrumbs={['Dashboards']} currentpage="Analytics" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    {analyticsdata.cardData.map((card: any, index: any) => (
                        <div key={index} className="xxxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                            <SpkAnalyticsCard card={card} />
                        </div>
                    ))}

                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-8 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SESSIONS OVERVIEW
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="sessions-overview">
                                    <Spkapexcharts chartOptions={analyticsdata.OverviewOptions} chartSeries={analyticsdata.Overviewseries} type="line" width={"100%"} height={338} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    EARNINGS REPORT
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="analytics-earnings-report">
                                    <Spkapexcharts chartOptions={analyticsdata.EarningsOptions} chartSeries={analyticsdata.Earningssericrs} type="bar" width={"100%"} height={338} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SESSIONS DEVICE
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body !p-0">
                                <span className="block p-4 text-textmuted dark:text-textmuted/50 text-[0.75rem]">Experience a remarkable surge in user engagement over the past week</span>
                                <div id="sessions-device">
                                    <Spkapexcharts chartOptions={analyticsdata.DeviceOptions} chartSeries={analyticsdata.Deviceserices} type="donut" width={"100%"} height={175} />
                                </div>
                                <ul className="ti-list-group ti-list-group-flush border-top mt-4">
                                    <li className="ti-list-group-item !p-[0.8rem] !border-t">
                                        <div className="flex items-start justify-between">
                                            <div className="session-type leading-none mobile">
                                                <div className="font-medium mb-1">Mobile</div>
                                                <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">Increased By<span className="text-success text-[0.75rem] ms-1 font-medium inline-block">1.67%</span></span>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-1">Total</span>
                                                <span className="block font-semibold mb-0">1,754</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item !p-[0.8rem]">
                                        <div className="flex items-start justify-between">
                                            <div className="session-type leading-none tablet">
                                                <div className="font-medium mb-1">Tablet</div>
                                                <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">Increased By<span className="text-success text-[0.75rem] ms-1 font-medium inline-block">0.46%</span></span>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-1">Total</span>
                                                <span className="block font-semibold mb-0">634</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="ti-list-group-item !p-[0.8rem]">
                                        <div className="flex items-start justify-between">
                                            <div className="session-type desktop leading-none">
                                                <div className="font-medium mb-1">Desktop</div>
                                                <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">Decresed By<span className="text-danger text-[0.75rem] ms-1 font-medium inline-block">3.43%</span></span>
                                            </div>
                                            <div className="leading-none text-end">
                                                <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-1">Total</span>
                                                <span className="block font-semibold mb-0">878</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-8 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-12 sm:col-span-12 col-span-12">
                                <div className="box overflow-hidden">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Browser Statistics
                                        </div>
                                    </div>
                                    <div className="box-body !p-0 custom-analytics">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Browser' }, { title: 'Sessions', headerClassname: '!text-center' }, { title: 'BounceRate', headerClassname: '!text-center !text-nowrap' }]}>
                                                {analyticsdata.BrowserStatistics.map((idx) => (
                                                    <tr key={idx.sessions}>
                                                        <th>
                                                            <div className="flex items-center gap-2">
                                                                <div>
                                                                    <span className="avatar avatar-rounded avatar-md !mb-0  p-1 bg-light border border-warning/10">
                                                                        <Image fill src={idx.src} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">{idx.browser}</span>
                                                                    <span className="block text-textmuted dark:text-textmuted/50 text-[0.75rem]">{idx.browser},Inc</span>
                                                                </div>
                                                            </div>
                                                        </th>
                                                        <td className="text-center">{idx.sessions}</td>
                                                        <td className="text-center">{idx.bounceRate}</td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-12 sm:col-span-12 col-span-12">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-6 md:col-span-12 sm:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-body">
                                                <div className="mb-4 flex items-start justify-between flex-wrap">
                                                    <div>
                                                        <span className="text-[0.75rem] block mb-2 text-textmuted dark:text-textmuted/50">Impressions</span>
                                                        <h4 className="mb-0">9,763<span className="text-success text-[0.75rem] ms-2"><i className="ti ti-trending-up align-middle ms-1 me-1"></i>0.14%</span></h4>
                                                    </div>
                                                    <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                                        Icon={true} IconClass="ri-more-2-fill text-[1.25rem] text-textmuted dark:text-textmuted/50">
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Week</Link></li>
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Day</Link></li>
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Year</Link></li>
                                                    </SpkDropdown>
                                                </div>
                                                <div id="impressions">
                                                    <Spkapexcharts chartOptions={analyticsdata.ImpressionsOptions} chartSeries={analyticsdata.Impressionsserices} type="area" width={"100%"} height={50} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-6 md:col-span-12 sm:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-body">
                                                <div className="mb-4 flex items-start justify-between flex-wrap">
                                                    <div>
                                                        <span className="text-[0.75rem] block mb-2 text-textmuted dark:text-textmuted/50">New Subscribers</span>
                                                        <h4 className="mb-0">13,278<span className="text-success text-[0.75rem] ms-2"><i className="ti ti-trending-up align-middle ms-1 me-1"></i>0.25%</span></h4>
                                                    </div>
                                                    <SpkDropdown Linktag={true} Linkclass="text-[0.75rem] text-textmuted dark:text-textmuted/50"
                                                        Icon={true} IconClass="ri-more-2-fill text-[1.25rem] text-textmuted dark:text-textmuted/50">
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Week</Link></li>
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Day</Link></li>
                                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!"> Year</Link></li>
                                                    </SpkDropdown>
                                                </div>
                                                <div id="new-subscribers">
                                                    <Spkapexcharts chartOptions={analyticsdata.Subscribersoptions} chartSeries={analyticsdata.Subscribersserices} type="line" width={"100%"} height={50} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header justify-between">
                                                <div className="box-title">VISITORS BY BROWSER</div>
                                                <SocialDropdown />
                                            </div>
                                            <div className="box-body">
                                                <div id="views-browser">
                                                    <Spkapexcharts chartOptions={analyticsdata.Browseroptions} chartSeries={analyticsdata.Browserserices} type="radar" width={"100%"} height={202} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    CAMPAIGN ANALYTICS
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                   <SalesDropdown />

                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" Customcheckclass="!text-center" showCheckbox={true} header={[{ title: 'Website' }, { title: 'Clicks' }, { title: 'Impressions' }, { title: 'CTR' }, { title: 'Amount Spent' }, { title: 'Cost Per Click' }, { title: 'Action' }]}>
                                        {analyticsdata.CampaignAnalytics.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className={`avatar avatar-sm bg-${idx.iconBg}/[0.15] text-${idx.iconBg}`}>
                                                            <i className={`ti ${idx.icon} text-[1rem]`}></i>
                                                        </span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold fs-13 mb-0 flex items-center"><Link scroll={false} href="#!">{idx.website}</Link></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.clicks}
                                                </td>
                                                <td>{idx.impressions}</td>
                                                <td>
                                                    <span className={`badge bg-${idx.badgeClass}/[0.15] text-${idx.badgeClass}`}>{idx.ctr}</span>
                                                </td>
                                                <td>
                                                    {idx.amountSpent}
                                                </td>
                                                <td>
                                                    {idx.costPerClick}
                                                </td>
                                                <td>
                                                    <div className="ti-btn-list">
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave">
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-secondary btn-wave">
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                    </div>
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
            </div>
            {/* <!-- End:: row-4 --> */}
        </Fragment>
    );
};

export default Analytics;