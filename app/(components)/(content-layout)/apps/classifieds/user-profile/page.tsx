"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
//filepond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { Accountdata, Categorydata, Conditiondata, Gendardata, Prioritydata, Selectdata2, UserProfileData } from "@/shared/data/apps/classifieds/user-profile-data";
import { InvoicesList } from "@/shared/data/apps/ecommers/vendor/invoicesdata";
import Link from "next/link";
import Image from "next/image";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const UserProfile = () => {

    //Filepond 
    const [files, setFiles] = useState<any>([]);



    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="User Profile" />
                <Pageheader Heading="User Profile" breadcrumbs={['Apps', 'Classifieds']} currentpage="User Profile" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12 xl:col-span-3">
                        <div className="box">
                            <div className="border-defaultborder p-4 !border-b dark:border-defaultborder/10 items-start sm:flex">
                                <div>
                                    <span className="avatar avatar-lg avatar-rounded me-3 online">
                                        <Image fill src="../../../assets/images/faces/9.jpg" alt="" />
                                    </span>
                                </div>
                                <div className="flex-grow main-profile-info">
                                    <div className="font-semibold h6 mb-1">Jack Miller
                                        <div className="hs-tooltip ti-main-tooltip">
                                            <Link scroll={false} href="#!" className="p-1 hs-tooltip-toggle">
                                                <i className="text-[0.875rem] text-success bi bi-check-circle-fill"></i>
                                                <span
                                                    className="shadow-sm !bg-black !font-medium !px-2 !py-1 !rounded-sm !text-[0.75rem] !text-white hs-tooltip-content ti-main-tooltip-content"
                                                    role="tooltip">
                                                    Verified User
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="mb-0">Member Since 2005</p>
                                    <Link scroll={false} href="#!" className="text-[0.75rem] text-primary font-semibold"><i className="align-middle me-1 ri-shut-down-line"></i>Logout</Link>
                                </div>
                                <span className="badge badge-md bg-warning/[0.15] text-warning"><i className="align-middle me-2 ri-vip-crown-2-line"></i> Basic</span>
                            </div>
                            <div className="!p-0 box-body">
                                <nav className="flex flex-col nav nav-tabs candidateprofile-nav" role="tablist">
                                    <Link  className="nav-link active" href="#" id="tab1" data-hs-tab="#tab-1" aria-controls="tab-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="96" r="64" opacity="0.2" /><circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>My Profile</Link>
                                    <Link className="nav-link" href="#" id="tab2" data-hs-tab="#tab-2" aria-controls="tab-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M32,96H224V56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8Z" opacity="0.2" /><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="32" y1="96" x2="224" y2="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>All Posted Ads</Link>
                                    <Link className="nav-link" href="#" id="tab3" data-hs-tab="#tab-3" aria-controls="tab-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M128,144a191.14,191.14,0,0,1-96-25.68h0V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V118.31A191.08,191.08,0,0,1,128,144Z" opacity="0.2" /><line x1="112" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><rect x="32" y="64" width="192" height="144" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M168,64V48a16,16,0,0,0-16-16H104A16,16,0,0,0,88,48V64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M224,118.31A191.09,191.09,0,0,1,128,144a191.14,191.14,0,0,1-96-25.68" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Post Ads</Link>
                                    <Link className="nav-link" href="#" id="tab4" data-hs-tab="#tab-4" aria-controls="tab-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M168,200V104h56v88a8,8,0,0,1-8,8Z" opacity="0.2" /><path d="M64,56H40A16,16,0,0,0,24,72h0A16,16,0,0,0,40,88H56a16,16,0,0,1,16,16h0a16,16,0,0,1-16,16H28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="48" y1="48" x2="48" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="48" y1="120" x2="48" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M96,56H224V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="104" y1="104" x2="224" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="80" y1="152" x2="224" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="168" y1="104" x2="168" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Invoices</Link>
                                    <Link className="nav-link" href="#" id="tab5" data-hs-tab="#tab-5" aria-controls="tab-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2" /><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M130.05,206.11c-1.34,0-2.69,0-4,0L94,224a104.61,104.61,0,0,1-34.11-19.2l-.12-36c-.71-1.12-1.38-2.25-2-3.41L25.9,147.24a99.15,99.15,0,0,1,0-38.46l31.84-18.1c.65-1.15,1.32-2.29,2-3.41l.16-36A104.58,104.58,0,0,1,94,32l32,17.89c1.34,0,2.69,0,4,0L162,32a104.61,104.61,0,0,1,34.11,19.2l.12,36c.71,1.12,1.38,2.25,2,3.41l31.85,18.14a99.15,99.15,0,0,1,0,38.46l-31.84,18.1c-.65,1.15-1.32,2.29-2,3.41l-.16,36A104.58,104.58,0,0,1,162,224Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>Settings</Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 xl:col-span-9">
                        <div className="tab-content">
                            <div className="!border-0 !p-0 active show tab-pane" id="tab-1" role="tabpanel" aria-labelledby="tab1">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="flex-grow box-title">
                                            Personal Information
                                        </div>
                                        <div>
                                            <p className="font-semibold mb-2">Profile 60% completed - <Link scroll={false} href="#!" className="text-[0.75rem] text-primary">Finish now</Link></p>
                                            <div className="progress progress-animate progress-xs">
                                                <div className="bg-primary progress-bar" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} style={{ width: '60%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="items-center mb-4 sm:flex">
                                            <div className="mb-0 me-4">
                                                <span className="avatar avatar-rounded avatar-xxl">
                                                    <Image fill src="../../../assets/images/faces/9.jpg" alt="" />
                                                    <Link scroll={false} href="#!" className="badge bg-primary text-white !rounded-full avatar-badge"><i className="text-[0.75rem] fe fe-camera"></i></Link>
                                                </span>
                                            </div>
                                            <div className="btn-list">
                                                <button className="!me-2 ti-btn ti-btn-primary">Change</button>
                                                <button className="ti-btn ti-btn-light">Remove</button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 gap-y-6 mb-4 sm:gap-x-6">
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="first-name" className="ti-form-label">First Name</label>
                                                <input type="text" className="form-control" id="first-name" placeholder="Firt Name" defaultValue="Json" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="last-name" className="ti-form-label">Last Name</label>
                                                <input type="text" className="form-control" id="last-name" placeholder="Last Name" defaultValue="Taylor" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="email-address" className="ti-form-label">Email Address :</label>
                                                <input type="text" className="form-control" id="email-address" placeholder="xyz@gmail.com" defaultValue="json@gmail.com" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="phone-number" className="ti-form-label">Mobile Number :</label>
                                                <input type="text" className="form-control" id="phone-number" placeholder="*** *** ****" defaultValue="65432 76765" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-12 gap-y-6 sm:gap-x-6">
                                            <div className="col-span-12 xl:col-span-4">
                                                <label className="ti-form-label">Country :</label>
                                                <SpkSelect name="colors" option={Selectdata2} mainClass="basic-multi-select" id="country-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Selectdata2[0]]} />

                                            </div>
                                            <div className="col-span-12 xl:col-span-4">
                                                <label className="ti-form-label">Gendar :</label>
                                                <SpkSelect name="colors" option={Gendardata} mainClass="basic-multi-select" id="Gendar-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Gendardata[0]]} />

                                            </div>
                                            <div className="col-span-12 xl:col-span-4">
                                                <label htmlFor="City" className="ti-form-label">City :</label>
                                                <input type="text" className="form-control" id="City" placeholder="City" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-12">
                                                <label htmlFor="bio" className="ti-form-label">Bio :</label>
                                                <textarea className="form-control" id="bio" rows={7} defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="!border-0 !p-0 hidden tab-pane" id="tab-2" role="tabpanel" aria-labelledby="tab2">
                                <div className="box overflow-hidden">
                                    <div className="justify-between box-header">
                                        <div className="box-title">
                                            All Posted Ads
                                        </div>
                                        <div className="flex">
                                            <div className="me-3">
                                                <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                            </div>
                                            <div className="hs-dropdown ti-dropdown">
                                                <Link scroll={false} href="#!" className="btn-wave !m-0 ti-btn ti-btn-primary ti-btn-sm waves-effect waves-light" data-bs-toggle="ti-dropdown hs-dropdown" aria-expanded="false">
                                                    Sort By<i className="align-middle ms-1 ri-arrow-down-s-line"></i>
                                                </Link>
                                                <ul className="hidden hs-dropdown-menu ti-dropdown-menu" role="menu">
                                                    <li><Link scroll={false} href="#!" className="ti-dropdown-item" >New</Link></li>
                                                    <li><Link scroll={false} href="#!" className="ti-dropdown-item" >Popular</Link></li>
                                                    <li><Link scroll={false} href="#!" className="ti-dropdown-item" >Relevant</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="!p-0 box-body">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full ti-custom-table-hover" showCheckbox={true} header={[{ title: 'Ad Title' }, { title: 'Category', }, { title: 'Status' }, { title: 'Location' }, { title: 'Published Date', headerClassname: '!text-nowrap' }, { title: 'Expires on' }, { title: 'Price' }, { title: 'Action' },]}>
                                                {UserProfileData.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td className="ps-6"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" aria-label="..." defaultChecked={idx.checked} /></td>
                                                        <td>
                                                            <div className="flex">
                                                                <span className="bg-opacity-10 top-nft bg-primary avatar avatar-md avatar-square">
                                                                    <Image fill src={idx.src} className="" alt="..." /></span>
                                                                <div className="ms-2">
                                                                    <p className="flex font-semibold items-center mb-0"><Link scroll={false} href="#!"> {idx.title}</Link></p>
                                                                    <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.details}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{idx.category}</td>
                                                        <td><span className={`badge !rounded-full badge-sm bg-${idx.statusColor}/[0.15]  text-${idx.statusColor}`}>{idx.status}</span></td>
                                                        <td>
                                                            <div className="inline-flex items-center">
                                                                <i className="text-[0.625rem] text-textmuted dark:text-textmuted/50 ri-map-pin-fill"></i>
                                                                <span className="ms-1">{idx.location}</span>
                                                            </div>
                                                        </td>
                                                        <td>{idx.postedDate}</td>
                                                        <td><span className={`badge bg-${idx.expiryDateColor}/[0.15] text-${idx.expiryDateColor}`}><i className="bi bi-clock me-1"></i>{idx.expiryDate}</span></td>
                                                        <td>{idx.price}</td>
                                                        <td>
                                                            <button className="btn-wave ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-primary">
                                                                <i className="ri-eye-line"></i>
                                                            </button>
                                                            <button className="btn-wave ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger">
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="flex flex-wrap items-center overflow-auto">
                                            <div className="mb-2 mb-sm-0">
                                                Showing <b>1</b> to <b>6</b> of <b>10</b> entries <i className="bi bi-arrow-right font-semibold inline-flex ms-2 rtl:rotate-180"></i>
                                            </div>
                                            <div className="ms-auto">
                                                <nav aria-label="Page navigation" className="me-1 pagination-style-4">
                                                    <ul className="mb-0 ti-pagination">
                                                        <li className="page-item"> <Link scroll={false} href="#!" className="disabled page-link" > Prev </Link> </li>
                                                        <li className="page-item"><Link scroll={false} href="#!" className="active page-link" >1</Link></li>
                                                        <li className="page-item"><Link scroll={false} href="#!" className="page-link" >2</Link></li>
                                                        <li className="page-item"><Link scroll={false} href="#!" className="page-link" >3</Link></li>
                                                        <li className="page-item"><Link scroll={false} href="#!" className="page-link" >4</Link></li>
                                                        <li className="page-item"> <Link scroll={false} href="#!" className="text-primary page-link" > next </Link> </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="!border-0 !p-0 hidden tab-pane" id="tab-3" role="tabpanel" aria-labelledby="tab3">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Post Ads
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12 gap-y-6 mb-4 sm:gap-x-6">
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="ad-title" className="ti-form-label">Ad Title</label>
                                                <input type="text" className="form-control" id="ad-title" placeholder="Ad Title" defaultValue="Gittbos Bike Mf120" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label className="ti-form-label">Ad Category</label>
                                                <SpkSelect name="colors" option={Categorydata} mainClass="basic-multi-select" id="Category-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Categorydata[0]]} />

                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label className="ti-form-label">Condition</label>
                                                <SpkSelect name="colors" option={Conditiondata} mainClass="basic-multi-select" id="country-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Conditiondata[0]]} />

                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label className="ti-form-label">Priority</label>
                                                <SpkSelect name="colors" option={Prioritydata} mainClass="basic-multi-select" id="country-select"
                                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Prioritydata[0]]} />

                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="Price" className="ti-form-label">Price</label>
                                                <input type="text" className="form-control" id="Price" placeholder="Price" defaultValue="$3654" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-6">
                                                <label htmlFor="Address" className="ti-form-label">Address</label>
                                                <input type="text" className="form-control" id="Address" placeholder="Address" defaultValue="USA, 456372" />
                                            </div>
                                            <div className="col-span-12 xl:col-span-12">
                                                <label htmlFor="Address" className="ti-form-label">Upload Image</label>

                                                <FilePond
                                                    files={files}
                                                    onupdatefiles={setFiles}
                                                    allowMultiple={true}
                                                    maxFiles={3}
                                                    server="/api"
                                                    name="files" /* sets the file input name, it's filepond by default */
                                                    labelIdle='Drag & Drop your file here or click '
                                                />
                                            </div>
                                            <div className="col-span-12 xl:col-span-12">
                                                <label htmlFor="bio" className="ti-form-label">Ad Description :</label>
                                                <textarea className="form-control" id="Ad-description" rows={7} defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="!border-0 !p-0 hidden tab-pane" id="tab-4" role="tabpanel" aria-labelledby="tab4">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="flex-grow box-title">
                                            Invoices List <span className="text-primary"></span>
                                        </div>
                                    </div>
                                    <div className="!p-0 box-body">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'User' }, { title: 'Invoice ID' }, { title: 'Issued Date', }, { title: 'Amount', }, { title: 'Status' }, { title: 'Due Date' }, { title: 'Action' }]}>
                                                {InvoicesList.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td>
                                                            <div className="flex items-center">
                                                                <div className="leading-none me-2">
                                                                    <span className="avatar avatar-rounded avatar-sm">
                                                                        <Image fill src={idx.src} alt="" />
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold mb-0">{idx.name}</p>
                                                                    <p className="text-[0.6875rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.mail}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Link href="/ecommerce/vendor/invoice-details" className="text-primary font-semibold">
                                                                {idx.id}
                                                            </Link>
                                                        </td>
                                                        <td>{idx.date} </td>
                                                        <td>{idx.amount}</td>
                                                        <td>
                                                            <span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span>
                                                        </td>
                                                        <td>{idx.dueDate} </td>
                                                        <td>
                                                            <div className="hs-tooltip ti-main-tooltip">
                                                                <Link scroll={false} href="#!" className="!m-0 !me-2 hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-primary">
                                                                    <i className="ri-printer-line"></i>
                                                                    <span
                                                                        className="shadow-sm !bg-black !font-medium !px-2 !py-1 !rounded-sm !text-[0.75rem] !text-white hs-tooltip-content ti-main-tooltip-content"
                                                                        role="tooltip">
                                                                        Print
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                            <div className="hs-tooltip ti-main-tooltip">
                                                                <Link scroll={false} href="#!" className="!m-0 !me-1 hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger">
                                                                    <i className="ri-delete-bin-5-line"></i>
                                                                    <span
                                                                        className="shadow-sm !bg-black !font-medium !px-2 !py-1 !rounded-sm !text-[0.75rem] !text-white hs-tooltip-content ti-main-tooltip-content"
                                                                        role="tooltip">
                                                                        Delete
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="!border-0 !p-0 hidden tab-pane" id="tab-5" role="tabpanel" aria-labelledby="tab5">
                                <div className="box">
                                    <div className="box-header">
                                        <div className="box-title">
                                            Account Settings
                                        </div>
                                    </div>
                                    <div className="box-body">
                                        <div className="grid grid-cols-12 gap-y-[3rem] sm:gap-x-6">
                                            <div className="col-span-12 xl:col-span-11">
                                                <h6 className="text-primary font-semibold mb-3">General Settings :</h6>
                                                <div className="grid grid-cols-12 mb-6 sm:gap-x-6">
                                                    <div className="col-span-12 xl:col-span-3">
                                                        <span className="text-[0.875rem] font-semibold mb-0">Account Type :</span>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">Select the account type</p>
                                                    </div>
                                                    <div className="col-span-12 xl:col-span-9">
                                                        <SpkSelect name="colors" option={Accountdata} mainClass="basic-multi-select" id="account-type-select"
                                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Accountdata[0]]} />

                                                    </div>
                                                </div>
                                                <div className="justify-between block items-top mb-4 sm:flex">
                                                    <div>
                                                        <p className="text-[0.875rem] font-semibold mb-1">Two Step Verification</p>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">Two step verificatoin is very secured and restricts in happening faulty practices.</p>
                                                    </div>
                                                    <div className="custom-toggle-switch ms-0 ms-sm-2 toggle-sm">
                                                        <input id="two-step" name="toggleswitchsize" type="checkbox" defaultChecked />
                                                        <label htmlFor="two-step" className="label-primary mb-1"></label>
                                                    </div>
                                                </div>
                                                <div className="justify-between block items-top mb-4 sm:flex">
                                                    <div>
                                                        <p className="text-[0.875rem] font-semibold mb-1">Recovery Mail</p>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">Incase of forgetting password mails are sent to  heifo@gmail.com</p>
                                                    </div>
                                                    <div className="custom-toggle-switch ms-0 ms-sm-2 toggle-sm">
                                                        <input id="recovery-mail" name="toggleswitchsize" type="checkbox" defaultChecked />
                                                        <label htmlFor="recovery-mail" className="label-primary mb-1"></label>
                                                    </div>
                                                </div>
                                                <div className="justify-between block items-top sm:flex">
                                                    <div>
                                                        <p className="text-[0.875rem] font-semibold mb-1">SMS Recovery</p>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">SMS are sent to 9102312xx in case of recovery</p>
                                                    </div>
                                                    <div className="custom-toggle-switch ms-0 ms-sm-2 toggle-sm">
                                                        <input id="sms-recovery" name="toggleswitchsize" type="checkbox" defaultChecked />
                                                        <label htmlFor="sms-recovery" className="label-primary mb-1"></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 xl:col-span-12">
                                                <h6 className="text-primary font-semibold mb-3">Change Password</h6>
                                                <p className="text-[0.8125rem]">Password should be min of <b className="text-success font-semibold">8 digits<sup>*</sup></b>,atleast <b className="text-success font-semibold">One Capital letter<sup>*</sup></b> and <b className="text-success font-semibold">One Special Character<sup>*</sup></b> included.</p>
                                                <div className="grid grid-cols-12 sm:gap-x-6">
                                                    <div className="col-span-12 mb-2 sm:col-span-4">
                                                        <label htmlFor="current-password" className="ti-form-label">Current Password</label>
                                                        <input type="text" className="form-control" id="current-password" placeholder="Current Password" />
                                                    </div>
                                                    <div className="col-span-12 mb-2 sm:col-span-4">
                                                        <label htmlFor="new-password" className="ti-form-label">New Password</label>
                                                        <input type="text" className="form-control" id="new-password" placeholder="New Password" />
                                                    </div>
                                                    <div className="col-span-12 mb-0 sm:col-span-4">
                                                        <label htmlFor="confirm-password" className="ti-form-label">Confirm Password</label>
                                                        <input type="text" className="form-control" id="confirm-password" placeholder="Confirm PAssword" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <div className="float-end">
                                            <button className="m-1 ti-btn ti-btn-light">
                                                Restore Defaults
                                            </button>
                                            <button className="m-1 ti-btn ti-btn-primary">
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

export default UserProfile;