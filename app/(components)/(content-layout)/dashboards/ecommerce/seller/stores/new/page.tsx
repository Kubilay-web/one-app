"use client";

import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

interface FormData {
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFeePerItem: string;
  defaultShippingFeeForAdditionalItem: string;
  defaultShippingFeePerKg: string;
  defaultShippingFeeFixed: string;
  defaultDeliveryTimeMin: string;
  defaultDeliveryTimeMax: string;
}

interface ValidationResult {
  available: boolean;
  message: string;
}

export default function SellerNewStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    email: '',
    phone: '',
    url: '',
    logo: '/assets/images/default-store-logo.png',
    cover: '/assets/images/default-store-cover.jpg',
    returnPolicy: 'Return in 30 days.',
    defaultShippingService: 'Standard Shipping',
    defaultShippingFeePerItem: '0',
    defaultShippingFeeForAdditionalItem: '0',
    defaultShippingFeePerKg: '0',
    defaultShippingFeeFixed: '0',
    defaultDeliveryTimeMin: '7',
    defaultDeliveryTimeMax: '31',
  });

  // Validation states
  const [urlValidating, setUrlValidating] = useState(false);
  const [emailValidating, setEmailValidating] = useState(false);
  const [urlValidation, setUrlValidation] = useState<ValidationResult | null>(null);
  const [emailValidation, setEmailValidation] = useState<ValidationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // URL veya email değiştiğinde validation'ı sıfırla
    if (name === 'url') {
      setUrlValidation(null);
    }
    if (name === 'email') {
      setEmailValidation(null);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Step 1 validations
      if (!formData.name.trim()) {
        toast.error('Store name is required');
        return;
      }
      if (!formData.url.trim()) {
        toast.error('Store URL is required');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Email is required');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // URL validation
  const validateUrl = async () => {
    if (!formData.url.trim()) {
      setUrlValidation({
        available: false,
        message: 'URL is required'
      });
      return;
    }

    setUrlValidating(true);
    try {
      const response = await fetch(`/api/oneshop/seller/stores/checkurl?url=${encodeURIComponent(formData.url)}`);
      const data = await response.json();
      setUrlValidation(data);
    } catch (error) {
      console.error('Error validating URL:', error);
      toast.error('Failed to validate URL');
    } finally {
      setUrlValidating(false);
    }
  };

  // Email validation
  const validateEmail = async () => {
    if (!formData.email.trim()) {
      setEmailValidation({
        available: false,
        message: 'Email is required'
      });
      return;
    }

    setEmailValidating(true);
    try {
      const response = await fetch(`/api/oneshop/seller/stores/checkemail?email=${encodeURIComponent(formData.email)}`);
      const data = await response.json();
      setEmailValidation(data);
    } catch (error) {
      console.error('Error validating email:', error);
      toast.error('Failed to validate email');
    } finally {
      setEmailValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Final validations
      if (urlValidation && !urlValidation.available) {
        toast.error(urlValidation.message);
        setLoading(false);
        return;
      }

      if (emailValidation && !emailValidation.available) {
        toast.error(emailValidation.message);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/oneshop/seller/stores/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const store = await response.json();
        toast.success('Store created successfully!');
        router.push(`/seller/stores/${store.url}/settings`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create store');
      }
    } catch (error) {
      toast.error('An error occurred while creating the store');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-validate URL and email when they change (debounced)
  useEffect(() => {
    if (formData.url.trim() && formData.url.length >= 3) {
      const timer = setTimeout(() => {
        validateUrl();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.url]);

  useEffect(() => {
    if (formData.email.trim()) {
      const timer = setTimeout(() => {
        validateEmail();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb*/}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title="Create New Store" />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Dashboard', 'Shop', 'Seller', 'Stores']} 
              currentpage="Create New Store" 
            />
          </div>
        </div>
        {/* End:: Breadcrumb*/}

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12">
                {/* Progress Steps */}
                <div className="box mb-6">
                  <div className="box-header">
                    <div className="box-title">Store Setup</div>
                  </div>
                  <div className="box-body">
                    <div className="space-y-4">
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${step === 1 ? 'bg-primary/10 border border-primary' : 'bg-light dark:bg-black/20'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary text-white' : 'bg-light dark:bg-black/30'}`}>
                          1
                        </div>
                        <div>
                          <div className="font-medium">Basic Information</div>
                          <div className="text-sm text-textmuted dark:text-textmuted/50">Store name, URL, contact</div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${step === 2 ? 'bg-primary/10 border border-primary' : 'bg-light dark:bg-black/20'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light dark:bg-black/30'}`}>
                          2
                        </div>
                        <div>
                          <div className="font-medium">Appearance</div>
                          <div className="text-sm text-textmuted dark:text-textmuted/50">Logo, cover, description</div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 p-3 rounded-lg ${step === 3 ? 'bg-primary/10 border border-primary' : 'bg-light dark:bg-black/20'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-light dark:bg-black/30'}`}>
                          3
                        </div>
                        <div>
                          <div className="font-medium">Shipping Settings</div>
                          <div className="text-sm text-textmuted dark:text-textmuted/50">Default shipping configuration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Tips & Guidelines</div>
                  </div>
                  <div className="box-body">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <i className="bi bi-check-circle text-success mt-0.5"></i>
                        <span>Choose a memorable store name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="bi bi-check-circle text-success mt-0.5"></i>
                        <span>Use a short and clear URL</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="bi bi-check-circle text-success mt-0.5"></i>
                        <span>Add a professional logo and cover</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="bi bi-check-circle text-success mt-0.5"></i>
                        <span>Set realistic shipping times and fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <i className="bi bi-check-circle text-success mt-0.5"></i>
                        <span>You can always update these settings later</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-9 lg:col-span-8 col-span-12">
                {/* Store Creation Form */}
                <div className="box">
                  <form onSubmit={handleSubmit}>
                    <div className="box-header">
                      <div className="box-title">
                        {step === 1 && 'Basic Store Information'}
                        {step === 2 && 'Store Appearance'}
                        {step === 3 && 'Shipping Configuration'}
                      </div>
                      <div className="text-sm text-textmuted dark:text-textmuted/50">
                        Step {step} of 3
                      </div>
                    </div>
                    
                    <div className="box-body">
                      {/* Step 1: Basic Information */}
                      {step === 1 && (
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="name" className="ti-form-label">Store Name *</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g., Fashion Hub"
                              required
                              maxLength={100}
                            />
                            <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                              This will be displayed as your store name to customers
                            </p>
                          </div>

                          <div>
                            <label htmlFor="url" className="ti-form-label">Store URL *</label>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-3 border border-e-0 border-defaultborder bg-light dark:bg-black/20 text-textmuted dark:text-textmuted/50">
                                /
                              </span>
                              <input
                                type="text"
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                className="form-control rounded-s-none flex-1"
                                placeholder="my-store"
                                required
                                pattern="[a-z0-9-]+"
                                title="Only lowercase letters, numbers, and hyphens"
                                maxLength={50}
                              />
                              <button
                                type="button"
                                onClick={validateUrl}
                                disabled={urlValidating || !formData.url.trim()}
                                className="ti-btn ti-btn-outline whitespace-nowrap"
                              >
                                {urlValidating ? 'Checking...' : 'Check Availability'}
                              </button>
                            </div>
                            <div className="mt-2">
                              {urlValidating && (
                                <div className="text-sm text-warning">
                                  <i className="bi bi-hourglass-split me-1"></i>
                                  Checking URL availability...
                                </div>
                              )}
                              {urlValidation && (
                                <div className={`text-sm ${urlValidation.available ? 'text-success' : 'text-danger'}`}>
                                  <i className={`bi ${urlValidation.available ? 'bi-check-circle' : 'bi-exclamation-circle'} me-1`}></i>
                                  {urlValidation.message}
                                </div>
                              )}
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Only lowercase letters, numbers, and hyphens. This will be your store's web address.
                              </p>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="email" className="ti-form-label">Contact Email *</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="contact@store.com"
                              required
                            />
                            <div className="mt-2">
                              {emailValidating && (
                                <div className="text-sm text-warning">
                                  <i className="bi bi-hourglass-split me-1"></i>
                                  Checking email availability...
                                </div>
                              )}
                              {emailValidation && (
                                <div className={`text-sm ${emailValidation.available ? 'text-success' : 'text-danger'}`}>
                                  <i className={`bi ${emailValidation.available ? 'bi-check-circle' : 'bi-exclamation-circle'} me-1`}></i>
                                  {emailValidation.message}
                                </div>
                              )}
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Customers will contact you at this email address
                              </p>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="phone" className="ti-form-label">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="+1 (555) 123-4567"
                            />
                            <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                              Optional. For customer support inquiries
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Appearance */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="logo" className="ti-form-label">Store Logo URL</label>
                              <input
                                type="url"
                                id="logo"
                                name="logo"
                                value={formData.logo}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="https://example.com/logo.png"
                              />
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Recommended size: 300x300 pixels
                              </p>
                              {formData.logo && (
                                <div className="mt-3">
                                  <div className="font-medium text-sm mb-2">Logo Preview:</div>
                                  <div className="avatar avatar-xl bg-gray-300 dark:bg-light rounded-lg">
                                    <Image
                                      src={formData.logo}
                                      alt="Logo preview"
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src = '/assets/images/default-store-logo.png';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label htmlFor="cover" className="ti-form-label">Store Cover URL</label>
                              <input
                                type="url"
                                id="cover"
                                name="cover"
                                value={formData.cover}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="https://example.com/cover.jpg"
                              />
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Recommended size: 1200x400 pixels
                              </p>
                              {formData.cover && (
                                <div className="mt-3">
                                  <div className="font-medium text-sm mb-2">Cover Preview:</div>
                                  <div className="h-32 bg-gray-300 dark:bg-light rounded-lg overflow-hidden">
                                    <Image
                                      src={formData.cover}
                                      alt="Cover preview"
                                      width={200}
                                      height={80}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = '/assets/images/default-store-cover.jpg';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="description" className="ti-form-label">Store Description</label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="form-control"
                              rows={4}
                              placeholder="Describe your store... What do you sell? What makes your store special?"
                              maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-textmuted dark:text-textmuted/50">
                                Tell customers about your store
                              </p>
                              <span className="text-xs text-textmuted dark:text-textmuted/50">
                                {formData.description.length}/500
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Shipping Settings */}
                      {step === 3 && (
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="returnPolicy" className="ti-form-label">Return Policy *</label>
                            <input
                              type="text"
                              id="returnPolicy"
                              name="returnPolicy"
                              value={formData.returnPolicy}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g., Return in 30 days"
                              required
                            />
                            <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                              Your store's default return policy
                            </p>
                          </div>

                          <div>
                            <label htmlFor="defaultShippingService" className="ti-form-label">Default Shipping Service *</label>
                            <input
                              type="text"
                              id="defaultShippingService"
                              name="defaultShippingService"
                              value={formData.defaultShippingService}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g., Standard Shipping"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="defaultShippingFeePerItem" className="ti-form-label">Fee Per Item ($)</label>
                              <input
                                type="number"
                                id="defaultShippingFeePerItem"
                                name="defaultShippingFeePerItem"
                                value={formData.defaultShippingFeePerItem}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            <div>
                              <label htmlFor="defaultShippingFeeForAdditionalItem" className="ti-form-label">Additional Item Fee ($)</label>
                              <input
                                type="number"
                                id="defaultShippingFeeForAdditionalItem"
                                name="defaultShippingFeeForAdditionalItem"
                                value={formData.defaultShippingFeeForAdditionalItem}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            <div>
                              <label htmlFor="defaultShippingFeePerKg" className="ti-form-label">Fee Per Kg ($)</label>
                              <input
                                type="number"
                                id="defaultShippingFeePerKg"
                                name="defaultShippingFeePerKg"
                                value={formData.defaultShippingFeePerKg}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            <div>
                              <label htmlFor="defaultShippingFeeFixed" className="ti-form-label">Fixed Fee ($)</label>
                              <input
                                type="number"
                                id="defaultShippingFeeFixed"
                                name="defaultShippingFeeFixed"
                                value={formData.defaultShippingFeeFixed}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>

                            <div>
                              <label htmlFor="defaultDeliveryTimeMin" className="ti-form-label">Min Delivery Days *</label>
                              <input
                                type="number"
                                id="defaultDeliveryTimeMin"
                                name="defaultDeliveryTimeMin"
                                value={formData.defaultDeliveryTimeMin}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="7"
                                min="1"
                                required
                              />
                            </div>

                            <div>
                              <label htmlFor="defaultDeliveryTimeMax" className="ti-form-label">Max Delivery Days *</label>
                              <input
                                type="number"
                                id="defaultDeliveryTimeMax"
                                name="defaultDeliveryTimeMax"
                                value={formData.defaultDeliveryTimeMax}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="31"
                                min="1"
                                required
                              />
                            </div>
                          </div>

                          <div className="p-4 bg-light dark:bg-black/20 rounded-lg">
                            <div className="font-medium mb-2">Shipping Summary</div>
                            <div className="text-sm space-y-1">
                              <div>Service: {formData.defaultShippingService}</div>
                              <div>Delivery: {formData.defaultDeliveryTimeMin}-{formData.defaultDeliveryTimeMax} days</div>
                              <div>Return Policy: {formData.returnPolicy}</div>
                              {parseFloat(formData.defaultShippingFeePerItem) > 0 && (
                                <div>Per Item: ${parseFloat(formData.defaultShippingFeePerItem).toFixed(2)}</div>
                              )}
                              {parseFloat(formData.defaultShippingFeeForAdditionalItem) > 0 && (
                                <div>Additional Item: ${parseFloat(formData.defaultShippingFeeForAdditionalItem).toFixed(2)}</div>
                              )}
                            </div>
                            <p className="text-xs text-textmuted dark:text-textmuted/50 mt-2">
                              You can customize shipping rates for specific countries after store creation
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Form Navigation */}
                      <div className="mt-8 pt-6 border-t border-defaultborder dark:border-defaultborder/10">
                        <div className="flex justify-between">
                          {step > 1 ? (
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="ti-btn ti-btn-outline"
                            >
                              <i className="bi bi-arrow-left me-2"></i>
                              Previous
                            </button>
                          ) : (
                            <Link
                              href="/seller/stores"
                              className="ti-btn ti-btn-outline"
                            >
                              <i className="bi bi-x-lg me-2"></i>
                              Cancel
                            </Link>
                          )}

                          {step < 3 ? (
                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="ti-btn ti-btn-primary"
                            >
                              Next
                              <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={loading}
                              className="ti-btn ti-btn-primary"
                            >
                              {loading ? (
                                <>
                                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full me-2"></span>
                                  Creating Store...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-lg me-2"></i>
                                  Create Store
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Store Preview */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title">Store Preview</div>
                    <div className="text-sm text-textmuted dark:text-textmuted/50">
                      How your store will appear to customers
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="border border-defaultborder dark:border-defaultborder/10 rounded-lg overflow-hidden">
                      {/* Cover Image */}
                      <div className="h-40 bg-gray-300 dark:bg-light relative">
                        {formData.cover ? (
                          <Image
                            src={formData.cover}
                            alt="Store cover"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/default-store-cover.jpg';
                            }}
                          />
                        ) : null}
                      </div>

                      {/* Store Info */}
                      <div className="p-6 relative">
                        {/* Logo */}
                        <div className="absolute -top-8 left-6">
                          <div className="avatar avatar-xl bg-white dark:bg-bodybg border-4 border-white dark:border-bodybg rounded-lg">
                            {formData.logo ? (
                              <Image
                                src={formData.logo}
                                alt="Store logo"
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = '/assets/images/default-store-logo.png';
                                }}
                              />
                            ) : null}
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="mt-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {formData.name || 'Your Store Name'}
                          </h3>
                          <p className="text-textmuted dark:text-textmuted/50 mb-4">
                            {formData.description || 'Store description will appear here'}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Store URL</div>
                              <div className="text-textmuted dark:text-textmuted/50">
                                /{formData.url || 'your-store-url'}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Contact Email</div>
                              <div className="text-textmuted dark:text-textmuted/50">
                                {formData.email || 'email@store.com'}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Shipping</div>
                              <div className="text-textmuted dark:text-textmuted/50">
                                {formData.defaultDeliveryTimeMin}-{formData.defaultDeliveryTimeMax} days
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
        </section>
      </div>
    </Fragment>
  );
}