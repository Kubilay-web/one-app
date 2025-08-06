"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import * as ProjectData from "@/shared/data/dashboard/projectsdata";
import { SalesDropdown } from "@/shared/data/dashboard/salesdata";
import { SocialDropdown, SocialPagination } from "@/shared/data/dashboard/social-media-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

const Projects = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Projects" />
                <Pageheader Heading="Projects" breadcrumbs={['Dashboards']} currentpage="Projects" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start:: row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-12 col-span-12">
                        <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 col-span-12">
                                <div className="box project-card overflow-hidden">
                                    <div className="box-header !block !bg-primary !p-6 items-start overflow-hidden">
                                        <div>
                                            <div className="box-title flex items-center !text-[1.25rem] !mb-2 text-white">
                                                <svg className="upcoming-icon me-1" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        d="M8.04492,22a.99922.99922,0,0,1-.96533-1.25879L8.88574,14H5.04541a1.00007,1.00007,0,0,1-.96582-1.25879l2.67969-10A.99954.99954,0,0,1,7.7251,2h7a1.00008,1.00008,0,0,1,.96582,1.25879L14.42041,8h4.53418a1,1,0,0,1,.73975,1.67285l-10.90918,12A.99947.99947,0,0,1,8.04492,22Z">
                                                    </path>
                                                </svg><span>PROJECT ANALYSIS</span>
                                            </div>
                                            <span className="subtitle text-white">
                                                Welcome to deashboard you can manage all your project activities
                                                here
                                            </span>
                                        </div>
                                    </div>
                                    <div className="box-body project-cardbody">
                                        <div className="grid grid-cols-12 sm:gap-x-6">
                                            <div className="xl:col-span-12 col-span-12">
                                                <div className="box card-bg-light !shadow-none !border-0 !mb-4">
                                                    <div className="box-body !p-0">
                                                        <div className="grid grid-cols-12 gap-0">
                                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 project-analysis-border">
                                                                <div className="p-6">
                                                                    <div className="flex items-start">
                                                                        <span className="!fill-primary">
                                                                            <svg width="25" height="25"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                enableBackground="new 0 0 24 24"
                                                                                viewBox="0 0 24 24">
                                                                                <path opacity="0.5"
                                                                                    d="M12,14.5c-3.26461,0.00094-6.4876-0.73267-9.43018-2.14648C2.22156,12.18802,1.99974,11.83676,2,11.45117V9.5c0.00181-1.65611,1.34389-2.99819,3-3h14c1.65611,0.00181,2.99819,1.34389,3,3v1.95215c0.00003,0.3859-0.22189,0.73741-0.57031,0.90332C18.48677,13.76762,15.26418,14.50051,12,14.5z M21,11.45215L21,11.45215z">
                                                                                </path>
                                                                                <path opacity="1"
                                                                                    d="M10,6.5v-1c0.00055-0.55206,0.44794-0.99945,1-1h2c0.55206,0.00055,0.99945,0.44794,1,1v1h2v-1c-0.00183-1.65613-1.34387-2.99817-3-3h-2c-1.65613,0.00183-2.99817,1.34387-3,3v1H10z">
                                                                                </path>
                                                                                <path opacity="0.2"
                                                                                    d="M21.42969,12.35547C18.48676,13.76764,15.26416,14.50049,12,14.5c-3.26459,0.00092-6.48761-0.73267-9.43018-2.14648C2.22156,12.18805,1.99976,11.83673,2,11.45117V18.5c0.00183,1.65613,1.34387,2.99817,3,3h14c1.65613-0.00183,2.99817-1.34387,3-3v-7.04785C22.00006,11.83807,21.77814,12.18958,21.42969,12.35547z">
                                                                                </path>
                                                                            </svg>
                                                                        </span>
                                                                        <div className="ti-dropdown hs-dropdown ms-auto mt-1">
                                                                            <Link scroll={false} href="#!"
                                                                                className="text-textmuted dark:text-textmuted/50"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false">
                                                                                <i className="ri-more-fill text-[1.25rem] leading-none"></i>
                                                                            </Link>
                                                                            <div className="ti-dropdown-menu hs-dropdown-menu hidden dropdown-menu-start">
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-share-forward-line me-2"></i>Share
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-download-2-line me-2"></i>Download
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-delete-bin-7-line me-2"></i>Delete
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="block font-medium mt-4">Total Projects</span>
                                                                    <div className="flex items-center mt-4 gap-3 leading-none flex-wrap">
                                                                        <h4 className="font-medium mb-0 leading-none"> 34,876</h4>
                                                                        <span className="badge bg-primary/[0.15] text-primary">10.2%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                                                <div className="p-6">
                                                                    <div className="flex items-start">
                                                                        <span className="!fill-secondary">
                                                                            <svg width="25" height="25"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24">
                                                                                <path opacity="0.5"
                                                                                    d="M21.30285,10.07813A2.99076,2.99076,0,0,0,18.99963,9H14.44006l.484-1.29663a4.31847,4.31847,0,0,0,.16034-2.6919A4.13089,4.13089,0,0,0,11.113,2a1.00364,1.00364,0,0,0-.91705.59375L7.34887,9.0022V22H17.726a3.00077,3.00077,0,0,0,2.95233-2.46387l1.273-7A2.98989,2.98989,0,0,0,21.30285,10.07813Z">
                                                                                </path>
                                                                                <path opacity="1"
                                                                                    d="M7.34985,9H5.00012a3.00328,3.00328,0,0,0-3,3v7a3.00328,3.00328,0,0,0,3,3H7.34887V9.0022Z">
                                                                                </path>
                                                                            </svg>
                                                                        </span>
                                                                        <div className="ti-dropdown hs-dropdown ms-auto mt-1">
                                                                            <Link scroll={false} href="#!" className="text-textmuted dark:text-textmuted/50" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <i className="ri-more-fill text-[1.25rem] leading-none"></i>
                                                                            </Link>
                                                                            <div className="ti-dropdown-menu hs-dropdown-menu hidden dropdown-menu-start">
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-share-forward-line me-2"></i>Share
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-download-2-line me-2"></i>Download
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-delete-bin-7-line me-2"></i>Delete
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="block font-medium mt-4">Completed</span>
                                                                    <div className="flex items-center mt-4 gap-3 leading-none flex-wrap">
                                                                        <h4 className="font-medium mb-0 leading-none">26,231</h4>
                                                                        <span className="badge bg-secondary/[0.15] text-secondary">5.3%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <div className="box card-bg-light !shadow-none !border-0 !mb-0">
                                                    <div className="box-body !p-0">
                                                        <div className="grid grid-cols-12 gap-0">
                                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 project-analysis-border">
                                                                <div className="p-6">
                                                                    <div className="flex items-start">
                                                                        <span className="!fill-success">
                                                                            <svg width="25" height="25"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24">
                                                                                <path opacity="0.5"
                                                                                    d="M9.24268,18.0003H5a.99974.99974,0,0,1-1-1V12.75713a.99928.99928,0,0,1,.293-.707l9.75976-9.75684a.99965.99965,0,0,1,1.41407,0L19.707,6.53252a.99962.99962,0,0,1,0,1.41406L9.94971,17.70733A1.00014,1.00014,0,0,1,9.24268,18.0003Z">
                                                                                </path>
                                                                                <path opacity="1"
                                                                                    d="M15.4668 2.29326a.99965.99965 0 0 0-1.41407 0L10.51318 5.83172l5.65387 5.6538.00629-.004L19.707 7.94658a.99962.99962 0 0 0 0-1.41406zM21 22.0003H3a1 1 0 0 1 0-2H21a1 1 0 0 1 0 2z">
                                                                                </path>
                                                                            </svg>
                                                                        </span>
                                                                        <div className="ti-dropdown hs-dropdown ms-auto mt-1">
                                                                            <Link scroll={false} href="#!"
                                                                                className="text-textmuted dark:text-textmuted/50"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false">
                                                                                <i className="ri-more-fill text-[1.25rem] leading-none"></i>
                                                                            </Link>
                                                                            <div className="ti-dropdown-menu hs-dropdown-menu hidden dropdown-menu-start">
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-share-forward-line me-2"></i>Share
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-download-2-line me-2"></i>Download
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-delete-bin-7-line me-2"></i>Delete
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="block font-medium mt-4">Pending</span>
                                                                    <div className="flex items-center mt-4 gap-3 leading-none flex-wrap">
                                                                        <h4 className="font-medium mb-0 leading-none"> 8,645</h4>
                                                                        <span className="badge bg-success/[0.15] text-success">2.1%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
                                                                <div className="p-6">
                                                                    <div className="flex items-start">
                                                                        <span className="!fill-orangemain">
                                                                            <svg width="25" height="25"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24">
                                                                                <path opacity="0.5"
                                                                                    d="M19,21.5H5a3.00328,3.00328,0,0,1-3-3V5.5a3.00328,3.00328,0,0,1,3-3H9.55859A2.99629,2.99629,0,0,1,12.4043,4.55078L12.7207,5.5H19a3.00328,3.00328,0,0,1,3,3v10A3.00328,3.00328,0,0,1,19,21.5Z">
                                                                                </path>
                                                                                <path opacity="1"
                                                                                    d="M14,12.5H13v-1a1,1,0,0,0-2,0v1H10a1,1,0,0,0,0,2h1v1a1,1,0,0,0,2,0v-1h1a1,1,0,0,0,0-2Z">
                                                                                </path>
                                                                            </svg>
                                                                        </span>
                                                                        <div className="ti-dropdown hs-dropdown ms-auto mt-1">
                                                                            <Link scroll={false} href="#!"
                                                                                className="text-textmuted dark:text-textmuted/50"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false">
                                                                                <i className="ri-more-fill text-[1.25rem] leading-none"></i>
                                                                            </Link>
                                                                            <div className="ti-dropdown-menu hs-dropdown-menu hidden dropdown-menu-start">
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-share-forward-line me-2"></i>Share
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-download-2-line me-2"></i>Download
                                                                                </Link>
                                                                                <Link scroll={false} className="ti-dropdown-item" href="#!">
                                                                                    <i className="ri-delete-bin-7-line me-2"></i>Delete
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="block font-medium mt-4">New Projects</span>
                                                                    <div
                                                                        className="flex items-center mt-4 gap-3 leading-none flex-wrap">
                                                                        <h4 className="font-medium mb-0 leading-none">  3,579</h4>
                                                                        <span className="badge bg-orangemain/[0.15] text-orangemain">7.8%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 col-span-12">
                                <div className="box">
                                    <div className="box-header  justify-between">
                                        <div className="box-title">PROJECT STATISTICS</div>
                                        <SocialDropdown />
                                    </div>
                                    <div className="box-body">
                                        <div id="project-statistics">
                                            <Spkapexcharts chartOptions={ProjectData.ProjectOption} chartSeries={ProjectData.ProjectSeries} type="line" width={'100%'} height={350} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-12  col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-header">
                                <div className="box-title">
                                    TASK ACTIVITY
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div id="task-activity" className="p-4 border-b border-defaultborder dark:border-defaultborder/10">
                                    <Spkapexcharts chartOptions={ProjectData.ActivityOption} chartSeries={ProjectData.ActivitySeries} type="donut" width={'100%'} height={228} />
                                </div>
                                <div>
                                    <ul className="ti-list-group ti-list-group-flush">
                                        {ProjectData.tasks.map((task, index) => (
                                            <li key={index} className="ti-list-group-item">
                                                <div className="flex items-start justify-between">
                                                    <div className={`task-activity-type leading-none ${task.type}`}>
                                                        <div className="font-medium mb-1">{task.title}</div>
                                                        <span className="text-[0.75rem] text-textmuted dark:text-textmuted/50">
                                                            {task.changeType}
                                                            <span className={`text-[0.75rem] ms-1 font-medium inline-block ${task.changeColor}`}>
                                                                {task.percentageChange}%
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="leading-none text-end">
                                                        <span className="block text-[0.75rem] text-textmuted dark:text-textmuted/50 mb-1">
                                                            Total
                                                        </span>
                                                        <span className="block font-semibold mb-0">{task.total}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-1 --> */}

                {/* <!-- Start:: row-2 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    TODO LIST
                                </div>
                                <Link scroll={false} href="#!" className="text-[0.75rem] text-textmuted dark:text-textmuted/50"> View All<i className="ti ti-arrow-narrow-right ms-1"></i> </Link>
                            </div>
                            <div className="box-body">
                                <ul className="list-unstyled mb-0 todo-list-list">
                                    {ProjectData.todolist.map((task, index) => (
                                        <li key={index}>
                                            <div className="flex">
                                                <div>
                                                    <span className={`avatar avatar-md avatar-rounded me-3 ${task.avatarBg} !fill-primary`}>
                                                        {task.avatarColor}
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-[0.875rem] font-medium flex items-center justify-between mb-1">
                                                        {task.title}
                                                        <Link scroll={false} href="#!" className="ti-btn ti-btn-sm ti-btn-icon ti-btn-outline-light ti-btn-sm text-textmuted dark:text-textmuted/50">
                                                            <i className="fe fe-trash-2"></i>
                                                        </Link>
                                                    </p>
                                                    <ul className="list-unstyled todo-sublist">
                                                        {task.subTasks.map((subTask, subIndex) => (
                                                            <li key={subIndex} className="mb-2">
                                                                <div className="form-check mb-0 leading-none">
                                                                    <input
                                                                        className="form-check-input form-checked-gray"
                                                                        type="checkbox"
                                                                        id={`subTask-${index}-${subIndex}`}
                                                                        defaultChecked={subTask.checked}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor={`subTask-${index}-${subIndex}`}>
                                                                        {subTask.text}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-6  col-span-12">
                        <div className="box">
                            <div className="box-header sm:flex block items-center">
                                <div className="box-title">TASK LIST</div>
                                <div className="tab-menu-heading !border-0 !p-0 ms-auto">
                                    <div className="tabs-menu-task flex me-4">
                                        <ul className="nav nav-tabs panel-tabs-task !border-0 flex" role="tablist">
                                            <li><Link scroll={false} href="#!" className="me-1 active"
                                                id="active-item" data-hs-tab="#taskactive" aria-controls="taskactive">Active Tasks</Link></li>
                                            <li><Link scroll={false} href="#!" id="completed-item" data-hs-tab="#completed" aria-controls="completed">Completed Tasks</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="sm:mt-0 mt-2">
                                    <button type="button" className="ti-btn ti-btn-sm ti-btn-outline-light items-center inline-flex !m-0">
                                        <i className="ti ti-plus me-1 font-semibold"></i>Add Task
                                    </button>
                                </div>
                            </div>
                            <div className="box-body !p-0">
                                <div className="tab-content !p-0">
                                    <div className="tab-pane active !p-0 !border-0" id="taskactive" role="tabpanel">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: 'Task details' }, { title: 'Assigned', }, { title: 'Target' }, { title: 'Assigned to', }]}>
                                                {ProjectData.TaskList.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td><Link scroll={false} href="#!">{idx.taskDetails}</Link></td>
                                                        <td className="text-textmuted dark:text-textmuted/50">{idx.assigned}</td>
                                                        <td><span className={`badge bg-${idx.targetColor}/[0.15] text-${idx.targetColor}`}>{idx.target}</span></td>
                                                        <td>
                                                            <div className="avatar-list-stacked avatar-list-stacked flex items-center -space-x-2 mb-0">
                                                                {idx.assignedTo.map((img, index) => (
                                                                    <span className="avatar avatar-xs !rounded-sm" key={index}>
                                                                        <Image fill src={img} alt="img" />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                    <div className="tab-pane !p-0 !border-0 hidden" id="completed" role="tabpanel">
                                        <div className="table-responsive">
                                            <Spktables tableClass="ti-custom-table ti-custom-table-head w-full text-nowrap" header={[{ title: 'Task details' }, { title: 'Assigned on', }, { title: 'Completed' }, { title: 'AssignedTo', }]}>
                                                {ProjectData.TaskListTab2.map((idx) => (
                                                    <tr key={idx.id}>
                                                        <td><Link scroll={false} href="#!">{idx.taskDetails}</Link></td>
                                                        <td className="text-textmuted dark:text-textmuted/50">{idx.assignedOn}</td>
                                                        <td><span className="badge bg-success  text-white">{idx.completed}</span></td>
                                                        <td>
                                                            <div className="avatar-list-stacked avatar-list-stacked flex items-center -space-x-2 mb-0">
                                                                {idx.assignedTo.map((img, index) => (
                                                                    <span className="avatar avatar-xs !rounded-sm" key={index}>
                                                                        <Image fill src={img} alt="img" />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Spktables>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                            <SocialPagination />
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    YEARLY REVENUE
                                </div>
                            </div>
                            <div className="box-body !py-0">
                                <div id="yearly-revenue">
                                    <Spkapexcharts chartOptions={ProjectData.YearlyRevenueOption} chartSeries={ProjectData.YearlyRevenueSeries} type="bar" width={'100%'} height={399} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-2 --> */}

                {/* <!-- Start:: row-3 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-9  col-span-12">
                        <div className="box">
                            <div className="box-header justify-between">
                                <div className="box-title">
                                    PROJECTS SUMMARY
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
                                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full text-nowrap" header={[{ title: 'Name' }, { title: 'Start Date', }, { title: 'Progress' }, { title: 'Team', }, { title: 'Due Date', }, { title: 'Status', }, { title: 'Actions', },]}>
                                        {ProjectData.ProjetSummary.map((idx) => (
                                            <tr key={idx.id}>
                                                <td> {idx.name} </td>
                                                <td> {idx.startDate}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <div className="progress progress-animate progress-xs w-full"
                                                            role="progressbar" aria-valuenow={idx.progress} aria-valuemin={0}
                                                            aria-valuemax={100}>
                                                            <div className={`progress-bar progress-bar-striped progress-bar-animated !bg-${idx.progressColor}`} style={{ width: `${idx.progress}%` }}></div>
                                                        </div>
                                                        <div className="ms-2">{idx.progress}%</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="avatar-list-stacked flex items-center -space-x-2">
                                                        {idx.team.map((img, index) => (
                                                            <span key={index} className="avatar avatar-xs avatar-rounded">
                                                                <Image fill src={img} alt="Team member" />
                                                            </span>
                                                        ))}
                                                        {idx.length && (
                                                            <Link scroll={false} className="avatar avatar-xs bg-primary avatar-rounded text-white" href="#!">
                                                                +{idx.length}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.dueDate}
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span>
                                                </td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-primary btn-wave !m-0 !me-1">
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-danger btn-wave !m-0">
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer">
                            <SocialPagination />
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-3  col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    RECENT ACTIVITY
                                </div>
                            </div>
                            <div className="box-body">
                                <ul className="list-unstyled projects-recent-activity">
                                    {ProjectData.notifications.map((notification, index) => (
                                        <li key={index}>
                                            <span className="font-medium block">
                                                {notification.title}
                                                <span className="badge bg-light text-default float-end">{notification.date}</span>
                                            </span>
                                            <span className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">
                                                {notification.person} {notification.type === 'finished' && 'finished task on '}
                                                {notification.type === 'commented' && 'commented on Project '}
                                                {notification.type === 'deal' && 'offered a '}
                                                {notification.type === 'updated' && 'uploaded a new '}
                                                {notification.type === 'overdue' && 'task '}
                                                <span
                                                    className={`font-medium ${notification.type === 'finished'
                                                        ? 'text-primary'
                                                        : notification.type === 'commented'
                                                            ? 'text-secondary'
                                                            : notification.type === 'deal'
                                                                ? 'text-success'
                                                                : notification.type === 'updated'
                                                                    ? 'text-orange'
                                                                    : 'text-secondary'
                                                        }`}>
                                                    {notification.task}
                                                </span>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: row-3 --> */}
            </div>
        </Fragment>
    );
};

export default Projects;