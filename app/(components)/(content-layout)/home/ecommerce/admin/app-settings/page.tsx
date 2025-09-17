"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { Date, Day, Encryption, Global, Keywords, Language, Payment, Protocol, Time } from '@/shared/data/apps/ecommers/admin/app-settings-data';

const AppSettings = () => {
   
    return (
        <Fragment>

            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="App Settings" />
                <Pageheader Heading="App Settings" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="App Settings" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-body !p-0">
                                <nav className="nav nav-tabs flex flex-col candidateprofile-nav" role="tablist">
                                    <Link scroll={false} className="nav-link active" id="tab-1" data-hs-tab="#tab1" aria-controls="tab1" role="tab"
                                        aria-current="page" href="#general-vertical-link" aria-selected="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="96" r="64" opacity="0.2" /><circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                        General Settings</Link>
                                    <Link scroll={false} className="nav-link" id="tab-2" data-hs-tab="#tab2" aria-controls="tab2" role="tab"
                                        aria-current="page" href="#email-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polygon points="224 56 128 144 32 56 224 56" opacity="0.2" /><path d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="224 56 128 144 32 56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Email Settings</Link>
                                    <Link scroll={false} className="nav-link" id="tab-3" data-hs-tab="#tab3" aria-controls="tab3" role="tab"
                                        aria-current="page" href="#seo-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><rect x="152" y="40" width="56" height="168" opacity="0.2" /><polyline points="48 208 48 136 96 136" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="224" y1="208" x2="32" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="96 208 96 88 152 88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="152 208 152 40 208 40 208 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>SEO</Link>
                                    <Link scroll={false} className="nav-link" id="tab-4" data-hs-tab="#tab4" aria-controls="tab4" role="tab"
                                        aria-current="page" href="#google-analytics-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="88" opacity="0.2" /><path d="M128,128h88a88,88,0,1,1-20.11-56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Google Analytics</Link>
                                    <Link scroll={false} className="nav-link" id="tab-5" data-hs-tab="#tab5" aria-controls="tab5" role="tab"
                                        aria-current="page" href="#custom-css-js-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polygon points="192 168 240 128 192 88 64 88 16 128 64 168 192 168" opacity="0.2" /><polyline points="64 88 16 128 64 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="192 88 240 128 192 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="160" y1="40" x2="96" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Custom CSS & JS</Link>
                                    <Link scroll={false} className="nav-link" id="tab-6" data-hs-tab="#tab6" aria-controls="tab6" role="tab"
                                        aria-current="page" href="#social-logins-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M128,32A96,96,0,0,0,63.8,199.38h0A72,72,0,0,1,128,160a40,40,0,1,1,40-40,40,40,0,0,1-40,40,72,72,0,0,1,64.2,39.37A96,96,0,0,0,128,32Z" opacity="0.2" /><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M63.8,199.37a72,72,0,0,1,128.4,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M222.67,112A95.92,95.92,0,1,1,144,33.33" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="184 56 200 72 232 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Social Logins</Link>
                                    <Link scroll={false} className="nav-link" id="tab-7" data-hs-tab="#tab7" aria-controls="tab7" role="tab"
                                        aria-current="page" href="#google-captcha-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="40" opacity="0.2" /><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="128" y1="88" x2="215.29" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="162.64" y1="148" x2="118.99" y2="223.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="93.36" y1="148" x2="49.71" y2="72.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Google reCAPTCHA</Link>
                                    <Link scroll={false} className="nav-link" id="tab-8" data-hs-tab="#tab8" aria-controls="tab8" role="tab"
                                        aria-current="page" href="#payment-gateways-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M24,96H232v96a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8Z" opacity="0.2" /><rect x="24" y="56" width="208" height="144" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="168" y1="168" x2="200" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="120" y1="168" x2="136" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="24" y1="96" x2="232" y2="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Payment Gateways</Link>
                                    <Link scroll={false} className="nav-link" id="tab-9" data-hs-tab="#tab9" aria-controls="tab9" role="tab"
                                        aria-current="page" href="#purchasecode-vertical-link" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polygon points="176 216 232 128 176 40 80 40 24 128 80 216 176 216" opacity="0.2" /><polyline points="80 40 24 128 80 216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="176 40 232 128 176 216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Purchase Code</Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-9 col-span-12">
                        <div className="tab-content">
                            <div className="tab-pane show active p-0 border-0" id="tab1" aria-labelledby="tab-1"
                                role="tabpanel">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="lg:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    App Title & Logos
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="app-title" className="ti-form-label">App Title</label>
                                                        <input type="text" className="form-control" id="app-title" placeholder="App Title" defaultValue="Spruko" />
                                                    </div>
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <div className="box shadow-none app-logo-upload mb-0">
                                                            <div className="box-body">
                                                                <div className="upload-logo">
                                                                    <Image fill src="../../../../assets/images/brand-logos/desktop-logo.png" alt="" />
                                                                    <button className="ti-btn ti-btn-danger logo-delete btn-icon btn-sm !rounded-full p-1" type="button">
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                                <label htmlFor="small-file-input1" className="ti-form-label font-semibold">Upload Dark Logo</label>
                                                                <div> <label htmlFor="small-file-input1" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input1" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                                                    file:border-0
                                                                   file:bg-light file:me-4
                                                                   file:py-2 file:px-4
                                                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                                                </div>
                                                                <small className="text-textmuted dark:text-textmuted/50"><i>The file size should not be more than 5MB</i></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <div className="box shadow-none app-logo-upload mb-0">
                                                            <div className="box-body">
                                                                <div className="upload-logo">
                                                                    <Image fill src="../../../../assets/images/brand-logos/toggle-logo.png" alt="" />
                                                                    <button className="ti-btn ti-btn-danger logo-delete btn-icon btn-sm !rounded-full p-1" type="button">
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                                <label htmlFor="small-file-input2" className="ti-form-label font-semibold">Upload Dark Icon</label>
                                                                <div> <label htmlFor="small-file-input2" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input2" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                                                    file:border-0
                                                                   file:bg-light file:me-4
                                                                   file:py-2 file:px-4
                                                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                                                </div>
                                                                <small className="text-textmuted dark:text-textmuted/50"><i>The file size should not be more than 5MB</i></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <div className="box shadow-none app-logo-upload mb-0">
                                                            <div className="box-body">
                                                                <div className="upload-logo">
                                                                    <Image fill src="../../../../assets/images/brand-logos/favicon.ico" alt="" />
                                                                    <button className="ti-btn ti-btn-danger logo-delete btn-icon btn-sm !rounded-full p-1" type="button">
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                                <label htmlFor="small-file-input3" className="ti-form-label font-semibold">Upload Fav Icon</label>
                                                                <div> <label htmlFor="small-file-input3" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input3" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                                                    file:border-0
                                                                   file:bg-light file:me-4
                                                                   file:py-2 file:px-4
                                                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                                                </div>
                                                                <small className="text-textmuted dark:text-textmuted/50"><i>The file size should not be more than 5MB</i></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <div className="box shadow-none app-logo-upload mb-0">
                                                            <div className="box-body">
                                                                <div className="upload-logo">
                                                                    <Image fill src="../../../../assets/images/brand-logos/desktop-dark.png" alt="" />
                                                                    <button className="ti-btn ti-btn-danger logo-delete btn-icon btn-sm !rounded-full p-1" type="button">
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                                <label htmlFor="small-file-input4" className="ti-form-label font-semibold">Upload Light Logo</label>
                                                                <div> <label htmlFor="small-file-input4" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input4" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                                                    file:border-0
                                                                   file:bg-light file:me-4
                                                                   file:py-2 file:px-4
                                                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                                                </div>
                                                                <small className="text-textmuted dark:text-textmuted/50"><i>The file size should not be more than 5MB</i></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <div className="box shadow-none app-logo-upload mb-0">
                                                            <div className="box-body">
                                                                <div className="upload-logo">
                                                                    <Image fill src="../../../../assets/images/brand-logos/toggle-dark.png" alt="" />
                                                                    <button className="ti-btn ti-btn-danger logo-delete btn-icon btn-sm !rounded-full p-1" type="button">
                                                                        <i className="bi bi-x"></i>
                                                                    </button>
                                                                </div>
                                                                <label htmlFor="small-file-input5" className="ti-form-label font-semibold">Upload Light Icon</label>
                                                                <div> <label htmlFor="small-file-input5" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input5" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                                                    file:border-0
                                                                   file:bg-light file:me-4
                                                                   file:py-2 file:px-4
                                                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                                                </div>
                                                                <small className="text-textmuted dark:text-textmuted/50"><i>The file size should not be more than 5MB</i></small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Set URL
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label htmlFor="first-name" className="ti-form-label">Terms of Service URL</label>
                                                <input type="text" className="form-control" id="first-name" placeholder="https://" defaultValue="https://www.spruko.com" />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Global Language Settings
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label className="ti-form-label">Select Language</label>
                                                <SpkSelect option={Language} mainClass=" basic-multi-select" name="Language-select" id="Language-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Language[0]]} />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Global Date & Time Format
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="lg:col-span-6 col-span-12">
                                                        <label className="ti-form-label">Select Date Format</label>
                                                        <SpkSelect option={Date} mainClass=" basic-multi-select" name="dateformat-select" id="dateformat-select"
                                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Date[0]]} />

                                                    </div>
                                                    <div className="lg:col-span-6 col-span-12">
                                                        <label className="ti-form-label">Select Time Format</label>
                                                        <SpkSelect option={Time} mainClass=" basic-multi-select" name="timeformat-select" id="timeformat-select"
                                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Time[0]]} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    First Day Of The Week
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label className="ti-form-label">Select Day</label>
                                                <SpkSelect option={Day} mainClass=" basic-multi-select" name="day-select" id="day-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Day[0]]} />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Global Timezones
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label className="ti-form-label">Select Global Timezones</label>
                                                <SpkSelect option={Global} mainClass=" basic-multi-select" name="timezone-select" id="timezone-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Global[0]]} />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Contact Us
                                                </div>
                                                <div className="form-check form-switch">
                                                    <div className="relative inline-block"> <input type="checkbox" id="hs-xs-solid-switch1" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" /></div>
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch1">Enable Contact Us</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label htmlFor="email" className="ti-form-label">Contact us Email</label>
                                                <input type="text" className="form-control" id="email" placeholder="Enter Email Here" defaultValue="spruko@gmail.com" />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Contact Us
                                                </div>
                                                <div className="form-check form-switch">
                                                    <div className="relative inline-block"> <input type="checkbox" id="hs-xs-solid-switch" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" /> </div>
                                                    <label className="form-check-label" htmlFor="contact-us1">Enable Contact Us</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <label htmlFor="email1" className="ti-form-label">Contact us Email</label>
                                                <input type="text" className="form-control" id="email1" placeholder="Enter Email Here" defaultValue="spruko@gmail.com" />
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Color Settings
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="lg:col-span-6 col-span-12">
                                                        <label className="ti-form-label">Primary Color</label>
                                                        <div className="app-color-picker">
                                                            <input type="color" className="form-control form-control-color border-0 bg-transparent"
                                                                id="exampleColorInput1" defaultValue="#24c5a8" title="Choose your color " />
                                                            <span className="ms-1">rgb(12, 191, 159)</span>
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-6 col-span-12">
                                                        <label className="ti-form-label">Secondary Color</label>
                                                        <div className="app-color-picker">
                                                            <input type="color" className="form-control form-control-color border-0 bg-transparent"
                                                                id="exampleColorInput" defaultValue="#00ccff" title="Choose your color" />
                                                            <span className="ms-1">rgb(0, 204, 255)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary m-1">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab2" aria-labelledby="tab-2" role="tabpanel">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Send Test Mail
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <label htmlFor="test-email" className="ti-form-label">Send Test Mail</label>
                                        <div className="flex gap-2">
                                            <input type="text" className="form-control" id="test-email" placeholder="Enter Email Here" defaultValue="spruko@gmail.com" />
                                            <button className="ti-btn ti-btn-primary !m-0">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Email Settings
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-protocol" className="ti-form-label">Mail Protocol</label>
                                                <SpkSelect option={Protocol} mainClass=" basic-multi-select" name="mail-protocol" id="mail-protocol"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Protocol[0]]} />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-host" className="ti-form-label">Mail Host</label>
                                                <input type="text" className="form-control" id="mail-host" placeholder="Enter Email Here" defaultValue="spruko@gmail.com" />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-port" className="ti-form-label">Mail Port</label>
                                                <input type="text" className="form-control" id="mail-port" placeholder="Enter Port Here" defaultValue="564" />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-user-name" className="ti-form-label">Mail Username</label>
                                                <input type="text" className="form-control" id="mail-user-name" placeholder="Enter Username Here" defaultValue="d-not-reply@spruko.com" />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-password" className="ti-form-label">Mail Password</label>
                                                <input type="text" className="form-control" id="mail-password" placeholder="Enter Password Here" defaultValue="********" />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="mail-encryption" className="ti-form-label">Mail Encryption</label>
                                                <SpkSelect option={Encryption} mainClass=" basic-multi-select" name="mail-encryption" id="mail-encryption"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Encryption[0]]} />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="from-name" className="ti-form-label">From Name</label>
                                                <input type="text" className="form-control" id="from-name" placeholder="Enter Name Here" defaultValue="Spruko" />
                                            </div>
                                            <div className="lg:col-span-6 col-span-12">
                                                <label htmlFor="from-email" className="ti-form-label">From Email</label>
                                                <input type="text" className="form-control" id="from-email" placeholder="Enter Email Here" defaultValue="do-not-reply@spruko.com" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="ti-btn ti-btn-primary m-1">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab3" aria-labelledby="tab-3"
                                role="tabpanel">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title flex-grow">
                                            SEO
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                            <div className="lg:col-span-12 col-span-12">
                                                <label htmlFor="title" className="ti-form-label">Title</label>
                                                <input type="text" className="form-control" id="title" placeholder="Enter Title Here" defaultValue="My Desk" />
                                            </div>
                                            <div className="lg:col-span-12 col-span-12">
                                                <label htmlFor="description" className="ti-form-label">Description</label>
                                                <input type="text" className="form-control" id="description" placeholder="Enter Description Here" defaultValue="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" />
                                            </div>
                                            <div className="lg:col-span-12 col-span-12">
                                                <label htmlFor="keywords" className="ti-form-label">Keywords</label>
                                                <SpkSelect multi option={Keywords} mainClass=" basic-multi-select" name="keywords" id="keywords"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Keywords[0]]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="ti-btn ti-btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab4" aria-labelledby="tab-4"
                                role="tabpanel">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title flex-grow">
                                            Google Analytics
                                        </div>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="contact-us1" />
                                            <label className="form-check-label" htmlFor="contact-us1">Enable Google Analytics</label>
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <label htmlFor="google-analytics" className="ti-form-label">Google Analytics ID</label>
                                        <input type="text" className="form-control" id="google-analytics" placeholder="Enter ID Here" defaultValue="87246" />
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="ti-btn ti-btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab5" aria-labelledby="tab-5"
                                role="tabpanel">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Custom CSS & JS
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="alert alert-primary text-default alert-dismissible fade show custom-alert-icon shadow-sm mb-4" role="alert">
                                            If you feel that you need more advanced design changes and you're familiar with coding, then you can easily add custom CSS and Java Script to make your website look even more unique.
                                        </div>
                                        <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                            <div className="lg:col-span-12 col-span-12">
                                                <label htmlFor="custom-css" className="ti-form-label">Custom CSS</label>
                                                <textarea className="form-control mb-2" id="custom-css" rows={7} placeholder="custom-css"></textarea>
                                                <p className="mb-0">Write styles using style tag like, </p>
                                            </div>
                                            <div className="lg:col-span-12 col-span-12">
                                                <label htmlFor="custom-js" className="ti-form-label">Custom JS</label>
                                                <textarea className="form-control mb-2" id="custom-js" rows={7} placeholder="custom-js"></textarea>
                                                <p className="mb-0">Write script using script tag like, <code>&lt;script&gt; document.getElementById("hello").innerHTML = "Hello World!";   &lt;/script&gt;</code></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="ti-btn ti-btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab6" aria-labelledby="tab-6"
                                role="tabpanel">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Google Login Credentials
                                                    <p className="mb-0 text-[0.75rem] font-normal">Enable / disable app credentials for Google login</p>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch2" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch2">Enable Google</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="google-id1" className="ti-form-label">Google App ID</label>
                                                        <input type="text" className="form-control" id="google-id1" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="google-secret1" className="ti-form-label">Google App Secret</label>
                                                        <input type="text" className="form-control" id="google-secret1" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="google-callback" className="ti-form-label">Google callback url</label>
                                                        <input type="text" className="form-control !bg-light" id="google-callback" placeholder="https://" defaultValue="https://spruko.com/customer/login/google/callback" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Facebook Login Credentials
                                                    <p className="mb-0 text-[0.75rem] font-normal">Enable / disable app credentials for Facebook login</p>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch3" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch3">Enable Facebook</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="facebook-id" className="ti-form-label">Facebook App ID</label>
                                                        <input type="text" className="form-control" id="facebook-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="facebook-secret" className="ti-form-label">Facebook App Secret</label>
                                                        <input type="text" className="form-control" id="facebook-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="facebook-callback" className="ti-form-label">Facebook callback url</label>
                                                        <input type="text" className="form-control !bg-light" id="facebook-callback" placeholder="https://" defaultValue="https://spruko.com/customer/login/facebook/callback" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Twitter Login Credentials
                                                    <p className="mb-0 text-[0.75rem] font-normal">Enable / disable app credentials for twitter login</p>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch4" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch4">Enable Twitter</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="twitter-id" className="ti-form-label">Twitter App ID</label>
                                                        <input type="text" className="form-control" id="twitter-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="twitter-secret" className="ti-form-label">Twitter App Secret</label>
                                                        <input type="text" className="form-control" id="twitter-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="twitter-callback" className="ti-form-label">Twitter callback url</label>
                                                        <input type="text" className="form-control !bg-light" id="twitter-callback" placeholder="https://" defaultValue="https://spruko.com/customer/login/twitter/callback" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Github Login Credentials
                                                    <p className="mb-0 text-[0.75rem] font-normal">Enable / disable app credentials for github login</p>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch5" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch5">Enable Github</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="github-id" className="ti-form-label">Github App ID</label>
                                                        <input type="text" className="form-control" id="github-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="github-secret" className="ti-form-label">Github App Secret</label>
                                                        <input type="text" className="form-control" id="github-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="github-callback" className="ti-form-label">Github callback url</label>
                                                        <input type="text" className="form-control !bg-light" id="github-callback" placeholder="https://" defaultValue="https://spruko.com/customer/login/github/callback" disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab7" aria-labelledby="tab-7" role="tabpanel">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Google Re-Captcha Settings
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="google-id" className="ti-form-label">Site Key</label>
                                                        <input type="text" className="form-control" id="google-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="google-secret" className="ti-form-label">Secret Key</label>
                                                        <input type="text" className="form-control" id="google-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Captcha Setting In Forms
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" id="hs-xs-solid-switch6" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                            <label className="form-check-label" htmlFor="hs-xs-solid-switch6">Enable On Contact Form</label>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" id="hs-xs-solid-switch7" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                            <label className="form-check-label" htmlFor="hs-xs-solid-switch7">Enable On Register Form</label>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" id="hs-xs-solid-switch8" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                            <label className="form-check-label" htmlFor="hs-xs-solid-switch8">Enable On Login Form</label>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" id="hs-xs-solid-switch9" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                            <label className="form-check-label" htmlFor="hs-xs-solid-switch9">Enable On Guest Ticket</label>
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" id="hs-xs-solid-switch15" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                            <label className="form-check-label" htmlFor="hs-xs-solid-switch15">Enable On Admin Login Form</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab8" aria-labelledby="tab-8" role="tabpanel">
                                <div className="grid grid-cols-12 gap-x-6">
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Paypal Settings
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch10" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch10">Enable Paypal</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="paypal-id" className="ti-form-label">Paypal ID</label>
                                                        <input type="text" className="form-control" id="paypal-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="paypal-secret" className="ti-form-label">Paypal Secret</label>
                                                        <input type="text" className="form-control" id="paypal-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Stripe Settings
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch11" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch11">Enable Stripe</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="stripe-id" className="ti-form-label">Stripe ID</label>
                                                        <input type="text" className="form-control" id="stripe-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="stripe-secret" className="ti-form-label">Stripe Secret</label>
                                                        <input type="text" className="form-control" id="stripe-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Razorpay Settings
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch12" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch12">Enable Razorpay</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="razorpay-id" className="ti-form-label">Razorpay ID</label>
                                                        <input type="text" className="form-control" id="razorpay-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="razorpay-secret" className="ti-form-label">Razorpay Secret</label>
                                                        <input type="text" className="form-control" id="razorpay-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Paystack Settings
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch13" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch13">Enable Paystack</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="paystack-id" className="ti-form-label">Paystack ID</label>
                                                        <input type="text" className="form-control" id="paystack-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="paystack-secret" className="ti-form-label">Paystack Secret</label>
                                                        <input type="text" className="form-control" id="paystack-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="box">
                                            <div className="box-header">
                                                <div className="box-title flex-grow">
                                                    Manual Payment Methods
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input type="checkbox" id="hs-xs-solid-switch14" className="ti-switch shrink-0 !w-[29px] !h-[18px] before:size-3 before:-translate-y-[1px]" defaultChecked />
                                                    <label className="form-check-label" htmlFor="hs-xs-solid-switch14">Enable Manual Payment</label>
                                                </div>
                                            </div>
                                            <div className="box-body">
                                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="payment-name" className="ti-form-label">Payment Name</label>
                                                        <input type="text" className="form-control" id="payment-name" placeholder="Enter Name Here" defaultValue="Bank" />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label className="ti-form-label">Payment Type</label>
                                                        <SpkSelect option={Payment} mainClass=" basic-multi-select" name="account-type-select" id="account-type-select"
                                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Payment[0]]} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-footer">
                                                <div className="float-end">
                                                    <button className="ti-btn ti-btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane p-0 border-0 hidden" id="tab9" aria-labelledby="tab-9" role="tabpanel">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title flex-grow">
                                            Purchase Code
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="purchase-code" className="ti-form-label">Purchase Code</label>
                                                <input type="text" className="form-control" id="purchase-code" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="buyer-email" className="ti-form-label">Buyer Email</label>
                                                <input type="text" className="form-control" id="buyer-email" placeholder="Enter Here" defaultValue="buyer@gmail.com" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="ti-btn ti-btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}
            </div>
        </Fragment>
    );
};

export default AppSettings;