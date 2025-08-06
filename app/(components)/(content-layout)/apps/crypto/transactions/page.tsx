"use client"
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/uielements/spk-dropdown";
import SpkOverlay from "@/shared/@spk-reusable-components/uielements/spk-overlay";
import { TransactionHistory, TransactionsOptions, TransactionsSeries } from "@/shared/data/apps/crypto/transactionsdata";
import { taskData } from "@/shared/data/apps/task/list-view-data";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import CountUp from "react-countup";

const Transactions = () => {

    const [transaction, setTransaction] = useState(TransactionHistory);
    const handleRemove = (id: string) => {
        const list = transaction.filter((idx: any) => idx.id !== id)
        setTransaction(list);
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Transactions" />
            <Pageheader Heading="Transactions" breadcrumbs={['Apps', 'Crypto']} currentpage="Transactions" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-6 col-span-12">
                            <div className="grid grid-cols-12 gap-x-6">
                                {taskData.map((task) => (
                                    <div className="xxl:col-span-6 col-span-12" key={task.id}>
                                        <div className="box">
                                            <div className="box-body !p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`svg-icon-background ${task.color}/[0.15] mb-3 svg-primary mx-auto`}>
                                                        {task.icon}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h6 className="mb-2 text-[0.75rem]">{task.title}</h6>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-medium mb-0">
                                                                    <CountUp className="count-up" end={task.count} />
                                                                    {task.count === 33 ? "k" : ""}
                                                                </h4>
                                                                <span className={`badge ${task.color} text-white`}>
                                                                    {task.badge}
                                                                </span>
                                                            </div>
                                                            <p className="text-textmuted dark:text-textmuted/50 text-[0.6875rem] mb-0 leading-none">
                                                                <span className={`me-1 font-medium ${task.trend.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                                                                    <i className={`ri-arrow-${task.trend.direction}-s-line me-1 align-middle`}></i>
                                                                    {task.trend.value}
                                                                </span>
                                                                <span> this month</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="box-title">
                                        Transactions Statistics
                                    </div>
                                </div>
                                <div className="box-body !px-0 !pb-0">
                                    <div id="transactions">
                                        <Spkapexcharts chartOptions={TransactionsOptions} chartSeries={TransactionsSeries} type="bar" width={"100%"} height={193} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Transaction History
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div>
                                    <input className="form-control form-control-sm" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                                </div>
                                <SpkDropdown Linktag={true} Linkclass="ti-btn ti-btn-primary ti-btn-sm btn-wave waves-effect waves-light !m-0"
                                    Toggletext="Sort By" Arrowicon={true}>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Week</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Month</Link></li>
                                    <li><Link scroll={false} className="ti-dropdown-item" href="#!">This Year</Link></li>
                                </SpkDropdown>
                                <div>
                                    <SpkButton Size="sm" customClass="ti-btn ti-btn-secondary  btn-wave !m-0">View All</SpkButton>
                                </div>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <Spktables tableClass="ti-custom-table ti-custom-table-head w-full" header={[{ title: '', }, { title: 'Sender', }, { title: 'Transaction Hash', },
                                { title: 'Coin', }, { title: 'Date', }, { title: 'Amount', }, { title: 'Receiver', }, { title: 'Status', }, { title: 'Actions', },]}>
                                    {transaction.map((idx) => (
                                        <tr key={idx.id}>
                                            <td>
                                                <span className="avatar avatar-sm avatar-rounded bg-light">
                                                    <i className={`ti ti-arrow-narrow-${idx.arrowClass} text-${idx.arrowColor} font-medium text-[1rem]`}></i>
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="avatar avatar-xs avatar-rounded">
                                                        <Image fill src={idx.avatar} alt="" />
                                                    </span>
                                                    <div className="font-medium">{idx.userName}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span>{idx.id}</span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="avatar avatar-xs avatar-rounded">
                                                        <Image fill src={idx.crypto.image} alt="" />
                                                    </span>
                                                    <div className="font-medium">{idx.crypto.name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span>{idx.date}</span>
                                            </td>
                                            <td>
                                                <span className={`text-${idx.amountColor}`}>{idx.amount}</span>
                                            </td>
                                            <td>
                                                <span>{idx.operator}</span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${idx.statusColor}/[0.15] text-${idx.statusColor}`}>{idx.status}</span>
                                            </td>
                                            <td>
                                                <SpkOverlay>
                                                    <SpkButton variant="soft-primary" Size="sm" customClass="ti-btn ti-btn-soft-primary ti-btn-icon "><i className="ri-download-2-line"></i>
                                                        <span className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm " role="tooltip">
                                                            Download
                                                        </span>
                                                    </SpkButton>
                                                </SpkOverlay>
                                                <SpkButton variant="soft-danger" Size="sm" customClass="ti-btn ti-btn-soft-danger ti-btn-icon ms-1 ti-btn-sm task-delete-btn" onclickfunc={() => handleRemove(idx.id)}>
                                                    <i className="ri-delete-bin-5-line"></i>
                                                </SpkButton>
                                            </td>
                                        </tr>
                                    ))}
                                </Spktables>
                            </div>
                        </div>
                        <div className="box-footer">
                            <nav aria-label="Page navigation">
                                <ul className="ti-pagination mb-0 float-end">
                                    <li className="page-item">
                                        <Link scroll={false} href="#!" className="page-link disabled">Previous </Link>
                                    </li>
                                    <li className="page-item"><Link scroll={false} className="page-link" href="#!">1 </Link> </li>
                                    <li className="page-item" aria-current="page">
                                        <Link scroll={false} className="page-link active" href="#!">2 </Link>
                                    </li>
                                    <li className="page-item"><Link scroll={false} className="page-link" href="#!">3 </Link> </li>
                                    <li className="page-item">
                                        <Link scroll={false} className="page-link" href="#!">Next </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!--End::row-1 --> */}
        </Fragment>
    );
};

export default Transactions;