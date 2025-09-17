"use client"
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { AllOrdersList } from "@/shared/data/apps/ecommers/admin/ordersdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Orders = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Orders" />
                <Pageheader Heading="Orders" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Orders" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    ALL ORDERS LIST
                                </div>
                                <div className="flex gap-4 items-center flex-wrap">
                                    <div className="btn-group ti-dropdown hs-dropdown">
                                        <button className="ti-btn ti-btn-outline-light !text-dark !m-0 !border dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-sort-descending-2 me-1"></i> Sort By <i className="ri-arrow-down-s-line align-middle inline-block"></i>
                                        </button>
                                        <ul className="ti-dropdown-menu hs-dropdown-menu hidden">
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Created Date</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Status</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Featured</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Customer Name</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Oldest</Link></li>
                                        </ul>
                                    </div>
                                    <div className="custom-form-group flex-grow">
                                        <input type="text" className="form-control" placeholder="Search Template.."
                                            aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-hover ti-custom-table-head w-full" header={[{ title: 'Order Id' }, { title: 'Product', }, { title: 'Customer', }, { title: 'Mobile Number' }, { title: 'Ordered Date' }, { title: 'Status' }, { title: 'Payment Mode' }, { title: 'Cost' }, { title: 'Action' },]}>
                                        {AllOrdersList.map((idx) => (
                                            <tr key={idx.id}>
                                                <td>{idx.id}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="avatar avatar-sm custom-img  avatar-square bg-gray-300 dark:bg-light"><Image fill src={idx.productSrc} className="w-100 h-100" alt="..." /></span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="/apps/ecommerce/admin/order-details">{idx.productName}</Link></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <span className="avatar  avatar-sm me-2 avatar-rounded">
                                                            <Image fill src={idx.customerSrc} alt="" />
                                                        </span>{idx.customerName}
                                                    </div>
                                                </td>
                                                <td>{idx.number}</td>
                                                <td>{idx.date}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                                <td>{idx.paymentMode}</td>
                                                <td className="font-semibold">{idx.cost}</td>
                                                <td>
                                                    <Link scroll={false} href="/apps/ecommerce/admin/order-details" className="ti-btn ti-btn-icon ti-btn-sm !me-2 ti-btn-soft-primary btn-wave">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info !me-2 btn-wave">
                                                        <i className="ri-download-line"></i>
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
                                <div className="flex items-center flex-wrap overflow-auto">
                                    <div className="mb-2 mb-sm-0">
                                        Showing <b>1</b> to <b>10</b> of <b>10</b> entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 fw-semibold"></i>
                                    </div>
                                    <div className="ms-auto">
                                        <ul className="ti-pagination mb-0 overflow-auto">
                                            <li className="page-item"><Link scroll={false} href="#!" className="page-link disabled">Previous</Link></li>
                                            <li className="page-item" aria-current="page"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                            <li className="page-item"> <Link scroll={false} className="page-link" href="#!">2</Link> </li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">3</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">4</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">5</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">Next</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}
            </div>
        </Fragment>
    );
};

export default Orders;