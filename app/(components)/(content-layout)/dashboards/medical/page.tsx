"use client"
import SpkMedicalCard from "@/shared/@spk-reusable-components/dashboards/spk-medical-card";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as medicaldata from "@/shared/data/dashboard/medicaldata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Medical = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Medical" />
                <Pageheader Heading="Medical" breadcrumbs={['Dashboards']} currentpage="Medical" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="box medical-banner-card overflow-hidden">
                            <div className="box-body !p-6">
                                <div className="grid grid-cols-12 justify-content-between">
                                    <div className="xxl:col-span-7 xl:col-span-5 lg:col-span-5 md:col-span-5 sm:col-span-5 col-span-12">
                                        <h4 className="mb-2 font-medium">Your Path to Wellness</h4>
                                        <p className="mb-3">Book appointments, access resources, and prioritize your well-being with ease</p>
                                        <button className="ti-btn ti-btn-lg bg-gradient-to-r from-primary to-secondary !text-white !border-0 btn-wave">Book Appointment</button>
                                    </div>
                                    <div className="xxl:col-span-5 xl:col-span-7 lg:col-span-7 md:col-span-7 sm:col-span-7 col-span-12 sm:block hidden text-end my-auto relative">
                                        <Image fill src="../../assets/images/media/backgrounds/5.png" alt="" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    AVAILABLE TREATMENTS
                                </div>
                            </div>
                            <div className="box-body p-4">
                                <div className="grid grid-cols-12 am:gap-y-0 gap-y-3">
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-primary !border-0 !p-6 leading-none rounded-sm">
                                            <i className="ti ti-heartbeat text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Cardiology</Link>
                                    </div>
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-secondary !border-0 !p-6 leading-none rounded-sm">
                                            <i className="ti ti-baby-carriage  text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Pediatrics</Link>
                                    </div>
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-success !border-0 !p-6 leading-none rounded-sm">
                                            <i className="ti ti-bone text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Orthopedic</Link>
                                    </div>
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-orange !border-0 !p-6 leading-none rounded-sm">
                                            <i className="ti ti-activity-heartbeat text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Neurology</Link>
                                    </div>
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-info !border-0 !p-6 leading-none rounded-sm">
                                            <i className="ti ti-brand-debian text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">Psychiatry</Link>
                                    </div>
                                    <div className="xxl:col-span-2 xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-4 col-span-4 text-center">
                                        <Link scroll={false} aria-label="anchor" href="#!" className="ti-btn ti-btn-soft-warning !border-0 !p-6 leading-none rounded-sm">
                                            <i className="bi bi-three-dots text-[1.375rem]"></i>
                                        </Link>
                                        <Link scroll={false} href="#!" className="block pt-2 font-medium text-[0.75rem]">More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-4 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            {medicaldata.cardData.map((card: any, index: any) => (
                                <div key={index} className="xxl:col-span-6 xl:col-span-6 lg:col-span-3 md:col-span-6 sm:col-span-6 col-span-12">
                                    <SpkMedicalCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="xl:col-span-5 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    PATIENTS ANALYSIS
                                </div>
                                <SocialDropdown />
                            </div>
                            <div className="box-body">
                                <div id="patients-analysis">
                                    <Spkapexcharts chartOptions={medicaldata.AnalysisOptions} chartSeries={medicaldata.AnalysisSries} type="bar" width={'100%'} height={320} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    DOCTORS LIST
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="ti-list-unstyled doctors-list">
                                    {medicaldata.doctors.map((doctor, index) => (
                                        <li key={index}>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="leading-none">
                                                    <span className="avatar avatar-sm avatar-rounded">
                                                        <Image fill src={doctor.imageSrc} alt={doctor.name} />
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <span className="block font-medium leading-none">{doctor.name}</span>
                                                    <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">{doctor.specialty}</span>
                                                </div>
                                                <div>
                                                    <span className={`badge ${doctor.badgeClass} !rounded-full`}>
                                                        <i className="ri-circle-fill me-1 text-[0.4375rem]"></i>
                                                        {doctor.availability}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-4 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    APPOINTMENT HISTORY
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body !p-0">
                                <ul className="ti-list-group ti-list-group-flush">
                                    {medicaldata.appointments.map((appointment, index) => (
                                        <li key={index} className="ti-list-group-item">
                                            <Link scroll={false} href="#!" className="stretched-link"></Link>
                                            <div className="flex items-center gap-2">
                                                <div className="leading-none">
                                                    <span className={`avatar avatar-md ${appointment.bgColorClass}`}>
                                                        <i className={`ti ${appointment.iconClass} text-[1.25rem]`}></i>
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <span className="font-medium">{appointment.title}</span>
                                                    <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50 block mt-1">
                                                        <span className="font-medium">{appointment.id}</span> - {appointment.dateTime}
                                                    </span>
                                                </div>
                                                <span className={appointment.statusClass}>{appointment.status}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-8 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    TOTAL PATIENTS
                                </div>
                                <div className="ti-dropdown hs-dropdown">
                                    <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50" data-bs-toggle="dropdown" aria-expanded="true"> Sort By <i className="ri-arrow-down-s-line align-middle ms-2 d-inline-block"></i> </Link>
                                    <ul className="ti-dropdown-menu hs-dropdown-menu hidden" role="menu" data-popper-placement="bottom-end">
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Last Week</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="box-body">
                                <div id="total-patients">
                                    <Spkapexcharts chartOptions={medicaldata.PatientsOptions} chartSeries={medicaldata.PatientsSries} type="line" width={'100%'} height={360} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}

                {/* <!-- Start:: row-4 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header justify-content-between">
                                <div className="box-title">
                                    PATIENTS LIST
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div>
                                        <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                    </div>
                                     <SalesDropdown/>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" showCheckbox={true} Customcheckclass="text-center" header={[{ title: 'Patient ID' }, { title: 'Name', }, { title: 'Gender' }, { title: 'Contact Number', }, { title: 'Last Appointment' }, { title: 'Medical History' }, { title: 'Next Appointment' }, { title: 'Action' },]}>
                                        {medicaldata.PatientsList.map((idx) => (
                                            <tr key={idx.id}>
                                                <td className="text-center"><input className="form-check-input" type="checkbox" id="checkboxNoLabeljob2" value="" aria-label="..." defaultChecked={idx.checked} /></td>
                                                <td>{idx.patientId}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <span className="avatar avatar-xs avatar-rounded"><Image fill src={idx.src} className="" alt="..." /></span>
                                                        <div>
                                                            <span className="font-medium mb-0 flex items-center">{idx.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{idx.gender} </td>
                                                <td>{idx.contact}</td>
                                                <td>{idx.lastAppointment}</td>
                                                <td>
                                                    <span className={`badge bg-${idx.medicalHistoryColor}/[0.15] text-${idx.medicalHistoryColor}`}>{idx.medicalHistory}</span>
                                                </td>
                                                <td>{idx.nextAppointment}</td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon !me-2 ti-btn-soft-primary btn-wave">
                                                            <i className="ri-eye-line"></i>
                                                        </button>
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon !me-2 ti-btn-soft-secondary btn-wave">
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer border-top-0">
                            <SocialPagination />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-4 --> */}
            </div>
        </Fragment>
    );
};

export default Medical;