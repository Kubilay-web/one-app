"use client"
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { CustomersListData } from "@/shared/data/apps/ecommers/admin/customers-list-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const CustomersList = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Customers List" />
                <Pageheader Heading="Customers List" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Customers List" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    Customers List
                                </div>
                                <div className="flex gap-4 items-center flex-wrap">
                                    <div className="btn-group ti-dropdown hs-dropdown">
                                        <button className="ti-btn ti-btn-outline-light !text-dark !m-0 !border dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="ti ti-sort-descending-2 me-1"></i> Sort By <i
                                                className="ri-arrow-down-s-line align-middle inline-block"></i>
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
                                        <input type="text" className="form-control" placeholder="Search Template.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                    </div>
                                    <Link scroll={false} href="/apps/ecommerce/admin/add-customer" className="ti-btn ti-btn-primary btn-wave !m-0">
                                        <i className="bi bi-plus-circle"></i>  Add Customer
                                    </Link>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-hover ti-custom-table-head w-full" header={[{ title: 'Customer' }, { title: 'Email', }, { title: 'Mobile Number', }, { title: 'Status' }, { title: 'Total Orders' }, { title: 'Wallet Balance' }, { title: 'Action' },]}>
                                        {CustomersListData.map((idx) => (
                                            <tr key={idx.id}>
                                                <th scope="row">
                                                    <div className="flex items-center">
                                                        <div className="me-2">
                                                            <span className="avatar avatar-md p-1 bg-light avatar-rounded">
                                                                <Image fill src={idx.src} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link scroll={false} href="/apps/ecommerce/admin/customer-details" className="font-semibold mb-0">{idx.name}</Link>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0"><i className="bi bi-geo-alt"></i> {idx.location}</p>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td>{idx.email}</td>
                                                <td>{idx.mobile}</td>
                                                <td><span className={`badge bg-${idx.statusClass}/[0.15] text-${idx.statusClass}`}>{idx.status}</span></td>
                                                <td>{idx.totalOrders}</td>
                                                <td>{idx.walletBalance} </td>
                                                <td>
                                                    <Link scroll={false} href="/apps/ecommerce/admin/customer-details" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-primary !me-2 btn-wave">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <Link scroll={false} href="/apps/ecommerce/admin/add-customer" className="ti-btn ti-btn-icon ti-btn-sm !me-2 ti-btn-soft-info btn-wave">
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
                                    <ul className="ti-pagination mb-0">
                                        <li className="page-item"> <Link scroll={false} className="page-link disabled" href="#!"> Prev </Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                        <li className="page-item"> <Link scroll={false} className="page-link" href="#!"> <i className="bi bi-three-dots"></i></Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">17</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link text-primary" href="#!"> next </Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}
            </div>
        </Fragment>
    );
};

export default CustomersList;