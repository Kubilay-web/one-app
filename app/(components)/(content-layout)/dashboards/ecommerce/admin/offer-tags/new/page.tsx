"use client"

import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

interface OfferTagFormData {
  name: string;
  url: string;
}

const AdminNewOfferTagsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OfferTagFormData>({
    name: '',
    url: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate URL from name
    if (name === 'name') {
      const urlSlug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        url: urlSlug
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/oneshop/admin/offertags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create offer tag');
      }

      toast.success('Offer tag created successfully!');
      
      // Redirect to offer tags list after a short delay
      setTimeout(() => {
        router.push('/dashboards/ecommerce/admin/offertags');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating offer tag:', error);
      toast.error(error.message || 'Failed to create offer tag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/ecommerce/admin/offertags');
    }
  };

  return (
    <Fragment>
      <div className="main-content landing-main ecommerce-main">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"New Offer Tag - Admin"} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Apps', 'Ecommerce', 'Admin', 'Offer Tags']} 
              currentpage="New Offer Tag" 
            />
          </div>
        </div>

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                <div className="grid grid-cols-12 gap-x-6">
                  <div className="lg:col-span-8 col-span-12">
                    <div className="box">
                      <div className="box-header">
                        <div className="box-title flex-grow-1">
                          Create New Offer Tag
                        </div>
                        <Link 
                          href="/ecommerce/admin/offertags"
                          className="ti-btn ti-btn-outline-light btn-wave waves-effect waves-light !text-dark !m-0"
                        >
                          <i className="bi bi-arrow-left rtl:rotate-180 inline-flex me-1"></i> Back to Offer Tags
                        </Link>
                      </div>
                      <div className="box-body">
                        <form onSubmit={handleSubmit}>
                          <div className="grid grid-cols-12 gap-6">
                            {/* Offer Tag Name */}
                            <div className="xl:col-span-6 col-span-12">
                              <label htmlFor="name" className="ti-form-label">
                                Offer Tag Name *
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="Enter offer tag name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Example: "Summer Sale", "Clearance", "New Arrivals"
                              </p>
                            </div>

                            {/* Offer Tag URL (Slug) */}
                            <div className="xl:col-span-6 col-span-12">
                              <label htmlFor="url" className="ti-form-label">
                                URL Slug *
                              </label>
                              <input
                                type="text"
                                id="url"
                                name="url"
                                className="form-control"
                                placeholder="offer-tag-url-slug"
                                value={formData.url}
                                onChange={handleInputChange}
                                required
                              />
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                This will be used in the URL. Use lowercase letters, numbers, and hyphens.
                              </p>
                            </div>

                            {/* Preview Section */}
                            <div className="xl:col-span-12 col-span-12">
                              <div className="border border-defaultborder dark:border-defaultborder/10 rounded p-4">
                                <h6 className="font-semibold mb-3">Preview</h6>
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                                    <i className="bi bi-tag text-primary"></i>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {formData.name || 'Offer Tag Name'}
                                    </div>
                                    <div className="text-xs text-textmuted dark:text-textmuted/50">
                                      URL: /offer/{formData.url || 'offer-tag-url'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="xl:col-span-12 col-span-12">
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={handleCancel}
                                  className="ti-btn ti-btn-outline-light btn-wave waves-effect waves-light"
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="ti-btn ti-btn-primary btn-wave waves-effect waves-light"
                                  disabled={loading || !formData.name || !formData.url}
                                >
                                  {loading ? (
                                    <>
                                      <i className="bi bi-arrow-clockwise animate-spin me-1"></i>
                                      Creating...
                                    </>
                                  ) : (
                                    'Create Offer Tag'
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Help Section */}
                  <div className="lg:col-span-4 col-span-12">
                    <div className="box">
                      <div className="box-header">
                        <div className="box-title">
                          <i className="bi bi-info-circle me-2"></i>
                          About Offer Tags
                        </div>
                      </div>
                      <div className="box-body">
                        <div className="space-y-4">
                          <div>
                            <h6 className="font-semibold text-sm mb-2">What are Offer Tags?</h6>
                            <p className="text-xs text-textmuted dark:text-textmuted/50">
                              Offer tags are special labels that can be assigned to products to highlight special offers, promotions, or categories like "Sale", "New", "Featured", etc.
                            </p>
                          </div>

                          <div>
                            <h6 className="font-semibold text-sm mb-2">Common Use Cases</h6>
                            <ul className="text-xs text-textmuted dark:text-textmuted/50 space-y-1">
                              <li className="flex items-start">
                                <i className="bi bi-check-circle text-success me-2 mt-0.5"></i>
                                <span>Seasonal sales (Summer Sale, Winter Clearance)</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-check-circle text-success me-2 mt-0.5"></i>
                                <span>Product highlights (Best Seller, New Arrival)</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-check-circle text-success me-2 mt-0.5"></i>
                                <span>Special promotions (Limited Time Offer, Flash Sale)</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-check-circle text-success me-2 mt-0.5"></i>
                                <span>Category highlights (Gift Ideas, Under $50)</span>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h6 className="font-semibold text-sm mb-2">Best Practices</h6>
                            <ul className="text-xs text-textmuted dark:textmuted/50 space-y-1">
                              <li className="flex items-start">
                                <i className="bi bi-lightbulb text-warning me-2 mt-0.5"></i>
                                <span>Keep names short and descriptive</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-lightbulb text-warning me-2 mt-0.5"></i>
                                <span>Use consistent naming conventions</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-lightbulb text-warning me-2 mt-0.5"></i>
                                <span>Limit to 2-3 active offer tags per product</span>
                              </li>
                              <li className="flex items-start">
                                <i className="bi bi-lightbulb text-warning me-2 mt-0.5"></i>
                                <span>Use seasonal tags that can be reused</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="box mt-4">
                      <div className="box-header">
                        <div className="box-title">
                          <i className="bi bi-bar-chart me-2"></i>
                          Offer Tag Stats
                        </div>
                      </div>
                      <div className="box-body">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-textmuted dark:text-textmuted/50">Total Offer Tags</div>
                              <div className="text-lg font-semibold">Loading...</div>
                            </div>
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <i className="bi bi-tags text-primary"></i>
                            </div>
                          </div>
                          
                          <div className="border-t border-defaultborder dark:border-defaultborder/10 pt-4">
                            <div className="text-xs text-textmuted dark:text-textmuted/50 mb-2">Popular Offer Tags</div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Summer Sale</span>
                                <span className="font-medium">45 products</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>New Arrivals</span>
                                <span className="font-medium">32 products</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Clearance</span>
                                <span className="font-medium">28 products</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="box mt-4">
                      <div className="box-header">
                        <div className="box-title">
                          <i className="bi bi-lightning me-2"></i>
                          Quick Actions
                        </div>
                      </div>
                      <div className="box-body">
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setFormData({
                                name: 'Summer Sale',
                                url: 'summer-sale'
                              });
                            }}
                            className="ti-btn ti-btn-outline-light w-full justify-start"
                          >
                            <i className="bi bi-sun me-2"></i>
                            Use Summer Sale Template
                          </button>
                          <button
                            onClick={() => {
                              setFormData({
                                name: 'Clearance',
                                url: 'clearance'
                              });
                            }}
                            className="ti-btn ti-btn-outline-light w-full justify-start"
                          >
                            <i className="bi bi-tag me-2"></i>
                            Use Clearance Template
                          </button>
                          <button
                            onClick={() => {
                              setFormData({
                                name: 'New Arrivals',
                                url: 'new-arrivals'
                              });
                            }}
                            className="ti-btn ti-btn-outline-light w-full justify-start"
                          >
                            <i className="bi bi-star me-2"></i>
                            Use New Arrivals Template
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="section bg-banner lg:px-0 px-4 !py-[4.375rem]">
          <div className="grid grid-cols-12 gap-x-6 justify-center">
            <div className="lg:col-span-3 col-span-1 text-center"></div>
            <div className="lg:col-span-6 col-span-10 text-center">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">
                  &#128073; Download our free mobile apps today
                </h3>
              </div>
              <h6 className="mb-4 opacity-90 text-white">
                Labore no sed ipsum ipsum nonumy. Sit ipsum sanctus ea
                magna est. Kasd diam rebum sit ipsum ipsum erat et kasd.Est amet sit vero sanctus labore no
                sed ipsum ipsum nonumy vero sanctus labore..
              </h6>
              <div className="btn-list">
                <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                  <Image 
                    src="../../../assets/images/media/apps/play-store.png" 
                    alt="Google Play" 
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  Google Play
                </Link>
                <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                  <Image 
                    src="../../../assets/images/media/apps/apple-store.png" 
                    alt="App Store" 
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  App Store
                </Link>
              </div>
            </div>
            <div className="lg:col-span-3 col-span-1 text-center"></div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default AdminNewOfferTagsPage;