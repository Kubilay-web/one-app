"use client"
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { OrderDetailsData } from "@/shared/data/apps/ecommers/admin/order-details-data";
import React, { Fragment } from "react";
import Link from "next/link";

import Image from "next/image";

const OrderDetails = () => {
    const print = () => {
        window.print();
    };
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Order Details" />
                <Pageheader Heading="Order Details" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Order Details" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header md:flex block">
                                <div className="h5 mb-0 sm:flex bllock items-center">
                                    <div className="avatar avatar-sm">
                                        <Image fill src="../../../../assets/images/brand-logos/toggle-logo.png" alt="" />
                                    </div>
                                    <div className="sm:ms-2 ms-0 sm:mt-0 mt-2">
                                        <div className="h6 font-semibold mb-0">SHOPPING INVOICE : <span className="text-primary">#8140-2099</span></div>
                                    </div>
                                </div>
                                <div className="ms-auto md:mt-0 mt-2">
                                    <button className="ti-btn ti-btn-sm ti-btn-secondary me-2" onClick={() => print()} >Print<i className="ri-printer-line ms-1 align-middle inline-block"></i></button>
                                    <button className="ti-btn ti-btn-sm ti-btn-primary">Save As PDF<i className="ri-file-pdf-line ms-1 align-middle inline-block"></i></button>
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="grid grid-cols-12 sm:gap-x-6">
                                            <div className="xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12">
                                                <p className="text-textmuted dark:text-textmuted/50 mb-2">
                                                    Billing From :
                                                </p>
                                                <p className="font-semibold mb-1">
                                                    SPRUKO TECHNOLOGIES
                                                </p>
                                                <p className="mb-1 text-textmuted dark:text-textmuted/50">
                                                    Mig-1-11,Manroe street
                                                </p>
                                                <p className="mb-1 text-textmuted dark:text-textmuted/50">
                                                    Georgetown,Washington D.C,USA,200071
                                                </p>
                                                <p className="mb-1 text-textmuted dark:text-textmuted/50">
                                                    sprukotrust.ynex@gmail.com
                                                </p>
                                                <p className="mb-1 text-textmuted dark:text-textmuted/50">
                                                    (555) 555-1234
                                                </p>
                                                <p className="text-textmuted dark:text-textmuted/50">For more information check for <Link scroll={false} href="#!" className="text-primary font-semibold"><u>GSTIN</u></Link> Details.</p>
                                            </div>
                                            <div className="xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-6 col-span-12 ms-auto mt-sm-0 mt-3">
                                                <p className="text-textmuted dark:text-textmuted/50 mb-2">
                                                    Billing To :
                                                </p>
                                                <p className="font-semibold mb-1">
                                                    Jack Miller
                                                </p>
                                                <p className="text-textmuted dark:text-textmuted/50 mb-1">
                                                    Lig-22-1,20 Covington Place
                                                </p>
                                                <p className="text-textmuted dark:text-textmuted/50 mb-1">
                                                    New Castle,de, United States,19320
                                                </p>
                                                <p className="text-textmuted dark:text-textmuted/50 mb-1">
                                                    jackmiller2134@gmail.com
                                                </p>
                                                <p className="text-textmuted dark:text-textmuted/50">
                                                    +1 202-918-2132
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <p className="font-semibold text-textmuted dark:text-textmuted/50 mb-1">Invoice ID :</p>
                                        <p className="text-[0.9375rem] mb-1">#SPK120219890</p>
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <p className="font-semibold text-textmuted dark:text-textmuted/50 mb-1">Date Issued :</p>
                                        <p className="text-[0.9375rem] mb-1">29,Nov 2024 - <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">12:42PM</span></p>
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <p className="font-semibold text-textmuted dark:text-textmuted/50 mb-1">Due Date :</p>
                                        <p className="text-[0.9375rem] mb-1">29,Dec 2024</p>
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <p className="font-semibold text-textmuted dark:text-textmuted/50 mb-1">Due Amount :</p>
                                        <p className="text-[1rem] mb-1 font-semibold">$2,570.42</p>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table whitespace-nowrap border dark:border-defaultborder/10 mt-4" header={[{ title: 'BRAND NAME' }, { title: 'DESCRIPTION', }, { title: 'QUANTITY', }, { title: 'PRICE PER UNIT' }, { title: 'TOTAL' }]}>
                                                {OrderDetailsData.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td>
                                                            <div className="font-semibold">
                                                                {idx.name}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="text-textmuted dark:text-textmuted/50">
                                                                {idx.description}
                                                            </div>
                                                        </td>
                                                        <td className="product-quantity-container">
                                                            {idx.quantity}
                                                        </td>
                                                        <td>
                                                            ${idx.price}
                                                        </td>
                                                        <td>
                                                            ${idx.total}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={3}></td>
                                                    <td colSpan={2}>
                                                        <table className="ti-custom-table !border-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0">Sub Total :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[0.9375rem]">$2,364</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0">Avail Discount :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[0.9375rem]">$29.98</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0">Coupon Discount <span className="text-success">(10%)</span> :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[0.9375rem]">$236.40</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0">Vat <span className="text-danger">(20%)</span> :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[0.9375rem]">$472.80</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0">Due Till Date :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[0.9375rem]">$0</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <p className="mb-0 text-[0.875rem]">Total :</p>
                                                                    </th>
                                                                    <td>
                                                                        <p className="mb-0 font-semibold text-[1rem] text-success">$2,570.42</p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </Spktables>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <div>
                                            <label htmlFor="invoice-note" className="form-label">Note:</label>
                                            <textarea className="form-control form-control-light"
                                                id="bio"
                                                rows={3}
                                                defaultValue="Once the invoice has been verified by the accounts payable team and recorded, the only task left is to send it for approval before releasing the payment"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer text-end">
                                <button className="ti-btn ti-btn-success">Download <i className="ri-download-2-line ms-1 align-middle"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    PAYMENT DETAILS
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-y-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <p className="text-[0.875rem] font-semibold mb-4">
                                            Credit/Debit Card
                                        </p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-textmuted dark:text-textmuted/50 text-[0.75rem]">Name On Card :</span> Jack Miller
                                        </p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-textmuted dark:text-textmuted/50 text-[0.75rem]">Card Number :</span> 1234 5678 9087 XXXX
                                        </p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-textmuted dark:text-textmuted/50 text-[0.75rem]">Total Amount :</span> <span className="text-success font-semibold text-[0.875rem]">$2570.42</span>
                                        </p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-textmuted dark:text-textmuted/50 text-[0.75rem]">Due Date :</span> 29,Dec 2024 - <span className="text-danger text-[0.75rem] font-semibold">30 days due</span>
                                        </p>
                                        <p className="mb-4">
                                            <span className="font-semibold text-textmuted dark:text-textmuted/50 text-[0.75rem]">Invoice Status : <span className="badge bg-warning/[0.15] text-warning">Pending</span></span>
                                        </p>
                                        <div className="alert alert-success" role="alert">
                                            Please Make sure to pay the invoice bill within 30 days.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    CUSTOMER DETAILS
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="flex items-center border-b border-dashed dark:border-defaultborder/10 p-4 flex-wrap">
                                    <div className="me-2">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-0 font-semibold">Jack Miller</p>
                                        <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">jackmiller2135@gmail.com</p>
                                    </div>
                                    <div>
                                        <span className="badge bg-secondary text-white">Elite</span>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[0.875rem] font-semibold">Delivery address :</span>
                                        <button className="ti-btn ti-btn-icon btn-wave ti-btn-primary ti-btn-sm"><i className="ri-pencil-line"></i></button>
                                    </div>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">Landmark : </span>MIG-1-11</p>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">Street : </span>Monroe Street</p>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">City : </span>Georgetown</p>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">State : </span>Washington,D.C</p>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">Country : </span>USA</p>
                                    <p className="mb-0 text-textmuted dark:text-textmuted/50"><span className="font-semibold text-dark inline-block me-1">Zipcode : </span>200071</p>
                                </div>
                                <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                    <div className="mb-4">
                                        <span className="text-[0.875rem] font-semibold">Send updates to :</span>
                                    </div>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50">
                                        <span className="font-semibold text-dark inline-block me-1">Phone : </span>
                                        (555)-0123-1210
                                    </p>
                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">
                                        <span className="font-semibold text-dark inline-block me-1">Email : </span>
                                        jackmiller2134@gmail.com
                                    </p>
                                </div>
                                <div className="p-4 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                    <div className="mb-4">
                                        <span className="text-[0.875rem] font-semibold">Order Summary</span>
                                    </div>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50">
                                        <span className="font-semibold text-dark inline-block me-1">Ordered Date</span>
                                        24,Nov 2024
                                    </p>
                                    <p className="mb-2 text-textmuted dark:text-textmuted/50">
                                        <span className="font-semibold text-dark inline-block me-1">Ordered Time :</span>
                                        11:47AM
                                    </p>
                                    <p className="mb-0 text-textmuted dark:text-textmuted/50">
                                        <span className="font-semibold text-dark inline-block me-1">Payment Interface :</span>
                                        UPI
                                    </p>
                                </div>
                            </div>
                            <div className="box-footer">Total
                                <span className="text-success"> 294 items</span> purchased upto now
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}
            </div>
        </Fragment>
    );
};

export default OrderDetails;