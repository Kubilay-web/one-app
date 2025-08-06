"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
const SpkSelect = dynamic(() => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'), { ssr: false });
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import * as socialMediaData from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import dynamic from "next/dynamic";
import React, { FC, Fragment } from "react";

interface SocialMediaProps { }

const SocialMedia: FC<SocialMediaProps> = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Social Media" />
                <Pageheader Heading="Social Media" breadcrumbs={['Dashboards']} currentpage="Social Media" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <socialMediaData.Socialmediacard />
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between !py-3">
                                <div className="box-title">
                                    PROFILE ANALYSIS
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div>
                                        <SpkSelect name="colors" option={socialMediaData.Data1} mainClass="basic-multi-select profile-analysis-select form-control form-control-sm"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[socialMediaData.Data1[0]]} />
                                    </div>
                                    <socialMediaData.SocialDropdown />
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="profile-analysis">
                                    <Spkapexcharts chartOptions={socialMediaData.ProfileOptions} chartSeries={socialMediaData.ProfileSeries} type="area" width={'100%'} height={325} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    AUDIENCE AGE METRICS
                                </div>
                            </div>
                            <div className="box-body !py-0">
                                <div id="audience-age-metrics">
                                    <Spkapexcharts chartOptions={socialMediaData.MetricsOptions} chartSeries={socialMediaData.MetricsSeries} type="bar" width={'100%'} height={375} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    AUDIENCE REACHED
                                </div>
                                <socialMediaData.SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="audience-reached">
                                    <Spkapexcharts chartOptions={socialMediaData.AudienceReachedOptions} chartSeries={socialMediaData.AudienceReachedSeries} type="donut" width={'100%'} height={195} />
                                </div>
                            </div>
                            <div className="box-footer !p-0">
                                <ul className="ti-list-group ti-list-group-flush audience-reached-list">
                                    {socialMediaData.genderData.map((item, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <div className="flex align-items-start justify-between">
                                                <div className="leading-none">
                                                    <div className="font-medium mb-1">{item.label}</div>
                                                </div>
                                                <div className="leading-none text-end">
                                                    <span className="block font-semibold mb-0">{item.percentage}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header">
                                <div className="box-title">
                                    AUDIENCE TOP COUNTRIES
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 sm:gap-x-6">
                                    <div className="xl:col-span-4 col-span-12 my-auto">
                                        <ul className="ti-list-unstyled mb-0">
                                            {socialMediaData.countryData.map((item, index) => (
                                                <li key={index} className={`mb-${index === socialMediaData.countryData.length - 1 ? "0" : "4"}`}>
                                                    <span className="text-[0.75rem]">
                                                        <i className={`ri-checkbox-blank-circle-fill align-middle me-2 inline-block ${item.colorClass}`}></i>
                                                        {item.name}
                                                    </span>
                                                    <span className="font-medium float-end">{item.value.toLocaleString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="xl:col-span-8 col-span-12">
                                        <socialMediaData.SocialWorldMap />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    REVENUE EARNED
                                </div>
                                <socialMediaData.SocialDropdown />
                            </div>
                            <div className="box-body !p-0">
                                <div id="revenue-earned">
                                    <Spkapexcharts chartOptions={socialMediaData.RevenueEarnedOptions} chartSeries={socialMediaData.RevenueEarnedSeries} type="radialBar" width={'100%'} height={155} />
                                </div>
                                <div className="border-t border-defaultborder dark:border-defaultborder/10">
                                    <ul className="ti-list-group ti-list-group-flush revenue-earned-list">
                                        {socialMediaData.data.map((item, index) => (
                                            <li key={index} className="ti-list-group-item">
                                                <div className="flex align-items-start justify-between">
                                                    <div className="leading-none">
                                                        <div className="font-medium mb-1">{item.platform}</div>
                                                    </div>
                                                    <div className="leading-none text-end">
                                                        <span className="block font-semibold mb-0">{item.amount}</span>
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
                {/* <!-- End:: row-3 --> */}

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SOCIAL MEDIA PERFORMANCE
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
                                    <socialMediaData.SocialTable />
                                </div>
                            </div>
                            <div className="box-footer">
                                <socialMediaData.SocialPagination />
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    SESSIONS BY DEVICE
                                </div>
                                <socialMediaData.SocialDropdown />
                            </div>
                            <div className="box-body !p-0">
                                <div id="sessions-device">
                                    <Spkapexcharts chartOptions={socialMediaData.SessionsByDeviceOptions} chartSeries={socialMediaData.SessionsByDeviceSeries} type="bubble" width={'100%'} height={363} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-4 --> */}
            </div>
        </Fragment>
    );
};

export default SocialMedia;