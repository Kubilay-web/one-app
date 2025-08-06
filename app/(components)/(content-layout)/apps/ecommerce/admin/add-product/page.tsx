"use client"
import dynamic from 'next/dynamic';
const SpkSelect = dynamic(() =>import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),{ ssr: false });
import { days, payment, quantity, simpleItems, simpleItems1, simpleItems2, taxes } from "@/shared/data/apps/ecommers/admin/addproduct";

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import CreatableSelect from 'react-select/creatable';

const AddProduct = () => {
    //create
    const components = {
        DropdownIndicator: null,
    };

    const createOption = (label: string) => ({
        label,
        value: label,
    });

    const [inputValue, setInputValue] = React.useState('');
    const [value, setValue] = React.useState<any>([]);

    const handleKeyDown = (event: any) => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setValue((prev: any) => [...prev, createOption(inputValue)]);
                setInputValue('');
                event.preventDefault();
        }
    };

    return (
        <Fragment>
            <div className="container-fluid">
                {/* <!-- Page Header --> */}
                <Seo title="Add Product" />
                <Pageheader Heading="Add Product" breadcrumbs={['Apps', 'Ecommerce', 'Admin']} currentpage="Add Product" />
                {/* <!-- Page Header Close --> */}

                {/* <!-- Start::row-1 --> */}
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-8 lg:col-span-8 md:col-span-7 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title flex-grow-1">
                                    Add Product
                                </div>
                                <Link href="/apps/ecommerce/admin/products" className="ti-btn ti-btn-outline-light btn-wave !m-0 !text-dark">
                                    <i className="bi bi-arrow-right  rtl:rotate-180 inline-flex "></i> Go Back
                                </Link>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 sm:gap-x-6 gap-y-6">
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="Product-name" className="ti-form-label">Product Name</label>
                                        <input type="text" className="form-control" id="Product-name" placeholder="Product Name" defaultValue="SoundSync Headphones" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Product Category</label>
                                        <SpkSelect option={simpleItems} mainClass="" name="Category-select"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[simpleItems[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Brand</label>
                                        <SpkSelect option={simpleItems1} mainClass="" name="Brand"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[simpleItems1[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Property Address</label>
                                        <SpkSelect option={simpleItems2} mainClass="" name="address"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[simpleItems2[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Stock QTY</label>
                                        <SpkSelect option={quantity} mainClass="" name="stockqty"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[quantity[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Taxes</label>
                                        <SpkSelect option={taxes} mainClass="" name="Taxes"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[taxes[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label className="ti-form-label">Shipping Days</label>
                                        <SpkSelect option={days} mainClass="" name="Bathrooms"
                                            menuplacement='auto' classNameprefix="Select2" defaultvalue={[days[0]]} />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="discount" className="ti-form-label">Discount (%)</label>
                                        <input type="text" className="form-control" id="discount" placeholder="Discount" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="SKU" className="ti-form-label">SKU</label>
                                        <input type="text" className="form-control" id="SKU" placeholder="SKU" defaultValue="#SPK147" />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <label htmlFor="tags-name" className="ti-form-label">Tags</label>
                                        <CreatableSelect
                                            classNamePrefix='Select2'
                                            components={components}
                                            inputValue={inputValue}
                                            isClearable
                                            isMulti
                                            menuIsOpen={false}
                                            onChange={(newValue) => setValue(newValue)}
                                            onInputChange={(newValue) => setInputValue(newValue)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type something and press enter..."
                                            value={value}
                                        />
                                    </div>
                                    <div className="xl:col-span-8 col-span-12">
                                        <label className="ti-form-label">Payment Options</label>
                                        <SpkSelect multi option={payment} mainClass="" name="Payment" id="payment"
                                            menuplacement='auto' classNameprefix="Select2" />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <label htmlFor="Price" className="ti-form-label">Price</label>
                                        <input type="text" className="form-control" id="Price" placeholder="Price" defaultValue="$3654" />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <label htmlFor="Ad-description" className="ti-form-label">Product Description :</label>
                                        <textarea className="form-control w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            id="bio"
                                            rows={7}
                                            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. At sit impedit, officiis non minima saepe voluptates a magnam enim sequi porro veniam ea suscipit dolorum vel mollitia voluptate iste nemo!"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="box-footer">
                                <div className="float-end">
                                    <button className="ti-btn ti-btn-primary">
                                        Add Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-4 lg:col-span-4 md:col-span-5 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Vendor Profile</div>
                            </div>
                            <div className="box-body">
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="mb-4">
                                        <span className="avatar avatar-lg avatar-rounded">
                                            <Image fill src="../../../../assets/images/faces/9.jpg" alt="" className="w-full h-full" />
                                            <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                        </span>
                                    </div>
                                    <div> <label htmlFor="small-file-input1" className="sr-only">Choose file</label> <input type="file" name="small-file-input1" id="small-file-input2" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                    file:border-0
                                   file:bg-light file:me-4
                                   file:py-2 file:px-4
                                   dark:file:bg-black/20 dark:file:text-white/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Product Images </div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-y-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="mb-3">
                                            <span className="avatar avatar-lg avatar-rounded me-2 bg-light">
                                                <Image fill src="../../../../assets/images/ecommerce/png/13.png" alt="" className="w-full h-full" />
                                                <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                            </span>
                                            <span className="avatar avatar-lg avatar-rounded me-2 bg-light">
                                                <Image fill src="../../../../assets/images/ecommerce/png/14.png" alt="" className="w-full h-full" />
                                                <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                            </span>
                                            <span className="avatar avatar-lg avatar-rounded me-2 bg-light">
                                                <Image fill src="../../../../assets/images/ecommerce/png/15.png" alt="" className="w-full h-full" />
                                                <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                            </span>
                                            <span className="avatar avatar-lg avatar-rounded me-2 bg-light">
                                                <Image fill src="../../../../assets/images/ecommerce/png/16.png" alt="" className="w-full h-full" />
                                                <Link scroll={false} href="#!" className="badge rounded-pill bg-danger avatar-badge text-white"><i className="fe fe-x text-[0.75rem]"></i></Link>
                                            </span>
                                        </div>
                                        <label htmlFor="small-file-input2" className="ti-form-label">Upload Image</label>
                                        <div> <label htmlFor="small-file-input2" className="sr-only">Choose file</label> <input type="file" name="small-file-input2" id="small-file-input1" className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                        file:border-0
                                       file:bg-light file:me-4
                                       file:py-2 file:px-4
                                       dark:file:bg-black/20 dark:file:text-white/50" />
                                        </div>
                                        <p className="mb-0 text-textmuted dark:text-textmuted/50 mt-3 text-[0.75rem]">Minimum of 6 images are need to be uploaded,make sure the image size match the proper background size and all images should be uniformly maintained with width and height.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--End::row-1 --> */}
            </div>
        </Fragment>
    );
};

export default AddProduct;