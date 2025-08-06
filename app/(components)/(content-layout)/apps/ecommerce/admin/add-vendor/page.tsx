"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import { simpleItems } from "@/shared/data/apps/ecommers/admin/addproduct";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const AddVendor = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Add Vendor" />
                <Pageheader Heading="Add Vendor" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Add Vendor" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-8 lg:col-span-8 md:col-span-7 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title flex-grow-1">
                                    ADD NEW VENDOR
                                </div>
                                <Link href="/apps/ecommerce/admin/products" className="ti-btn ti-btn-outline-light btn-wave !m-0 !text-dark">
                                    <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex "></i> Go Back
                                </Link>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="vendor-name" className="ti-form-label">Vendor Name</label>
                                        <input type="text" className="form-control" id="vendor-name" placeholder="vendor Name" defaultValue="Jack Miller" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Vendor-username" className="ti-form-label">Vendor Username</label>
                                        <input type="text" className="form-control" id="Vendor-username" placeholder="Vendor username" defaultValue="andrewretail" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Store-name" className="ti-form-label">Store Name</label>
                                        <input type="text" className="form-control" id="Store-name" placeholder="Store Name" defaultValue="Andrew Retail PVT LTD" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Store-website" className="ti-form-label">Store Website</label>
                                        <input type="text" className="form-control" id="Store-website" placeholder="Store Website" defaultValue="https://spruko.com" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="email-address" className="ti-form-label">Email Address :</label>
                                        <input type="text" className="form-control" id="email-address" placeholder="xyz@gmail.com" defaultValue="json@gmail.com" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Category :</label>
                                        <SpkSelect option={simpleItems} mainClass="" name="Category-select"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[simpleItems[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="phone-number" className="ti-form-label">Mobile Number :</label>
                                        <input type="text" className="form-control" id="phone-number" placeholder="*** *** ****" defaultValue="65432 76765" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Establishment-Year" className="ti-form-label">Establishment Year :</label>
                                        <input type="text" className="form-control" id="Establishment-Year" placeholder="Establishment Year" defaultValue="2019" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Address" className="ti-form-label">Store Address :</label>
                                        <input type="text" className="form-control" id="Address" placeholder="Address" defaultValue="USA" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Zip-Code" className="ti-form-label">Zip Code :</label>
                                        <input type="text" className="form-control" id="Zip-Code" placeholder="Zip Code" defaultValue="1234" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="bio" className="ti-form-label">About Store :</label>
                                        <textarea className="form-control w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            id="bio"
                                            rows={7}
                                            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="float-end">
                                    <button className="ti-btn ti-btn-primary btn-wave">
                                        <i className="bi bi-plus-circle"></i> Add Vendor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-4 lg:col-span-4 md:col-span-5 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Vendor Profile</div>
                            </div>
                            <div className="box-body">
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-4">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" className="w-full h-full" />
                                            <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                        </span>
                                    </div>
                                    <div> <label htmlFor="small-file-input" className="sr-only">Choose file</label> <input type="file" name="small-file-input" id="small-file-input" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                    file:border-0
                                   file:bg-light file:me-4
                                   file:py-2 file:px-4
                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Social Links</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-y-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="facebook" className="ti-form-label">Facebook :</label>
                                        <input type="text" className="form-control" id="facebook" placeholder="https://" defaultValue="https://www.facebook.com" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Twitter" className="ti-form-label">Twitter :</label>
                                        <input type="text" className="form-control" id="Twitter" placeholder="https://" defaultValue="https://twitter.com" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Pinterest" className="ti-form-label">Pinterest:</label>
                                        <input type="text" className="form-control" id="Pinterest" placeholder="https://" defaultValue="https://in.pinterest.com" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Linkedin" className="ti-form-label">Linkedin :</label>
                                        <input type="text" className="form-control" id="Linkedin" placeholder="https://" defaultValue="https://www.linkedin.com" />
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

export default AddVendor;