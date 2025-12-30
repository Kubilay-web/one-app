"use client";

import dynamic from 'next/dynamic';
import { Fragment, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

const SpkSelect = dynamic(() => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'), { 
  ssr: false,
  loading: () => <div className="ti-form-select">Loading...</div>
});

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

interface Store {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  status: string;
  averageRating: number;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  createdAt: string;
  products: Product[];
  shippingRates: ShippingRate[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sales: number;
}

interface ShippingRate {
  id: string;
  shippingService: string;
  shippingFeePerItem: number;
  shippingFeeForAdditionalItem: number;
  shippingFeePerKg: number;
  shippingFeeFixed: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
}

interface Country {
  id: string;
  name: string;
  code: string;
}

export default function SellerStoreSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const storeUrl = params.storeUrl as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    url: '',
    logo: '',
    cover: '',
    returnPolicy: '',
    defaultShippingService: '',
    defaultShippingFeePerItem: '',
    defaultShippingFeeForAdditionalItem: '',
    defaultShippingFeePerKg: '',
    defaultShippingFeeFixed: '',
    defaultDeliveryTimeMin: '',
    defaultDeliveryTimeMax: '',
  });

  // Shipping rate form
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [editingShippingRate, setEditingShippingRate] = useState<ShippingRate | null>(null);
  const [shippingForm, setShippingForm] = useState({
    shippingService: '',
    countryId: '',
    countryName: '',
    shippingFeePerItem: '',
    shippingFeeForAdditionalItem: '',
    shippingFeePerKg: '',
    shippingFeeFixed: '',
    deliveryTimeMin: '',
    deliveryTimeMax: '',
    returnPolicy: '',
  });

  // Fetch store data
  const fetchStore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/settings`);
      if (!response.ok) {
        throw new Error('Store not found');
      }
      const data = await response.json();
      setStore(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        email: data.email || '',
        phone: data.phone || '',
        url: data.url || storeUrl,
        logo: data.logo || '',
        cover: data.cover || '',
        returnPolicy: data.returnPolicy || '',
        defaultShippingService: data.defaultShippingService || '',
        defaultShippingFeePerItem: data.defaultShippingFeePerItem?.toString() || '',
        defaultShippingFeeForAdditionalItem: data.defaultShippingFeeForAdditionalItem?.toString() || '',
        defaultShippingFeePerKg: data.defaultShippingFeePerKg?.toString() || '',
        defaultShippingFeeFixed: data.defaultShippingFeeFixed?.toString() || '',
        defaultDeliveryTimeMin: data.defaultDeliveryTimeMin?.toString() || '',
        defaultDeliveryTimeMax: data.defaultDeliveryTimeMax?.toString() || '',
      });
    } catch (error) {
      toast.error('Failed to load store data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries
  const fetchCountries = async (search = '') => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/countries?search=${search}`);
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    if (storeUrl) {
      fetchStore();
      fetchCountries();
    }
  }, [storeUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedStore = await response.json();
        setStore(updatedStore);
        // URL değiştiyse yönlendir
        if (updatedStore.url !== storeUrl) {
          router.push(`/seller/stores/${updatedStore.url}/settings`);
        } else {
          toast.success('Store updated successfully!');
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update store');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingShippingRate 
        ? `/api/seller/store/${storeUrl}/shipping/${editingShippingRate.id}`
        : `/api/seller/store/${storeUrl}/shipping`;
      
      const method = editingShippingRate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingForm),
      });

      if (response.ok) {
        const shippingRate = await response.json();
        
        if (store) {
          if (editingShippingRate) {
            setStore(prev => ({
              ...prev!,
              shippingRates: prev!.shippingRates.map(rate => 
                rate.id === shippingRate.id ? shippingRate : rate
              )
            }));
          } else {
            setStore(prev => ({
              ...prev!,
              shippingRates: [...prev!.shippingRates, shippingRate]
            }));
          }
        }
        
        setShowShippingForm(false);
        setEditingShippingRate(null);
        setShippingForm({
          shippingService: '',
          countryId: '',
          countryName: '',
          shippingFeePerItem: '',
          shippingFeeForAdditionalItem: '',
          shippingFeePerKg: '',
          shippingFeeFixed: '',
          deliveryTimeMin: '',
          deliveryTimeMax: '',
          returnPolicy: '',
        });
        toast.success(`Shipping rate ${editingShippingRate ? 'updated' : 'added'} successfully!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save shipping rate');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleEditShipping = (rate: ShippingRate) => {
    setEditingShippingRate(rate);
    setShippingForm({
      shippingService: rate.shippingService,
      countryId: rate.country.id,
      countryName: rate.country.name,
      shippingFeePerItem: rate.shippingFeePerItem.toString(),
      shippingFeeForAdditionalItem: rate.shippingFeeForAdditionalItem.toString(),
      shippingFeePerKg: rate.shippingFeePerKg.toString(),
      shippingFeeFixed: rate.shippingFeeFixed.toString(),
      deliveryTimeMin: rate.deliveryTimeMin.toString(),
      deliveryTimeMax: rate.deliveryTimeMax.toString(),
      returnPolicy: rate.returnPolicy,
    });
    setShowShippingForm(true);
  };

  const handleDeleteShipping = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this shipping rate?')) return;

    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/settings/shipping/${rateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStore(prev => ({
          ...prev!,
          shippingRates: prev!.shippingRates.filter(rate => rate.id !== rateId)
        }));
        toast.success('Shipping rate deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete shipping rate');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleDeleteStore = async () => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/settings`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Store deleted successfully!');
        router.push('/seller/stores');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete store');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Store not found</h2>
        <Link href="/seller/stores" className="ti-btn ti-btn-primary">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb*/}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={`${store.name} - Settings`} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Dashboard', 'Shop', 'Seller', 'Stores', store.name]} 
              currentpage="Settings" 
            />
          </div>
        </div>
        {/* End:: Breadcrumb*/}

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-3 lg:col-span-4 col-span-12">
                {/* Store Info Sidebar */}
                <div className="box sticky top-4">
                  <div className="box-body">
                    <div className="text-center mb-4">
                      <div className="avatar avatar-xxl mx-auto mb-3">
                        <Image
                          src={store.logo || '/assets/images/default-store-logo.png'}
                          alt={store.name}
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{store.name}</h3>
                      <p className="text-textmuted dark:text-textmuted/50">{store.email}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-warning">
                          {'★'.repeat(Math.floor(store.averageRating))}
                          {'☆'.repeat(5 - Math.floor(store.averageRating))}
                        </span>
                        <span>({store.averageRating.toFixed(1)})</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-textmuted dark:text-textmuted/50">Status:</span>
                        <span className={`ms-2 badge ${store.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          {store.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-textmuted dark:text-textmuted/50">URL:</span>
                        <span className="ms-2">/{store.url}</span>
                      </div>
                      <div>
                        <span className="text-textmuted dark:text-textmuted/50">Phone:</span>
                        <span className="ms-2">{store.phone}</span>
                      </div>
                      <div>
                        <span className="text-textmuted dark:text-textmuted/50">Created:</span>
                        <span className="ms-2">{new Date(store.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Link 
                        href={`/seller/stores/${store.url}/products`}
                        className="ti-btn ti-btn-outline w-full justify-center"
                      >
                        Manage Products
                      </Link>
                      <Link 
                        href={`/seller/stores/${store.url}/orders`}
                        className="ti-btn ti-btn-outline w-full justify-center"
                      >
                        View Orders
                      </Link>
                      <Link 
                        href={`/store/${store.url}`}
                        target="_blank"
                        className="ti-btn ti-btn-primary w-full justify-center"
                      >
                        View Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-9 lg:col-span-8 col-span-12">
                {/* Store Settings Form */}
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Store Settings</div>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="name" className="ti-form-label">Store Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter store name"
                            required
                          />
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="url" className="ti-form-label">Store URL *</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-s-md border border-e-0 border-defaultborder bg-light dark:bg-black/20 text-textmuted dark:text-textmuted/50">
                              /
                            </span>
                            <input
                              type="text"
                              id="url"
                              name="url"
                              value={formData.url}
                              onChange={handleInputChange}
                              className="form-control rounded-s-none"
                              placeholder="store-url"
                              required
                              pattern="[a-z0-9-]+"
                              title="Only lowercase letters, numbers, and hyphens are allowed"
                            />
                          </div>
                          <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                            Only lowercase letters, numbers, and hyphens are allowed
                          </p>
                        </div>
                        <div className="xl:col-span-6 col-span-12">
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
                        </div>
                        <div className="xl:col-span-6 col-span-12">
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
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="logo" className="ti-form-label">Logo URL</label>
                          <input
                            type="url"
                            id="logo"
                            name="logo"
                            value={formData.logo}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="https://example.com/logo.png"
                          />
                          {formData.logo && (
                            <div className="mt-2">
                              <Image
                                src={formData.logo}
                                alt="Logo preview"
                                width={80}
                                height={80}
                                className="rounded-lg border border-defaultborder"
                              />
                            </div>
                          )}
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                          <label htmlFor="cover" className="ti-form-label">Cover Image URL</label>
                          <input
                            type="url"
                            id="cover"
                            name="cover"
                            value={formData.cover}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="https://example.com/cover.jpg"
                          />
                          {formData.cover && (
                            <div className="mt-2">
                              <Image
                                src={formData.cover}
                                alt="Cover preview"
                                width={160}
                                height={80}
                                className="rounded-lg border border-defaultborder object-cover w-40 h-20"
                              />
                            </div>
                          )}
                        </div>
                        <div className="xl:col-span-12 col-span-12">
                          <label htmlFor="description" className="ti-form-label">Store Description</label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-control"
                            rows={4}
                            placeholder="Describe your store..."
                          />
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-defaultborder dark:border-defaultborder/10">
                        <h4 className="font-semibold mb-4">Default Shipping Settings</h4>
                        <div className="grid grid-cols-12 gap-6">
                          <div className="xl:col-span-6 col-span-12">
                            <label htmlFor="defaultShippingService" className="ti-form-label">Default Shipping Service</label>
                            <input
                              type="text"
                              id="defaultShippingService"
                              name="defaultShippingService"
                              value={formData.defaultShippingService}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g., Standard Shipping"
                            />
                          </div>
                          <div className="xl:col-span-6 col-span-12">
                            <label htmlFor="returnPolicy" className="ti-form-label">Return Policy</label>
                            <input
                              type="text"
                              id="returnPolicy"
                              name="returnPolicy"
                              value={formData.returnPolicy}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g., Return in 30 days"
                            />
                          </div>
                          <div className="xl:col-span-3 col-span-6">
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
                            />
                          </div>
                          <div className="xl:col-span-3 col-span-6">
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
                            />
                          </div>
                          <div className="xl:col-span-3 col-span-6">
                            <label htmlFor="defaultDeliveryTimeMin" className="ti-form-label">Min Delivery Days</label>
                            <input
                              type="number"
                              id="defaultDeliveryTimeMin"
                              name="defaultDeliveryTimeMin"
                              value={formData.defaultDeliveryTimeMin}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="7"
                              min="1"
                            />
                          </div>
                          <div className="xl:col-span-3 col-span-6">
                            <label htmlFor="defaultDeliveryTimeMax" className="ti-form-label">Max Delivery Days</label>
                            <input
                              type="number"
                              id="defaultDeliveryTimeMax"
                              name="defaultDeliveryTimeMax"
                              value={formData.defaultDeliveryTimeMax}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="31"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleDeleteStore}
                          className="ti-btn ti-btn-outline-danger"
                        >
                          Delete Store
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="ti-btn ti-btn-primary"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Shipping Rates Section */}
                <div className="box mt-6">
                  <div className="box-header flex justify-between items-center">
                    <div className="box-title">Shipping Rates</div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowShippingForm(true);
                        setEditingShippingRate(null);
                        setShippingForm({
                          shippingService: '',
                          countryId: '',
                          countryName: '',
                          shippingFeePerItem: '',
                          shippingFeeForAdditionalItem: '',
                          shippingFeePerKg: '',
                          shippingFeeFixed: '',
                          deliveryTimeMin: '',
                          deliveryTimeMax: '',
                          returnPolicy: 'Return in 30 days.',
                        });
                      }}
                      className="ti-btn ti-btn-primary btn-wave"
                    >
                      <i className="bi bi-plus-lg me-1"></i> Add Shipping Rate
                    </button>
                  </div>
                  <div className="box-body">
                    {store.shippingRates.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-textmuted dark:text-textmuted/50">No shipping rates configured yet.</p>
                        <button
                          onClick={() => setShowShippingForm(true)}
                          className="ti-btn ti-btn-primary mt-4"
                        >
                          Add Your First Shipping Rate
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table min-w-full">
                          <thead>
                            <tr>
                              <th scope="col">Country</th>
                              <th scope="col">Service</th>
                              <th scope="col">Fees</th>
                              <th scope="col">Delivery Time</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {store.shippingRates.map((rate) => (
                              <tr key={rate.id}>
                                <td>
                                  <div className="font-medium">{rate.country.name}</div>
                                  <div className="text-sm text-textmuted dark:text-textmuted/50">
                                    {rate.country.code}
                                  </div>
                                </td>
                                <td>{rate.shippingService}</td>
                                <td>
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      Per item: ${rate.shippingFeePerItem.toFixed(2)}
                                    </div>
                                    <div className="text-sm">
                                      Additional: ${rate.shippingFeeForAdditionalItem.toFixed(2)}
                                    </div>
                                    {rate.shippingFeePerKg > 0 && (
                                      <div className="text-sm">
                                        Per kg: ${rate.shippingFeePerKg.toFixed(2)}
                                      </div>
                                    )}
                                    {rate.shippingFeeFixed > 0 && (
                                      <div className="text-sm">
                                        Fixed: ${rate.shippingFeeFixed.toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {rate.deliveryTimeMin}-{rate.deliveryTimeMax} days
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditShipping(rate)}
                                      className="ti-btn ti-btn-outline btn-sm"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteShipping(rate.id)}
                                      className="ti-btn ti-btn-outline-danger btn-sm"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Products */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title">Recent Products</div>
                  </div>
                  <div className="box-body">
                    {store.products.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-textmuted dark:text-textmuted/50">No products added yet.</p>
                        <Link 
                          href={`/seller/stores/${store.url}/products/new`}
                          className="ti-btn ti-btn-primary mt-4"
                        >
                          Add Your First Product
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {store.products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-3 border border-defaultborder dark:border-defaultborder/10 rounded-lg">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-textmuted dark:text-textmuted/50">
                                Sales: {product.sales} | URL: /{product.slug}
                              </p>
                            </div>
                            <Link 
                              href={`/seller/stores/${store.url}/products/${product.id}`}
                              className="ti-btn ti-btn-outline btn-sm"
                            >
                              Edit
                            </Link>
                          </div>
                        ))}
                        <div className="text-center">
                          <Link 
                            href={`/seller/stores/${store.url}/products`}
                            className="ti-btn ti-btn-outline"
                          >
                            View All Products
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Shipping Rate Modal */}
      {showShippingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-bodybg rounded-lg w-full max-w-lg">
            <div className="box">
              <div className="box-header flex justify-between items-center">
                <div className="box-title">
                  {editingShippingRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
                </div>
                <button
                  onClick={() => {
                    setShowShippingForm(false);
                    setEditingShippingRate(null);
                  }}
                  className="ti-btn ti-btn-outline btn-sm"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="box-body">
                <form onSubmit={handleShippingSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="ti-form-label">Shipping Service *</label>
                      <input
                        type="text"
                        name="shippingService"
                        value={shippingForm.shippingService}
                        onChange={handleShippingInputChange}
                        className="form-control"
                        placeholder="e.g., Express Shipping"
                        required
                      />
                    </div>
                    <div>
                      <label className="ti-form-label">Country *</label>
                      <select
                        name="countryId"
                        value={shippingForm.countryId}
                        onChange={(e) => {
                          const selectedCountry = countries.find(c => c.id === e.target.value);
                          setShippingForm(prev => ({
                            ...prev,
                            countryId: e.target.value,
                            countryName: selectedCountry?.name || ''
                          }));
                        }}
                        className="form-control"
                        required
                      >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                        Can't find your country? Contact support to add it.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="ti-form-label">Fee Per Item ($) *</label>
                        <input
                          type="number"
                          name="shippingFeePerItem"
                          value={shippingForm.shippingFeePerItem}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">Additional Item Fee ($)</label>
                        <input
                          type="number"
                          name="shippingFeeForAdditionalItem"
                          value={shippingForm.shippingFeeForAdditionalItem}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="ti-form-label">Fee Per Kg ($)</label>
                        <input
                          type="number"
                          name="shippingFeePerKg"
                          value={shippingForm.shippingFeePerKg}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">Fixed Fee ($)</label>
                        <input
                          type="number"
                          name="shippingFeeFixed"
                          value={shippingForm.shippingFeeFixed}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="ti-form-label">Min Delivery Days *</label>
                        <input
                          type="number"
                          name="deliveryTimeMin"
                          value={shippingForm.deliveryTimeMin}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="7"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">Max Delivery Days *</label>
                        <input
                          type="number"
                          name="deliveryTimeMax"
                          value={shippingForm.deliveryTimeMax}
                          onChange={handleShippingInputChange}
                          className="form-control"
                          placeholder="31"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="ti-form-label">Return Policy *</label>
                      <textarea
                        name="returnPolicy"
                        value={shippingForm.returnPolicy}
                        onChange={handleShippingInputChange}
                        className="form-control"
                        rows={3}
                        placeholder="Return policy for this shipping method"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowShippingForm(false);
                        setEditingShippingRate(null);
                      }}
                      className="ti-btn ti-btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ti-btn ti-btn-primary"
                    >
                      {editingShippingRate ? 'Update' : 'Add'} Shipping Rate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}