"use client"
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import { Categorydata, Faqsdata } from "@/shared/data/apps/ecommers/admin/faqsdata";
import React, { Fragment } from "react";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import SunEditorComponent from "@/shared/@spk-reusable-components/spk-packages/editor-component";
import Link from "next/link";

const Faqs = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Faq's" />
                <Pageheader Heading="Faq's" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Faq's" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-body">
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <h6 className="font-semibold mb-0">
                                        FAQ'S
                                    </h6>
                                    <div className="flex gap-4 items-center flex-wrap">
                                        <div className="custom-form-group flex-grow">
                                            <input type="text" className="form-control" placeholder="Search FAQ'S.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                            <Link scroll={false}href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                        </div>
                                        <Link scroll={false}href="#!" className="ti-btn ti-btn-primary btn-wave !m-0" data-hs-overlay="#hs-overlay-example">
                                            <i className="bi bi-plus-circle"></i>  Add New FAQ
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {Faqsdata.map((idx) => (
                        <div className="xxl:col-span-4 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12" key={idx.id}>
                            <div className="box">
                                <div className="box-body">
                                    <div className="btn-list float-end">
                                        <button className="ti-btn ti-btn-sm ti-btn-icon btn-wave ti-btn-soft-info" data-hs-overlay="#hs-overlay-example"><i className="ri-edit-line"></i></button>
                                        <button className="ti-btn ti-btn-sm ti-btn-icon btn-wave ti-btn-soft-danger me-0"><i className="ri-delete-bin-line"></i></button>
                                    </div>
                                    <div className="flex items-start mb-3 gap-2 flex-wrap">
                                        <div>
                                            <span className="avatar avatar-md avatar-rounded bg-primary/[0.15] text-primary">
                                                <i className="bi bi-question-lg text-[1.25rem]"></i>
                                            </span>
                                        </div>
                                        <div>
                                            <p className="mb-0 font-semibold text-[0.9375rem]">{idx.title}</p>
                                            <span className="badge bg-light border dark:border-defaultborder/10 text-default">{idx.badge}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-textmuted dark:text-textmuted/50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum autem quaerat distinctio....</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-semibold">Status : </span>
                                        <span className="badge bg-success/[0.15] text-success ms-1">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="xl:col-span-12 col-span-12">
                        <nav aria-label="Page navigation" className="pagination-style-4 float-end mb-4 justify-end ">
                            <ul className="ti-pagination mb-0 ">
                                <li className="page-item"><Link scroll={false}className="page-link !bg-white dark:!bg-bodybg disabled" href="#!"> Prev </Link> </li>
                                <li className="page-item"><Link scroll={false}className="page-link active" href="#!">1</Link></li>
                                <li className="page-item "><Link scroll={false}className="page-link !bg-white dark:!bg-bodybg" href="#!">2</Link></li>
                                <li className="page-item "><Link scroll={false}className="page-link !bg-white dark:!bg-bodybg" href="#!">3</Link></li>
                                <li className="page-item "><Link scroll={false}className="page-link !bg-white dark:!bg-bodybg" href="#!">4</Link></li>
                                <li className="page-item "><Link scroll={false}className="page-link !bg-white dark:!bg-bodybg" href="#!">next</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/*<!-- Start::add faq -->*/}
                <div className="hs-overlay ti-offcanvas ti-offcanvas-right !z-[105] hidden !max-w-[600px] custom-canvas" tabIndex={-1}
                    id="hs-overlay-example">
                    <div className="ti-offcanvas-header border-b">
                        <h5 className="ti-offcanvas-title" id="offcanvasScrollingLabel">Add New Faq's</h5>
                        <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor" data-hs-overlay="#hs-overlay-example">
                            <span className="sr-only">Close</span>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <div className="ti-offcanvas-body !pt-4 !px-4 overflow-auto">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="lg:col-span-12 col-span-12">
                                <label htmlFor="FAQ-Title" className="ti-form-label">FAQ Title : </label>
                                <input type="text" className="form-control" id="FAQ-Title" placeholder="FAQ Title" defaultValue="Jack Miller"  />
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <label className="ti-form-label">Category</label>
                                <SpkSelect name="state" option={Categorydata} mainClass="js-example-placeholder-multiple w-full js-states"
                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[Categorydata[0]]} placeholder="High" />

                            </div>
                            <div className="lg:col-span-12 col-span-12">
                                <label className="ti-form-label">FAQ Description</label>
                                <div id="faq-description-editor">
                                    <SunEditorComponent setoptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],
                                            ["table", "link", "image", "video"],
                                            ["preview", "print"],
                                            ["removeFormat"]
                                        ],
                                        defaultTag: "div",
                                        minHeight: "300px",
                                        showPathLabel: false,
                                        font: ["Arial", "Comic Sans MS", "Courier New", "Impact"],
                                        defaultStyle: 'font-family: Arial; font-size: 16px;',
                                    }} />
                                </div>
                            </div>
                            <div className="lg:col-span-12 col-span-12">
                                <div className="flex items-center mb-3">
                                    <input type="checkbox" id="hs-basic-with-description-checked" className="ti-switch" defaultChecked />
                                    <label htmlFor="hs-basic-with-description-checked" className="text-sm text-gray-500 ms-3 text-textmuted dark:text-textmuted/50">Active</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end ti-offcanvas-footer p-4 border-t shadow-sm">
                        <div className="btn-list">
                            <div className="ti-btn ti-btn-w-md ti-btn-info">Draft</div>
                            <div className="ti-btn ti-btn-w-md ti-btn-primary">Publish</div>
                        </div>
                    </div>
                </div>
                {/*<!-- Start::add faq -->*/}
            </div>
        </Fragment>
    );
};

export default Faqs;