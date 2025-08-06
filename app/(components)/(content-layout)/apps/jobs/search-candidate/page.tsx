"use client"

import SpkSearchcandidate from "@/shared/@spk-reusable-components/apps/spk-searchcandidate";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() => import("@/shared/@spk-reusable-components/spk-packages/spk-reactselect"), { ssr: false });
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { Data, Data2, Searchcandidate } from "@/shared/data/apps/jobs/searchcandidatedate";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";
import React, { FC, Fragment } from "react";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

interface SearchCandidateProps { }

const SearchCandidate: FC<SearchCandidateProps> = ({ local_varaiable }: any) => {

    const AirbnbSlider = styled(Slider)(({ theme }) => ({
        color: '#546dfe',
        height: 3,
        padding: '13px 0',
        '& .MuiSlider-thumb': {
            height: 27,
            width: 27,
            backgroundColor: '#fff',
            border: '1px solid currentColor',
            '&:hover': {
                boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
            },
            '& .airbnb-bar': {
                height: 9,
                width: 1,
                backgroundColor: 'currentColor',
                marginLeft: 1,
                marginRight: 1,
            },
        },
        '& .MuiSlider-track': {
            height: 3,
        },
        '& .MuiSlider-rail': {
            color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
            opacity: theme.palette.mode === 'dark' ? undefined : 1,
            height: 3,
        },
    }));

    function AirbnbThumbComponent(props: any) {
        const { children, ...other } = props;
        return (
            <SliderThumb {...other}>
                {children}
                <span className="airbnb-bar" />
                <span className="airbnb-bar" />
                <span className="airbnb-bar" />
            </SliderThumb>
        );
    }
    return (
        <Fragment>
            {/* <!-- Page Header --> */}
            <Seo title="Search Candidate" />
            <Pageheader Heading="Search Candidate" breadcrumbs={['Apps', 'Jobs']} currentpage="Search Candidate" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-4 xl:col-span-12 col-span-12">
                    <div className="box custom-box products-navigation-box">
                        <div className="box-body !p-0">
                            <div className="!p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Categories</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="c-1"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="c-1">
                                            R &amp; D
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">2,712</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="c-2" />
                                        <label className="form-check-label" htmlFor="c-2">
                                            Accounting
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">536</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="c-3"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="c-3">
                                            Business Process
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">18,289</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="c-4"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="c-4">
                                            Consulting
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">3,453</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="c-5" />
                                        <label className="form-check-label" htmlFor="c-5">
                                            Administrative Support
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">7,165</SpkBadge>
                                    </div>
                                    <div id="hs-show-hide-categeories-heading"
                                        className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                                        aria-labelledby="hs-show-hide-categeories">
                                        <div className="form-check !mb-2 font-medium !flex items-center">
                                            <input className="form-check-input" type="checkbox" value="" id="c-6" />
                                            <label className="form-check-label" htmlFor="c-6">
                                                Human Resources
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">7,165</SpkBadge>
                                        </div>
                                        <div className="form-check !mb-2 font-medium !flex items-center">
                                            <input className="form-check-input" type="checkbox" value="" id="c-7" />
                                            <label className="form-check-label" htmlFor="c-7">
                                                Marketing
                                            </label>
                                            <SpkBadge variant="light" customClass="text-defaulttextcolor  float-end ms-auto">7,165</SpkBadge>
                                        </div>
                                    </div>
                                    <Link scroll={false} className="ecommerce-more-link hs-collapse-toggle inline-flex items-center gap-x-2"
                                        href="#!" id="hs-show-hide-categeories"
                                        data-hs-collapse="#hs-show-hide-categeories-heading">
                                        <span className="hs-collapse-open:hidden">MORE</span>
                                        <span className="hs-collapse-open:block hidden">MORE</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Availability</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="available-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="available-1">
                                            Immediate
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">512</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="available-2" />
                                        <label className="form-check-label" htmlFor="available-2">
                                            30 Days
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="available-3" />
                                        <label className="form-check-label" htmlFor="available-3">
                                            3 Months
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">734</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Bond Agreement</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="bond-1"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="bond-1">
                                            1 Year
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">512</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="bond-2" />
                                        <label className="form-check-label" htmlFor="bond-2">
                                            2 Years
                                        </label>
                                        <span
                                            className="badge bg-light text-default font-500 float-end ms-auto">512</span>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="bond-3" />
                                        <label className="form-check-label" htmlFor="bond-3">
                                            3 Years
                                        </label>
                                        <SpkBadge variant="light" customClass="text-default font-500 float-end ms-auto">512</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Languages</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="languages-1" defaultChecked />
                                        <label className="form-check-label" htmlFor="languages-1">
                                            English
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">13</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="languages-2" />
                                        <label className="form-check-label" htmlFor="languages-2">
                                            Hindi
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">67</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value=""
                                            id="languages-3" />
                                        <label className="form-check-label" htmlFor="languages-3">
                                            Telugu
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">58</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Job Type</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="j-1"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="j-1">
                                            Full Time
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">512</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="j-2"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="j-2">
                                            Part Time
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">2,186</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="j-3"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="j-3">
                                            Internship
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">734</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="j-4" />
                                        <label className="form-check-label" htmlFor="j-4">
                                            Freelancer
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">16</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="j-5" />
                                        <label className="form-check-label" htmlFor="j-5">
                                            Remote Job
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">1,432</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Salary Range</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div id="nonlinear">
                                        <AirbnbSlider
                                            slots={{ thumb: AirbnbThumbComponent }}
                                            getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                                            defaultValue={[10, 90]}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Qualification</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="q-1" />
                                        <label className="form-check-label" htmlFor="q-1">
                                            All Education Levels
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">16,563</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="q-2"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="q-2">
                                            10th Pass and Above
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">15,234</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="q-3" />
                                        <label className="form-check-label" htmlFor="q-3">
                                            12th Pass and Above
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">6,278</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="q-4"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="q-4">
                                            Diploma and Graduate
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">4,531</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="q-5" />
                                        <label className="form-check-label" htmlFor="q-5">
                                            Post Graduate
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">2,405</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b dark:border-defaultborder/10">
                                <h6 className="font-semibold mb-0">Experience</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="e-1"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="e-1">
                                            Fresher
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">23,156</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="e-2" />
                                        <label className="form-check-label" htmlFor="e-2">
                                            Less than 1 year
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">15,632</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="e-3"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="e-3">
                                            Less than 2 year
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">15,032</SpkBadge>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="e-4"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="e-4">
                                            More than 3 years
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">7,154</SpkBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h6 className="font-semibold mb-0">Skills</h6>
                                <div className="px-2 py-3 pb-0">
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="s-1"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="s-1">
                                            HTML5
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">23,156</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="s-2"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="s-2">
                                            Javascript
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">15,632</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="s-3" />
                                        <label className="form-check-label" htmlFor="s-3">
                                            PHP
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">15,032</SpkBadge>
                                    </div>
                                    <div className="form-check !mb-2 font-medium !flex items-center">
                                        <input className="form-check-input" type="checkbox" value="" id="s-4"
                                            defaultChecked />
                                        <label className="form-check-label" htmlFor="s-4">
                                            CSS3
                                        </label>
                                        <SpkBadge variant="light" customClass=" text-default font-500 float-end ms-auto">7,154</SpkBadge>
                                    </div>
                                    <div id="hs-show-hide-skills-heading"
                                        className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                                        aria-labelledby="hs-show-hide-skills">
                                        <div className="form-check !mb-2 font-medium !flex items-center">
                                            <input className="form-check-input" type="checkbox" value="" id="s-5" />
                                            <label className="form-check-label" htmlFor="s-5">
                                                Tailwind
                                            </label>
                                            <SpkBadge variant="light" customClass=" text-defaulttextcolor font-500 float-end ms-auto">5,946</SpkBadge>
                                        </div>
                                        <div className="form-check !mb-2 font-medium !flex items-center">
                                            <input className="form-check-input" type="checkbox" value="" id="s-6" />
                                            <label className="form-check-label" htmlFor="s-6">
                                                Angular
                                            </label>
                                            <SpkBadge variant="light" customClass=" text-defaulttextcolor font-500 float-end ms-auto">3,267</SpkBadge>
                                        </div>
                                        <div className="form-check !mb-2 font-medium !flex items-center">
                                            <input className="form-check-input" type="checkbox" value="" id="s-7" />
                                            <label className="form-check-label" htmlFor="s-7">
                                                React
                                            </label>
                                            <SpkBadge variant="light" customClass=" text-defaulttextcolor font-500 float-end ms-auto">578</SpkBadge>
                                        </div>
                                    </div>
                                    <Link scroll={false} className="ecommerce-more-link hs-collapse-toggle inline-flex items-center gap-x-2"
                                        href="#!" id="hs-show-hide-skills"
                                        data-hs-collapse="#hs-show-hide-skills-heading">
                                        <span className="hs-collapse-open:hidden">MORE</span>
                                        <span className="hs-collapse-open:block hidden">MORE</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xxl:col-span-8 xl:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6 items-center mb-6">
                        <div className="lg:col-span-12 col-span-12">
                            <div className="inline-flex !w-full companies-search-input mb-6 !flex-wrap">
                                <input type="text" className="form-control !w-auto flex-grow !rounded-e-none" aria-label="Text input with segmented dropdown button" placeholder="Enter your keyword here" />
                                <SpkSelect name="state" option={Data} mainClass="basic-multi-select" searchable menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data[0]]} />
                                <input type="text" className="form-control !w-auto flex-grow  !rounded-none" aria-label="Text input with segmented dropdown button" placeholder="Search by location" />
                                <SpkSelect name="state" option={Data2} mainClass="basic-multi-select custom-select-searchcompany" searchable menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data2[0]]} />
                                <SpkButton buttontype="button" variant="primary" customClass="ti-btn btn-wave ti-btn-primary !m-0 !rounded-s-none"><i className="ri-search-line"></i></SpkButton>
                            </div>
                        </div>
                        <div className="lg:col-span-12 col-span-12">
                            <div className="box custom-box">
                                <div className="box-body">
                                    <div className="sm:flex items-center">
                                        <h5 className="font-semibold mb-0 flex-grow">1287
                                            <span className="font-normal text-[1.125rem] ms-1 inline-block">Candidates match your job search</span>
                                        </h5>
                                        <SpkDropdown Customclass="btn-group" CustomToggleclass="ti-btn  btn-wave ti-btn-light border dropdown-toggle waves-effect waves-light"
                                            Toggletext="Sort By"
                                            Icon={true} IconClass="ti ti-chevron-down">
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
                        {Searchcandidate.map((candidateSearch) => (
                            <div className="xl:col-span-6 col-span-12" key={candidateSearch.id}>
                                <SpkSearchcandidate object={candidateSearch} />
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
            {/* <!--End::row-1 --> */}


        </Fragment>
    );
};

export default SearchCandidate;