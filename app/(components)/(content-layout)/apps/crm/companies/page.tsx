"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { Companydata, Selectdata1, Selectdata2 } from "@/shared/data/apps/crm/companiesdata";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";

const Companies = () => {

    const [manageInvoiceData, setManageInvoiceData] = useState([...Companydata]);

    const handleDelete = (idToRemove: number) => {
        const updatedInvoiceData = manageInvoiceData.filter((item: any) => item.id !== idToRemove);
        setManageInvoiceData(updatedInvoiceData);
    };
  //image upload
  const [images1, setImages1] = useState<any>([]);
  const [selectedImage1, setSelectedImage1] = useState(null);
  
  const handleFileChange1 = (e:any) => {
      const file = e.target.files[0];
      if (file) {
          const reader:any = new FileReader();
          reader.onloadend = () => {
              setSelectedImage1(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };
    return (
        <Fragment>

            {/* <!-- Page Header --> */}
            <Seo title="Companies" />
            <Pageheader Heading="Companies" breadcrumbs={['Apps','CRM']} currentpage="Companies" />
            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box custom-box">
                        <div className="box-header justify-between">
                            <div className="box-title">
                                Companies <span className="badge bg-light text-defaulttextcolor rounded-full ms-1 text-[0.75rem] align-middle">14</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link scroll={false} href="#!" className="hs-dropdown-toggle ti-btn  btn-wave ti-btn-primary ti-btn-sm" data-hs-overlay="#todo-compose"><i className="ri-add-line font-medium align-middle"></i>Add Company
                                </Link>
                                <button type="button" className="ti-btn  btn-wave ti-btn-soft-success ti-btn-sm btn-wave">Export As CSV</button>
                                <div className="hs-dropdown ti-dropdown">
                                    <Link scroll={false} href="#!" className="ti-btn  btn-wave ti-btn-light ti-btn-sm btn-wave" aria-expanded="false">
                                        Sort By<i className="ri-arrow-down-s-line align-middle ms-2 inline-block"></i>
                                    </Link>
                                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Newest</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">Date Added</Link></li>
                                        <li><Link scroll={false} className="ti-dropdown-item" href="#!">A - Z</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <div className="table-responsive">
                                    <Spktables showCheckbox={true} Customcheckclass="" tableClass="ti-custom-table ti-custom-table-head w-full whitespace-nowrap" header={[{ title: 'Company Name', headerClassname: 'text-start' }, { title: 'Email', headerClassname: 'text-start' },
                                    { title: 'Phone', headerClassname: 'text-start' }, { title: 'Industry', headerClassname: 'text-start' }, { title: 'Company Size', headerClassname: 'text-start' }, { title: 'Key Contact', headerClassname: 'text-start' }, { title: 'Total Deals', headerClassname: 'text-start' }, { title: 'Actions', headerClassname: 'text-start' },]}>
                                        {manageInvoiceData.map((idx) => (
                                            <tr className="border border-defaultborder dark:border-defaultborder/10 crm-contact" key={idx.id}>
                                                <td>
                                                    <input className="form-check-input" type="checkbox" id="checkboxNoLabel1" value="" aria-label="..." />
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-sm p-1 bg-light avatar-rounded">
                                                                <Image fill src={idx.src2} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <Link scroll={false} href="#offcanvasExample" data-hs-overlay="#hs-overlay-contacts">{idx.text1}</Link>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="block mb-1"><i className="ri-mail-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>{idx.mail}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span className="block"><i className="ri-phone-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>{idx.cell}</span>
                                                    </div>
                                                </td>
                                                <td> {idx.text2}</td>
                                                <td>
                                                    <div className="flex items-center flex-wrap gap-1">
                                                        <span className={`badge bg-${idx.badgeColor} text-${idx.badgeTextColor}`}>{idx.badge}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="leading-none">
                                                            <span className="avatar avatar-rounded avatar-sm">
                                                                <Image fill src={idx.src1} alt="" />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="block font-medium">{idx.contactName}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {idx.score}
                                                </td>
                                                <td>
                                                    <div className="btn-list">
                                                        <button aria-label="button" type="button" className="ti-btn  btn-wave ti-btn-sm ti-btn-soft-warning !m-0 !me-1" data-hs-overlay="#hs-overlay-contacts"><i className="ri-eye-line"></i></button>
                                                        <button aria-label="button" type="button" className="ti-btn  btn-wave ti-btn-sm ti-btn-soft-info !m-0 !me-1"><i className="ri-pencil-line"></i></button>
                                                        <SpkButton variant="soft-danger" Size="sm" customClass="ti-btn ti-btn-icon contact-delete" onclickfunc={() => handleDelete(idx.id)}><i className="ri-delete-bin-line"></i></SpkButton>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </Spktables>
                                </div>
                            </div>
                            <div className="box-footer !border-t-0">
                                <div className="flex items-center">
                                    <div>
                                        Showing 10 Entries <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex  ms-2 font-medium"></i>
                                    </div>
                                    <div className="ms-auto">
                                        <nav aria-label="Page navigation" className="pagination-style-4">
                                            <ul className="ti-pagination mb-0">
                                                <li className="page-item disabled">
                                                    <Link scroll={false} className="page-link" href="#!">
                                                        Prev
                                                    </Link>
                                                </li>
                                                <li className="page-item "><Link scroll={false} className="page-link active" href="#!">1</Link></li>
                                                <li className="page-item"><Link scroll={false} className="page-link" href="#!">2</Link></li>
                                                <li className="page-item">
                                                    <Link scroll={false} className="page-link text-primary" href="#!">
                                                        next
                                                    </Link>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}

                {/* <!-- Start:: Company Details Offcanvas --> */}
                <div className="hs-overlay hidden ti-offcanvas ti-offcanvas-right !max-w-[25rem] !border-0" tabIndex={-1} id="hs-overlay-contacts">
                    <div className="ti-offcanvas-body !p-0">
                        <div className="sm:flex items-start p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 main-profile-cover">
                            <div>
                                <span className="avatar avatar-xxl avatar-rounded me-3 bg-light/10 p-2">
                                    <Image fill src="../../../assets/images/company-logos/1.png" alt="" />
                                </span>
                            </div>
                            <div className="flex-fill main-profile-info w-full">
                                <div className="flex items-center justify-between">
                                    <h6 className="font-medium mb-1">Spruko Technologies</h6>
                                    <button type="button" className="ti-btn  btn-wave flex-shrink-0 !p-0  transition-none opacity-70 hover:opacity-100 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:outline-0 focus-visible:outline-0 !mb-0" data-hs-overlay="#hs-overlay-contacts">
                                        <span className="sr-only">Close modal</span>
                                        <i className="ri-close-line leading-none text-lg"></i>
                                    </button>
                                </div>
                                <p className="mb-1 opacity-70">Telecommunications</p>
                                <p className="text-[0.75rem] mb-4 opacity-50">
                                    <span className="me-3"><i className="ri-building-line me-1 align-middle"></i>Georgia</span>
                                    <span className="inline-flex"><i className="ri-map-pin-line me-1 align-middle"></i>Washington D.C</span>
                                </p>
                                <div className="flex mb-0">
                                    <div className="me-4">
                                        <p className="font-medium text-xl text-shadow mb-0">113</p>
                                        <p className="mb-0 text-[0.6875rem] opacity-50">Deals</p>
                                    </div>
                                    <div className="me-4">
                                        <p className="font-medium text-xl text-shadow mb-0">$12.2k</p>
                                        <p className="mb-0 text-[0.6875rem] opacity-50">Contributions</p>
                                    </div>
                                    <div className="me-4">
                                        <p className="font-medium text-xl text-shadow mb-0">$10.67k</p>
                                        <p className="mb-0 text-[0.6875rem] opacity-50">Comitted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-b border-dashed border-defaultborder  dark:border-defaultborder/10">
                            <div className="mb-0">
                                <p className="text-[0.9375rem] mb-2 font-medium">Professional Bio :</p>
                                <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                                    <b className="text-default">Spruko</b> Technologies is a leading technology company specializing in innovative software solutions for businesses worldwide. With a strong focus on cutting-edge technologies and a team of skilled professionals.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-b border-dashed border-defaultborder  dark:border-defaultborder/10">
                            <p className="text-[.875rem] mb-2 me-4 font-medium">Contact Information :</p>
                            <div className="">
                                <div className="flex items-center mb-2">
                                    <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                            <i className="ri-mail-line align-middle text-[.875rem]"></i>
                                        </span>
                                    </div>
                                    <div>
                                        sprukotechnologies2981@gmail.com
                                    </div>
                                </div>
                                <div className="flex items-center mb-2">
                                    <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                            <i className="ri-phone-line align-middle text-[.875rem]"></i>
                                        </span>
                                    </div>
                                    <div>
                                        1678-28993-223
                                    </div>
                                </div>
                                <div className="flex items-center mb-0">
                                    <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded bg-light text-textmuted dark:text-textmuted/50">
                                            <i className="ri-map-pin-line align-middle text-[.875rem]"></i>
                                        </span>
                                    </div>
                                    <div>
                                        MIG-1-11, Monroe Street, Georgetown, Washington D.C, USA,20071
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-b border-dashed border-defaultborder  dark:border-defaultborder/10 flex items-center">
                            <p className="text-[.875rem] mb-0 me-4 font-medium">Social Networks :</p>
                            <div className="btn-list mb-0 gap-2 flex">
                                <button aria-label="button" type="button" className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-primary mb-0">
                                    <i className="ri-facebook-line font-medium"></i>
                                </button>
                                <button aria-label="button" type="button" className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-secondary mb-0">
                                    <i className="ri-twitter-x-line font-medium"></i>
                                </button>
                                <button aria-label="button" type="button" className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-warning mb-0">
                                    <i className="ri-instagram-line font-medium"></i>
                                </button>
                                <button aria-label="button" type="button" className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-success mb-0">
                                    <i className="ri-github-line font-medium"></i>
                                </button>
                                <button aria-label="button" type="button" className="ti-btn  btn-wave w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-soft-danger mb-0">
                                    <i className="ri-youtube-line font-medium"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-b border-dashed border-defaultborder  dark:border-defaultborder/10 flex items-center gap-3">
                            <div className="text-[.875rem] font-medium">Company Size:</div>
                            <div>
                                <span className="badge bg-primary/10 !text-primary m-1">Corporate</span> - 1001+ Employees
                            </div>
                        </div>
                        <div className="p-4 flex items-center gap-3">
                            <div className="text-[.875rem] font-medium">
                                Key Contact :
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="leading-none">
                                    <span className="avatar avatar-rounded avatar-sm">
                                        <Image fill src="../../../assets/images/faces/2.jpg" alt="img" />
                                    </span>
                                </div>
                                <div className="font-medium">Lisa Convay</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: Company Details Offcanvas --> */}

                {/* <!-- Start:: Add Company --> */}
                <div id="todo-compose" className="hs-overlay hidden ti-modal">
                    <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header">
                                <h6 className="modal-title text-[1rem] font-medium text-defaulttextcolor" id="mail-ComposeLabel">Add Company</h6>
                                <button type="button" className="hs-dropdown-toggle !text-[1rem] !font-medium !text-defaulttextcolor" data-hs-overlay="#todo-compose">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className="ti-modal-body px-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="mb-0 text-center">
                                            <span className="avatar avatar-xxl avatar-rounded bg-light p-2">
                                                <img src={selectedImage1 || "../../../assets/images/company-logos/11.png"} alt="" id="profile-img"/>
                                                <span className="badge rounded-pill bg-primary text-white avatar-badge">
                                                <input onChange={(e: any) => {
                                                    handleFileChange1(e);
                                                    setImages1([...images1, e.target.files[0]]);
                                                }} type="file" name="photo" className="absolute w-full h-full opacity-0" id="profile-change" />
                                                <i className="fe fe-camera text-[.625rem]"></i>
                                                    
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="company-name" className="ti-form-label">Company Name</label>
                                        <input type="text" className="form-control" id="company-name" placeholder="Contact Name" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="company-lead-score" className="ti-form-label">Total Deals</label>
                                        <input type="number" className="form-control" id="company-lead-score" placeholder="Total Deals" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="company-mail" className="ti-form-label">Email</label>
                                        <input type="email" className="form-control" id="company-mail" placeholder="Enter Email" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="company-phone" className="ti-form-label">Phone No</label>
                                        <input type="tel" className="form-control" id="company-phone" placeholder="Enter Phone Number" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="key-contact" className="ti-form-label">Key Contact</label>
                                        <input type="text" className="form-control" id="key-contact" placeholder="Contact Name" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Industry</label>
                                        <SpkSelect name="colors" option={Selectdata2} mainClass="basic-multi-select"
                                            menuplacement='auto' classNameprefix="Select2" placeholder="Select Industry" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label className="ti-form-label">Company Size</label>
                                        <SpkSelect name="colors" option={Selectdata1} mainClass="basic-multi-select custom-company"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[Selectdata1[0]]} />
                                    </div>
                                </div>
                            </div>
                            <div className="ti-modal-footer">
                                <button type="button"
                                    className="hs-dropdown-toggle ti-btn  btn-wave  ti-btn-light align-middle"
                                    data-hs-overlay="#todo-compose">
                                    Cancel
                                </button>
                                <button type="button" className="ti-btn  btn-wave bg-primary text-white !font-medium">Create Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End:: Add Company --> */}
            </div>
        </Fragment>
    );
};

export default Companies;