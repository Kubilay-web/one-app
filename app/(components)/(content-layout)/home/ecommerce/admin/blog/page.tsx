"use client"
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import { AllBlogs } from "@/shared/data/apps/ecommers/admin/blogdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
//filepond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import { simpleItems } from "@/shared/data/apps/ecommers/admin/addproduct";
import SunEditorComponent from "@/shared/@spk-reusable-components/spk-packages/editor-component";
import Link from "next/link";
import Image from "next/image";

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Blog = () => {
    //Filepond 
    const [files, setFiles] = useState<any>([]);
    const [primary1, setprimary1] = useState("on");
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Ecommerce Blog" />
                <Pageheader Heading="Ecommerce Blog" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Ecommerce Blog" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 sm:gap-x-6">
                    <div className="xl:col-col-12 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    All Blogs
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
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Published Date</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Status</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Author</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Category</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                            <li><Link scroll={false} className="ti-dropdown-item" href="#!">Oldest</Link></li>
                                        </ul>
                                    </div>
                                    <div className="custom-form-group flex-grow custom-blog">
                                        <input type="text" className="form-control" placeholder="Search Blog.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                        <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                    </div>
                                    <button type="button" className="ti-btn ti-btn-primary btn-wave !m-0" data-hs-overlay="#hs-admin-blog">
                                        <i className="bi bi-plus-circle me-1"></i> Add Blog
                                    </button>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head ti-custom-table-hover !whitespace-normal" header={[{ title: 'Blog Title', headerClassname: '!w-[20%] text-nowrap' }, { title: 'Description', headerClassname: '!w-[25%] text-wrap !whitespace-normal' }, { title: 'Author', }, { title: 'Published Date', headerClassname: 'text-nowrap' }, { title: 'Status' }, { title: 'Comments' }, { title: 'Action' },]}>
                                        {AllBlogs.map((idx) => (
                                            <tr key={idx.badgeText}>
                                                <th scope="row" className="!w-[20%] text-nowrap">
                                                    <div className="flex items-top text-wrap">
                                                        <div className="me-2">
                                                            <span className="avatar bg-light avatar-square">
                                                                <Image fill src={idx.titleSrc} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link scroll={false} href="#!" className="font-semibold text-wrap">{idx.titleName}</Link>
                                                            <div className="clearfix"></div>
                                                            <span className={`badge bg-${idx.badgecolor}/[0.15] text-${idx.badgecolor}`}>{idx.badgeText}</span>
                                                        </div>
                                                    </div>
                                                </th>
                                                <td className="!w-[25%] text-wrap !whitespace-normal">{idx.description}</td>
                                                <td>
                                                    <div className="flex items-top text-wrap">
                                                        <div className="me-2">
                                                            <span
                                                                className="avatar avatar-md p-1 bg-light avatar-rounded">
                                                                <Image fill src={idx.authorsrc} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link href="/apps/ecommerce/admin/vendor-details" className="font-semibold mb-0 text-wrap">{idx.authorName}</Link>
                                                            <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">{idx.authorLable}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.date}</td>
                                                <td><span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span>
                                                </td>
                                                <td>{idx.comments}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info btn-wave" data-hs-overlay="#hs-admin-blog">
                                                            <i className="ri-edit-line"></i>
                                                        </Link>
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger btn-wave">
                                                            <i className="ri-delete-bin-line"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                                <nav aria-label="Page navigation" className="pagination-style-2 float-end">
                                    <ul className="ti-pagination mb-0">
                                        <li className="page-item"><Link scroll={false} className="page-link disabled" href="#!"> Prev </Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link>  </li>
                                        <li className="page-item"> <Link scroll={false} className="page-link" href="#!"><i className="bi bi-three-dots"></i></Link></li>
                                        <li className="page-item"><Link scroll={false} className="page-link" href="#!">16</Link> </li>
                                        <li className="page-item"><Link scroll={false} className="page-link text-primary" href="#!"> next</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/*<!-- Start::Add New Blog -->*/}
                <div id="hs-admin-blog" className="hs-overlay hidden ti-offcanvas-upload ti-offcanvas ti-offcanvas-right !z-[105] !max-w-[600px] " tabIndex={-1}>
                    <div className="ti-offcanvas-header">
                        <h6 className="ti-offcanvas-title !text-[1.25rem] !font-medium">
                            Add New Blog
                        </h6>
                        <button type="button" data-hs-overlay="#hs-admin-blog" className="ti-btn  btn-wave flex-shrink-0 !p-0 transition-none text-gray-500 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white text-textmuted dark:text-textmuted/50 dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10">
                            <span className="sr-only">Close modal</span>
                            <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="ti-offcanvas-body !p-4">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="lg:col-span-12 col-span-12">
                                <label htmlFor="Blog-Title" className="ti-form-label">Blog Title : </label>
                                <input type="text" className="form-control" id="Blog-Title" placeholder="Blog-Title"
                                    defaultValue="Touring excites in winter !" />
                            </div>
                            <div className="xl:col-span-12 col-span-12">
                                <label className="ti-form-label">Category</label>
                                <SpkSelect option={simpleItems} mainClass="" name="Category"
                                    menuplacement='auto' classNameprefix="Select2" defaultvalue={[simpleItems[1]]} />
                            </div>
                            <div className="lg:col-span-12 col-span-12">
                                <label className="ti-form-label">Blog Description</label>
                                <SunEditorComponent height={'200px'} />

                            </div>
                            <div className="lg:col-span-12 col-span-12">
                                <label className="ti-form-label">Upload Image</label>
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    allowMultiple={true}
                                    maxFiles={3}
                                    server="/api"
                                    name="files"
                                    labelIdle='Drag & Drop your file here or click '
                                />

                            </div>
                            <div className="lg:col-span-12 col-span-12">
                                <div className="flex items-center flex-wrap justify-between">
                                    <div className="font-medium h6 mb-0">Status :</div>
                                    
                                    <div className={`toggle mb-0 ${primary1}`} onClick={() => { primary1 == "on" ? setprimary1("off") : setprimary1("on"); }}>
                                        <span></span>
                                    </div>
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
                {/*<!-- End::Add New Blog -->*/}
            </div>
        </Fragment>
    );
};

export default Blog;