"use client"
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkBadge from "@/shared/@spk-reusable-components/uielements/spk-badge";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import { ContactsData, Data, Data1 } from "@/shared/data/apps/crm/contactsdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const Contacts = () => {
    const [manageInvoiceData, setManageInvoiceData] = useState([...ContactsData]);
    const handleDelete = (idToRemove: string) => {
        const updatedInvoiceData = manageInvoiceData.filter((item: any) => item.id !== idToRemove);
        setManageInvoiceData(updatedInvoiceData);
    };

    const [startDate, setStartDate] = useState(new Date());
    //Datepicker function
    const handleDateChange = (date: any) => {
        // Ensure date is defined before setting it
        if (date) {
            setStartDate(date);
        }
    };


    //image upload
    const [images1, setImages1] = useState<any>([]);
    const [selectedImage1, setSelectedImage1] = useState(null);

    const handleFileChange1 = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setSelectedImage1(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Contacts" />
            <Pageheader Heading="Contacts" breadcrumbs={['Apps', 'CRM']} currentpage="Contacts" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box custom-box">
                        <div className="box-header flex items-center justify-between flex-wrap gap-4">
                            <div className="box-title">
                                Contacts
                                <SpkBadge variant="light" customClass="text-default rounded-full ms-1 text-[0.75rem] align-middle">28</SpkBadge>
                            </div>
                            <div className="flexflex-wrap gap-2">
                                <Link scroll={false} href="#!"
                                    className="hs-dropdown-toggle ti-btn  btn-wave ti-btn-primary ti-btn-sm !m-0 !me-1"
                                    data-hs-overlay="#todo-compose"><i
                                        className="ri-add-line font-medium align-middle"></i>Create Contact
                                </Link>

                                <SpkButton customClass="ti-btn ti-btn-soft-success ti-btn-sm !m-0 !me-1">Export As CSV</SpkButton>
                                <SpkDropdown Linktag={true} Linkclass="ti-btn  btn-wave ti-btn-light ti-btn-sm mt-2 btn-wave" Toggletext="Sort By" Arrowicon={true}>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Date Added</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">A - Z</Link></li>
                                </SpkDropdown>

                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables showCheckbox={true} tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Contact Name', headerClassname: 'text-start' }, { title: 'Lead Score', headerClassname: 'text-start whitespace-nowrap' },
                                { title: 'Email', headerClassname: 'text-start' }, { title: 'Phone', headerClassname: 'text-start' }, { title: 'Company', headerClassname: 'text-start' }, { title: 'Lead Source', headerClassname: 'text-start' }, { title: 'Tags', headerClassname: 'text-start' },{ title: '	Actions', headerClassname: 'text-start' },]}>
                                    {manageInvoiceData.map((idx) => (
                                        <tr className="border border-defaultborder dark:border-defaultborder/10 crm-contact" key={idx.id}>
                                            <td>
                                                <input className="form-check-input" type="checkbox" id="checkboxNoLabel1" value="" aria-label="..." />
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image fill src={idx.avatarSrc} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Link scroll={false} href="#offcanvasExample"
                                                            data-hs-overlay="#hs-overlay-contacts"><span
                                                                className="block font-medium">{idx.name}</span> </Link>
                                                        <SpkOverlay>
                                                            <span
                                                                className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] hs-tooltip-toggle">
                                                                <i
                                                                    className="ri-account-circle-line me-1 text-[0.8125rem] align-middle"></i>{idx.lastContacted}
                                                                <span
                                                                    className="hs-tooltip-content  ti-main-tooltip-content !py-1 !px-2 !bg-primary !text-[0.75rem] !font-medium !text-white shadow-sm !rounded-sm"
                                                                    role="tooltip">
                                                                    Last Contacted
                                                                </span>
                                                            </span>
                                                        </SpkOverlay>

                                                    </div>
                                                </div>
                                            </td>
                                            <td>{idx.lead} </td>
                                            <td>
                                                <div>
                                                    <span className="block mb-1"><i className="ri-mail-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50inline-flex"></i>{idx.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="block"><i
                                                        className="ri-phone-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>{idx.phone}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-sm p-1 bg-light avatar-rounded">
                                                            <Image fill src={idx.companyLogoSrc} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>{idx.company}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {idx.contactMethod}
                                            </td>
                                            <td>
                                                <div className="flex items-center flex-wrap gap-1">
                                                    {idx.leadStatus?.map((badge) => (
                                                        <span className={`badge ${badge.color}`} key={badge.text}>{badge.text}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-list">
                                                    <SpkButton Overlay="#hs-overlay-contacts" variant="soft-warning" Size="sm" customClass="ti-btn ti-btn-icon " ><i className="ri-eye-line"></i></SpkButton>
                                                    <SpkButton variant="soft-info" Size="sm" customClass="ti-btn ti-btn-icon " ><i className="ri-pencil-line"></i></SpkButton>
                                                    <SpkButton variant="soft-danger" Size="sm" customClass="ti-btn ti-btn-icon contact-delete" onclickfunc={() => handleDelete(idx.id)}><i className="ri-delete-bin-line"></i></SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer border-t-0">
                            <div className="flex items-center">
                                <div>
                                    Showing 10 Entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-medium"></i>
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation" className="pagination-style-4">
                                        <ul className="ti-pagination mb-0">
                                            <li className="page-item disabled">
                                                <Link scroll={false} className="page-link" href="#!">
                                                    Prev
                                                </Link>
                                            </li>
                                            <li className="page-item "> <Link scroll={false} className="page-link active"
                                                href="#!">1 </Link> </li>
                                            <li className="page-item"> <Link scroll={false} className="page-link"
                                                href="#!">2 </Link> </li>
                                            <li className="page-item">
                                                <Link scroll={false} className="page-link text-primary" href="#!">
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
            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: Contact Details Offcanvas --> */}
            <div className="hs-overlay hidden ti-offcanvas ti-offcanvas-right !max-w-[25rem] !border-0" tabIndex={-1} id="hs-overlay-contacts">
                <div className="ti-offcanvas-body !p-0">
                    <div className="sm:flex items-start p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 main-profile-cover">
                        <div className="avatar avatar-xxl avatar-rounded online me-4 !bottom-0 !mb-0">
                            <Image fill src="../../../assets/images/faces/4.jpg" alt="" />
                        </div>
                        <div className="flex-grow main-profile-info">
                            <div className="flex items-center justify-between">
                                <h6 className="font-medium mb-1">Lisa Convay</h6>
                                <button type="button"
                                    className="ti-btn  btn-wave flex-shrink-0 !p-0  transition-none opacity-70 hover:opacity-100 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:outline-0 focus-visible:outline-0 !mb-0"
                                    data-hs-overlay="#hs-overlay-contacts">
                                    <span className="sr-only">Close modal</span>
                                    <i className="ri-close-line leading-none text-lg"></i>
                                </button>
                            </div>
                            <p className="mb-1  op-7">Chief Executive Officer (C.E.O)</p>
                            <p className="text-[0.75rem] mb-4 opacity-[0.5]">
                                <span className="me-3"><i className="ri-building-line me-1 align-middle"></i>Georgia</span>
                                <span><i className="ri-map-pin-line me-1 align-middle"></i> Washington D.C</span>
                            </p>
                            <div className="flex mb-0">
                                <div className="me-4">
                                    <p className="font-medium text-xl text-shadow mb-0">113</p>
                                    <p className="mb-0 text-[0.6875rem] opacity-[0.5]">Deals</p>
                                </div>
                                <div className="me-4">
                                    <p className="font-medium text-xl text-shadow mb-0">$12.2k</p>
                                    <p className="mb-0 text-[0.6875rem] opacity-[0.5]">Contributions</p>
                                </div>
                                <div className="me-4">
                                    <p className="font-medium text-xl text-shadow mb-0">$10.67k</p>
                                    <p className="mb-0 text-[0.6875rem] opacity-[0.5]">Comitted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                        <div className="mb-0">
                            <p className="text-[0.9375rem] mb-2 font-medium">Professional Bio :</p>
                            <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                                I am <b className="text-default">Lisa Convay,</b> here by conclude that,i am the founder
                                and managing director of the prestigeous company name laugh at all and acts as the
                                cheif executieve officer of the company.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                        <p className="text-[.875rem] mb-2 me-4 font-medium">Contact Information :</p>
                        <div className="">
                            <div className="flex items-center mb-2">
                                <div className="me-2">
                                    <span
                                        className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                        <i className="ri-mail-line align-middle text-[.875rem]"></i>
                                    </span>
                                </div>
                                <div>
                                    sonyataylor2531@gmail.com
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                <div className="me-2">
                                    <span
                                        className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                        <i className="ri-phone-line align-middle text-[.875rem]"></i>
                                    </span>
                                </div>
                                <div>
                                    +(555) 555-1234
                                </div>
                            </div>
                            <div className="flex items-center mb-0">
                                <div className="me-2">
                                    <span
                                        className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                        <i className="ri-map-pin-line align-middle text-[.875rem]"></i>
                                    </span>
                                </div>
                                <div>
                                    MIG-1-11, Monroe Street, Georgetown, Washington D.C, USA,20071
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 flex items-center">
                        <p className="text-[.875rem] mb-0 me-4 font-medium">Social Networks :</p>
                        <div className="btn-list mb-0 gap-2 flex">
                            <button aria-label="button" type="button"
                                className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-primary mb-0">
                                <i className="ri-facebook-line font-medium"></i>
                            </button>
                            <button aria-label="button" type="button"
                                className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-secondary mb-0">
                                <i className="ri-twitter-x-line font-medium"></i>
                            </button>
                            <button aria-label="button" type="button"
                                className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-warning mb-0">
                                <i className="ri-instagram-line font-medium"></i>
                            </button>
                            <button aria-label="button" type="button"
                                className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-success mb-0">
                                <i className="ri-github-line font-medium"></i>
                            </button>
                            <button aria-label="button" type="button"
                                className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-danger mb-0">
                                <i className="ri-youtube-line font-medium"></i>
                            </button>
                        </div>
                    </div>
                    <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                        <p className="text-[.875rem] mb-2 me-4 font-medium">Tags :</p>
                        <div>
                            <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">New Lead</span>
                            <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">Others</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-[.875rem] mb-2 font-medium">Relationship Manager :
                            <Link scroll={false} className="text-[.875rem] text-primary mb-0 ltr:float-right rtl:float-left"
                                href="#!"><i className="ri-add-line me-1 align-middle"></i>Add
                                Manager </Link>
                        </p>
                        <div className="avatar-list-stacked">
                            <span className="avatar avatar-rounded">
                                <Image fill src="../../../assets/images/faces/2.jpg" alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image fill src="../../../assets/images/faces/8.jpg" alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image fill src="../../../assets/images/faces/2.jpg" alt="img" />
                            </span>
                            <span className="avatar avatar-rounded">
                                <Image fill src="../../../assets/images/faces/10.jpg" alt="img" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: Contact Details Offcanvas --> */}

            {/* <!-- Start:: Create Contact --> */}
            <div id="todo-compose" className="hs-overlay hidden ti-modal">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-medium text-defaulttextcolor"
                                id="mail-ComposeLabel">Create Contact</h6>
                            <button type="button"
                                className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor"
                                data-hs-overlay="#todo-compose">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-0 text-center">
                                        <span className="avatar avatar-xxl avatar-rounded">
                                            <img src={selectedImage1 || "../../../assets/images/faces/9.jpg"} alt="" id="profile-img" />
                                            <span className="badge rounded-pill bg-primary avatar-badge">
                                                <input onChange={(e: any) => {
                                                    handleFileChange1(e);
                                                    setImages1([...images1, e.target.files[0]]);
                                                }} type="file" name="photo" className="absolute w-full h-full opacity-0" id="profile-change" />
                                                <i className="fe fe-camera text-[.625rem] !text-white"></i>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label htmlFor="deal-title" className="ti-form-label">Deal Title</label>
                                    <input type="text" className="form-control" id="deal-title" placeholder="Deal Title" />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label htmlFor="contact-lead-score" className="ti-form-label">Lead Score</label>
                                    <input type="number" className="form-control" id="contact-lead-score" placeholder="Lead Score" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="contact-mail" className="ti-form-label">Email</label>
                                    <input type="email" className="form-control" id="contact-mail" placeholder="Enter Email" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="contact-phone" className="ti-form-label">Phone No</label>
                                    <input type="tel" className="form-control" id="contact-phone" placeholder="Enter Phone Number" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="company-name" className="ti-form-label">Company Name</label>
                                    <input type="text" className="form-control" id="company-name" placeholder="Company Name" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="ti-form-label">Lead Source</label>
                                    <SpkSelect name="colors" option={Data1} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data1[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Last Contacted</label>
                                    <div className="form-group">
                                        <div className="input-group custom-input-pickr">
                                            <div className="input-group-text text-[#8c9097] dark:text-white/50"> <i className="ri-calendar-line"></i> </div>
                                            <SpkDatepickr className="form-control" selected={startDate} onChange={handleDateChange} Timeinput="Time:" dateFormat="yy/MM/dd h:mm aa" placeholderText='Choose date with time' showTimeInput />
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Tags</label>
                                    <SpkSelect multi name="colors" option={Data} mainClass="basic-multi-select" menuplacement='auto' classNameprefix="Select2" placeholder="Select Tag" />
                                </div>
                            </div>
                        </div>
                        <div className="ti-modal-footer">
                            <button type="button" className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-light align-middle" data-hs-overlay="#todo-compose">
                                Cancel
                            </button>
                            <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Create Contact</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: Create Contact --> */}
        </Fragment>
    );
};

export default Contacts;