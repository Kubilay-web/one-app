// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/app/cart-store/useCartStore";
// import { useCheckoutStore } from "@/app/oneshopstore/cartstore/checkoutstore";
// import { useToast } from "@/app/projects/components/ui/use-toast";
// import {
//   Truck,
//   User,
//   CreditCard,
//   CheckCircle,
//   Plus,
//   Edit2,
//   Trash2,
//   MapPin,
//   Package,
//   Shield,
//   Tag,
//   X,
//   Calendar,
// } from "lucide-react";
// import { CartProductType } from "@/app/lib/types";

// interface StoreGroupedItems {
//   [storeId: string]: CartProductType[];
// }

// const Checkout = () => {
//   const { toast } = useToast();

//   // Cart store
//   const { cart, totalPrice, appliedCoupon, setCart, clearCart, removeCoupon } =
//     useCartStore();

//   console.log("cart", cart);

//   // Checkout store
//   const {
//     step,
//     shippingAddresses,
//     selectedAddressId,
//     paymentMethod,
//     shippingMethod,
//     note,
//     countries,
//     isLoading: checkoutLoading,
//     error,
//     shippingFee,
//     estimatedDeliveryDays,
//     shippingService,
//     calculatedShipping,

//     setStep,
//     nextStep,
//     prevStep,
//     fetchShippingAddresses,
//     addShippingAddress,
//     updateShippingAddress,
//     deleteShippingAddress,
//     setSelectedAddress,
//     fetchCountries,
//     setPaymentMethod,
//     setShippingMethod,
//     setNote,
//     calculateShippingFee,
//     placeOrder,
//     resetCheckout,
//   } = useCheckoutStore();

//   // New address form state
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<null | any>(null);
//   const [addressForm, setAddressForm] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address1: "",
//     address2: "",
//     state: "",
//     city: "",
//     zip_code: "",
//     countryId: "",
//     default: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [shippingCalculated, setShippingCalculated] = useState(false);

//   // Fetch data on mount
//   useEffect(() => {
//     const loadCart = () => {
//       try {
//         setLoading(true);
//         const savedCart = localStorage.getItem("cart");
//         if (savedCart) {
//           const parsedCart: CartProductType[] = JSON.parse(savedCart);
//           setCart(parsedCart);
//         }
//       } catch (error) {
//         console.error("Failed to load cart from localStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCart();
//     fetchShippingAddresses();
//     fetchCountries();
//   }, [setCart, fetchShippingAddresses, fetchCountries]);

//   // Adres veya sepet değiştiğinde shipping fee hesapla

// // Adres veya sepet değiştiğinde shipping fee hesapla
// useEffect(() => {
//   const calculateShipping = async () => {
//     if (selectedAddressId && cart.length > 0) {
//       const selectedAddress = shippingAddresses.find(
//         (addr) => addr.id === selectedAddressId
//       );

//     const storeIds = [...new Set(cart.map(item => item.storeId).filter(Boolean))];

//       if (selectedAddress && selectedAddress.countryId) {
//         // Tüm store'ların item'larını birleştir
//         const allItems = cart.map((item) => ({
//           productId: item.productId,
//           variantId: item.variantId,
//           sizeId: item.sizeId,
//           quantity: item.quantity,
//           price: item.price,
//           storeId: item.storeId || "default-store",
//         }));

//         // API'ye tüm item'ları gönder
//         await calculateShippingFee(
//           allItems,
//           selectedAddress.countryId,
//           storeIds[0]
//         );
//         setShippingCalculated(true);
//       }
//     }
//   };

//   if (selectedAddressId && shippingAddresses.length > 0 && cart.length > 0) {
//     calculateShipping();
//   }
// }, [selectedAddressId, cart, shippingAddresses, calculateShippingFee]);

//   // Helper functions
//   const getSubTotal = () => {
//     return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const getShippingFees = () => {
//     // Hesaplanmış shipping fee varsa onu kullan
//     if (calculatedShipping && shippingFee > 0) {
//       // Express shipping için ekstra ücret
//       return shippingMethod === "express" ? shippingFee + 9.99 : shippingFee;
//     }

//     // Yoksa shipping method'a göre hesapla
//     return shippingMethod === "express" ? 9.99 : 0;
//   };

//   // Total hesaplama
//   const getTotal = () => {
//     const subTotal = getSubTotal();
//     const shippingFees = getShippingFees();
//     let total = subTotal + shippingFees;

//     // Eğer uygulanmış bir kupon varsa, indirimi uygula
//     if (appliedCoupon) {
//       total -= appliedCoupon.discountAmount;
//     }

//     return total > 0 ? total : 0;
//   };

//   const getItemCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const getStoreGroupedItems = (): StoreGroupedItems => {
//     const grouped: StoreGroupedItems = {};

//     cart.forEach((item) => {
//       const storeId = item.storeId || "unknown-store"; // item.storeId'yi kullan
//       if (!grouped[storeId]) {
//         grouped[storeId] = [];
//       }
//       grouped[storeId].push(item);
//     });

//     return grouped;
//   };

//   // Calculate totals
//   const subTotal = getSubTotal();
//   const shippingFees = getShippingFees();
//   const total = getTotal();
//   const itemCount = getItemCount();
//   const storeGroupedItems = getStoreGroupedItems();

//   // Debug için console.log
//   useEffect(() => {
//     console.log("Checkout Debug:");
//     console.log("- Cart items:", cart.length);
//     console.log("- Applied Coupon:", appliedCoupon);
//     console.log("- Subtotal:", subTotal.toFixed(2));
//     console.log("- Shipping Fees:", shippingFees.toFixed(2));
//     console.log("- Calculated Shipping Fee:", shippingFee.toFixed(2));
//     console.log("- Calculated Total:", total.toFixed(2));
//   }, [cart, appliedCoupon, subTotal, shippingFees, shippingFee, total]);

//   // Handle address form
//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (editingAddress) {
//         await updateShippingAddress(editingAddress.id, addressForm);
//         toast({
//           title: "Address updated",
//           description: "Shipping address has been updated.",
//         });
//       } else {
//         await addShippingAddress(addressForm);
//         toast({
//           title: "Address added",
//           description: "New shipping address has been added.",
//         });
//       }

//       setShowAddressForm(false);
//       setEditingAddress(null);
//       setAddressForm({
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         state: "",
//         city: "",
//         zip_code: "",
//         countryId: "",
//         default: false,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save address.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEditAddress = (address: any) => {
//     setEditingAddress(address);
//     setAddressForm({
//       firstName: address.firstName,
//       lastName: address.lastName,
//       phone: address.phone,
//       address1: address.address1,
//       address2: address.address2 || "",
//       state: address.state,
//       city: address.city,
//       zip_code: address.zip_code,
//       countryId: address.countryId,
//       default: address.default,
//     });
//     setShowAddressForm(true);
//   };

//   const handleDeleteAddress = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this address?")) return;

//     try {
//       await deleteShippingAddress(id);
//       toast({
//         title: "Address deleted",
//         description: "Shipping address has been deleted.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete address.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle address selection with shipping calculation
//   const handleAddressSelect = (addressId: string) => {
//     setSelectedAddress(addressId);
//   };

//   // Kupon kaldırma fonksiyonu
//   const handleRemoveCouponClick = async () => {
//     if (!appliedCoupon) return;

//     if (!confirm("Are you sure you want to remove this coupon?")) return;

//     try {
//       // API'ye kupon kaldırma isteği gönder
//       const response = await fetch("/api/oneshop/coupon/remove", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           couponId: appliedCoupon.couponId,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Failed to remove coupon");
//       }

//       // Store'dan kuponu kaldır
//       removeCoupon();

//       toast({
//         title: "Coupon removed",
//         description: "Coupon has been removed from your order.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to remove coupon.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle order placement
//   const handlePlaceOrder = async () => {
//     if (!selectedAddressId) {
//       toast({
//         title: "Error",
//         description: "Please select a shipping address.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!paymentMethod) {
//       toast({
//         title: "Error",
//         description: "Please select a payment method.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (cart.length === 0) {
//       toast({
//         title: "Error",
//         description: "Your cart is empty. Please add items to your cart.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const result = await placeOrder();

//       if (result.success) {
//         if (
//           result.paymentUrl &&
//           (paymentMethod === "card" || paymentMethod === "paypal")
//         ) {
//           // Stripe veya PayPal Checkout'e yönlendir
//           window.location.href = result.paymentUrl;
//         } else {
//           toast({
//             title: "Order Placed!",
//             description: "Your order has been placed successfully.",
//           });

//           // Clear cart on successful order
//           clearCart();

//           // Move to confirmation step for COD/UPI
//           if (paymentMethod === "cod" || paymentMethod === "upi") {
//             setStep(3);
//           }
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to place order.",
//           variant: "destructive",
//         });
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "An unexpected error occurred.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle payment method selection
//   const handlePaymentMethodSelect = async (method: string) => {
//     setPaymentMethod(method as any);

//     // If it's a card payment, automatically proceed to place order
//     if (method === "card" || method === "paypal") {
//       await handlePlaceOrder();
//     }
//   };

//   // Calculate delivery date
//   const getDeliveryDate = () => {
//     const today = new Date();
//     const minDate = new Date(today);
//     minDate.setDate(today.getDate() + estimatedDeliveryDays.min);

//     const maxDate = new Date(today);
//     maxDate.setDate(today.getDate() + estimatedDeliveryDays.max);

//     return {
//       min: minDate.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       }),
//       max: maxDate.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       }),
//     };
//   };

//   const deliveryDate = getDeliveryDate();

//   // Loading state
//   if (loading || checkoutLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-4">
//               <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//             <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (cart.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
//             <Package className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">
//             Add some items to your cart before checkout.
//           </p>
//           <Link
//             href="/cart"
//             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//           >
//             View Cart
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Checkout</h1>
//         <p className="text-gray-500">
//           {itemCount} item{itemCount !== 1 ? "s" : ""} in your order
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-4">
//           {[1, 2, 3].map((stepNumber) => (
//             <div key={stepNumber} className="flex items-center">
//               <div
//                 className={`
//                 w-10 h-10 rounded-full flex items-center justify-center
//                 ${
//                   step >= stepNumber
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 dark:bg-gray-800 text-gray-400"
//                 }
//               `}
//               >
//                 {stepNumber}
//               </div>
//               {stepNumber < 3 && (
//                 <div
//                   className={`
//                   h-1 w-32 mx-2
//                   ${step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}
//                 `}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between text-sm max-w-md mx-auto">
//           <span
//             className={
//               step === 1 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Shipping Address
//           </span>
//           <span
//             className={
//               step === 2 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Payment Method
//           </span>
//           <span
//             className={
//               step === 3 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Confirmation
//           </span>
//         </div>
//       </div>

//       {/* Shipping Information Card */}
//       {selectedAddressId &&
//         calculatedShipping &&
//         shippingFee > 0 &&
//         step < 3 && (
//           <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
//             <div className="flex items-start gap-3">
//               <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div className="flex-1">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <p className="font-medium text-blue-800 dark:text-blue-400">
//                       Shipping Information
//                     </p>
//                     <p className="text-sm text-blue-600 dark:text-blue-300">
//                       {shippingService}
//                       {shippingMethod === "express" && " • Express Shipping"}
//                     </p>
//                   </div>
//                   <p className="font-bold text-blue-700 dark:text-blue-300">
//                     ${shippingFees.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
//                   <Calendar className="w-4 h-4" />
//                   <span>
//                     Estimated delivery: {deliveryDate.min} - {deliveryDate.max}
//                   </span>
//                 </div>
//                 {(() => {
//                   const address = shippingAddresses.find(
//                     (a) => a.id === selectedAddressId
//                   );
//                   return (
//                     address && (
//                       <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
//                         Shipping to: {address.country?.name}
//                       </p>
//                     )
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Checkout Content */}
//         <div className="lg:col-span-2">
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
//               <p className="text-red-600 dark:text-red-400">{error}</p>
//             </div>
//           )}

//           {/* Step 1: Shipping Address */}
//           {step === 1 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-2 mb-2">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Shipping Address</h2>
//                 </div>
//                 <p className="text-gray-500">
//                   Select or add a shipping address
//                 </p>
//               </div>

//               <div className="p-6">
//                 {/* Address List */}
//                 <div className="space-y-4 mb-6">
//                   {shippingAddresses.map((address) => (
//                     <div
//                       key={address.id}
//                       className={`
//                         p-4 border rounded-lg cursor-pointer transition-all
//                         ${
//                           selectedAddressId === address.id
//                             ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                             : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                         }
//                       `}
//                       onClick={() => handleAddressSelect(address.id)}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <p className="font-medium">
//                               {address.firstName} {address.lastName}
//                             </p>
//                             {address.default && (
//                               <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
//                                 Default
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-gray-600 dark:text-gray-400">
//                             {address.address1}
//                             {address.address2 && `, ${address.address2}`}
//                           </p>
//                           <p className="text-gray-600 dark:text-gray-400">
//                             {address.city}, {address.state} {address.zip_code}
//                           </p>
//                           <p className="text-gray-600 dark:text-gray-400">
//                             {address.country?.name}
//                           </p>
//                           <p className="text-gray-600 dark:text-gray-400">
//                             Phone: {address.phone}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleEditAddress(address);
//                             }}
//                             className="p-2 text-gray-500 hover:text-blue-600"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </button>
//                           {!address.default && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteAddress(address.id);
//                               }}
//                               className="p-2 text-gray-500 hover:text-red-600"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Add New Address Button */}
//                 {!showAddressForm && (
//                   <button
//                     onClick={() => setShowAddressForm(true)}
//                     className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
//                   >
//                     <div className="flex items-center justify-center gap-2">
//                       <Plus className="w-5 h-5" />
//                       <span>Add New Address</span>
//                     </div>
//                   </button>
//                 )}

//                 {/* Address Form */}
//                 {showAddressForm && (
//                   <form
//                     onSubmit={handleAddressSubmit}
//                     className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.firstName}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               firstName: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.lastName}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               lastName: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Phone
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.phone}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               phone: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Country
//                         </label>
//                         <select
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.countryId}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               countryId: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select Country</option>
//                           {countries.map((country) => (
//                             <option key={country.id} value={country.id}>
//                               {country.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-2">
//                           Address Line 1
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.address1}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               address1: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-2">
//                           Address Line 2 (Optional)
//                         </label>
//                         <input
//                           type="text"
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.address2}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               address2: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           City
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.city}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               city: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           State
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.state}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               state: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           ZIP Code
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.zip_code}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               zip_code: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="md:col-span-2 flex items-center">
//                         <input
//                           type="checkbox"
//                           id="defaultAddress"
//                           className="mr-2"
//                           checked={addressForm.default}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               default: e.target.checked,
//                             })
//                           }
//                         />
//                         <label htmlFor="defaultAddress" className="text-sm">
//                           Set as default shipping address
//                         </label>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                       >
//                         {editingAddress ? "Update Address" : "Save Address"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowAddressForm(false);
//                           setEditingAddress(null);
//                           setAddressForm({
//                             firstName: "",
//                             lastName: "",
//                             phone: "",
//                             address1: "",
//                             address2: "",
//                             state: "",
//                             city: "",
//                             zip_code: "",
//                             countryId: "",
//                             default: false,
//                           });
//                         }}
//                         className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>

//               <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//                 <button
//                   onClick={nextStep}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
//                   disabled={!selectedAddressId}
//                 >
//                   Continue to Payment
//                   <CreditCard className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Payment */}
//           {step === 2 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CreditCard className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Payment Method</h2>
//                 </div>
//                 <p className="text-gray-500">
//                   Choose your preferred payment method
//                 </p>
//               </div>

//               <div className="p-6">

//                 {/* Selected Address Display */}
//                 {selectedAddressId && (
//                   <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="font-medium text-blue-800 dark:text-blue-400 mb-1">
//                           Shipping to:
//                         </p>
//                         {(() => {
//                           const address = shippingAddresses.find(
//                             (a) => a.id === selectedAddressId
//                           );
//                           return address ? (
//                             <>
//                               <p className="text-sm text-blue-700 dark:text-blue-300">
//                                 {address.firstName} {address.lastName}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.address1}
//                                 {address.address2 && `, ${address.address2}`}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.city}, {address.state}{" "}
//                                 {address.zip_code}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.country?.name}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 Phone: {address.phone}
//                               </p>
//                             </>
//                           ) : (
//                             <p className="text-sm text-blue-600 dark:text-blue-400">
//                               Address not found
//                             </p>
//                           );
//                         })()}
//                       </div>
//                       <button
//                         onClick={() => setStep(1)}
//                         className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
//                       >
//                         Change
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Payment Method Selection */}
//                 <div className="space-y-4 mb-6">
//                   <button
//                     onClick={() => handlePaymentMethodSelect("card")}
//                     disabled={isProcessing}
//                     className={`
//                       w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//                       ${
//                         paymentMethod === "card"
//                           ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                       }
//                       ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//                     `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
//                         <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div>
//                         <p className="font-medium">
//                           Credit/Debit Card with Stripe
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Pay securely with your card
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Image
//                         src="/images/payment/visa.png"
//                         alt="Visa"
//                         width={40}
//                         height={25}
//                         className="object-contain"
//                       />
//                       <Image
//                         src="/images/payment/mastercard.png"
//                         alt="Mastercard"
//                         width={40}
//                         height={25}
//                         className="object-contain"
//                       />
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handlePaymentMethodSelect("paypal")}
//                     disabled={isProcessing}
//                     className={`
//                       w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//                       ${
//                         paymentMethod === "paypal"
//                           ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                       }
//                       ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//                     `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
//                         <Image
//                           src="/images/payment/paypal.png"
//                           alt="PayPal"
//                           width={24}
//                           height={24}
//                           className="object-contain"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-medium">PayPal</p>
//                         <p className="text-sm text-gray-500">
//                           Pay securely with PayPal
//                         </p>
//                       </div>
//                     </div>
//                     <div>
//                       <Image
//                         src="/images/payment/paypal-logo.png"
//                         alt="PayPal"
//                         width={60}
//                         height={20}
//                         className="object-contain"
//                       />
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => setPaymentMethod("cod")}
//                     disabled={isProcessing}
//                     className={`
//                       w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//                       ${
//                         paymentMethod === "cod"
//                           ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                       }
//                       ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//                     `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
//                         <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
//                       </div>
//                       <div>
//                         <p className="font-medium">Cash on Delivery</p>
//                         <p className="text-sm text-gray-500">
//                           Pay when you receive your order
//                         </p>
//                       </div>
//                     </div>
//                   </button>

//                   {/* <button
//                     onClick={() => setPaymentMethod("upi")}
//                     disabled={isProcessing}
//                     className={`
//                       w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//                       ${
//                         paymentMethod === "upi"
//                           ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                       }
//                       ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//                     `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
//                         <Image
//                           src="/images/payment/upi.png"
//                           alt="UPI"
//                           width={24}
//                           height={24}
//                           className="object-contain"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-medium">UPI Payment</p>
//                         <p className="text-sm text-gray-500">
//                           Pay using UPI apps
//                         </p>
//                       </div>
//                     </div>
//                   </button> */}
//                 </div>

//                 {/* Security Note */}
//                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Shield className="w-5 h-5 text-green-600" />
//                     <p className="font-medium">Secure Payment</p>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Your payment is processed securely through Stripe or PayPal.
//                     We never store your card details. All transactions are
//                     encrypted and PCI compliant.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
//                 <button
//                   onClick={prevStep}
//                   className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                   disabled={isProcessing}
//                 >
//                   Back to Address
//                 </button>

//                 {(paymentMethod === "cod" || paymentMethod === "upi") && (
//                   <button
//                     onClick={handlePlaceOrder}
//                     className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
//                     disabled={!paymentMethod || isProcessing}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         Place Order
//                         <CheckCircle className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Confirmation */}
//           {step === 3 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-12 text-center">
//                 <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
//                   <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h2 className="text-2xl font-bold mb-2">Order Confirmed! 🎉</h2>
//                 <p className="text-gray-500 mb-6">
//                   Thank you for your order. We've sent a confirmation email with
//                   your order details.
//                 </p>

//                 <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
//                   {/* Shipping Information */}
//                   <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center">
//                         <Truck className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
//                         <span className="font-medium text-blue-700 dark:text-blue-300">
//                           {shippingMethod === "express"
//                             ? "Express Shipping"
//                             : "Standard Shipping"}
//                         </span>
//                       </div>
//                       <span className="font-bold text-blue-700 dark:text-blue-300">
//                         ${shippingFees.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
//                       <Calendar className="w-3 h-3" />
//                       <span>
//                         Estimated delivery: {deliveryDate.min} -{" "}
//                         {deliveryDate.max}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Coupon Information in Order Confirmation */}
//                   {appliedCoupon && (
//                     <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <Tag className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
//                           <span className="font-medium text-green-700 dark:text-green-300">
//                             {appliedCoupon.couponCode}
//                           </span>
//                         </div>
//                         <span className="font-bold text-green-700 dark:text-green-300">
//                           -${appliedCoupon.discountAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-600">Order ID</span>
//                     <span className="font-mono font-bold">
//                       #SPK-
//                       {Math.random().toString(36).substr(2, 6).toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-600">Payment Method</span>
//                     <span className="font-medium">
//                       {paymentMethod === "card"
//                         ? "Credit Card (Stripe)"
//                         : paymentMethod === "paypal"
//                           ? "PayPal"
//                           : paymentMethod === "cod"
//                             ? "Cash on Delivery"
//                             : "UPI"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-x-4">
//                   <Link
//                     href="/orders"
//                     className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     View Order Status
//                   </Link>
//                   <Link
//                     href="/shop"
//                     className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Summary Sidebar */}
//         <div>
//           <div className="sticky top-8 space-y-6">
//             {/* Order Summary */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-lg font-semibold">Order Summary</h3>
//                     <p className="text-sm text-gray-500">
//                       {itemCount} item{itemCount !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                   {appliedCoupon && (
//                     <div className="flex items-center text-green-600 dark:text-green-400">
//                       <Tag className="w-4 h-4 mr-1" />
//                       <span className="text-sm font-medium">
//                         {appliedCoupon.couponCode}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4">
//                 {/* Order Items */}

//                 {Object.keys(storeGroupedItems).length > 1 && (
//                   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="text-lg font-semibold">
//                         Stores in Your Order
//                       </h3>
//                       <p className="text-sm text-gray-500">
//                         {Object.keys(storeGroupedItems).length} store
//                         {Object.keys(storeGroupedItems).length !== 1 ? "s" : ""}
//                       </p>
//                     </div>
//                     <div className="p-4">
//                       <div className="space-y-3">
//                         {Object.entries(storeGroupedItems).map(
//                           ([storeId, items], index) => {
//                             const storeInfo = items[0];
//                             const storeTotal = items.reduce(
//                               (sum, item) => sum + item.price * item.quantity,
//                               0
//                             );

//                             return (
//                               <div
//                                 key={storeId}
//                                 className="flex items-center justify-between"
//                               >
//                                 <div className="flex items-center gap-3">
//                                   {storeInfo.storeLogo && (
//                                     <div className="relative w-10 h-10">
//                                       <Image
//                                         src={storeInfo.storeLogo}
//                                         alt={storeInfo.storeName}
//                                         width={40}
//                                         height={40}
//                                         className="object-cover rounded-full"
//                                       />
//                                     </div>
//                                   )}
//                                   <div>
//                                     <p className="font-medium text-sm">
//                                       {storeInfo.storeName}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                       {items.length} item
//                                       {items.length !== 1 ? "s" : ""}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-medium text-sm">
//                                     ${storeTotal.toFixed(2)}
//                                   </p>
//                                   {storeInfo.storeUrl && (
//                                     <Link
//                                       href={storeInfo.storeUrl}
//                                       className="text-xs text-blue-600 hover:underline"
//                                     >
//                                       Visit store
//                                     </Link>
//                                   )}
//                                 </div>
//                               </div>
//                             );
//                           }
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {/* Price Breakdown */}
//                 <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
//                   {/* Subtotal - İndirim varsa indirimli toplamı göster */}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">
//                       {appliedCoupon
//                         ? "Subtotal (Before Discount)"
//                         : "Subtotal"}
//                     </span>
//                     <span
//                       className={`${appliedCoupon ? "text-gray-500 line-through" : "font-medium"}`}
//                     >
//                       ${subTotal.toFixed(2)}
//                     </span>
//                   </div>

//                   {/* İndirim satırı (sadece kupon varsa göster) */}
//                   {appliedCoupon && (
//                     <>
//                       <div className="flex justify-between text-green-600 dark:text-green-400">
//                         <span className="flex items-center">
//                           <Tag className="w-3 h-3 mr-1" />
//                           Discount ({appliedCoupon.couponCode})
//                         </span>
//                         <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
//                       </div>

//                       {/* İndirimli subtotal */}
//                       <div className="flex justify-between font-medium pb-2 border-b border-gray-100 dark:border-gray-700">
//                         <span>Discounted Subtotal</span>
//                         <span>
//                           $
//                           {(subTotal - appliedCoupon.discountAmount).toFixed(2)}
//                         </span>
//                       </div>
//                     </>
//                   )}

//                   {/* Shipping */}
//                   <div className="flex justify-between pt-2">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="font-medium">
//                       {shippingFees === 0 ? (
//                         "Free"
//                       ) : (
//                         <>
//                           ${shippingFees.toFixed(2)}
//                           {calculatedShipping && (
//                             <span className="text-xs text-gray-500 ml-1">
//                               (
//                               {shippingMethod === "express"
//                                 ? "Express"
//                                 : "Standard"}
//                               )
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </span>
//                   </div>

//                   {/* Total */}
//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>

//                   {/* Kupon kaldırma butonu (sadece kupon varsa ve ödeme yapılmamışsa) */}
//                   {appliedCoupon && step < 3 && (
//                     <div className="pt-3">
//                       <button
//                         onClick={handleRemoveCouponClick}
//                         className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 py-2 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//                       >
//                         <X className="w-3 h-3" />
//                         Remove Coupon
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Applied Coupon Info Card - Sadece kupon varsa göster */}
//             {appliedCoupon && (
//               <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
//                     <h4 className="font-medium text-green-800 dark:text-green-400">
//                       Coupon Applied
//                     </h4>
//                   </div>
//                   <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
//                     {appliedCoupon.discountPercentage}% OFF
//                   </span>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-green-700 dark:text-green-300">
//                       Code:{" "}
//                       <span className="font-mono font-bold">
//                         {appliedCoupon.couponCode}
//                       </span>
//                     </span>
//                     <span className="font-bold text-green-700 dark:text-green-300">
//                       -${appliedCoupon.discountAmount.toFixed(2)}
//                     </span>
//                   </div>
//                   <p className="text-xs text-green-600 dark:text-green-400">
//                     You saved ${appliedCoupon.discountAmount.toFixed(2)} on this
//                     order
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Shipping Information Card */}
//             {selectedAddressId && calculatedShipping && shippingFee > 0 && (
//               <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-700 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                     <h4 className="font-medium text-blue-800 dark:text-blue-400">
//                       Shipping Details
//                     </h4>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Service
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {shippingService}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Delivery Time
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {estimatedDeliveryDays.min}-{estimatedDeliveryDays.max}{" "}
//                       days
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Method
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {shippingMethod === "express"
//                         ? "Express (+$9.99)"
//                         : "Standard"}
//                     </span>
//                   </div>
//                   <div className="pt-2 border-t border-blue-100 dark:border-blue-700">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
//                         Total Shipping
//                       </span>
//                       <span className="font-bold text-blue-800 dark:text-blue-400">
//                         ${shippingFees.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Security Assurance */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <h4 className="font-medium">Shop with Confidence</h4>
//               </div>
//               <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Secure SSL Encryption</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>30-Day Return Policy</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Free Shipping Over $50</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>24/7 Customer Support</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Need Help */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
//               <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
//                 Need Help?
//               </h4>
//               <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
//                 Have questions about your order? We're here to help.
//               </p>
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//               >
//                 Contact Support →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

//////////////////




// // app/shop/checkout/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/app/cart-store/useCartStore";
// import { useCheckoutStore } from "@/app/oneshopstore/cartstore/checkoutstore";
// import { useToast } from "@/app/projects/components/ui/use-toast";
// import {
//   Truck,
//   User,
//   CreditCard,
//   CheckCircle,
//   Plus,
//   Edit2,
//   Trash2,
//   MapPin,
//   Package,
//   Shield,
//   Tag,
//   X,
//   Calendar,
// } from "lucide-react";
// import { CartProductType } from "@/app/lib/types";

// interface StoreGroupedItems {
//   [storeId: string]: CartProductType[];
// }

// const Checkout = () => {
//   const { toast } = useToast();

//   // Cart store - Tüm değerleri doğru şekilde al
//   const {
//     cart,
//     totalPrice,
//     subtotal: cartSubtotal,
//     shippingFee: cartShippingFee,
//     appliedCoupon,
//     setCart,
//     clearCart,
//     removeCoupon,
//     calculateSubtotal,
//     recalculateAll,
//   } = useCartStore();

//   console.log("Checkout Cart:", cart);
//   console.log("Applied Coupon:", appliedCoupon);
//   console.log("Cart Subtotal:", cartSubtotal);

//   // Checkout store
//   const {
//     step,
//     shippingAddresses,
//     selectedAddressId,
//     paymentMethod,
//     shippingMethod,
//     note,
//     countries,
//     isLoading: checkoutLoading,
//     error,
//     shippingFee,
//     estimatedDeliveryDays,
//     shippingService,
//     calculatedShipping,

//     setStep,
//     nextStep,
//     prevStep,
//     fetchShippingAddresses,
//     addShippingAddress,
//     updateShippingAddress,
//     deleteShippingAddress,
//     setSelectedAddress,
//     fetchCountries,
//     setPaymentMethod,
//     setShippingMethod,
//     setNote,
//     calculateShippingFee,
//     placeOrder,
//     resetCheckout,
//   } = useCheckoutStore();

//   // New address form state
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState<null | any>(null);
//   const [addressForm, setAddressForm] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     address1: "",
//     address2: "",
//     state: "",
//     city: "",
//     zip_code: "",
//     countryId: "",
//     default: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [shippingCalculated, setShippingCalculated] = useState(false);

//   // Fetch data on mount - DÜZGÜN CART YÜKLEME
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         // 1. Önce localStorage'dan cart-store'u kontrol et
//         const cartStoreData = localStorage.getItem("cart-store");
//         if (cartStoreData) {
//           try {
//             const parsedData = JSON.parse(cartStoreData);
//             const cartFromStorage = parsedData.state?.cart || [];

//             if (cartFromStorage.length > 0) {
//               console.log("Loading cart from cart-store:", cartFromStorage);
//               setCart(cartFromStorage);
//             } else {
//               // Eski sisteme fallback
//               const savedCart = localStorage.getItem("cart");
//               if (savedCart) {
//                 const parsedCart: CartProductType[] = JSON.parse(savedCart);
//                 if (parsedCart.length > 0) {
//                   console.log("Loading cart from old system:", parsedCart);
//                   setCart(parsedCart);
//                 }
//               }
//             }
//           } catch (e) {
//             console.error("Error parsing cart-store:", e);
//           }
//         }

//         // 2. Diğer dataları yükle
//         await Promise.all([fetchShippingAddresses(), fetchCountries()]);
//       } catch (error) {
//         console.error("Failed to load data:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load checkout data.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [setCart, fetchShippingAddresses, fetchCountries, toast]);

//   // Adres veya sepet değiştiğinde shipping fee hesapla - OPTIMIZED
//   useEffect(() => {
//     const calculateShipping = async () => {
//       if (!selectedAddressId || cart.length === 0) {
//         return;
//       }

//       try {
//         const selectedAddress = shippingAddresses.find(
//           (addr) => addr.id === selectedAddressId
//         );

//         if (!selectedAddress || !selectedAddress.countryId) {
//           console.log("No address or country selected");
//           return;
//         }

//         // Cart'ı API için formatla
//         const cartItems = cart.map((item) => ({
//           productId: item.productId,
//           variantId: item.variantId,
//           sizeId: item.sizeId,
//           quantity: item.quantity,
//           price: item.price,
//           storeId: item.storeId || "default-store",
//         }));

//         console.log("Calculating shipping for:", {
//           itemsCount: cartItems.length,
//           countryId: selectedAddress.countryId,
//         });

//         // Store IDs to array
//         const storeIds = [
//           ...new Set(cart.map((item) => item.storeId).filter(Boolean)),
//         ];
//         const primaryStoreId = storeIds[0] || "default-store";

//         await calculateShippingFee(
//           cartItems,
//           selectedAddress.countryId,
//           primaryStoreId
//         );

//         setShippingCalculated(true);
//       } catch (error) {
//         console.error("Failed to calculate shipping:", error);
//         toast({
//           title: "Shipping Error",
//           description: "Failed to calculate shipping costs. Please try again.",
//           variant: "destructive",
//         });
//       }
//     };

//     if (selectedAddressId && shippingAddresses.length > 0 && cart.length > 0) {
//       calculateShipping();
//     }
//   }, [selectedAddressId, cart, shippingAddresses, calculateShippingFee, toast]);

//   // Helper functions - Store'dan gelen değerleri kullan
//   const getSubTotal = () => {
//     return calculateSubtotal();
//   };

//   const getShippingFees = () => {
//     // Hesaplanmış shipping fee varsa onu kullan
//     if (calculatedShipping && shippingFee > 0) {
//       // Express shipping için ekstra ücret
//       const baseFee = shippingFee;
//       return shippingMethod === "express" ? baseFee + 9.99 : baseFee;
//     }

//     // Yoksa shipping method'a göre hesapla
//     return shippingMethod === "express" ? 9.99 : 0;
//   };

//   // Total hesaplama - Store'daki totalPrice'ı kullan


//   // getTotal fonksiyonunu düzelt
// const getTotal = () => {
//   const currentShipping = getShippingFees();
//   let total = totalPrice;

//   // Store'daki totalPrice shipping dahil olmayabilir, kontrol et
//   if (total === cartSubtotal - (appliedCoupon?.discountAmount || 0)) {
//     total += currentShipping;
//   }

//   // Negatif total olmamasını garantile
//   return Math.max(0, total);
// };



//   const getItemCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const getStoreGroupedItems = (): StoreGroupedItems => {
//     const grouped: StoreGroupedItems = {};

//     cart.forEach((item) => {
//       const storeId = item.storeId || "unknown-store";
//       if (!grouped[storeId]) {
//         grouped[storeId] = [];
//       }
//       grouped[storeId].push(item);
//     });

//     return grouped;
//   };

//   // Calculate totals
//   const subTotal = getSubTotal();
//   const shippingFees = getShippingFees();
//   const total = getTotal();
//   const itemCount = getItemCount();
//   const storeGroupedItems = getStoreGroupedItems();

//   // Debug için console.log
//   useEffect(() => {
//     console.log("Checkout State:", {
//       cartItems: cart.length,
//       appliedCoupon,
//       storeSubtotal: cartSubtotal,
//       storeTotal: totalPrice,
//       calculatedSubtotal: subTotal,
//       shippingFees,
//       calculatedTotal: total,
//       selectedAddressId,
//       shippingCalculated,
//       shippingFee,
//     });
//   }, [
//     cart,
//     appliedCoupon,
//     cartSubtotal,
//     totalPrice,
//     subTotal,
//     shippingFees,
//     total,
//     selectedAddressId,
//     shippingCalculated,
//     shippingFee,
//   ]);

//   // Handle address form
//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (editingAddress) {
//         await updateShippingAddress(editingAddress.id, addressForm);
//         toast({
//           title: "Address updated",
//           description: "Shipping address has been updated.",
//         });
//       } else {
//         await addShippingAddress(addressForm);
//         toast({
//           title: "Address added",
//           description: "New shipping address has been added.",
//         });
//       }

//       setShowAddressForm(false);
//       setEditingAddress(null);
//       setAddressForm({
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         state: "",
//         city: "",
//         zip_code: "",
//         countryId: "",
//         default: false,
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save address.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEditAddress = (address: any) => {
//     setEditingAddress(address);
//     setAddressForm({
//       firstName: address.firstName,
//       lastName: address.lastName,
//       phone: address.phone,
//       address1: address.address1,
//       address2: address.address2 || "",
//       state: address.state,
//       city: address.city,
//       zip_code: address.zip_code,
//       countryId: address.countryId,
//       default: address.default,
//     });
//     setShowAddressForm(true);
//   };

//   const handleDeleteAddress = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this address?")) return;

//     try {
//       await deleteShippingAddress(id);
//       toast({
//         title: "Address deleted",
//         description: "Shipping address has been deleted.",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete address.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle address selection with shipping calculation
//   const handleAddressSelect = (addressId: string) => {
//     setSelectedAddress(addressId);
//   };

//   // Kupon kaldırma fonksiyonu
//   const handleRemoveCouponClick = async () => {
//     if (!appliedCoupon) return;

//     if (!confirm("Are you sure you want to remove this coupon?")) return;

//     try {
//       // Store'dan kuponu kaldır
//       removeCoupon();

//       // Recalculate totals
//       recalculateAll();

//       toast({
//         title: "Coupon removed",
//         description: "Coupon has been removed from your order.",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to remove coupon.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle order placement



//   // handlePlaceOrder fonksiyonunu güncelle
// const handlePlaceOrder = async () => {
//   if (isProcessing) return;
//   setIsProcessing(true);

//   // Validasyon
//   if (!selectedAddressId) {
//     toast({
//       title: "Error",
//       description: "Please select a shipping address.",
//       variant: "destructive",
//     });
//     setIsProcessing(false);
//     return;
//   }

//   if (!paymentMethod) {
//     toast({
//       title: "Error",
//       description: "Please select a payment method.",
//       variant: "destructive",
//     });
//     setIsProcessing(false);
//     return;
//   }

//   if (cart.length === 0) {
//     toast({
//       title: "Error",
//       description: "Your cart is empty.",
//       variant: "destructive",
//     });
//     setIsProcessing(false);
//     return;
//   }

//   try {
//     const result = await placeOrder();

//     if (result.success && result.order?.id) {
//       // TÜM ödeme yöntemleri için order sayfasına yönlendir
//       clearCart();
//       resetCheckout();
      
//       // Toast mesajı göster
//       toast({
//         title: "Order Placed!",
//         description: "Redirecting to order details...",
//       });
      
//       // 1 saniye sonra yönlendir (kullanıcı toast'ı görebilsin)
//       setTimeout(() => {
//         window.location.href = `/shop/order/${result.order.id}`;
//       }, 1000);
      
//     } else {
//       toast({
//         title: "Error",
//         description: result.error || "Failed to place order.",
//         variant: "destructive",
//       });
//     }
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description: error.message || "An unexpected error occurred.",
//       variant: "destructive",
//     });
//   } finally {
//     // Eğer yönlendirme yapılmadıysa işlemi sıfırla
//     if (!window.location.href.includes("/shop/order/")) {
//       setIsProcessing(false);
//     }
//   }
// };


//   // Handle payment method selection

//   // Tek tıklamayla direkt ödemeye yönlendiren fonksiyon
// const handlePaymentMethodSelect = async (method: string) => {
//   // Eğer zaten işlemdeyse, engelle
//   if (isProcessing) return;
  
//   // Payment method'u set et
//   setPaymentMethod(method as any);
  
//   // Stripe veya PayPal için direkt order işle
//   if (method === "card" || method === "paypal") {
//     setIsProcessing(true);
//     try {
//       await handlePlaceOrder();
//     } catch (error) {
//       console.error("Payment error:", error);
//       setIsProcessing(false);
//     }
//   }
//   // COD için sadece seç, buton göster
// };

//   // Calculate delivery date
//   const getDeliveryDate = () => {
//     const today = new Date();
//     const minDate = new Date(today);
//     minDate.setDate(today.getDate() + estimatedDeliveryDays.min);

//     const maxDate = new Date(today);
//     maxDate.setDate(today.getDate() + estimatedDeliveryDays.max);

//     return {
//       min: minDate.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       }),
//       max: maxDate.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       }),
//     };
//   };

//   const deliveryDate = getDeliveryDate();

//   // Loading state
//   if (loading || checkoutLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 space-y-4">
//               <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//             <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty cart
//   if (cart.length === 0 && !loading) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
//             <Package className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">
//             Add some items to your cart before checkout.
//           </p>
//           <Link
//             href="/shop"
//             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Checkout</h1>
//         <p className="text-gray-500">
//           {itemCount} item{itemCount !== 1 ? "s" : ""} in your order
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-4">
//           {[1, 2, 3].map((stepNumber) => (
//             <div key={stepNumber} className="flex items-center">
//               <div
//                 className={`
//                 w-10 h-10 rounded-full flex items-center justify-center
//                 ${
//                   step >= stepNumber
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 dark:bg-gray-800 text-gray-400"
//                 }
//               `}
//               >
//                 {stepNumber}
//               </div>
//               {stepNumber < 3 && (
//                 <div
//                   className={`
//                   h-1 w-16 mx-2
//                   ${step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}
//                 `}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between text-sm max-w-md mx-auto">
//           <span
//             className={
//               step === 1 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Shipping Address
//           </span>
//           <span
//             className={
//               step === 2 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Payment Method
//           </span>
//           <span
//             className={
//               step === 3 ? "text-blue-600 font-medium" : "text-gray-500"
//             }
//           >
//             Confirmation
//           </span>
//         </div>
//       </div>

//       {/* Shipping Information Card */}
//       {selectedAddressId &&
//         shippingCalculated &&
//         shippingFee > 0 &&
//         step < 3 && (
//           <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
//             <div className="flex items-start gap-3">
//               <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
//               <div className="flex-1">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <p className="font-medium text-blue-800 dark:text-blue-400">
//                       Shipping Information
//                     </p>
//                     <p className="text-sm text-blue-600 dark:text-blue-300">
//                       {shippingService}
//                       {shippingMethod === "express" && " • Express Shipping"}
//                     </p>
//                   </div>
//                   <p className="font-bold text-blue-700 dark:text-blue-300">
//                     ${shippingFees.toFixed(2)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
//                   <Calendar className="w-4 h-4" />
//                   <span>
//                     Estimated delivery: {deliveryDate.min} - {deliveryDate.max}
//                   </span>
//                 </div>
//                 {(() => {
//                   const address = shippingAddresses.find(
//                     (a) => a.id === selectedAddressId
//                   );
//                   return (
//                     address && (
//                       <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
//                         Shipping to: {address.country?.name}
//                       </p>
//                     )
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Checkout Content */}
//         <div className="lg:col-span-2">
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
//               <p className="text-red-600 dark:text-red-400">{error}</p>
//             </div>
//           )}

//           {/* Step 1: Shipping Address */}
//           {step === 1 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-2 mb-2">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Shipping Address</h2>
//                 </div>
//                 <p className="text-gray-500">
//                   Select or add a shipping address
//                 </p>
//               </div>

//               <div className="p-6">
//                 {/* Address List */}
//                 <div className="space-y-4 mb-6">
//                   {shippingAddresses.length === 0 ? (
//                     <div className="text-center py-8">
//                       <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-gray-500 mb-4">
//                         No shipping addresses saved yet.
//                       </p>
//                       <button
//                         onClick={() => setShowAddressForm(true)}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                       >
//                         Add Your First Address
//                       </button>
//                     </div>
//                   ) : (
//                     shippingAddresses.map((address) => (
//                       <div
//                         key={address.id}
//                         className={`
//                           p-4 border rounded-lg cursor-pointer transition-all
//                           ${
//                             selectedAddressId === address.id
//                               ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                               : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//                           }
//                         `}
//                         onClick={() => handleAddressSelect(address.id)}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <div className="flex items-center gap-2 mb-1">
//                               <p className="font-medium">
//                                 {address.firstName} {address.lastName}
//                               </p>
//                               {address.default && (
//                                 <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
//                                   Default
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-gray-600 dark:text-gray-400">
//                               {address.address1}
//                               {address.address2 && `, ${address.address2}`}
//                             </p>
//                             <p className="text-gray-600 dark:text-gray-400">
//                               {address.city}, {address.state} {address.zip_code}
//                             </p>
//                             <p className="text-gray-600 dark:text-gray-400">
//                               {address.country?.name}
//                             </p>
//                             <p className="text-gray-600 dark:text-gray-400">
//                               Phone: {address.phone}
//                             </p>
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleEditAddress(address);
//                               }}
//                               className="p-2 text-gray-500 hover:text-blue-600"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             {!address.default && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteAddress(address.id);
//                                 }}
//                                 className="p-2 text-gray-500 hover:text-red-600"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Add New Address Button */}
//                 {!showAddressForm && shippingAddresses.length > 0 && (
//                   <button
//                     onClick={() => setShowAddressForm(true)}
//                     className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
//                   >
//                     <div className="flex items-center justify-center gap-2">
//                       <Plus className="w-5 h-5" />
//                       <span>Add New Address</span>
//                     </div>
//                   </button>
//                 )}

//                 {/* Address Form */}
//                 {showAddressForm && (
//                   <form
//                     onSubmit={handleAddressSubmit}
//                     className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           First Name *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.firstName}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               firstName: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Last Name *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.lastName}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               lastName: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Phone *
//                         </label>
//                         <input
//                           type="tel"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.phone}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               phone: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           Country *
//                         </label>
//                         <select
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.countryId}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               countryId: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select Country</option>
//                           {countries.map((country) => (
//                             <option key={country.id} value={country.id}>
//                               {country.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-2">
//                           Address Line 1 *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.address1}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               address1: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-2">
//                           Address Line 2 (Optional)
//                         </label>
//                         <input
//                           type="text"
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.address2}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               address2: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           City *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.city}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               city: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           State/Province *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.state}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               state: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-2">
//                           ZIP/Postal Code *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                           value={addressForm.zip_code}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               zip_code: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div className="md:col-span-2 flex items-center">
//                         <input
//                           type="checkbox"
//                           id="defaultAddress"
//                           className="mr-2"
//                           checked={addressForm.default}
//                           onChange={(e) =>
//                             setAddressForm({
//                               ...addressForm,
//                               default: e.target.checked,
//                             })
//                           }
//                         />
//                         <label htmlFor="defaultAddress" className="text-sm">
//                           Set as default shipping address
//                         </label>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                       >
//                         {editingAddress ? "Update Address" : "Save Address"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowAddressForm(false);
//                           setEditingAddress(null);
//                           setAddressForm({
//                             firstName: "",
//                             lastName: "",
//                             phone: "",
//                             address1: "",
//                             address2: "",
//                             state: "",
//                             city: "",
//                             zip_code: "",
//                             countryId: "",
//                             default: false,
//                           });
//                         }}
//                         className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>

//               <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//                 <button
//                   onClick={nextStep}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={!selectedAddressId}
//                 >
//                   Continue to Payment
//                   <CreditCard className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Payment */}

//           {/* Step 2: Payment */}
//           {step === 2 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CreditCard className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Payment Method</h2>
//                 </div>
//                 <p className="text-gray-500">
//                   Choose your preferred payment method
//                 </p>
//               </div>

//               <div className="p-6">
//                 {/* Selected Address Display */}
//                 {selectedAddressId && (
//                   <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="font-medium text-blue-800 dark:text-blue-400 mb-1">
//                           Shipping to:
//                         </p>
//                         {(() => {
//                           const address = shippingAddresses.find(
//                             (a) => a.id === selectedAddressId
//                           );
//                           return address ? (
//                             <>
//                               <p className="text-sm text-blue-700 dark:text-blue-300">
//                                 {address.firstName} {address.lastName}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.address1}
//                                 {address.address2 && `, ${address.address2}`}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.city}, {address.state}{" "}
//                                 {address.zip_code}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 {address.country?.name}
//                               </p>
//                               <p className="text-sm text-blue-600 dark:text-blue-400">
//                                 Phone: {address.phone}
//                               </p>
//                             </>
//                           ) : (
//                             <p className="text-sm text-blue-600 dark:text-blue-400">
//                               Address not found
//                             </p>
//                           );
//                         })()}
//                       </div>
//                       <button
//                         onClick={() => setStep(1)}
//                         className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
//                       >
//                         Change
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Payment Method Selection - TEK TIKLAMAYLA */}
//                 <div className="space-y-4 mb-6">
//                   {/* Stripe Card Payment - TEK TIKLAMAYLA GİTSİN */}
//                   <button
//                     onClick={() => handlePaymentMethodSelect("card")}
//                     disabled={isProcessing}
//                     className={`
//             w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//             ${
//               paymentMethod === "card"
//                 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                 : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//             }
//             ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//           `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
//                         <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div>
//                         <p className="font-medium">
//                           Credit/Debit Card with Stripe
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Pay securely with your card
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
//                         <span className="text-xs font-bold text-blue-700">
//                           VISA
//                         </span>
//                       </div>
//                       <div className="w-10 h-6 bg-red-100 rounded flex items-center justify-center">
//                         <span className="text-xs font-bold text-red-700">
//                           MC
//                         </span>
//                       </div>
//                     </div>
//                   </button>

//                   {/* PayPal - TEK TIKLAMAYLA GİTSİN */}
//                   <button
//                     onClick={() => handlePaymentMethodSelect("paypal")}
//                     disabled={isProcessing}
//                     className={`
//             w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//             ${
//               paymentMethod === "paypal"
//                 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                 : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//             }
//             ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//           `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
//                         <span className="text-lg font-bold text-blue-700">
//                           P
//                         </span>
//                       </div>
//                       <div>
//                         <p className="font-medium">PayPal</p>
//                         <p className="text-sm text-gray-500">
//                           Pay securely with PayPal
//                         </p>
//                       </div>
//                     </div>
//                     <div>
//                       <span className="text-lg font-bold text-blue-700">
//                         PayPal
//                       </span>
//                     </div>
//                   </button>

//                   {/* Cash on Delivery - TEK TIKLAMAYLA GİTSİN */}
//                   <button
//                     onClick={() => handlePaymentMethodSelect("cod")}
//                     disabled={isProcessing}
//                     className={`
//             w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between
//             ${
//               paymentMethod === "cod"
//                 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                 : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
//             }
//             ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
//           `}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
//                         <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
//                       </div>
//                       <div>
//                         <p className="font-medium">Cash on Delivery</p>
//                         <p className="text-sm text-gray-500">
//                           Pay when you receive your order
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 {/* Order Note */}
//                 {/* <div className="mb-6">
//                   <label className="block text-sm font-medium mb-2">
//                     Order Note (Optional)
//                   </label>
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
//                     rows={3}
//                     placeholder="Add any special instructions for your order..."
//                     value={note}
//                     onChange={(e) => setNote(e.target.value)}
//                   />
//                 </div> */}

//                 {/* Security Note */}
//                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Shield className="w-5 h-5 text-green-600" />
//                     <p className="font-medium">Secure Payment</p>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Your payment is processed securely through Stripe or PayPal.
//                     We never store your card details. All transactions are
//                     encrypted and PCI compliant.
//                   </p>
//                 </div>
//               </div>

//               <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
//                 <button
//                   onClick={prevStep}
//                   className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                   disabled={isProcessing}
//                 >
//                   Back to Address
//                 </button>

//                 {/* COD için Place Order butonu */}
//                 {(paymentMethod === "cod" || paymentMethod === "upi") && (
//                   <button
//                     onClick={handlePlaceOrder}
//                     className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={!paymentMethod || isProcessing}
//                   >
//                     {isProcessing ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         Place Order
//                         <CheckCircle className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Step 3: Confirmation */}
//           {step === 3 && (
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-12 text-center">
//                 <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
//                   <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h2 className="text-2xl font-bold mb-2">Order Confirmed! 🎉</h2>
//                 <p className="text-gray-500 mb-6">
//                   Thank you for your order. We've sent a confirmation email with
//                   your order details.
//                 </p>

//                 <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
//                   {/* Shipping Information */}
//                   <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center">
//                         <Truck className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
//                         <span className="font-medium text-blue-700 dark:text-blue-300">
//                           {shippingMethod === "express"
//                             ? "Express Shipping"
//                             : "Standard Shipping"}
//                         </span>
//                       </div>
//                       <span className="font-bold text-blue-700 dark:text-blue-300">
//                         ${shippingFees.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
//                       <Calendar className="w-3 h-3" />
//                       <span>
//                         Estimated delivery: {deliveryDate.min} -{" "}
//                         {deliveryDate.max}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Coupon Information in Order Confirmation */}
//                   {appliedCoupon && (
//                     <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <Tag className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
//                           <span className="font-medium text-green-700 dark:text-green-300">
//                             {appliedCoupon.couponCode}
//                           </span>
//                         </div>
//                         <span className="font-bold text-green-700 dark:text-green-300">
//                           -${appliedCoupon.discountAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-600">Order ID</span>
//                     <span className="font-mono font-bold">
//                       #SPK-
//                       {Math.random().toString(36).substr(2, 6).toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-600">Payment Method</span>
//                     <span className="font-medium">
//                       {paymentMethod === "card"
//                         ? "Credit Card (Stripe)"
//                         : paymentMethod === "paypal"
//                           ? "PayPal"
//                           : paymentMethod === "cod"
//                             ? "Cash on Delivery"
//                             : "UPI"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <span>Total Paid</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <div className="space-x-4">
//                   <Link
//                     href="/orders"
//                     className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     View Order Status
//                   </Link>
//                   <Link
//                     href="/shop"
//                     className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                   >
//                     Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Order Summary Sidebar */}
//         <div>
//           <div className="sticky top-8 space-y-6">
//             {/* Order Summary */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="text-lg font-semibold">Order Summary</h3>
//                     <p className="text-sm text-gray-500">
//                       {itemCount} item{itemCount !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                   {appliedCoupon && (
//                     <div className="flex items-center text-green-600 dark:text-green-400">
//                       <Tag className="w-4 h-4 mr-1" />
//                       <span className="text-sm font-medium">
//                         {appliedCoupon.couponCode}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4">
//                 {/* Cart Items Preview */}
//                 <div className="mb-4 max-h-80 overflow-y-auto">
//                   {cart.slice(0, 3).map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}-${item.sizeId}`}
//                       className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
//                     >
//                       <div className="relative w-16 h-16 flex-shrink-0">
//                         <Image
//                           src={item.image || "/placeholder-product.jpg"}
//                           alt={item.name}
//                           fill
//                           className="object-cover rounded-md"
//                           sizes="64px"
//                         />
//                         <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
//                           {item.quantity}
//                         </div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm truncate">
//                           {item.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           Size: {item.size} | {item.sku}
//                         </p>
//                         <p className="font-bold text-sm">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   {cart.length > 3 && (
//                     <div className="text-center py-2">
//                       <p className="text-sm text-gray-500">
//                         +{cart.length - 3} more item
//                         {cart.length - 3 !== 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">
//                       {appliedCoupon
//                         ? "Subtotal (Before Discount)"
//                         : "Subtotal"}
//                     </span>
//                     <span
//                       className={`${appliedCoupon ? "text-gray-500 line-through" : "font-medium"}`}
//                     >
//                       ${subTotal.toFixed(2)}
//                     </span>
//                   </div>

//                   {appliedCoupon && (
//                     <>
//                       <div className="flex justify-between text-green-600 dark:text-green-400">
//                         <span className="flex items-center">
//                           <Tag className="w-3 h-3 mr-1" />
//                           Discount ({appliedCoupon.couponCode})
//                         </span>
//                         <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
//                       </div>

//                       <div className="flex justify-between font-medium pb-2 border-b border-gray-100 dark:border-gray-700">
//                         <span>Discounted Subtotal</span>
//                         <span>
//                           $
//                           {(subTotal - appliedCoupon.discountAmount).toFixed(2)}
//                         </span>
//                       </div>
//                     </>
//                   )}

//                   <div className="flex justify-between pt-2">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="font-medium">
//                       {shippingFees === 0 ? (
//                         "Free"
//                       ) : (
//                         <>
//                           ${shippingFees.toFixed(2)}
//                           {shippingCalculated && (
//                             <span className="text-xs text-gray-500 ml-1">
//                               (
//                               {shippingMethod === "express"
//                                 ? "Express"
//                                 : "Standard"}
//                               )
//                             </span>
//                           )}
//                         </>
//                       )}
//                     </span>
//                   </div>

//                   <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>

//                   {appliedCoupon && step < 3 && (
//                     <div className="pt-3">
//                       <button
//                         onClick={handleRemoveCouponClick}
//                         className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 py-2 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//                       >
//                         <X className="w-3 h-3" />
//                         Remove Coupon
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Applied Coupon Info Card */}
//             {appliedCoupon && (
//               <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
//                     <h4 className="font-medium text-green-800 dark:text-green-400">
//                       Coupon Applied
//                     </h4>
//                   </div>
//                   <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
//                     {appliedCoupon.discountPercentage}% OFF
//                   </span>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-green-700 dark:text-green-300">
//                       Code:{" "}
//                       <span className="font-mono font-bold">
//                         {appliedCoupon.couponCode}
//                       </span>
//                     </span>
//                     <span className="font-bold text-green-700 dark:text-green-300">
//                       -${appliedCoupon.discountAmount.toFixed(2)}
//                     </span>
//                   </div>
//                   <p className="text-xs text-green-600 dark:text-green-400">
//                     You saved ${appliedCoupon.discountAmount.toFixed(2)} on this
//                     order
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Shipping Information Card */}
//             {selectedAddressId && shippingCalculated && shippingFee > 0 && (
//               <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-700 p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-2">
//                     <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                     <h4 className="font-medium text-blue-800 dark:text-blue-400">
//                       Shipping Details
//                     </h4>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Service
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {shippingService}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Delivery Time
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {estimatedDeliveryDays.min}-{estimatedDeliveryDays.max}{" "}
//                       days
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-blue-700 dark:text-blue-300">
//                       Method
//                     </span>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {shippingMethod === "express"
//                         ? "Express (+$9.99)"
//                         : "Standard"}
//                     </span>
//                   </div>
//                   <div className="pt-2 border-t border-blue-100 dark:border-blue-700">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
//                         Total Shipping
//                       </span>
//                       <span className="font-bold text-blue-800 dark:text-blue-400">
//                         ${shippingFees.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Security Assurance */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <Shield className="w-5 h-5 text-blue-600" />
//                 <h4 className="font-medium">Shop with Confidence</h4>
//               </div>
//               <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Secure SSL Encryption</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>30-Day Return Policy</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Free Shipping Over $50</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>24/7 Customer Support</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Need Help */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
//               <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
//                 Need Help?
//               </h4>
//               <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
//                 Have questions about your order? We're here to help.
//               </p>
//               <Link
//                 href="/contact"
//                 className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//               >
//                 Contact Support →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;






//Final Part




"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/cart-store/useCartStore";
import { useCheckoutStore } from "@/app/oneshopstore/cartstore/checkoutstore";
import { useToast } from "@/app/projects/components/ui/use-toast";
import {
  Truck, User, CreditCard, CheckCircle, Plus, Edit2, Trash2,
  MapPin, Package, Shield, Tag, X, Calendar, AlertCircle, Loader2
} from "lucide-react";
import { CartProductType } from "@/app/lib/types";

interface StoreGroupedItems {
  [storeId: string]: CartProductType[];
}

const Checkout = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [currency, setCurrency] = useState("USD");

  // Cart store
  const {
    cart,
    totalPrice,
    subtotal: cartSubtotal,
    shippingFee: cartShippingFee,
    appliedCoupon,
    clearCart,
    removeCoupon,
    calculateSubtotal,
    recalculateAll,
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
    shippingFee,
    estimatedDeliveryDays,
    shippingService,
    calculatedShipping,
    isProcessingPayment,

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
    calculateShippingFee,
    placeOrder,
    resetCheckout,
  } = useCheckoutStore();

  // Form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<null | any>(null);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    zip_code: "",
    countryId: "",
    default: false,
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const savedCurrency = localStorage.getItem("preferred-currency") || "USD";
        setCurrency(savedCurrency);

        // Load cart from localStorage
        const cartStoreData = localStorage.getItem("cart-store");
        if (cartStoreData) {
          try {
            const parsedData = JSON.parse(cartStoreData);
            const cartFromStorage = parsedData.state?.cart || [];
            if (cartFromStorage.length > 0) {
              useCartStore.getState().setCart(cartFromStorage);
            }
          } catch (e) {
            console.error("Error parsing cart-store:", e);
          }
        }

        await Promise.all([fetchShippingAddresses(), fetchCountries()]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load checkout data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchShippingAddresses, fetchCountries, toast]);

  // Calculate shipping when address or cart changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!selectedAddressId || cart.length === 0) return;

      try {
        const selectedAddress = shippingAddresses.find(
          (addr) => addr.id === selectedAddressId
        );
        if (!selectedAddress?.countryId) return;

        const cartItems = cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: item.price,
          storeId: item.storeId || "default-store",
        }));

        await calculateShippingFee(
          cartItems,
          selectedAddress.countryId,
          undefined,
          currency
        );
        setShippingCalculated(true);
      } catch (error) {
        toast({
          title: "Shipping Error",
          description: "Failed to calculate shipping costs.",
          variant: "destructive",
        });
      }
    };

    if (selectedAddressId && shippingAddresses.length > 0 && cart.length > 0) {
      calculateShipping();
    }
  }, [selectedAddressId, cart, shippingAddresses, calculateShippingFee, currency, toast]);

  // Helper functions
  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "TRY": return "₺";
      default: return "$";
    }
  };

  const getSubTotal = () => calculateSubtotal();
  const getShippingFees = () => {
    if (calculatedShipping && shippingFee > 0) {
      return shippingMethod === "express" ? shippingFee + 9.99 : shippingFee;
    }
    return shippingMethod === "express" ? 9.99 : 0;
  };
  const getTotal = () => {
    const currentShipping = getShippingFees();
    let total = totalPrice;
    if (total === cartSubtotal - (appliedCoupon?.discountAmount || 0)) {
      total += currentShipping;
    }
    return Math.max(0, total);
  };
  const getItemCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  // Calculate totals
  const subTotal = getSubTotal();
  const shippingFees = getShippingFees();
  const total = getTotal();
  const itemCount = getItemCount();
  const currencySymbol = getCurrencySymbol();

  // Calculate delivery date
  const getDeliveryDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + estimatedDeliveryDays.min);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + estimatedDeliveryDays.max);
    return {
      min: minDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      max: maxDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  };
  const deliveryDate = getDeliveryDate();

  // Handle address form
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateShippingAddress(editingAddress.id, addressForm);
        toast({ title: "Address updated", description: "Shipping address has been updated." });
      } else {
        await addShippingAddress(addressForm);
        toast({ title: "Address added", description: "New shipping address has been added." });
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        firstName: "", lastName: "", phone: "", address1: "", address2: "",
        state: "", city: "", zip_code: "", countryId: "", default: false,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save address.",
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
      address2: address.address2 || "",
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
      toast({ title: "Address deleted", description: "Shipping address has been deleted." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address.",
        variant: "destructive",
      });
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
  };

  // Handle coupon removal
  const handleRemoveCouponClick = async () => {
    if (!appliedCoupon || !confirm("Are you sure you want to remove this coupon?")) return;
    try {
      removeCoupon();
      recalculateAll();
      toast({ title: "Coupon removed", description: "Coupon has been removed from your order." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove coupon.",
        variant: "destructive",
      });
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (isProcessingPayment) return;
    
    // Validations
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
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await placeOrder(currency);

      if (result.success) {
        if (result.paymentUrl && (paymentMethod === "card" || paymentMethod === "paypal")) {
          // Redirect to payment page
          window.location.href = result.paymentUrl;
        } else if (result.order?.id) {
          // For COD/UPI, redirect to order page
          clearCart();
          resetCheckout();
          toast({
            title: "Order Placed Successfully!",
            description: "Redirecting to order details...",
          });
          setTimeout(() => {
            window.location.href = `/shop/order/${result.order.id}`;
          }, 1500);
        }
      } else {
        toast({
          title: "Order Failed",
          description: result.error || "Failed to place order.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method as any);
    if (method === "cod" || method === "upi") {
      setTimeout(() => nextStep(), 500);
    }
  };

  // Currency selector
  const CurrencySelector = () => (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Payment Currency</span>
        </div>
        <select
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            localStorage.setItem("preferred-currency", e.target.value);
          }}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-sm"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="TRY">TRY (₺)</option>
        </select>
      </div>
      <p className="text-sm text-gray-500">
        All amounts will be shown in your selected currency
      </p>
    </div>
  );

  // Loading state
  if (loading || checkoutLoading) {
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
  if (cart.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Add some items to your cart before checkout.</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
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

      {/* Currency Selector */}
      <CurrencySelector />

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400"
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`h-1 w-16 mx-2 ${
                  step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm max-w-md mx-auto">
          <span className={step === 1 ? "text-blue-600 font-medium" : "text-gray-500"}>
            Shipping Address
          </span>
          <span className={step === 2 ? "text-blue-600 font-medium" : "text-gray-500"}>
            Payment Method
          </span>
          <span className={step === 3 ? "text-blue-600 font-medium" : "text-gray-500"}>
            Confirmation
          </span>
        </div>
      </div>

      {/* Shipping Information Card */}
      {selectedAddressId && shippingCalculated && shippingFee > 0 && step < 3 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-400">Shipping Information</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    {shippingService}
                    {shippingMethod === "express" && " • Express Shipping"}
                  </p>
                </div>
                <p className="font-bold text-blue-700 dark:text-blue-300">
                  {currencySymbol}{shippingFees.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Calendar className="w-4 h-4" />
                <span>Estimated delivery: {deliveryDate.min} - {deliveryDate.max}</span>
              </div>
              {(() => {
                const address = shippingAddresses.find((a) => a.id === selectedAddressId);
                return address && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Shipping to: {address.country?.name}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Content */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                <p className="text-gray-500">Select or add a shipping address</p>
              </div>

              <div className="p-6">
                {/* Address List */}
                <div className="space-y-4 mb-6">
                  {shippingAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No shipping addresses saved yet.</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    shippingAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{address.firstName} {address.lastName}</p>
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
                            <p className="text-gray-600 dark:text-gray-400">{address.country?.name}</p>
                            <p className="text-gray-600 dark:text-gray-400">Phone: {address.phone}</p>
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
                    ))
                  )}
                </div>

                {/* Add New Address Button */}
                {!showAddressForm && shippingAddresses.length > 0 && (
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
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.firstName}
                          onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.lastName}
                          onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone *</label>
                        <input
                          type="tel"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Country *</label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.countryId}
                          onChange={(e) => setAddressForm({ ...addressForm, countryId: e.target.value })}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.address1}
                          onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.address2}
                          onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State/Province *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP/Postal Code *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                          value={addressForm.zip_code}
                          onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center">
                        <input
                          type="checkbox"
                          id="defaultAddress"
                          className="mr-2"
                          checked={addressForm.default}
                          onChange={(e) => setAddressForm({ ...addressForm, default: e.target.checked })}
                        />
                        <label htmlFor="defaultAddress" className="text-sm">Set as default shipping address</label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        {editingAddress ? "Update Address" : "Save Address"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                          setAddressForm({
                            firstName: "", lastName: "", phone: "", address1: "", address2: "",
                            state: "", city: "", zip_code: "", countryId: "", default: false,
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedAddressId}
                >
                  Continue to Payment
                  <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <p className="text-gray-500">Choose your preferred payment method</p>
              </div>

              <div className="p-6">
                {/* Selected Address Display */}
                {selectedAddressId && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-800 dark:text-blue-400 mb-1">Shipping to:</p>
                        {(() => {
                          const address = shippingAddresses.find((a) => a.id === selectedAddressId);
                          return address ? (
                            <>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {address.address1}
                                {address.address2 && `, ${address.address2}`}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">{address.country?.name}</p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Phone: {address.phone}</p>
                            </>
                          ) : (
                            <p className="text-sm text-blue-600 dark:text-blue-400">Address not found</p>
                          );
                        })()}
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => handlePaymentMethodSelect("card")}
                    disabled={isProcessingPayment}
                    className={`w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card (Stripe)</p>
                        <p className="text-sm text-gray-500">Secure payment with Stripe</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">VISA</span>
                      </div>
                      <div className="w-10 h-6 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-red-700">MC</span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect("paypal")}
                    disabled={isProcessingPayment}
                    className={`w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-700">P</span>
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-blue-700">PayPal</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect("cod")}
                    disabled={isProcessingPayment}
                    className={`w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between ${
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    onClick={() => handlePaymentMethodSelect("upi")}
                    disabled={isProcessingPayment}
                    className={`w-full p-4 border rounded-lg text-left transition-all flex items-center justify-between ${
                      paymentMethod === "upi"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    } ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-500">Pay using UPI payment methods</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <p className="font-medium">Secure Payment</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your payment is processed securely. We never store your card details.
                    All transactions are encrypted and PCI compliant.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={isProcessingPayment}
                >
                  Back to Address
                </button>

                {/* Place Order Button */}
                {paymentMethod && (
                  <button
                    onClick={handlePlaceOrder}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "card" || paymentMethod === "paypal"
                          ? "Proceed to Payment"
                          : "Place Order"}
                        {paymentMethod === "card" || paymentMethod === "paypal" ? (
                          <CreditCard className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation (for COD/UPI) */}
          {step === 3 && (paymentMethod === "cod" || paymentMethod === "upi") && (
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
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"}
                        </span>
                      </div>
                      <span className="font-bold text-blue-700 dark:text-blue-300">
                        {currencySymbol}{shippingFees.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                      <Calendar className="w-3 h-3" />
                      <span>Estimated delivery: {deliveryDate.min} - {deliveryDate.max}</span>
                    </div>
                  </div>

                  {appliedCoupon && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {appliedCoupon.couponCode}
                          </span>
                        </div>
                        <span className="font-bold text-green-700 dark:text-green-300">
                          -{currencySymbol}{appliedCoupon.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span>{currencySymbol}{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-x-4">
                  <button
                    onClick={handlePlaceOrder}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </button>
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
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    <p className="text-sm text-gray-500">
                      {itemCount} item{itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{appliedCoupon.couponCode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Cart Items Preview */}
                <div className="mb-4 max-h-80 overflow-y-auto">
                  {cart.slice(0, 3).map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}-${item.sizeId}`}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-product.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="64px"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} | {item.sku}</p>
                        <p className="font-bold text-sm">
                          {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">
                        +{cart.length - 3} more item{cart.length - 3 !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {appliedCoupon ? "Subtotal (Before Discount)" : "Subtotal"}
                    </span>
                    <span className={`${appliedCoupon ? "text-gray-500 line-through" : "font-medium"}`}>
                      {currencySymbol}{subTotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          Discount ({appliedCoupon.couponCode})
                        </span>
                        <span>-{currencySymbol}{appliedCoupon.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pb-2 border-b border-gray-100 dark:border-gray-700">
                        <span>Discounted Subtotal</span>
                        <span>{currencySymbol}{(subTotal - appliedCoupon.discountAmount).toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingFees === 0 ? "Free" : (
                        <>
                          {currencySymbol}{shippingFees.toFixed(2)}
                          {shippingCalculated && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({shippingMethod === "express" ? "Express" : "Standard"})
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                    <span>Total</span>
                    <span>{currencySymbol}{total.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && step < 3 && (
                    <div className="pt-3">
                      <button
                        onClick={handleRemoveCouponClick}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 py-2 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Remove Coupon
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Applied Coupon Info Card */}
            {appliedCoupon && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-800 dark:text-green-400">Coupon Applied</h4>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    {appliedCoupon.discountPercentage}% OFF
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Code: <span className="font-mono font-bold">{appliedCoupon.couponCode}</span>
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      -{currencySymbol}{appliedCoupon.discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    You saved {currencySymbol}{appliedCoupon.discountAmount.toFixed(2)} on this order
                  </p>
                </div>
              </div>
            )}

            {/* Shipping Information Card */}
            {selectedAddressId && shippingCalculated && shippingFee > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-800 dark:text-blue-400">Shipping Details</h4>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 dark:text-blue-300">Service</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {shippingService}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 dark:text-blue-300">Delivery Time</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {estimatedDeliveryDays.min}-{estimatedDeliveryDays.max} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 dark:text-blue-300">Method</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {shippingMethod === "express" ? `Express (+${currencySymbol}9.99)` : "Standard"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-blue-100 dark:border-blue-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Total Shipping</span>
                      <span className="font-bold text-blue-800 dark:text-blue-400">
                        {currencySymbol}{shippingFees.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <span>Free Shipping Over {currencySymbol}50</span>
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
