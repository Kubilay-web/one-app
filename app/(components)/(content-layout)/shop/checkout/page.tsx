"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/oneshopstore/cartstore/cartstore";
import { useCheckoutStore } from "@/app/oneshopstore/cartstore/checkoutstore";
import { useToast } from "@/app/projects/components/ui/use-toast";
import { Truck, User, CreditCard, CheckCircle, Plus, Edit2, Trash2, MapPin, Package, Shield } from "lucide-react";

const Checkout = () => {
  const { toast } = useToast();
  
  // Cart store
  const {
    cart,
    items,
    isLoading: cartLoading,
    fetchCart,
    getSubTotal,
    getTotal,
    getShippingFees,
    getItemCount,
    getStoreGroupedItems,
  } = useCartStore();

  // Checkout store
  const {
    step,
    shippingAddresses,
    selectedAddressId,
    paymentMethod,
    shippingMethod,
    note,
    countries,
    isLoading: checkoutLoading,
    error,
    
    setStep,
    nextStep,
    prevStep,
    fetchShippingAddresses,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    setSelectedAddress,
    fetchCountries,
    setPaymentMethod,
    setShippingMethod,
    setNote,
    placeOrder,
    resetCheckout,
  } = useCheckoutStore();

  // New address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<null | any>(null);
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    state: '',
    city: '',
    zip_code: '',
    countryId: '',
    default: false,
  });

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [cardSaved, setCardSaved] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchCart();
    fetchShippingAddresses();
    fetchCountries();
  }, [fetchCart, fetchShippingAddresses, fetchCountries]);

  // Calculate totals
  const subTotal = getSubTotal();
  const total = getTotal();
  const shippingFees = getShippingFees();
  const itemCount = getItemCount();
  const storeGroupedItems = getStoreGroupedItems();

  const discountAmount = cart?.coupon ? (cart.coupon.discount / 100) * subTotal : 0;

  // Handle address form
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        await updateShippingAddress(editingAddress.id, addressForm);
        toast({
          title: "Address updated",
          description: "Shipping address has been updated.",
        });
      } else {
        await addShippingAddress(addressForm);
        toast({
          title: "Address added",
          description: "New shipping address has been added.",
        });
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        firstName: '',
        lastName: '',
        phone: '',
        address1: '',
        address2: '',
        state: '',
        city: '',
        zip_code: '',
        countryId: '',
        default: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || '',
      state: address.state,
      city: address.city,
      zip_code: address.zip_code,
      countryId: address.countryId,
      default: address.default,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      await deleteShippingAddress(id);
      toast({
        title: "Address deleted",
        description: "Shipping address has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive",
      });
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a shipping address.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    const result = await placeOrder();
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to place order.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (cartLoading || checkoutLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">
            Add some items to your cart before checkout.
          </p>
          <Link
            href="/cart"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-gray-500">
          {itemCount} item{itemCount !== 1 ? "s" : ""} in your order
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${step >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`
                  h-1 w-16 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={step === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Shipping
          </span>
          <span className={step === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Personal Details
          </span>
          <span className={step === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Payment
          </span>
          <span className={step === 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Confirmation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Content */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                <p className="text-gray-500">Select or add a shipping address</p>
              </div>
              
              <div className="p-6">
                {/* Address List */}
                <div className="space-y-4 mb-6">
                  {shippingAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`
                        p-4 border rounded-lg cursor-pointer transition-all
                        ${selectedAddressId === address.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">
                              {address.firstName} {address.lastName}
                            </p>
                            {address.default && (
                              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {address.address1}
                            {address.address2 && `, ${address.address2}`}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {address.city}, {address.state} {address.zip_code}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {address.country?.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            Phone: {address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!address.default && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Button */}
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>Add New Address</span>
                    </div>
                  </button>
                )}

                {/* Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.firstName}
                          onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.lastName}
                          onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.countryId}
                          onChange={(e) => setAddressForm({...addressForm, countryId: e.target.value})}
                        >
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address Line 1</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.address1}
                          onChange={(e) => setAddressForm({...addressForm, address1: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.address2}
                          onChange={(e) => setAddressForm({...addressForm, address2: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.zip_code}
                          onChange={(e) => setAddressForm({...addressForm, zip_code: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center">
                        <input
                          type="checkbox"
                          id="defaultAddress"
                          className="mr-2"
                          checked={addressForm.default}
                          onChange={(e) => setAddressForm({...addressForm, default: e.target.checked})}
                        />
                        <label htmlFor="defaultAddress" className="text-sm">
                          Set as default shipping address
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                          setAddressForm({
                            firstName: '',
                            lastName: '',
                            phone: '',
                            address1: '',
                            address2: '',
                            state: '',
                            city: '',
                            zip_code: '',
                            countryId: '',
                            default: false,
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Shipping Method */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Shipping Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => setShippingMethod('standard')}
                      className={`
                        p-4 border rounded-lg text-left transition-all
                        ${shippingMethod === 'standard'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-sm text-gray-500">5-7 business days</p>
                        </div>
                        <p className="font-semibold">${shippingFees.toFixed(2)}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setShippingMethod('express')}
                      className={`
                        p-4 border rounded-lg text-left transition-all
                        ${shippingMethod === 'express'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Express Delivery</p>
                          <p className="text-sm text-gray-500">2-3 business days</p>
                        </div>
                        <p className="font-semibold">${(shippingFees * 1.5).toFixed(2)}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={!selectedAddressId}
                >
                  Continue to Personal Details
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Personal Details</h2>
                </div>
                <p className="text-gray-500">Complete your personal information</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Order Note (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                      rows={3}
                      placeholder="Any special instructions for your order..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-6">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Selected Address: {shippingAddresses.find(a => a.id === selectedAddressId)?.address1}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Shipping
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  Continue to Payment
                  <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <p className="text-gray-500">Choose your preferred payment method</p>
              </div>
              
              <div className="p-6">
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`
                      w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
                      ${paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Image
                        src="/images/payment/visa.png"
                        alt="Visa"
                        width={40}
                        height={25}
                        className="object-contain"
                      />
                      <Image
                        src="/images/payment/mastercard.png"
                        alt="Mastercard"
                        width={40}
                        height={25}
                        className="object-contain"
                      />
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`
                      w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
                      ${paymentMethod === 'cod'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`
                      w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
                      ${paymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                        <Image
                          src="/images/payment/upi.png"
                          alt="UPI"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-gray-500">Pay using UPI apps</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Card Details Form */}
                {paymentMethod === 'card' && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Name on Card</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry Date</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="saveCard"
                          checked={cardSaved}
                          onChange={(e) => setCardSaved(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="saveCard" className="text-sm">
                          Save card for future purchases
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <p className="font-medium">Secure Payment</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your payment information is encrypted and secure. We don't store your card details.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back to Personal Details
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  disabled={!paymentMethod}
                >
                  Place Order
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed! 🎉</h2>
                <p className="text-gray-500 mb-6">
                  Thank you for your order. We've sent a confirmation email with your order details.
                </p>
                
                <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-mono font-bold">#SPK-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium">
                      {new Date(Date.now() + (shippingMethod === 'express' ? 3 : 7) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">
                      {paymentMethod === 'card' ? 'Credit Card' : 
                       paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}
                    </span>
                  </div>
                </div>

                <div className="space-x-4">
                  <Link
                    href="/orders"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Order Status
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="sticky top-8 space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <p className="text-sm text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              </div>
              
              <div className="p-4">
                {/* Order Items */}
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {Object.values(storeGroupedItems).flat().map((item, index) => (
                    <div key={item.id || index} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} × {item.quantity}</p>
                        <p className="text-sm font-semibold">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subTotal.toFixed(2)}</span>
                  </div>
                  
                  {cart?.coupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({cart.coupon.discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${shippingMethod === 'express' 
                      ? (shippingFees * 1.5).toFixed(2) 
                      : shippingFees.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span>${(subTotal * 0.18).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code */}
                {cart?.coupon && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800 dark:text-green-400">
                        Coupon Applied
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 rounded">
                        {cart.coupon.code}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Shop with Confidence</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure SSL Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>30-Day Return Policy</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Shipping Over $50</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>24/7 Customer Support</span>
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
                Have questions about your order? We're here to help.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;