"use client";

import { Fragment, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

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

interface CountryWithShipping {
  id: string;
  name: string;
  code: string;
  hasShippingRate: boolean;
  shippingRate?: ShippingRate | null;
}

interface DefaultShippingSettings {
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  returnPolicy: string;
}

export default function SellerStoreShippingPage() {
  const params = useParams();
  const router = useRouter();
  const storeUrl = params.storeUrl as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countries, setCountries] = useState<CountryWithShipping[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [defaultSettings, setDefaultSettings] = useState<DefaultShippingSettings>({
    defaultShippingService: 'Standard Shipping',
    defaultShippingFeePerItem: 0,
    defaultShippingFeeForAdditionalItem: 0,
    defaultShippingFeePerKg: 0,
    defaultShippingFeeFixed: 0,
    defaultDeliveryTimeMin: 7,
    defaultDeliveryTimeMax: 31,
    returnPolicy: 'Return in 30 days.'
  });

  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkData, setBulkData] = useState<Record<string, any>>({});

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch countries with shipping rates
      const countriesRes = await fetch(`/api/oneshop/seller/stores/${storeUrl}/shipping/countries?limit=100`);
      if (countriesRes.ok) {
        const countriesData = await countriesRes.json();
        setCountries(countriesData);
        
        // Extract existing shipping rates
        const existingRates = countriesData
          .filter((c: CountryWithShipping) => c.hasShippingRate && c.shippingRate)
          .map((c: CountryWithShipping) => c.shippingRate);
        setShippingRates(existingRates);
      }

      // Fetch default shipping settings
      const defaultRes = await fetch(`/api/oneshop/seller/stores/${storeUrl}/shipping/default`);
      if (defaultRes.ok) {
        const defaultData = await defaultRes.json();
        setDefaultSettings(defaultData);
      }

    } catch (error) {
      toast.error('Failed to load shipping data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeUrl) {
      fetchData();
    }
  }, [storeUrl]);

  const handleDefaultSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDefaultSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBulkDataChange = (countryId: string, field: string, value: string) => {
    setBulkData(prev => ({
      ...prev,
      [countryId]: {
        ...prev[countryId],
        [field]: value
      }
    }));
  };

  const handleSaveDefaultSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/shipping/default`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultSettings),
      });

      if (response.ok) {
        toast.success('Default shipping settings updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSave = async () => {
    setSaving(true);
    try {
      // Prepare rates data
      const rates = Object.entries(bulkData).map(([countryId, data]) => ({
        countryId,
        ...data,
        // Use default values if not specified
        shippingService: data.shippingService || defaultSettings.defaultShippingService,
        returnPolicy: data.returnPolicy || defaultSettings.returnPolicy,
        shippingFeePerItem: data.shippingFeePerItem || defaultSettings.defaultShippingFeePerItem,
        shippingFeeForAdditionalItem: data.shippingFeeForAdditionalItem || defaultSettings.defaultShippingFeeForAdditionalItem,
        shippingFeePerKg: data.shippingFeePerKg || defaultSettings.defaultShippingFeePerKg,
        shippingFeeFixed: data.shippingFeeFixed || defaultSettings.defaultShippingFeeFixed,
        deliveryTimeMin: data.deliveryTimeMin || defaultSettings.defaultDeliveryTimeMin,
        deliveryTimeMax: data.deliveryTimeMax || defaultSettings.defaultDeliveryTimeMax,
      }));

      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/shipping/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rates }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setBulkEditMode(false);
        setBulkData({});
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save shipping rates');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditShipping = (rateId: string) => {
    router.push(`/seller/stores/${storeUrl}/shipping/${rateId}`);
  };

  const handleDeleteShipping = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this shipping rate?')) return;

    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/shipping/${rateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Shipping rate deleted successfully!');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete shipping rate');
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

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb*/}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title="Shipping Management" />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Dashboard', 'Shop', 'Seller', 'Stores', storeUrl, 'Shipping']} 
              currentpage="Shipping Management" 
            />
          </div>
        </div>
        {/* End:: Breadcrumb*/}

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                {/* Shipping Settings Navigation */}
                <div className="box mb-6">
                  <div className="box-body">
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        href={`/seller/stores/${storeUrl}/settings`}
                        className="ti-btn ti-btn-outline"
                      >
                        Store Settings
                      </Link>
                      <Link 
                        href={`/seller/stores/${storeUrl}/shipping`}
                        className="ti-btn ti-btn-primary"
                      >
                        Shipping Rates
                      </Link>
                      <Link 
                        href={`/seller/stores/${storeUrl}/products`}
                        className="ti-btn ti-btn-outline"
                      >
                        Products
                      </Link>
                      <Link 
                        href={`/seller/stores/${storeUrl}/orders`}
                        className="ti-btn ti-btn-outline"
                      >
                        Orders
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Default Shipping Settings */}
                <div className="box mb-6">
                  <div className="box-header">
                    <div className="box-title">Default Shipping Settings</div>
                    <div className="text-sm text-textmuted dark:text-textmuted/50">
                      These settings will be used as defaults when creating new shipping rates
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="xl:col-span-6 col-span-12">
                        <label htmlFor="defaultShippingService" className="ti-form-label">Default Shipping Service</label>
                        <input
                          type="text"
                          id="defaultShippingService"
                          name="defaultShippingService"
                          value={defaultSettings.defaultShippingService}
                          onChange={handleDefaultSettingsChange}
                          className="form-control"
                          placeholder="e.g., Standard Shipping"
                        />
                      </div>
                      <div className="xl:col-span-6 col-span-12">
                        <label htmlFor="returnPolicy" className="ti-form-label">Default Return Policy</label>
                        <input
                          type="text"
                          id="returnPolicy"
                          name="returnPolicy"
                          value={defaultSettings.returnPolicy}
                          onChange={handleDefaultSettingsChange}
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
                          value={defaultSettings.defaultShippingFeePerItem}
                          onChange={handleDefaultSettingsChange}
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
                          value={defaultSettings.defaultShippingFeeForAdditionalItem}
                          onChange={handleDefaultSettingsChange}
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
                          value={defaultSettings.defaultDeliveryTimeMin}
                          onChange={handleDefaultSettingsChange}
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
                          value={defaultSettings.defaultDeliveryTimeMax}
                          onChange={handleDefaultSettingsChange}
                          className="form-control"
                          placeholder="31"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSaveDefaultSettings}
                        disabled={saving}
                        className="ti-btn ti-btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save Default Settings'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shipping Rates Management */}
                <div className="box">
                  <div className="box-header flex justify-between items-center">
                    <div>
                      <div className="box-title">Shipping Rates by Country</div>
                      <div className="text-sm text-textmuted dark:text-textmuted/50">
                        Manage shipping rates for different countries
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {!bulkEditMode ? (
                        <>
                          <button
                            onClick={() => setBulkEditMode(true)}
                            className="ti-btn ti-btn-outline-primary"
                          >
                            <i className="bi bi-pencil-square me-1"></i> Bulk Edit
                          </button>
                          <Link
                            href={`/seller/stores/${storeUrl}/shipping/new`}
                            className="ti-btn ti-btn-primary"
                          >
                            <i className="bi bi-plus-lg me-1"></i> Add New Rate
                          </Link>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setBulkEditMode(false);
                              setBulkData({});
                            }}
                            className="ti-btn ti-btn-outline"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBulkSave}
                            disabled={saving}
                            className="ti-btn ti-btn-primary"
                          >
                            {saving ? 'Saving...' : 'Save All Changes'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="overflow-x-auto">
                      <table className="table min-w-full">
                        <thead>
                          <tr>
                            <th scope="col" className="w-40">Country</th>
                            <th scope="col">Service</th>
                            <th scope="col">Fees</th>
                            <th scope="col">Delivery Time</th>
                            <th scope="col">Status</th>
                            {!bulkEditMode && <th scope="col" className="w-32">Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {countries.map((country) => {
                            const shippingRate = country.shippingRate;
                            const bulkCountryData = bulkData[country.id] || {};

                            return (
                              <tr key={country.id}>
                                <td>
                                  <div className="font-medium">{country.name}</div>
                                  <div className="text-sm text-textmuted dark:text-textmuted/50">
                                    {country.code}
                                  </div>
                                </td>
                                
                                {/* Shipping Service */}
                                <td>
                                  {bulkEditMode ? (
                                    <input
                                      type="text"
                                      value={bulkCountryData.shippingService || shippingRate?.shippingService || defaultSettings.defaultShippingService}
                                      onChange={(e) => handleBulkDataChange(country.id, 'shippingService', e.target.value)}
                                      className="form-control form-control-sm"
                                      placeholder="Service name"
                                    />
                                  ) : (
                                    <div>{shippingRate?.shippingService || 'Not set'}</div>
                                  )}
                                </td>

                                {/* Fees */}
                                <td>
                                  {bulkEditMode ? (
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-xs text-textmuted dark:text-textmuted/50">Per Item:</label>
                                        <input
                                          type="number"
                                          value={bulkCountryData.shippingFeePerItem || shippingRate?.shippingFeePerItem || defaultSettings.defaultShippingFeePerItem}
                                          onChange={(e) => handleBulkDataChange(country.id, 'shippingFeePerItem', e.target.value)}
                                          className="form-control form-control-sm"
                                          placeholder="0.00"
                                          step="0.01"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-textmuted dark:text-textmuted/50">Additional:</label>
                                        <input
                                          type="number"
                                          value={bulkCountryData.shippingFeeForAdditionalItem || shippingRate?.shippingFeeForAdditionalItem || defaultSettings.defaultShippingFeeForAdditionalItem}
                                          onChange={(e) => handleBulkDataChange(country.id, 'shippingFeeForAdditionalItem', e.target.value)}
                                          className="form-control form-control-sm"
                                          placeholder="0.00"
                                          step="0.01"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-sm">
                                        Per item: ${(shippingRate?.shippingFeePerItem || 0).toFixed(2)}
                                      </div>
                                      <div className="text-sm">
                                        Additional: ${(shippingRate?.shippingFeeForAdditionalItem || 0).toFixed(2)}
                                      </div>
                                      {shippingRate?.shippingFeePerKg > 0 && (
                                        <div className="text-sm">
                                          Per kg: ${shippingRate.shippingFeePerKg.toFixed(2)}
                                        </div>
                                      )}
                                      {shippingRate?.shippingFeeFixed > 0 && (
                                        <div className="text-sm">
                                          Fixed: ${shippingRate.shippingFeeFixed.toFixed(2)}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* Delivery Time */}
                                <td>
                                  {bulkEditMode ? (
                                    <div className="flex gap-2">
                                      <div>
                                        <label className="text-xs text-textmuted dark:text-textmuted/50">Min:</label>
                                        <input
                                          type="number"
                                          value={bulkCountryData.deliveryTimeMin || shippingRate?.deliveryTimeMin || defaultSettings.defaultDeliveryTimeMin}
                                          onChange={(e) => handleBulkDataChange(country.id, 'deliveryTimeMin', e.target.value)}
                                          className="form-control form-control-sm w-20"
                                          min="1"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-textmuted dark:text-textmuted/50">Max:</label>
                                        <input
                                          type="number"
                                          value={bulkCountryData.deliveryTimeMax || shippingRate?.deliveryTimeMax || defaultSettings.defaultDeliveryTimeMax}
                                          onChange={(e) => handleBulkDataChange(country.id, 'deliveryTimeMax', e.target.value)}
                                          className="form-control form-control-sm w-20"
                                          min="1"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {shippingRate ? (
                                        `${shippingRate.deliveryTimeMin}-${shippingRate.deliveryTimeMax} days`
                                      ) : (
                                        'Not set'
                                      )}
                                    </div>
                                  )}
                                </td>

                                {/* Status */}
                                <td>
                                  <span className={`badge ${country.hasShippingRate ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                    {country.hasShippingRate ? 'Configured' : 'Not Set'}
                                  </span>
                                </td>

                                {/* Actions */}
                                {!bulkEditMode && (
                                  <td>
                                    <div className="flex gap-2">
                                      {country.hasShippingRate && shippingRate ? (
                                        <>
                                          <button
                                            onClick={() => handleEditShipping(shippingRate.id)}
                                            className="ti-btn ti-btn-outline btn-sm"
                                            title="Edit"
                                          >
                                            <i className="bi bi-pencil"></i>
                                          </button>
                                          <button
                                            onClick={() => handleDeleteShipping(shippingRate.id)}
                                            className="ti-btn ti-btn-outline-danger btn-sm"
                                            title="Delete"
                                          >
                                            <i className="bi bi-trash"></i>
                                          </button>
                                        </>
                                      ) : (
                                        <Link
                                          href={`/seller/stores/${storeUrl}/shipping/new?countryId=${country.id}`}
                                          className="ti-btn ti-btn-outline-primary btn-sm"
                                        >
                                          Add Rate
                                        </Link>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Bulk Edit Instructions */}
                    {bulkEditMode && (
                      <div className="mt-6 p-4 bg-light dark:bg-black/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Bulk Edit Instructions</h4>
                        <ul className="text-sm text-textmuted dark:text-textmuted/50 space-y-1">
                          <li>• Edit values directly in the table cells</li>
                          <li>• Empty fields will use default values when saved</li>
                          <li>• Click "Save All Changes" to apply all modifications</li>
                          <li>• Click "Cancel" to discard changes</li>
                        </ul>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-defaultborder dark:border-defaultborder/10 rounded-lg">
                        <div className="text-sm text-textmuted dark:text-textmuted/50">Total Countries</div>
                        <div className="text-2xl font-semibold">{countries.length}</div>
                      </div>
                      <div className="p-4 border border-defaultborder dark:border-defaultborder/10 rounded-lg">
                        <div className="text-sm text-textmuted dark:text-textmuted/50">Configured Rates</div>
                        <div className="text-2xl font-semibold text-success">
                          {shippingRates.length}
                        </div>
                      </div>
                      <div className="p-4 border border-defaultborder dark:border-defaultborder/10 rounded-lg">
                        <div className="text-sm text-textmuted dark:text-textmuted/50">Remaining</div>
                        <div className="text-2xl font-semibold text-warning">
                          {countries.length - shippingRates.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title">Quick Actions</div>
                  </div>
                  <div className="box-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => {
                          // Apply default settings to all unconfigured countries
                          const unconfiguredCountries = countries.filter(c => !c.hasShippingRate);
                          const newBulkData: Record<string, any> = {};
                          
                          unconfiguredCountries.forEach(country => {
                            newBulkData[country.id] = {
                              shippingService: defaultSettings.defaultShippingService,
                              shippingFeePerItem: defaultSettings.defaultShippingFeePerItem,
                              shippingFeeForAdditionalItem: defaultSettings.defaultShippingFeeForAdditionalItem,
                              deliveryTimeMin: defaultSettings.defaultDeliveryTimeMin,
                              deliveryTimeMax: defaultSettings.defaultDeliveryTimeMax,
                              returnPolicy: defaultSettings.returnPolicy
                            };
                          });

                          setBulkData(newBulkData);
                          setBulkEditMode(true);
                          toast.info('Default settings applied to all unconfigured countries. Review and save.');
                        }}
                        className="ti-btn ti-btn-outline-primary w-full justify-center"
                      >
                        <i className="bi bi-lightning me-2"></i>
                        Apply Defaults to All
                      </button>
                      
                      <button
                        onClick={() => {
                          // Clear all shipping rates confirmation
                          if (confirm('Are you sure you want to clear all shipping rates? This cannot be undone.')) {
                            // This would need an API endpoint to clear all rates
                            toast.info('Feature coming soon');
                          }
                        }}
                        className="ti-btn ti-btn-outline-danger w-full justify-center"
                      >
                        <i className="bi bi-trash me-2"></i>
                        Clear All Rates
                      </button>
                      
                      <Link
                        href={`/seller/stores/${storeUrl}/shipping/export`}
                        className="ti-btn ti-btn-outline w-full justify-center"
                      >
                        <i className="bi bi-download me-2"></i>
                        Export Rates
                      </Link>
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