"use client"
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import { PaymentGatewaysData, Statusselectdata } from "@/shared/data/apps/ecommers/admin/payment-gateways-data";
import React, { Fragment, useState } from "react";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import Image from "next/image";
import Link from "next/link";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const PaymentGateways = () => {
    //Filepond 
    const [files, setFiles] = useState<any>([]);
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Payment Gateways" />
                <Pageheader Heading="Payment Gateways" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Payment Gateways" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-body">
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <h6 className="font-semibold mb-0">
                                        Payment Methods
                                    </h6>
                                    <div className="flex gap-4 align-items-center flex-wrap">
                                        <div className="custom-form-group flex-grow">
                                            <input type="text" className="form-control" placeholder="Search Payment Options.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                            <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                        </div>
                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-primary btn-wave !m-0" data-hs-overlay="#add-payment">
                                            <i className="bi bi-plus-circle"></i>  Add New Payment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {PaymentGatewaysData.map((idx) => (
                        <div className="xxl:col-span-4 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12" key={idx.id}>
                            <div className="box">
                                <div className="box-body">
                                    <div className="ti-dropdown hs-dropdown float-end">
                                        <button className="ti-btn ti-btn-icon ti-btn-sm !border ti-btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-dots-vertical"></i>
                                        </button>
                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden">
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-edit-line me-1"></i>Edit</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!"><i className="ri-delete-bin-line me-1"></i>Delete</Link></li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-4 items-start flex-wrap">
                                        <div className="payment-card relative">
                                            <Image fill src={idx.src} alt="" />
                                        </div>
                                        <div className="flex-grow w-[50%]">
                                            <h6 className="font-semibold mb-1">{idx.title}</h6>
                                            <p className="mb-1 text-textmuted dark:text-textmuted/50">Customer can pay directly via {idx.paymantVia}.</p>
                                            <p className="mb-0"><span className="font-semibold">Status :</span> <span className="badge bg-success/[0.15] text-success">Enabled</span> </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <!-- End::row-1 --> */}

                <div id="add-payment" className="hs-overlay hidden ti-modal">
                    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header">
                                <h6 className="modal-title text-[1rem] font-medium" id="mail-ComposeLabel">Add New Payment</h6>
                                <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#add-payment">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className="ti-modal-body px-4">
                                <div className="grid grid-cols-12 gap-6 mb-4">
                                    <div className="lg:col-span-12 col-span-12">
                                        <label htmlFor="Payment-title" className="ti-form-label">Payment Title : </label>
                                        <input type="text" className="form-control" id="Payment-title" placeholder="Payment Title" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Payment-id" className="ti-form-label">Payment ID</label>
                                        <input type="text" className="form-control" id="Payment-id" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Payment-secret" className="ti-form-label">Payment Secret</label>
                                        <input type="text" className="form-control" id="Payment-secret" placeholder="Enter Here" defaultValue="54327812645fuygfeh" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Payment-currency" className="ti-form-label">Payment Currency</label>
                                        <input type="text" className="form-control" id="Payment-currency" placeholder="Enter Here" defaultValue="USD" />
                                    </div>
                                    <div className="lg:col-span-12 col-span-12">
                                        <label className="ti-form-label">Status</label>
                                        <SpkSelect name="state" option={Statusselectdata} mainClass="js-example-placeholder-multiple w-full js-states"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Statusselectdata[0]]} placeholder="High" />

                                    </div>
                                    <div className="lg:col-span-12 col-span-12">
                                        <label className="ti-form-label">Upload Image : </label>
                                        <FilePond
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            server="/api"
                                            name="files"
                                            labelIdle='Drag & Drop your file here or click '
                                        />
                                        {/*<div data-single="true" action="https://httpbin.org/post" class="dropzone"></div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="ti-modal-footer">
                                <button type="button"
                                    className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-secondary align-middle"
                                    data-hs-overlay="#add-payment">
                                    Close
                                </button>
                                <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Add Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default PaymentGateways;