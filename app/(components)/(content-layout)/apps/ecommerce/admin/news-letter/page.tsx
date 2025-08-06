"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { Locationdata, Statusdata, SubscribersList } from "@/shared/data/apps/ecommers/admin/news-letter-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const NewsLetter = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="News Letter" />
                <Pageheader Heading="News Letter" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="News Letter" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-col-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    SUBSCRIBERS LIST
                                </div>
                                <div className="flex gap-3 items-center flex-wrap">
                                    <div className="btn-group ti-dropdown hs-dropdown">
                                        <button
                                            className="ti-btn ti-btn-outline-light !text-dark !border dropdown-toggle !m-0"
                                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-sort-descending-2 me-1"></i> Sort By <i
                                                className="ri-arrow-down-s-line align-middle inline-block"></i>
                                        </button>
                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden">
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Created Date</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Status</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">User Name</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Oldest</Link></li>
                                        </ul>
                                    </div>
                                    <div className="custom-form-group flex-grow">
                                        <input type="text" className="form-control" placeholder="Search Blog.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                    </div>
                                    <button type="button" className="ti-btn ti-btn-primary btn-wave !m-0" data-hs-overlay="#add-user">
                                        <i className="bi bi-plus-circle me-1"></i> Add User
                                    </button>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'User Name' }, { title: 'Email', }, { title: 'Created Date', }, { title: 'Status' }, { title: 'Action' }]}>
                                        {SubscribersList.map((idx) => (
                                            <tr key={idx.id}>
                                                <th scope="row">
                                                    <div className="flex items-center">
                                                        <div className="me-2">
                                                            <span className="avatar avatar-md p-1 bg-light avatar-rounded">
                                                                <Image fill src={idx.src} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link scroll={false} href="/apps/ecommerce/admin/vendor-details" className="font-semibold mb-0">{idx.name}</Link>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0"><i className="bi bi-geo-alt"></i> {idx.location}</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>{idx.email}</td>
                                                <td>{idx.createdDate}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                                <td>
                                                    <Link scroll={false} href="/apps/ecommerce/admin/vendor-details" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-primary btn-wave">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info btn-wave hs-dropdown-toggle" data-hs-overlay="#hs-edit-subscrier">
                                                        <i className="ri-edit-line"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger btn-wave">
                                                        <i className="ri-delete-bin-line"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                                <nav aria-label="Page navigation" className="pagination-style-2 float-end">
                                    <ul className="ti-pagination mb-0 flex-wrap">
                                        <li className="page-item"><Link scroll={false} className="page-link disabled" href="#!">Prev</Link> </li>
                                        <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                        <li className="page-item"> <Link scroll={false} className="page-link" href="#!"><i className="bi bi-three-dots"></i> </Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">16</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">17</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link text-primary" href="#!">next</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}
            </div>

            <div id="hs-edit-subscrier" className="hs-overlay hidden ti-modal">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-medium" id="mail-ComposeLabel">Add New User</h6>
                            <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#add-user">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                            <div className="grid grid-cols-12 gap-6 mb-4">
                                <div className="lg:col-span-12 col-span-12">
                                    <label htmlFor="User-Name" className="ti-form-label">User Name : </label>
                                    <input type="text" className="form-control" id="User-Name" placeholder="User Name" defaultValue="Brenda Simpson" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="Email-id1" className="ti-form-label">Email ID</label>
                                    <input type="text" className="form-control" id="Email-id1" placeholder="Enter Here" defaultValue="brendasimpson@gmail.com" />
                                </div>
                                <div className="lg:col-span-12 col-span-12">
                                    <label className="ti-form-label">Location</label>
                                    <SpkSelect name="Location" option={Locationdata} mainClass=""
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Locationdata[0]]} />

                                </div>
                                <div className="lg:col-span-12 col-span-12">
                                    <label className="ti-form-label">Status</label>
                                    <SpkSelect name="Status" option={Statusdata} mainClass=""
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Statusdata[0]]} />

                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-4">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" className="w-full h-full" />
                                            <Link scroll={false} href="#!" className="badge !rounded-full bg-danger avatar-badge text-white"><i className="fe fe-x"></i></Link>
                                        </span>
                                    </div>
                                    <div className="btn-list">
                                        <div> <label htmlFor="small-file-input1" className="sr-only">Choose file</label> <input type="file" name="small-file-input1" id="small-file-input1" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                        file:border-0
                                       file:bg-light file:me-4
                                       file:py-2 file:px-4
                                       dark:file:bg-black/20 dark:file:text-white/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ti-modal-footer">
                            <button type="button"
                                className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-secondary align-middle"
                                data-hs-overlay="#add-user">
                                Close
                            </button>
                            <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Add User</button>
                        </div>
                    </div>
                </div>
            </div>


            <div id="add-user" className="hs-overlay hidden ti-modal">
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                    <div className="ti-modal-content">
                        <div className="ti-modal-header">
                            <h6 className="modal-title text-[1rem] font-medium" id="mail-ComposeLabel1">Add New User</h6>
                            <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#add-user">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4">
                            <div className="grid grid-cols-12 gap-6 mb-4">
                                <div className="lg:col-span-12 col-span-12">
                                    <label htmlFor="User-Name1" className="ti-form-label">User Name : </label>
                                    <input type="text" className="form-control" id="User-Name1" placeholder="User Name" defaultValue="Brenda Simpson" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="Email-id" className="ti-form-label">Email ID</label>
                                    <input type="text" className="form-control" id="Email-id" placeholder="Enter Here" defaultValue="brendasimpson@gmail.com" />
                                </div>
                                <div className="lg:col-span-12 col-span-12">
                                    <label className="ti-form-label">Location</label>
                                    <SpkSelect name="Location" option={Locationdata} mainClass=""
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Locationdata[0]]} />
                                </div>
                                <div className="lg:col-span-12 col-span-12">
                                    <label className="ti-form-label">Status</label>
                                    <SpkSelect name="Status" option={Statusdata} mainClass=""
                                        menuplacement='auto' classNameprefix="Select2" defaultvalue={[Statusdata[0]]} />

                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-4">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" className="w-full h-full" />
                                            <Link scroll={false} href="#!" className="badge !rounded-full bg-danger avatar-badge text-white"><i className="fe fe-x"></i></Link>
                                        </span>
                                    </div>
                                    <div className="btn-list">
                                        <div> <label htmlFor="small-file-input" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                        file:border-0
                                       file:bg-light file:me-4
                                       file:py-2 file:px-4
                                       dark:file:bg-black/20 dark:file:text-white/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ti-modal-footer">
                            <button type="button"
                                className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-secondary align-middle"
                                data-hs-overlay="#add-user">
                                Close
                            </button>
                            <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Add User</button>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default NewsLetter;