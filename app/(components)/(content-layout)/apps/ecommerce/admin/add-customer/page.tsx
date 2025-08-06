"use client"

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const AddCustomer = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Add Customer" />
                <Pageheader Heading="Add Customer" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Add Customer" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-8 lg:col-span-8 md:col-span-7 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    Add New Customer
                                </div>
                                <Link href={"/apps/ecommerce/admin/customers-list/"} className="ti-btn ti-btn-light !border ti-btn-sm btn-wave">
                                    <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  me-1"></i> Go Back
                                </Link>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Customer-name" className="ti-form-label">Customer Name</label>
                                        <input type="text" className="form-control" id="Customer-name" placeholder="Customer Name" defaultValue="Jack Miller" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Customer-username" className="ti-form-label">Customer Username</label>
                                        <input type="text" className="form-control" id="Customer-username" placeholder="Customer username" defaultValue="andrewretail" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="email-address" className="ti-form-label">Email Address :</label>
                                        <input type="text" className="form-control" id="email-address" placeholder="xyz@gmail.com" defaultValue="json@gmail.com" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="phone-number" className="ti-form-label">Mobile Number :</label>
                                        <input type="text" className="form-control" id="phone-number" placeholder="*** *** ****" defaultValue="65432 76765" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Address" className="ti-form-label">Address :</label>
                                        <input type="text" className="form-control" id="Address" placeholder="Address" defaultValue="USA" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Zip-Code" className="ti-form-label">Zip Code :</label>
                                        <input type="text" className="form-control" id="Zip-Code" placeholder="Zip Code" defaultValue="1234" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="bio" className="ti-form-label">About Customer :</label>
                                        <textarea className="form-control w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            id="bio"
                                            rows={7}
                                            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-end">
                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary btn-wave">
                                    <i className="bi bi-plus-circle"></i> Add Customer
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-4 lg:col-span-4 md:col-span-5 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Customer Profile</div>
                            </div>
                            <div className="box-body">
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-4">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" className="w-full h-full" />
                                            <Link scroll={false} href="#!" className="badge rounded-pill bg-danger text-white avatar-badge"><i className="fe fe-x text-[0.75rem]"></i></Link>
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
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    Change Password
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12  gap-y-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Current-Password" className="ti-form-label">Current Password :</label>
                                        <input type="password" className="form-control" id="Current-Password" placeholder="Enter Password..." />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="New-Password" className="ti-form-label">New Password :</label>
                                        <input type="password" className="form-control" id="New-Password" placeholder="Enter Password..." />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Confirm-Password" className="ti-form-label">Confirm Password :</label>
                                        <input type="password" className="form-control" id="Confirm-Password" placeholder="Enter Password..." />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-end">
                                <Link scroll={false} href="#!" className="ti-btn ti-btn-primary btn-wave">
                                    Update
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}
            </div>
        </Fragment>
    );
};

export default AddCustomer;