"use client"
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import { AllJobsList } from "@/shared/data/apps/jobs/jobs-list-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const JobsList = () => {
    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Jobs List" />
            <Pageheader Heading="Jobs List" breadcrumbs={['Apps', 'Jobs']} currentpage="Jobs List" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box  overflow-hidden">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                All Jobs List
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href={"/apps/jobs/job-post/"} className="ti-btn  btn-wave ti-btn-primary !m-0 ti-btn-sm">
                                    <i className="ri-add-line  align-middle"></i>Post Job
                                </Link>
                                <div>
                                    <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Linktag={true} Linkclass="ti-btn ti-btn-primary !m-0 ti-btn-sm btn-wave" Toggletext="Sort By" Arrowicon={true}>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Posted Date</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Status</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Department</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Job Type</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">Oldest</Link></li>
                                </SpkDropdown>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables showCheckbox={true} Customcheckclass="!ps-6" tableClass="ti-custom-table ti-custom-table-head w-full jobs-list-table" header={[{ title: 'Job Title' }, { title: 'Company' },
                                { title: 'Department' }, { title: 'Applications' }, { title: 'Vacancies' }, { title: 'Status' }, { title: 'Job Type' }, { title: 'Posted Date' },
                                { title: 'Expires on' }, { title: 'Action' },]}>
                                    {AllJobsList.map((idx) => (
                                        <tr className={`border-t ${idx.trclass} hover:bg-gray-200 dark:hover:bg-light`} key={idx.id}>
                                            <td className="!ps-6"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                            <td>
                                                <div className="flex">
                                                    <span className="avatar avatar-md !rounded-full bg-primary/10 !fill-primary">{idx.icon}</span>
                                                    <div className="ms-2">
                                                        <p className="font-semibold mb-0 flex items-center"><Link scroll={false} href="/apps/jobs/job-details/"> {idx.jobTitle}</Link></p>
                                                        <p className="text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-0">Remote/Onsite</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center">
                                                    <span className="avatar avatar-sm p-1 me-1 bg-light !rounded-full">
                                                        <Image fill src={idx.companyLogo} alt="" />
                                                    </span>
                                                    <Link scroll={false} href="#!" className="font-semibold mb-0">{idx.company}</Link>
                                                </div>
                                            </td>
                                            <td>{idx.department} </td>
                                            <td>{idx.applications}</td>
                                            <td>{idx.vacancies}</td>
                                            <td><span className={`badge !rounded-full bg-${idx.statusColor}/10 text-${idx.statusColor}`}>{idx.status}</span></td>
                                            <td>{idx.type}</td>
                                            <td>{idx.postedDate} </td>
                                            <td><span className={`badge ${idx.expiresOn === 'Nov 12 2022' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'} `}><i className="bi bi-clock me-1"></i>{idx.expiresOn}</span></td>
                                            <td>
                                                <Link aria-label="anchor" href="/apps/jobs/job-details/" className="ti-btn  btn-wave ti-btn-icon ti-btn-sm ti-btn-soft-primary">
                                                    <i className="ri-eye-line"></i>
                                                </Link>
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn  btn-wave ti-btn-icon ti-btn-sm ti-btn-soft-info">
                                                    <i className="ri-edit-line"></i>
                                                </Link>
                                                <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn  btn-wave ti-btn-icon ti-btn-sm ti-btn-soft-danger">
                                                    <i className="ri-delete-bin-line"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer border-t-0">
                            <div className="flex items-center flex-wrap overflow-auto">
                                <div className="mb-2 sm:mb-0">
                                    Showing <b>1</b> to <b>10</b> of <b>10</b> entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-semibold"></i>
                                </div>
                                <div className="ms-auto">
                                    <nav aria-label="Page navigation">
                                        <ul className="ti-pagination  mb-0">
                                            <li className="page-item disabled"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">Previous</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link active px-3 py-[0.375rem]" href="#!">1</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">2</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">3</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">4</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">5</Link></li>
                                            <li className="page-item"><Link scroll={false} className="page-link px-3 py-[0.375rem]" href="#!">Next</Link></li>
                                        </ul>
                                    </nav>
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

export default JobsList;