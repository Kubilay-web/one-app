import { validateRequest } from "@/app/auth";
import PageTitle from "../../../components/page-title";
import db from "@/app/lib/db";
import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import Image from "next/image";

async function Account() {
  const {user} = await validateRequest();
  const propertiesCount = await db.property.count({
    where: { userId: user?.id },
  });

  const userSubscription: any = await db.subscriptionEstate.findFirst({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>


      {/* <!-- Start:: Account Section --> */}
      <section className="section !py-6">
        <div className="container">
          <div className="box">
            <div className="box-header">
              <div className="box-title">
                <PageTitle title="My Account" />
              </div>

            </div>

            {/* User Profile Section */}
            <div className="box-body">
              <div className="grid grid-cols-12 gap-6">
                {/* User Info Card */}
                <div className="lg:col-span-4 col-span-12">
                  <div className="box border border-defaultborder dark:border-defaultborder/10">
                    <div className="box-body text-center">
                      <div className="avatar avatar-xxl avatar-rounded mx-auto mb-4 bg-primary/10">
                        {user?.avatarUrl ? (
                          <Image 
                            src={user.avatarUrl} 
                            alt={user.username || 'User'} 
                            width={80}
                            height={80}
                            className="rounded-full"
                          />
                        ) : (
                          <i className="ri-user-line text-primary text-4xl"></i>
                        )}
                      </div>
                      <h4 className="font-semibold mb-1">{user?.username || 'User'}</h4>
                      <p className="text-textmuted dark:text-textmuted/50 mb-3">{user?.email}</p>
                      <div className="flex justify-center gap-2">
                        <span className="badge bg-primary/10 text-primary">
                          <i className="bi bi-house me-1"></i>
                          {propertiesCount} Properties
                        </span>
                        <span className="badge bg-success/10 text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Details Section */}
                <div className="lg:col-span-8 col-span-12">
                  <div className="box">
                    <div className="box-header">
                      <div className="box-title">
                        <i className="ri-user-line me-2 text-primary"></i>
                        Basic Details
                      </div>
                    </div>
                    <div className="box-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            <i className="ri-user-3-line me-2"></i>
                            Name
                          </label>
                          <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                            {user?.username || 'Not provided'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            <i className="ri-mail-line me-2"></i>
                            Email
                          </label>
                          <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                            {user?.email || 'Not provided'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            <i className="ri-home-3-line me-2"></i>
                            Properties Posted
                          </label>
                          <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                            {propertiesCount}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <label className="form-label text-textmuted dark:text-textmuted/50">
                            <i className="ri-shield-user-line me-2"></i>
                            Role
                          </label>
                          <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                            {user?.roleestate || 'USER'}
                          </p>
                        </div>
               
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Details Section */}
            <div className="box-body !pt-0">
              <div className="box">
                <div className="box-header">
                  <div className="box-title">
                    <i className="ri-vip-crown-line me-2 text-primary"></i>
                    Subscription Details
                  </div>
         
                </div>
                <div className="box-body">
                  {userSubscription ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex flex-col">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          <i className="ri-medal-line me-2"></i>
                          Plan
                        </label>
                        <div className="flex items-center">
                          <span className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70 me-2">
                            {userSubscription?.plan.name || 'N/A'}
                          </span>
                          <span className="badge bg-primary/10 text-primary">
                            Active
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          <i className="ri-money-dollar-circle-line me-2"></i>
                          Price
                        </label>
                        <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                          ${userSubscription?.plan.price || '0.00'}
                          <span className="text-xs text-textmuted ms-1">/month</span>
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          <i className="ri-calendar-event-line me-2"></i>
                          Purchased On
                        </label>
                        <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70">
                          {dayjs(userSubscription?.createdAt).format("DD MMM YYYY")}
                          <span className="text-xs text-textmuted block">
                            {dayjs(userSubscription?.createdAt).format("hh:mm A")}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <label className="form-label text-textmuted dark:text-textmuted/50">
                          <i className="ri-bill-line me-2"></i>
                          Payment ID
                        </label>
                        <p className="font-semibold text-defaulttextcolor dark:text-defaulttextcolor/70 text-sm">
                          {userSubscription?.paymentId || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <i className="ri-vip-crown-line text-5xl text-gray-300"></i>
                      </div>
                      <h5 className="text-gray-500 mb-2">No Active Subscription</h5>
                      <p className="text-gray-400 mb-4">Subscribe to unlock premium features and post more properties</p>
                      <Link href="/realestate/user/subscriptions" className="ti-btn ti-btn-primary">
                        <i className="ri-add-line me-2"></i>
                        View Subscription Plans
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>



          </div>
        </div>
      </section>
      {/* <!-- End:: Account Section --> */}



    </div>
  );
}

export default Account;