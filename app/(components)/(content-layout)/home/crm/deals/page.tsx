"use client"
import SpkDealsCard from "@/shared/@spk-reusable-components/apps/spk-dealscard";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { Dealsdata, Dealsdata1, Dealsdata2, Dealsdata3, Dealsdata4, Dealsdata5, Dealsdata6 } from "@/shared/data/apps/crm/dealsdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";

const Deals = () => {
    const [startDate, setStartDate] = useState(new Date());
    const handleDateChange = (date: any) => {
        if (date) {
            setStartDate(date);
        }
    };
    const slidesArrow = (selector: any) => document.querySelector(selector);

    const firstContainerRef = useRef(null);
    const secondContainerRef = useRef(null);
    const thirdContainerRef = useRef(null);
    const fourthContainerRef = useRef(null);
    const fifthContainerRef = useRef(null);
    const sixthContainerRef = useRef(null);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const dragula = require("dragula");
            const windowElement = window;

            if (firstContainerRef.current && secondContainerRef.current) {
                const containers = [
                    firstContainerRef.current,
                    secondContainerRef.current,
                    thirdContainerRef.current,
                    fourthContainerRef.current,
                    fifthContainerRef.current,
                    sixthContainerRef.current,

                ];
                const drake = dragula(containers);

                if (slidesArrow(".firstdrag")?.classList.contains("task-Null")) {
                    slidesArrow(".view-more-button")?.classList.add("d-none");
                }
            }
        }
    }, []);
    //image Upload
    const [images, setImages] = useState<any>([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFileChange = (e: any) => {
        const file: any = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Deals" />
            <Pageheader Heading="Deals" breadcrumbs={['Apps', 'CRM']} currentpage="Deals" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box custom-box">
                        <div className="box-body">
                            <div className="flex items-center flex-wrap gap-2 justify-between">
                                <div className="flex items-center">
                                    <span className="font-medium text-[1rem] me-1">Deals</span>
                                    <SpkBadge variant="light" customClass="text-default align-middle">26</SpkBadge>
                                </div>
                                <div className="flex flex-wrap gap-2">

                                    <SpkButton variant="primary" Size="sm" customClass="ti-btn" Overlay="#todo-compose"><i className="ri-add-line me-1 font-medium align-middle"></i>New Deal</SpkButton>
                                    <SpkButton variant="soft-success" Size="sm" customClass="ti-btn">Export As CSV</SpkButton>
                                    <SpkDropdown Linktag={true} Linkclass="ti-btn bg-light ti-btn-sm btn-wave waves-effect waves-light ti-dropdown-toggle hs-dropdown-toggle"
                                        Toggletext="Sort By" Arrowicon={true}>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Date Added</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">A - Z</Link></li>
                                    </SpkDropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}

            {/* <!-- Start::row-2 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                {Dealsdata.map((item, index) => (
                    <div className="xxl:col-span-2 md:col-span-4 col-span-12" key={index}>
                        <div className="box custom-box">
                            <div className="box-body !p-4">
                                <div>
                                    <div>
                                        <div className={`font-medium text-[.9375rem] ${item.Cardclass}`}>
                                            {item.stage}
                                        </div>
                                        <SpkBadge variant="light" customClass={`mb-1 ${item.badgeClass}`}>
                                            {item.badgeText}
                                        </SpkBadge>
                                    </div>
                                    <div>
                                        <span className={`${item.textClass} font-medium`}>{item.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <!-- End::row-2 --> */}

            {/* <!-- Start::row-3 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-2 col-span-12" id="leads-discovered" ref={firstContainerRef}>

                    {Dealsdata1.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
                <div className="xxl:col-span-2 col-span-12" id="leads-qualified" ref={secondContainerRef}>
                    {Dealsdata2.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
                <div className="xxl:col-span-2 col-span-12" id="contact-initiated" ref={thirdContainerRef}>
                    {Dealsdata3.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
                <div className="xxl:col-span-2 col-span-12" id="needs-identified" ref={fourthContainerRef}>
                    {Dealsdata4.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
                <div className="xxl:col-span-2 col-span-12" id="negotiation" ref={fifthContainerRef}>
                    {Dealsdata5.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} initials={idx.initials} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
                <div className="xxl:col-span-2 col-span-12" id="deal-finalized" ref={sixthContainerRef}>
                    {Dealsdata6.map((idx) => (
                        <SpkDealsCard key={idx.id} img={idx.avatar} title={idx.name} date={idx.date} amount={idx.amount} company={idx.company} />
                    ))}
                </div>
            </div>
            {/* <!-- End::row-3 --> */}

            {/* <!-- Start:: New Deal --> */}
            <div id="todo-compose" className="hs-overlay hidden ti-modal">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-medium text-defaulttextcolor" id="mail-ComposeLabel">New Deal</h6>
                            <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#todo-compose">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-0 text-center">
                                        <span className="avatar custom-img avatar-xxl avatar-rounded">
                                            <img src={selectedImage || '../../../assets/images/faces/9.jpg'} alt="" id="profile-img" />
                                            <span className="badge rounded-full bg-primary avatar-badge">
                                                <input onChange={(e: any) => {
                                                    handleFileChange(e);
                                                    setImages([...images, e.target.files[0]]);
                                                }} type="file" name="photo" className="absolute w-full h-full opacity-[0]" id="profile-change" />
                                                <i className="fe fe-camera text-[.625rem] text-white"></i>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label htmlFor="deal-name" className="form-label">Contact Name</label>
                                    <input type="text" className="form-control" id="deal-name" placeholder="Contact Name" />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label htmlFor="deal-lead-score" className="form-label">Deal Value</label>
                                    <input type="number" className="form-control" id="deal-lead-score" placeholder="Deal Value" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="company-name" className="form-label">Company Name</label>
                                    <input type="text" className="form-control" id="company-name" placeholder="Company Name" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="form-label">Last Contacted</label>
                                    <div className="form-group">
                                        <div className="input-group custom-picker">
                                            <div className="input-group-text text-muted"> <i className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control" selected={startDate} onChange={handleDateChange} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ti-modal-footer">
                            <button type="button"
                                className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-light align-middle"
                                data-hs-overlay="#todo-compose">
                                Cancel
                            </button>
                            <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Create Deal</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: New Deal --> */}
        </Fragment>
    );
};

export default Deals;