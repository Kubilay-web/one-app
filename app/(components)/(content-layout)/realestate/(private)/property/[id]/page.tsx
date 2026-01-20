import LinkButton from "../../../components/link-button";
import db from "@/app/lib/db";
import { Property } from "@prisma/client";
import React from "react";
import { Carousel } from "antd";
import QueryModal from "../_components/query-modal";
import Image from "next/image";

interface Props {
  params: {
    id: string;
  };
}

async function PropertyPage({ params: { id } }: Props) {
  const property: Property = (await db.property.findUnique({
    where: {
      id: id,
    },
  })) as Property;

  return (
    <div>
      {/* <!-- Start:: Landing Banner --> */}

      <div className=" flex w-full justify-start">
        <LinkButton
          title="Back to Properties"
          path="/realestate"
          className="ti-btn ti-btn-lg btn-wave ti-btn-white !py-2 !bg-white dark:!bg-bodybg shadow-none leading-[2.43rem] rtl:!rounded-tr-md rtl:!rounded-br-md rtl:!rounded-tl-none rtl:!rounded-bl-none !rounded-tr-none !rounded-br-none categorydropdown !border-0 !m-0"
        />
      </div>

      {/* <!-- End:: Landing Banner --> */}

      {/* <!-- Start:: Property Details Section --> */}
      <section className="section !py-6">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="lg:col-span-8 col-span-12">
              {/* Property Images Carousel */}
              <div className="box">
                <div className="relative">
                  <button
                    className="ti-btn ti-btn-sm ti-btn-icon ti-btn-danger !rounded-full top-wishlist-icon absolute top-3 right-3 z-10"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Add to wishlist"
                    data-bs-original-title="Add to wishlist"
                  >
                    <i className="ri-heart-line"></i>
                  </button>
                  <Carousel autoplay className="property-carousel">
                    {property.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`${property.name} - Image ${index + 1}`}
                          className="w-full h-96 lg:h-[450px] object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>

              {/* Property Specifications */}
              <div className="grid grid-cols-12 gap-x-6 justify-center mb-4">
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12">
                  <div className="product-spec bg-white dark:!bg-bodybg">
                    {/* <div className="mb-2 relative h-12 w-12 mx-auto">
                      <Image fill src="/images/realestate/icons/4.png" alt="Bedrooms" />
                    </div> */}
                    <p className="text-[0.875rem] font-semibold mb-0">
                      {property.bedrooms} Bedrooms
                    </p>
                  </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 sm:mt-0 mt-4">
                  <div className="product-spec bg-white dark:!bg-bodybg">
                    {/* <div className="mb-2 relative h-12 w-12 mx-auto">
                      <Image fill src="/images/realestate/icons/5.png" alt="Bathrooms" />
                    </div> */}
                    <p className="text-[0.875rem] font-semibold mb-0">
                      {property.bathrooms} Bathrooms
                    </p>
                  </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-12 sm:mt-0 mt-4">
                  <div className="product-spec bg-white dark:!bg-bodybg">
                    {/* <div className="mb-2 relative h-12 w-12 mx-auto">
                      <Image fill src="/images/realestate/icons/6.png" alt="Area" />
                    </div> */}
                    <p className="text-[0.875rem] font-semibold mb-0">
                      {property.area} Sq.ft Built Up
                    </p>
                  </div>
                </div>
              </div>

              {/* Price and Description */}
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Property Details</div>
                </div>
                <div className="box-body">
                  <h1 className="text-2xl font-bold text-primary mb-4">
                    ${property.price.toLocaleString()} / {property.status}
                  </h1>
                  <p className="text-textmuted dark:text-textmuted/50 mb-0">
                    {property.description}
                  </p>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Amenities & Features</div>
                </div>
                <div className="box-body">
                  <div className="table-responsive">
                    <table className="grid grid-cols-12 gap-x-6 w-full">
                      <tbody className="lg:col-span-12 xl:col-span-6 col-span-12 !p-0">
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Bedrooms:
                            </span>{" "}
                            {property.bedrooms}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Bathrooms:
                            </span>{" "}
                            {property.bathrooms}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Parking:
                            </span>{" "}
                            {property.parking}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Area:
                            </span>{" "}
                            {property.area} Sq.ft
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Furnishing:
                            </span>{" "}
                            {property.furnishing}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Floors:
                            </span>{" "}
                            {property.floors}
                          </td>
                        </tr>
                      </tbody>
                      <tbody className="lg:col-span-12 xl:col-span-6 col-span-12 !p-0">
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Age:
                            </span>{" "}
                            {property.age} Years
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Property Type:
                            </span>{" "}
                            {property.type}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Status:
                            </span>{" "}
                            {property.status}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              City:
                            </span>{" "}
                            {property.city}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Landmark:
                            </span>{" "}
                            {property.landmark}
                          </td>
                        </tr>
                        <tr>
                          <td className="!py-3 !px-[1.15rem]">
                            <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                              <i className="bi bi-check-circle text-primary me-2"></i>
                              Updated:
                            </span>{" "}
                            {new Date(property.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Address</div>
                </div>
                <div className="box-body">
                  <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                      <div className="mb-3">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          City
                        </label>
                        <p className="font-semibold">{property.city}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          Landmark
                        </label>
                        <p className="font-semibold">{property.landmark}</p>
                      </div>
                    </div>
                    <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                      <div className="mb-3">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          Zipcode
                        </label>
                        <p className="font-semibold">{property.pincode}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          Address
                        </label>
                        <p className="font-semibold">{property.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Details Section */}
              {property.showOwnerContact && (
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Owner Details</div>
                  </div>
                  <div className="box-body">
                    <div className="grid grid-cols-12 gap-x-6">
                      <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                        <div className="mb-3">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            Owner Name
                          </label>
                          <p className="font-semibold">{property.ownerName}</p>
                        </div>
                        <div className="mb-3">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            Email
                          </label>
                          <p className="font-semibold">{property.ownerEmail}</p>
                        </div>
                      </div>
                      <div className="xxl:col-span-6 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                        <div className="mb-3">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            Phone Number
                          </label>
                          <p className="font-semibold">{property.ownerPhone}</p>
                        </div>
                        <div className="mb-3">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            Contact Preference
                          </label>
                          <p className="font-semibold">Available for Contact</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 col-span-12">
              <div className="box">
                <div className="box-body !p-6">
                  <div>
                    <h5 className="font-semibold mb-2">{property.name}</h5>
                    <div className="flex items-baseline mb-4">
                      <div className="text-textmuted dark:text-textmuted/50 me-2">
                        <span className="">
                          <i className="bi bi-geo-alt me-1"></i>
                          {property.city}
                        </span>
                        <span>, </span>
                        <span className="">{property.landmark}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-6 mb-6">
                      <div className="xxl:col-span-12 col-span-12">
                        <div className="mb-1 flex items-center">
                          <h5 className="text-[1.5rem] mb-0">
                            ${property.price.toLocaleString()}
                          </h5>
                          <span className="ms-3 badge bg-primary/[0.15] text-primary">
                            {property.status === "FOR_SALE"
                              ? "For Sale"
                              : "For Rent"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-[fs-15] font-semibold mb-1">
                        Quick Summary :
                      </p>
                      <p className="text-textmuted dark:text-textmuted/50 mb-0">
                        {property.description?.substring(0, 150)}...
                      </p>
                    </div>
                    <QueryModal propertyId={property.id} />
                  </div>
                </div>
              </div>

              {/* Agent/Owner Info */}
              <div className="box overflow-hidden">
                <div className="box-body !p-0">
                  <div className="sm:flex items-center p-6 border-b border-defaultborder dark:border-defaultborder/10">
                    <div>
                      <div className="avatar avatar-xl avatar-rounded online me-3 bg-primary/10">
                        <i className="ri-user-line text-primary text-2xl"></i>
                      </div>
                    </div>
                    <div className="flex-grow main-profile-info">
                      <h5 className="font-semibold mb-1">
                        {property.ownerName || "Property Owner"}
                        {property.showOwnerContact && (
                          <i
                            className="bi bi-check-circle-fill text-success text-[0.875rem] ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Verified Owner"
                          ></i>
                        )}
                      </h5>
                      <p className="mb-0">
                        Member Since{" "}
                        {new Date(property.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col gap-3">
                      {property.showOwnerContact ? (
                        <>
                          <div className="input-group">
                            <div className="input-group-text">
                              <i className="fe fe-phone"></i>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              value={property.ownerPhone || "Contact available"}
                              readOnly
                            />
                          </div>
                          <div className="input-group">
                            <div className="input-group-text">
                              <i className="fe fe-mail"></i>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              value={property.ownerEmail || "Email available"}
                              readOnly
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <i className="ri-shield-keyhole-line text-3xl text-primary mb-2"></i>
                          <p className="text-textmuted">
                            Contact details available upon request
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div
                className="alert alert-primary alert-dismissible fade show custom-alert-icon shadow-sm"
                role="alert"
              >
                <div className="flex">
                  <span className="svg-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-primary"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
                    </svg>
                  </span>
                  <div className="ms-2">
                    <h6 className="text-default mb-0">
                      Security & Safety Tips
                    </h6>
                    Always verify property details before making any payments.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End:: Property Details Section --> */}
    </div>
  );
}

export default PropertyPage;
