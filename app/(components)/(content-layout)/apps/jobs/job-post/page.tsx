"use client"
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import { Data1, Data10, Data11, Data12, Data2, Data3, Data4, Data5, Data6, Data7, Data8, Data9 } from "@/shared/data/apps/jobs/jobpostdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const PostJob = () => {
    const [startDate, setStartDate] = useState<Date | any>();
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(date);
        }
    };

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Post Job" />
            <Pageheader Heading="Post Job" breadcrumbs={['Apps', 'Jobs']} currentpage="Post Job" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-6">
                <div className="xxl:col-span-9 xl:col-span-8 col-span-12">
                    <div className="box custom-box">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Post New Job
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 sm:gap-6 mb-4">
                                <div className="xl:col-span-6 col-span-12">
                                    <label htmlFor="job-title" className="ti-form-label">Job Title</label>
                                    <input type="text" className="form-control" id="job-title" placeholder="Job Title" defaultValue="Web Developer" />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Job Category</label>
                                    <SpkSelect name="colors" option={Data1} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data1[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Working Experience</label>
                                    <SpkSelect name="colors" option={Data2} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data2[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Job Type</label>
                                    <SpkSelect name="colors" option={Data12} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data12[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Priority</label>
                                    <SpkSelect option={Data3} classNameprefix='Select2' menuplacement='auto' mainClass="multi-select" placeholder="" defaultvalue={[Data3[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Vacancies</label>
                                    <SpkSelect name="colors" option={Data4} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data4[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Salary</label>
                                    <SpkSelect option={Data5} classNameprefix='Select2' menuplacement='auto' mainClass="multi-select" placeholder="" defaultvalue={[Data5[0]]} />

                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Skills :</label>
                                    <SpkSelect multi name="colors" option={Data6} mainClass="basic-multi-select" classNameprefix="Select2"
                                        defaultvalue={[Data6[0], Data6[1], Data6[2]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12 job-deadline-placeholder " >
                                    <label htmlFor="Job-Deadline" className="ti-form-label">Job Deadline</label>
                                    <SpkDatepickr className="form-control" placeholderText='Job Deadline' selected={startDate} onChange={handleDateChange} />

                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Gender Requirement</label>
                                    <SpkSelect name="colors" option={Data7} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data7[0]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Languages :</label>
                                    <SpkSelect multi name="colors" option={Data8} mainClass="choices__item choices__item--selectable" classNameprefix="Select2"
                                        defaultvalue={[Data8[0], Data8[3]]} />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <label className="ti-form-label">Qualification :</label>
                                    <SpkSelect multi name="colors" option={Data9} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data9[0], Data9[2], Data9[3]]} />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="ti-form-label">Job Description :</label>
                                    <textarea className="form-control" id="job-description" rows={4} defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer text-end">
                            <Link scroll={false} href="#!" className="ti-btn  btn-wave ti-btn-primary !m-0 btn-wave">
                                <i className="bi bi-plus-circle"></i> Post Job
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="xxl:col-span-3 xl:col-span-4 col-span-12">
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Assign To Employer</div>
                        </div>
                        <div className="box-body">
                            <div className="xl:col-span-12 col-span-12">
                                <label className="ti-form-label">Employer Name</label>
                                <SpkSelect name="colors" option={Data10} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data10[0]]} />
                            </div>
                        </div>
                    </div>
                    <div className="box custom-box">
                        <div className="box-header">
                            <div className="box-title">Company Details</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="ti-form-label">Company Name</label>
                                    <input type="text" className="form-control" placeholder="Company Name" defaultValue="Obligation Pvt.Ltd" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="ti-form-label">Company Website</label>
                                    <input type="text" className="form-control" placeholder="Company Website" defaultValue="http//www.obligationpvtltd.com" />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label className="ti-form-label">Country</label>
                                    <SpkSelect name="colors" option={Data11} mainClass="basic-multi-select" classNameprefix="Select2" defaultvalue={[Data11[0]]} />
                                </div>
                                <div className="xl:col-span-12 col-span-12">
                                    <label htmlFor="CompanyAddress" className="ti-form-label">Address</label>
                                    <input type="text" id="CompanyAddress" className="form-control" placeholder="Company Address" defaultValue="USA" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}

        </Fragment>
    );
};

export default PostJob;