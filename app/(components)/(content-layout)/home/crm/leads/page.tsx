"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { Data, Data1, Data2, Leadsdata } from "@/shared/data/apps/crm/leadsdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const Leads = () => {

    const [manageInvoiceData, setManageInvoiceData] = useState([...Leadsdata]);
    const handleDelete = (idToRemove: number) => {
        const updatedInvoiceData = manageInvoiceData.filter((item: any) => item.id !== idToRemove);
        setManageInvoiceData(updatedInvoiceData);
    };

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
            <Seo title="Leads" />
            <Pageheader Heading="Leads" breadcrumbs={['Apps', 'CRM']} currentpage="Leads" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box custom-box">
                        <div className="box-header flex items-center justify-between flex-wrap gap-4">
                            <div className="box-title">
                                Leads<span className="badge bg-light text-default rounded-full ms-1 text-[0.75rem] align-middle">30</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link scroll={false} href="#!" className="hs-dropdown-toggle ti-btn  btn-wave ti-btn-primary ti-btn-sm !m-0" data-hs-overlay="#todo-compose"><i className="ri-add-line font-medium align-middle"></i>Create Lead
                                </Link>
                                <button type="button" className="ti-btn  btn-wave ti-btn-soft-success ti-btn-sm !m-0">Export As CSV</button>
                                <div className="hs-dropdown ti-dropdown">
                                    <Link scroll={false} href="#!" className="ti-btn  btn-wave ti-btn-light ti-btn-sm !m-0 btn-wave" aria-expanded="false">
                                        Sort By<i className="ri-arrow-down-s-line align-middle ms-2 inline-block"></i>
                                    </Link>
                                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Date Added</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">A - Z</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive xxl:overflow-auto">
                                <Spktables showCheckbox={true} tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Contact Name', headerClassname: 'text-start' }, { title: 'Email', headerClassname: 'text-start' },
                                { title: 'Phone', headerClassname: 'text-start' }, { title: 'Lead Status', headerClassname: 'text-start !whitespace-nowrap' }, { title: 'Company', headerClassname: 'text-start' }, { title: 'Lead Source', headerClassname: 'text-start !whitespace-nowrap' }, { title: 'Tags', headerClassname: 'text-start' }, { title: 'Actions', headerClassname: 'text-start' }]}>
                                    {manageInvoiceData.map((idx) => (
                                        <tr className="crm-contact" key={idx.id}>
                                            <td>
                                                <input className="form-check-input" type="checkbox" id="checkboxNoLabel1" value="" aria-label="..." />
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-rounded avatar-sm">
                                                            <Image fill src={idx.src1} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium">{idx.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="block mb-1"><i className="ri-mail-line me-2 align-middle text-[0.875rem] text-textmuted inline-block"></i>{idx.mail}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <span className="block"><i className="ri-phone-line me-2 align-middle text-[0.875rem] text-textmuted"></i>{idx.cell}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-default">{idx.badge}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="leading-none">
                                                        <span className="avatar avatar-sm p-1 bg-light avatar-rounded">
                                                            <Image fill src={idx.src2} alt="" />
                                                        </span>
                                                    </div>
                                                    <div>{idx.text1}</div>
                                                </div>
                                            </td>
                                            <td>{idx.text2}</td>
                                            <td>
                                                <div className="flex items-center flex-wrap gap-1">
                                                    <span className={`badge bg-${idx.color1}/[0.15] text-${idx.textColor1}`}>{idx.text3}</span>
                                                    <span className={`badge bg-${idx.color2}/[0.15] text-${idx.textColor2}`}>{idx.text4}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-list">
                                                    <Link href="#!" scroll={false} className="ti-btn ti-btn-sm ti-btn-soft-warning ti-btn-icon"><i className="ri-eye-line"></i></Link>
                                                    <button className="ti-btn ti-btn-sm ti-btn-soft-info ti-btn-icon"><i className="ri-pencil-line"></i></button>
                                                    <SpkButton variant="soft-danger" Size="sm" customClass="ti-btn ti-btn-icon contact-delete" onclickfunc={() => handleDelete(idx.id)}><i className="ri-delete-bin-line"></i></SpkButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer border-topacity-0">
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
                                            <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
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

            {/* <!-- Start:: Create Contact --> */}
            <div id="todo-compose" className="hs-overlay hidden ti-modal">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-medium text-defaulttextcolor" id="mail-ComposeLabel">Create Lead</h6>
                            <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#todo-compose">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                            <div className="modal-body px-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="mb-0 text-center">
                                            <span className="avatar avatar-xxl avatar-rounded">
                                                <img src={selectedImage || '../../../assets/images/faces/9.jpg'} alt="" id="profile-img" />
                                                <span className="badge rounded-pill text-white bg-primary avatar-badge">
                                                    <input onChange={(e: any) => {
                                                        handleFileChange(e);
                                                        setImages([...images, e.target.files[0]]);
                                                    }} type="file" name="photo" className="absolute w-full h-full opacity-0" id="profile-change" />
                                                    <i className="fe fe-camera text-[.625rem]"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="contact-name" className="ti-form-label">Contact Name</label>
                                        <input type="text" className="form-control" id="contact-name" placeholder="Contact Name" />
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
                                        <label className="ti-form-label">Lead Status</label>
                                        <SpkSelect name="colors" option={Data2} placeholder="Select Status"
                                            menuplacement='auto' classNameprefix="Select2"
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Lead Source</label>
                                        <SpkSelect name="colors" option={Data1}
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Data1[0]]}
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Tags</label>
                                        <SpkSelect multi name="colors" option={Data}
                                            menuplacement='auto' classNameprefix="Select2" placeholder="Select Tag"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ti-modal-footer">
                            <SpkButton buttontype="button" variant="soft-secondary" customClass="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-light align-middle" Overlay="#todo-compose">
                                Cancel
                            </SpkButton>
                            <SpkButton buttontype="button" variant="primary" customClass="ti-btn  btn-wave  text-white !font-medium" >
                                Create Contact
                            </SpkButton>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- End:: Create Contact --> */}
        </Fragment>
    );
};

export default Leads;