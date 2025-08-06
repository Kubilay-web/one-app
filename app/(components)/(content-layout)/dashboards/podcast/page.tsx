"use client"
import SpkPodcastCard from "@/shared/@spk-reusable-components/dashboards/spk-podcast-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as podcastdata from "@/shared/data/dashboard/podcastdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Podcast = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Podcast" />
                <Pageheader Heading="Podcast" breadcrumbs={['Dashboards']} currentpage="Podcast" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    <div className="xl:col-span-7 col-span-12">
                        <div className="box podcast-banner-card">
                            <div className="box-body sm:!p-[3rem]">
                                <div className="grid grid-cols-12">
                                    <div className="xl:col-span-9 col-span-12">
                                        <span className="badge bg-white/[0.15] text-white">Featured This Month</span>
                                        <h3 className="font-medium text-white mt-0">
                                            Echoes Of Insight
                                        </h3>
                                        <span className="block text-white font-meidum text-[1.125rem] mb-3">with Serene Harmony</span>
                                        <div className="flex flex-wrap items-center gap-6 mb-[3rem]">
                                            <Link scroll={false} href="#!" className="text-[0.75rem] opacity-80 font-medium flex items-center gap-2 text-white"><i className="ri-play-circle-fill text-primary text-[1.25rem] align-middle leading-none"></i>18,000 Plays</Link>
                                            <Link scroll={false} href="#!" className="text-[0.75rem] opacity-80 font-medium flex items-center gap-2 text-white"><i className="ri-customer-service-fill text-primary text-[1.25rem] align-middle leading-none"></i>265 Currently Listening</Link>
                                        </div>
                                        <div className="btn-list">
                                            <button className="ti-btn ti-btn-primary btn-wave !m-0 !me-2 !mb-2">Listen Now</button>
                                            <button className="ti-btn btn-wave text-white !m-0 bg-white/[0.10] !border-white/[0.25]">Add To Playlist</button>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-5 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-between !border-0">
                                <div className="box-title">
                                    POPULAR PODCASTERS
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full">
                                        {podcastdata.PopularPodcasters.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>{idx.id}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`avatar avatar-md avatar-rounded bg-${idx.bgcolor}/[0.15] `}>
                                                            <Image fill src={idx.src} alt="" />
                                                        </span>
                                                        <div>
                                                            <Link scroll={false} href="#!" className="font-medium block">{idx.name}</Link>
                                                            <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">{idx.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-[0.6875rem] text-textmuted dark:text-textmuted/50 block">Episodes</span>
                                                    <span>{idx.episodes}</span>
                                                </td>
                                                <td>
                                                    <button className={`ti-btn ${idx.buttonClass} ti-btn-sm btn-wave`}>{idx.buttonText}</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start: row-2 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            CATEGORIES
                                        </div>
                                        <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                    </div>
                                    <div className="box-body !px-[3rem] !py-6">
                                        <div className="flex items-center justify-between gap-6 flex-wrap">
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-primary btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-mood-happy text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Comedy</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-secondary btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-news  text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">News</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-success btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-slice text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">True Crime</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-orange btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-bulb text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Technology</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-info btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-test-pipe text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Science</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-warning btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-book text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Education</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-danger btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-ball-american-football text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Sports</Link>
                                            </div>
                                            <div className="text-center">
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-teal btn-wave border-0 !p-6 leading-none rounded">
                                                    <i className="ti ti-music text-[1.5rem]"></i>
                                                </Link>
                                                <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Music</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <div className="mb-6 flex items-center justify-between">
                                    <h6 className="font-medium mb-0">RECOMMENDATIONS :</h6>
                                    <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                                </div>
                                <div className="grid grid-cols-12 gap-x-6">
                                    {podcastdata.cardData.map((card: any, index: any) => (
                                        <div key={index} className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                            <SpkPodcastCard card={card} />
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-header justify-between">
                                        <div className="box-title">
                                            POPULAR PODCASTS
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
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Podcast Name' }, { title: 'Frequency', }, { title: 'Category' }, { title: 'Latest Episode', }, { title: 'Average Duration' }, { title: 'Ratings' },]}>
                                                {podcastdata.PopularPodcasts.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td>
                                                            <div className="flex gap-2">
                                                                <span className="avatar custom-img avatar-md"><Image fill src={idx.src} className="" alt="..." /></span>
                                                                <div>
                                                                    <Link scroll={false} href="#!" className="font-medium mb-0 flex items-center">{idx.name}</Link>
                                                                    <span className="text-[0.75rem] block text-textmuted dark:text-textmuted/50">{idx.host}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{idx.frequency} </td>
                                                        <td>
                                                            <span className={`badge bg-${idx.categoryColor}/[0.15] text-${idx.categoryColor}`}>{idx.category}</span>
                                                        </td>
                                                        <td>{idx.latestEpisode} </td>
                                                        <td>{idx.duration} </td>
                                                        <td>
                                                            {idx.rating}<i className="ri-star-fill ms-1 text-warning"></i>
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
                    <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-12 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                <div className="box bg-primary-gradient !border-0 !shadow-none">
                                    <div className="box-body !p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="flex-grow">
                                                <span className="font-medium block text-white">PLAYING NOW</span>
                                            </div>
                                            <div>
                                                <Link scroll={false} href="#!">
                                                    <i className="ri-heart-fill text-white text-[1.5rem] opacity-50 leading-none"></i>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="text-center mb-6">
                                            <span className="avatar avatar-rounded mb-4 podcast-playing-now-avatar shadow">
                                                <Image fill src="../../assets/images/media/media-85.jpg" alt="" />
                                            </span>
                                            <Link scroll={false} href="#!"><h6 className="font-medium mb-1 text-white">Random Ramblings</h6></Link>
                                            <span className="text-white opacity-80 text-[0.75rem]">By Alice Mumbleton</span>
                                        </div>
                                        <div className="grid grid-cols-12">
                                            <div className="xl:col-span-1 col-span-12"></div>
                                            <div className="xl:col-span-10 col-span-12">
                                                <div className="flex gap-3 items-center mb-4">
                                                    <div className="text-[0.75rem] text-white">12.25</div>
                                                    <div className="progress progress-xs progress-custom progress-animate !bg-white/[0.3] podcast-playing-progress" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                                                        <div className="progress-bar !bg-success" style={{ width: '50%' }}>
                                                        </div>
                                                    </div>
                                                    <div className="text-[0.75rem] text-white">23.45</div>
                                                </div>
                                                <div className="flex items-center justify-between flex-wrap gap-3 leading-none">
                                                    <Link scroll={false} href="#!">
                                                        <i className="ri-repeat-2-fill text-[1.25rem] text-white"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!">
                                                        <i className="ri-skip-back-fill text-[1.25rem] text-white"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!">
                                                        <i className="ri-play-fill text-[2rem] text-white"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!">
                                                        <i className="ri-skip-forward-fill text-[1.25rem] text-white"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!">
                                                        <i className="ri-shuffle-fill text-[1.25rem] text-white"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="xl:col-span-1 col-span-12"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-12 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            RECENTLY PLAYED
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <ul className="ti-list-unstyled podcast-recently-played-list">
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar custom-img avatar-md">
                                                            <Image fill src="../../assets/images/media/media-61.jpg" alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link scroll={false} href="#!" className="font-medium">Tech Talk</Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">John Smith</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <Link scroll={false} href="#!" className="font-medium text-gray-300"><i className="ri-heart-fill text-[1.125rem] leading-none"></i></Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">45 Mins</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar custom-img avatar-md">
                                                            <Image fill src="../../assets/images/media/media-59.jpg" alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link scroll={false} href="#!" className="font-medium">Science Explorers</Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">Emily Johnson</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <Link scroll={false} href="#!" className="font-medium text-danger"><i className="ri-heart-fill text-[1.125rem] leading-none"></i></Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">30 Mins</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar custom-img avatar-md">
                                                            <Image fill src="../../assets/images/media/media-62.jpg" alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link scroll={false} href="#!" className="font-medium">Business Insights</Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">David Williams</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <Link scroll={false} href="#!" className="font-medium text-gray-300"><i className="ri-heart-fill text-[1.125rem] leading-none"></i></Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">60 Mins</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar custom-img avatar-md">
                                                            <Image fill src="../../assets/images/media/media-71.jpg" alt="" />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link scroll={false} href="#!" className="font-medium">Health and Wellness</Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">Michael Brown</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <Link scroll={false} href="#!" className="font-medium text-gray-300"><i className="ri-heart-fill text-[1.125rem] leading-none"></i></Link>
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50">50 Mins</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-12 col-span-12">
                                <div className="box overflow-hidden">
                                    <div className="box-header justify-between">
                                        <div className="box-title">PODCAST ACTIVITY</div>
                                        <div className="ti-dropdown hs-dropdown">
                                            <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50" data-bs-toggle="dropdown" aria-expanded="true"> Sort By <i className="ri-arrow-down-s-line align-middle ms-2 inline-block"></i> </Link>
                                            <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="box-body !pb-0">
                                        <div className="ps-4 custom-podcast">
                                            <div className="text-textmuted dark:text-textmuted/50 text-[0.75rem] mb-1">Total Watch Time<span className="ms-2 inline-block text-success"><i className="fe fe-arrow-up-right fs-11"></i>0.25%</span>
                                            </div>
                                            <h5 className="font-medium mb-0">365 Hours</h5>
                                        </div>
                                        <div id="podcast-activity">
                                            <Spkapexcharts chartOptions={podcastdata.ActivityOption} chartSeries={podcastdata.ActivitySeries} type="bar" width={'100%'} height={242} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End: row-2 --> */}
            </div>
        </Fragment>
    );
};

export default Podcast;