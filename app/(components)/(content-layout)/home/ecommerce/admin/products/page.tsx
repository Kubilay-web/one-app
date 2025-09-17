"use client"
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { ProductsList } from "@/shared/data/apps/ecommers/admin/productsdata";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Products = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Products" />
                <Pageheader Heading="Products" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Products" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    PRODUCTS LIST
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
                                        <input type="text" className="form-control" placeholder="Search Template.."
                                            aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i
                                            className="ti ti-search"></i></Link>
                                    </div>
                                    <Link scroll={false} href="/apps/ecommerce/admin/add-product" className="ti-btn ti-btn-primary btn-wave !m-0">
                                        <i className="bi bi-plus-circle"></i>  Add Product
                                    </Link>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" showCheckbox={true} Customcheckclass="ps-6" header={[{ title: 'Product' }, { title: 'Seller', }, { title: 'Category', }, { title: 'Status' }, { title: 'Stock Qty' }, { title: 'Total Sales' }, { title: 'Price' }, { title: 'Action' },]}>
                                        {ProductsList.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="ps-6"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                                <td>
                                                    <div className="flex">
                                                        <span className="avatar custom-img avatar-md avatar-square bg-gray-300 dark:bg-light"><Image fill src={idx.imgSrc} className="" alt="..." /></span>
                                                        <div className="ms-2">
                                                            <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="/ecommerce/customer/product-details">{idx.productName}</Link></p>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center font-semibold">
                                                        <span className="avatar avatar-sm me-2 avatar-rounded">
                                                            <Image fill src={idx.sellerImg} alt="" />
                                                        </span>
                                                        <Link scroll={false} href="/apps/ecommerce/admin/vendor-details/">{idx.seller}</Link>
                                                    </div>
                                                </td>
                                                <td>{idx.category} </td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span></td>
                                                <td>{idx.stockQty}</td>
                                                <td>{idx.totalSales}</td>
                                                <td className="font-semibold">{idx.price}</td>
                                                <td>
                                                    <Link scroll={false} href="/ecommerce/customer/product-details" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-primary btn-wave">
                                                        <i className="ri-eye-line"></i>
                                                    </Link>
                                                    <Link scroll={false} href="/apps/ecommerce/admin/add-product" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info btn-wave">
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
                                <div className="flex items-center flex-wrap overflow-auto">
                                    <div className="mb-2 mb-sm-0">
                                        Showing <b>1</b> to <b>6</b> of <b>10</b> entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i>
                                    </div>
                                    <nav aria-label="Page navigation" className="pagination-style-4 float-end ms-auto">
                                        <ul className="ti-pagination mb-0 me-1">
                                            <li className="page-item"><Link scroll={false} className="page-link disabled" href="#!"> Prev</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!"> <i className="bi bi-three-dots"></i></Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">16</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link" href="#!">17</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link text-primary" href="#!"> next </Link></li>
                                        </ul>
                                    </nav>
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

export default Products;