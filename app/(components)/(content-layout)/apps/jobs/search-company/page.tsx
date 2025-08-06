"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import { Data, companies } from "@/shared/data/apps/jobs/searchcompanydata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const SearchCompany = () => {
    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Search Company" />
            <Pageheader Heading="Search Company" breadcrumbs={['Apps', 'Jobs']} currentpage="Search Company" />
            {/* <!-- Page Header Close --> */}

            <div className="container">
                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-4 lg:col-span-12 col-span-12">
                        <div className="box custom-box products-navigation-box">
                            <div className="box-body !p-0">
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Industry Type</h6>
                                    <div className="px-0 py-4 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="c-1">
                                                R &amp; D
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">2,712</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-2" />
                                            <label className="form-check-label" htmlFor="c-2">
                                                Accounting
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">536</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-3" defaultChecked />
                                            <label className="form-check-label" htmlFor="c-3">
                                                Business Process
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">18,289</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-4" defaultChecked />
                                            <label className="form-check-label" htmlFor="c-4">
                                                Consulting
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">3,453</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-5" />
                                            <label className="form-check-label" htmlFor="c-5">
                                                Administrative Support
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">7,165</SpkBadge>
                                        </div>
                                        <div id="hs-show-hide-industry-heading" className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300">
                                            <div className="form-check !flex items-center !mb-2">
                                                <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-8" />
                                                <label className="form-check-label" htmlFor="c-8">
                                                    Human Resources
                                                </label>
                                                <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">7,165</SpkBadge>
                                            </div>
                                            <div className="form-check !flex items-center !mb-2">
                                                <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-9" />
                                                <label className="form-check-label" htmlFor="c-9">
                                                    Marketing
                                                </label>
                                                <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">7,165</SpkBadge>
                                            </div>
                                        </div>
                                        <Link scroll={false} className="ecommerce-more-link hs-collapse-toggle inline-flex items-center gap-x-2" href="#!" id="hs-show-hide-industry" data-hs-collapse="#hs-show-hide-industry-heading">
                                            <span className="hs-collapse-open:hidden">MORE</span>
                                            <span className="hs-collapse-open:block hidden">MORE</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Location</h6>
                                    <div className="px-0 py-4 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="available-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="available-1">
                                                Hyderabad
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">512</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="available-2" />
                                            <label className="form-check-label" htmlFor="available-2">
                                                Banglore
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">2,186</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="available-3" />
                                            <label className="form-check-label" htmlFor="available-3">
                                                Chennai
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">734</SpkBadge>
                                        </div>
                                        <div id="hs-show-hide-location-heading" className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" >
                                            <div className="form-check !flex items-center !mb-2">
                                                <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-6" />
                                                <label className="form-check-label" htmlFor="c-6">
                                                    Pune
                                                </label>
                                                <SpkBadge variant="light" customClass="text-default  float-end ms-auto">5,964</SpkBadge>
                                            </div>
                                            <div className="form-check !flex items-center !mb-2">
                                                <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="c-7" />
                                                <label className="form-check-label" htmlFor="c-7">
                                                    USA
                                                </label>
                                                <SpkBadge variant="light" customClass="text-default  float-end ms-auto">2,123</SpkBadge>
                                            </div>
                                        </div>
                                        <Link scroll={false} className="ecommerce-more-link hs-collapse-toggle inline-flex items-center gap-x-2"
                                            href="#!" id="hs-show-hide-location"
                                            data-hs-collapse="#hs-show-hide-location-heading">
                                            <span className="hs-collapse-open:hidden">MORE</span>
                                            <span className="hs-collapse-open:block hidden">MORE</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Company Size</h6>
                                    <div className="px-2 py-3 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="bond-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="bond-1">
                                                0-50
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">145</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="bond-2" />
                                            <label className="form-check-label" htmlFor="bond-2">
                                                50 - 100
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">432</SpkBadge>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="bond-3" />
                                            <label className="form-check-label" htmlFor="bond-3">
                                                100 - 150
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">123</SpkBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Recruiter Type</h6>
                                    <div className="px-2 py-3 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="Recruiter-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="Recruiter-1">
                                                Direct Company
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">13</SpkBadge>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="Recruiter-2" />
                                            <label className="form-check-label" htmlFor="Recruiter-2">
                                                Agency
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">67</SpkBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Job Vacancies</h6>
                                    <div className="px-2 py-3 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="vacancies-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="vacancies-1">
                                                0 -10
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">13</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="vacancies-2" defaultChecked />
                                            <label className="form-check-label" htmlFor="vacancies-2">
                                                10 - 20
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">67</SpkBadge>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="vacancies-3" />
                                            <label className="form-check-label" htmlFor="vacancies-3">
                                                20 +above
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">67</SpkBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-b dark:border-defaultborder/10">
                                    <h6 className="font-semibold mb-0">Type of Employement</h6>
                                    <div className="px-2 py-3 pb-0">
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="j-1" defaultChecked />
                                            <label className="form-check-label" htmlFor="j-1">
                                                Full Time
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">512</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="j-2" defaultChecked />
                                            <label className="form-check-label" htmlFor="j-2">
                                                Part Time
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">2,186</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="j-3" defaultChecked />
                                            <label className="form-check-label" htmlFor="j-3">
                                                Internship
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">734</SpkBadge>
                                        </div>
                                        <div className="form-check !flex items-center !mb-2">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="j-4" />
                                            <label className="form-check-label" htmlFor="j-4">
                                                Freelancer
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">16</SpkBadge>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input me-2 focus:!shadow-none focus:!ring-0 focus:!ring-offset-0" type="checkbox" value="" id="j-5" />
                                            <label className="form-check-label" htmlFor="j-5">
                                                Remote Job
                                            </label>
                                            <SpkBadge variant="light" customClass="text-default  float-end ms-auto">1,432</SpkBadge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-8 lg:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6 align-center mb-4">
                            <div className="lg:col-span-12 col-span-12">
                                <div className="inline-flex !w-full companies-search-input mb-6 lg:!flex-nowrap flex-wrap">
                                    <input type="text"
                                        className="form-control !w-auto form-control-lg flex-grow !rounded-e-none"
                                        aria-label="Text input with segmented dropdown button"
                                        placeholder="Enter your keyword here" />
                                    <SpkSelect classNameprefix="Select2" mainClass='rounded-0 custom-select' name="form-field-name" option={Data} placeholder="All categories" />
                                    <input type="text"
                                        className="form-control form-control-lg !w-auto flex-grow !rounded-none"
                                        aria-label="Text input with segmented dropdown button"
                                        placeholder="Search by location" />
                                    <button aria-label="button" type="button" className="ti-btn  btn-wave !m-0 ti-btn-primary !rounded-s-none"><i className="ri-search-line"></i></button>
                                </div>
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <div className="box">
                                    <div className="box-body">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h5 className="font-medium mb-0 flex-grow">1287 <span className="font-normal text-[1.125rem]">Companies match for your search</span> </h5>
                                            <SpkDropdown Toggletext="Sort By" Icon={true} IconClass="ti ti-chevron-down" Customclass="btn-group"
                                                CustomToggleclass="ti-btn ti-btn-outline-light !text-dark !border dropdown-toggle">
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Premium</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Most Relevant</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Fresher</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Experienced</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Bond Agreement</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Flexible Shift</Link></li>
                                                <li><Link scroll={false} className="ti-dropdown-item" href="#!">Day Shift</Link></li>
                                            </SpkDropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {companies.map(company => (
                                <div key={company.id} className="xl:col-span-6 col-span-12">
                                    <div className="box">
                                        <div className="box-body">
                                            <div className="btn-list float-end">
                                                <SpkOverlay>
                                                    <Link scroll={false} href="#!" className="avatar avatar-rounded bg-light text-default avatar-sm hs-tooltip-toggle">
                                                        <i className="bi bi-heart"></i>
                                                        <span className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                            Add to wishlist
                                                        </span>
                                                    </Link>
                                                </SpkOverlay>
                                                {company.Share && (
                                                    <SpkOverlay>
                                                        <Link scroll={false} href="#!" className="avatar avatar-rounded bg-light text-default avatar-sm hs-tooltip-toggle ms-1">
                                                            <i className="bi bi-share"></i>
                                                            <span className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                                Share this company
                                                            </span>
                                                        </Link>
                                                    </SpkOverlay>

                                                )}
                                            </div>
                                            <div className="flex items-center flex-wrap gap-2">
                                                <span className="avatar avatar-xl bg-white shadow-sm border p-2 avatar-rounded dark:bg-bodybg border-defaultborder dark:border-defaultborder/10">
                                                    <Image fill src={company.imageSrc} alt={company.name} />
                                                </span>
                                                <div className="ms-2">
                                                    <div className="font-medium mb-0 h5 flex items-center">
                                                        <Link scroll={false} href="#!">
                                                            {company.name}
                                                            <SpkOverlay>
                                                                <span className="p-1 hs-tooltip-toggle">
                                                                    <i className="bi bi-check-circle-fill text-success !text-[1rem]"></i>
                                                                    <span className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                                        Verified User
                                                                    </span>
                                                                </span>
                                                            </SpkOverlay>
                                                        </Link>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link scroll={false} href="#!"><i className="bi bi-geo-alt fs-11"></i> {company.location}, </Link>
                                                        <p className="mb-0 text-textmuted dark:text-textmuted/50">Establishment year - {company.establishmentYear}</p>
                                                    </div>
                                                    <div
                                                        className="flex items-center text-[0.75rem] text-textmuted dark:text-textmuted/50">
                                                        <p className="text-[0.75rem] mb-0">Ratings : </p>
                                                        <div className="min-w-fit ms-2"> {company.ratings} </div>
                                                        <Link scroll={false} href="#!" className="ms-1 min-w-fit text-textmuted dark:text-textmuted/50">
                                                            <span> ({company.ratingcount})</span> <span> Ratings</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="box-footer">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <div className="flex-grow">
                                                    <SpkOverlay>
                                                        <Link scroll={false} href="#!" className="badge badge-md !rounded-full bg-info/[0.15] text-info hs-tooltip-toggle me-1">
                                                            <i className="bi bi-people me-1"></i>No. of Emp : {company.employees}
                                                            <span className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                                No of employees
                                                            </span>
                                                        </Link>
                                                    </SpkOverlay>
                                                    <Link scroll={false} href="#!" className="badge badge-md !rounded-full bg-primary/[0.15] text-primary"><i className="bi bi-briefcase me-1"></i>Vacancies : {company.vacancies}</Link>
                                                </div>
                                                <Link scroll={false} href="#!" className="ti-btn btn-wave ti-btn-primary !m-0">
                                                    View Profile <i className="ri-arrow-right-line align-middle"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <nav className="overflow-auto mb-4 float-end !bg-white dark:!bg-bodybg !rounded-md">
                            <ul className="ti-pagination">
                                <li><Link scroll={false} className="page-link" href="#!"> Previous </Link></li>
                                <li><Link scroll={false} className="page-link" href="#!" aria-current="page">1</Link></li>
                                <li><Link scroll={false} className="page-link active" href="#!">2</Link></li>
                                <li><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                <li><Link scroll={false} className="page-link" href="#!"> Next </Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}
            </div>

        </Fragment>
    );
};

export default SearchCompany;