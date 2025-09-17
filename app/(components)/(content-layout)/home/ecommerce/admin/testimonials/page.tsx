"use client"
import { Designationdata, TestimonialsData } from "@/shared/data/apps/ecommers/admin/testimonialsdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import React, { Fragment, useState } from "react";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import Box from "@mui/material/Box";
import StarsIcon from "@mui/icons-material/Stars";
import SpkRatings from "@/shared/@spk-reusable-components/spk-packages/spk-ratings";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Image from "next/image";
import Link from "next/link";
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const Testimonials = () => {

    //Filepond 
    const [files, setFiles] = useState<any>([]);

    //rating
    const [value, setValue] = useState<number | null>(2); // Default value is 2 stars
    const [hover, setHover] = useState<number>(-1);

    const labels = ["0", "1", "2", "3", "4", "5"];

    function getLabelText(value: any) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }
    return (
        <Fragment>

            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Testimonials" />
                <Pageheader Heading="Testimonials" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Testimonials" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="lg:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-body">
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <h6 className="font-semibold mb-0">
                                        Testimonials
                                    </h6>
                                    <div className="flex gap-4 items-center flex-wrap">
                                        <div className="custom-form-group flex-grow-1">
                                            <input type="text" className="form-control" placeholder="Search Testimonials.." aria-label="Recipient's username" aria-describedby="button-addon2" />
                                            <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50 custom-form-btn"><i className="ti ti-search"></i></Link>
                                        </div>
                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-primary btn-wave !m-0" data-hs-overlay="#add-testimonal">
                                            <i className="bi bi-plus-circle"></i>  Add New Testimonial
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {TestimonialsData.map((idx) => (
                        <div className="xxl:col-span-4 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12" key={idx.id}>
                            <div className="box">
                                <div className="box-body">
                                    <div className="btn-list float-end">
                                        <button className="ti-btn ti-btn-sm ti-btn-icon btn-wave ti-btn-soft-info" data-hs-overlay="#add-testimonal"><i className="ri-edit-line"></i></button>
                                        <button className="ti-btn ti-btn-sm ti-btn-icon btn-wave ti-btn-soft-danger me-0"><i className="ri-delete-bin-line"></i></button>
                                    </div>
                                    <div className="flex items-center mb-3">
                                        <span className="avatar avatar-md avatar-rounded me-3">
                                            <Image fill src={idx.src} alt="" />
                                        </span>
                                        <div>
                                            <p className="mb-0 font-semibold text-[0.9375rem]">{idx.name}</p>
                                            <p className="mb-0 text-[0.625rem] font-semibold text-textmuted dark:text-textmuted/50">{idx.role}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="hs-tooltip ti-main-tooltip">
                                            <span className="text-textmuted dark:text-textmuted/50">- Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum autem quaerat distinctio  --
                                                <Link scroll={false} href="#!" className="font-semibold text-[0.6875rem] text-primary hs-tooltip-toggle" data-bs-toggle="tooltip" data-bs-custom-classname="tooltip-primary" data-bs-placement="top" data-bs-title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum autem quaerat distinctio"> Read More
                                                    <span className="hs-tooltip-content  ti-main-tooltip-content !py-2 !px-2 !bg-primary text-wrap text-center !max-w-[200px] !text-[0.8125rem] !font-medium !text-white shadow-sm !rounded-sm" role="tooltip">
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum autem quaerat distinctio
                                                    </span>
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-textmuted dark:text-textmuted/50">Rating : </span>
                                            <span className="text-warning block ms-1">
                                                {idx.rating.map((star, index) => (
                                                    <i className={`ri-${star.icon} me-1`} key={index}></i>
                                                ))}
                                            </span>
                                        </div>
                                        <div className="float-end text-[0.75rem] font-semibold text-textmuted dark:text-textmuted/50 text-end">
                                            <span>{idx.days} ago</span>
                                            <span className="block font-normal text-[0.75rem] text-success"><i>{idx.name}</i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="xxl:col-span-12 col-span-12">
                        <nav aria-label="..." className="">
                            <ul className="ti-pagination mb-6 !p-0 flex justify-end">
                                <li className="page-item disabled"> <Link scroll={false} href="#!" className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-tr-none !rounded-br-none">Previous</Link></li>
                                <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-none" href="#!">1</Link></li>
                                <li className="page-item " aria-current="page"> <Link scroll={false} className="page-link active px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-none" href="#!">2</Link></li>
                                <li className="page-item"> <Link scroll={false} className="page-link px-3 py-[0.375rem] !text-[1rem] bg-white dark:bg-bodybg !rounded-tl-none !rounded-bl-none" href="#!">Next</Link> </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                <div id="add-testimonal" className="hs-overlay hidden ti-modal">
                    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header">
                                <h6 className="modal-title text-[1rem] font-medium" id="mail-ComposeLabel">Add New Testimonial</h6>
                                <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#add-testimonal">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className="ti-modal-body px-4">
                                <div className="grid grid-cols-12 gap-6 mb-4">
                                    <div className="lg:col-span-12 col-span-12">
                                        <label htmlFor="Testimonial-By" className="ti-form-label">Testimonial By : </label>
                                        <input type="text" className="form-control" id="Testimonial-By" placeholder="Testimonial By" defaultValue="Jack Miller" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Designation</label>
                                        <SpkSelect name="state" option={Designationdata} mainClass="js-example-placeholder-multiple w-full js-states"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Designationdata[0]]} placeholder="High" />

                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <p className="text-[0.875rem] mb-3">Please give your valuable rating</p>
                                        <div className="flex items-center">
                                            <div id="stars-hover" data-rating="3">
                                                <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                                                    <SpkRatings
                                                        name="hover-feedback"
                                                        value={value}
                                                        precision={1}
                                                        getLabelText={getLabelText}
                                                        onChange={(_event, newValue) => {
                                                            setValue(newValue);
                                                        }}
                                                        onChangeActive={(_event, newHover) => {
                                                            setHover(newHover);
                                                        }}
                                                        emptyIcon={<StarsIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    />
                                                    {value !== null && (
                                                        <Box className="rating-stars my-rating-9 rating-9" sx={{ ml: 2 }}>
                                                            <span className="live-rating badge bg-success/[0.15] text-success ">
                                                                {labels[hover !== -1 ? hover : value]}
                                                            </span>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </div>


                                        </div>
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Comment</label>
                                        <div className="form-floating">
                                            <textarea className="form-control" id="floatingTextarea2" style={{ height: "150px" }}></textarea>
                                            <label htmlFor="floatingTextarea2" className="!z-0">Comments</label>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12 col-span-12">
                                        <label className="ti-form-label">Upload Image : </label>
                                        <FilePond className="multiple-filepond"
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            server="/api"
                                            name="files" /* sets the file input name, it's filepond by default */
                                            labelIdle='Drag & Drop your file here or click '
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="ti-modal-footer">
                                <button type="button"
                                    className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-secondary align-middle"
                                    data-hs-overlay="#add-testimonal">
                                    Close
                                </button>
                                <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Add Testimonial</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Testimonials;