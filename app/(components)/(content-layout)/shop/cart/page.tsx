// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/app/cart-store/useCartStore";
// import { useToast } from "@/app/projects/components/ui/use-toast";
// import {
//   Trash2,
//   Plus,
//   Minus,
//   Heart,
//   Truck,
//   Tag,
//   ShoppingBag,
// } from "lucide-react";
// import { AppliedCouponType, CartProductType } from "@/app/lib/types";
// import { useSession } from "@/app/SessionProvider";

// interface CartItemType {
//   id: string;
//   productId: string;
//   variantId: string;
//   sizeId: string;
//   productSlug: string;
//   variantSlug: string;
//   sku: string;
//   name: string;
//   image: string;
//   size: string;
//   price: number;
//   quantity: number;
//   shippingFee: number;
//   totalPrice: number;
// }

// const CartPage = () => {
//   const {
//     cart,
//     totalItems,
//     totalPrice,
//     addToCart,
//     updateProductQuantity,
//     removeFromCart,
//     emptyCart,
//     setCart,
//   } = useCartStore();

//   const { toast } = useToast();
//   const [couponCode, setCouponCode] = useState("");
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [shippingMethod, setShippingMethod] = useState<"free" | "express">(
//     "free"
//   );
//   const [loading, setLoading] = useState(false);
//   const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponType | null>(
//     null
//   );

//   const { user } = useSession();

//   // LocalStorage'dan cart ve coupon'ı yükle
//   useEffect(() => {
//     const loadCart = () => {
//       try {
//         setLoading(true);

//         // Cart'ı yükle
//         const savedCart = localStorage.getItem("cart");
//         if (savedCart) {
//           const parsedCart: CartProductType[] = JSON.parse(savedCart);
//           setCart(parsedCart);
//         }

//         // Applied coupon'ı yükle
//         const savedCoupon = localStorage.getItem("appliedCoupon");
//         if (savedCoupon) {
//           try {
//             const parsedCoupon: AppliedCouponType = JSON.parse(savedCoupon);
//             setAppliedCoupon(parsedCoupon);
//             console.log("Loaded coupon from localStorage:", parsedCoupon);
//           } catch (e) {
//             console.error("Failed to parse coupon from localStorage:", e);
//             localStorage.removeItem("appliedCoupon"); // Geçersiz veriyi temizle
//           }
//         }

//       } catch (error) {
//         console.error("Failed to load cart from localStorage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCart();
//   }, [setCart]);

//   const handleQuantityChange = (
//     product: CartProductType,
//     newQuantity: number
//   ) => {
//     if (newQuantity < 1) return;

//     try {
//       updateProductQuantity(product, newQuantity);
//       toast({
//         title: "Quantity updated",
//         description: "Item quantity has been updated.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update quantity.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRemoveItem = (product: CartProductType) => {
//     if (!confirm("Are you sure you want to remove this item from your cart?"))
//       return;

//     try {
//       removeFromCart(product);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to remove item.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a coupon code.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Zaten uygulanmış bir kupon varsa, önce onu kaldır
//     if (appliedCoupon) {
//       await handleRemoveCoupon();
//     }

//     setIsApplyingCoupon(true);

//     try {
//       // 1. Kuponu doğrula
//       const validateResponse = await fetch("/api/oneshop/coupon/validate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           couponCode: couponCode.trim().toUpperCase(),
//           userId: user?.id,
//         }),
//       });

//       const validateData = await validateResponse.json();

//       if (!validateData.valid) {
//         throw new Error(validateData.message || "Invalid coupon");
//       }

//       // 2. Doğrulandıysa kuponu uygula
//       const applyResponse = await fetch("/api/oneshop/coupon/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           couponCode: couponCode.trim().toUpperCase(),
//           cart: cart,
//         }),
//       });

//       const applyData = await applyResponse.json();

//       if (!applyResponse.ok || !applyData.success) {
//         throw new Error(applyData.message || "Failed to apply coupon");
//       }

//       // 3. Kuponu localStorage'a ve state'e kaydet
//       localStorage.setItem('appliedCoupon', JSON.stringify(applyData.coupon));
//       setAppliedCoupon(applyData.coupon);
//       setCouponCode("");

//       // 4. Cart store'u güncelle (indirimli toplam için)
//       const { totalPrice } = useCartStore.getState();
//       const discountedTotal = totalPrice - applyData.coupon.discountAmount;

//       useCartStore.setState({
//         totalPrice: discountedTotal > 0 ? discountedTotal : 0
//       });

//       // 5. Başarılı mesajı göster
//       toast({
//         title: "Success!",
//         description: applyData.message || "Coupon has been applied successfully.",
//       });

//     } catch (error) {
//       toast({
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Failed to apply coupon.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   const handleRemoveCoupon = async () => {
//     if (!appliedCoupon) return;

//     try {
//       const response = await fetch("/api/oneshop/coupon/remove", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           couponId: appliedCoupon.couponId,
//           userId: user?.id,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.message || "Failed to remove coupon");
//       }

//       // 1. LocalStorage'dan kaldır
//       localStorage.removeItem('appliedCoupon');

//       // 2. State'den kaldır
//       setAppliedCoupon(null);

//       // 3. Cart store'ta totalPrice'ı orijinal değerine döndür
//       const { cart } = useCartStore.getState();
//       const originalTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//       useCartStore.setState({
//         totalPrice: originalTotal
//       });

//       toast({
//         title: "Coupon removed",
//         description: data.message || "Coupon has been removed.",
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

//   // Helper functions
//   const getSubTotal = () => {
//     return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const getShippingFees = () => {
//     return shippingMethod === "free" ? 0 : 9.99;
//   };

//   // Toplam hesaplamasını güncelle (indirim uygula)
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

//   // Store'a göre gruplama (simüle edilmiş)
//   const getStoreGroupedItems = () => {
//     const grouped: Record<string, CartProductType[]> = {};

//     cart.forEach((item) => {
//       // Store ID'sini item'dan alabilirsiniz, şimdilik sabit değer
//       const storeId = "store-1";
//       if (!grouped[storeId]) {
//         grouped[storeId] = [];
//       }
//       grouped[storeId].push(item);
//     });

//     return grouped;
//   };

//   const subTotal = getSubTotal();
//   const total = getTotal();
//   const shippingFees = getShippingFees();
//   const itemCount = getItemCount();
//   const storeGroupedItems = getStoreGroupedItems();

//   if (loading && cart.length === 0) {
//     return <CartSkeleton />;
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
//             <ShoppingBag className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">
//             Looks like you haven't added any items to your cart yet. Start
//             shopping to add items.
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

//   console.log("Cart items:", cart);
//   console.log("Applied coupon:", appliedCoupon);
//   console.log("Calculated total:", total);
//   console.log("Cart store totalPrice:", totalPrice);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Shopping Cart</h1>
//         <p className="text-gray-500">
//           {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2">
//           {Object.entries(storeGroupedItems).map(([storeId, storeItems]) => (
//             <div
//               key={storeId}
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
//             >
//               <div>
//                 {storeItems.map((item) => (
//                   <div
//                     key={`${item.productId}-${item.variantId}-${item.sizeId}`}
//                     className="p-6 border-t border-gray-100 dark:border-gray-700"
//                   >
//                     <div className="flex gap-4">
//                       {/* Product Image */}
//                       <div className="relative w-24 h-24 flex-shrink-0">
//                         <Image
//                           src={item.image}
//                           alt={item.name}
//                           fill
//                           className="object-cover rounded-md"
//                           sizes="96px"
//                         />
//                       </div>

//                       {/* Product Details */}
//                       <div className="flex-1">
//                         <div className="flex justify-between">
//                           <div>
//                             <Link
//                               href={`/shop/productdetails/${item.productSlug}/${item.variantSlug}`}
//                               className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
//                             >
//                               {item.name}
//                             </Link>
//                             <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                               <span>Size: {item.size}</span>
//                               <span className="mx-2">•</span>
//                               <span>SKU: {item.sku}</span>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-bold">
//                               ${(item.price * item.quantity).toFixed(2)}
//                             </p>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">
//                               ${item.price.toFixed(2)} each
//                             </p>
//                           </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="flex items-center justify-between mt-4">
//                           <div className="flex items-center gap-4">
//                             {/* Quantity Selector */}
//                             <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
//                               <button
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity - 1)
//                                 }
//                                 disabled={item.quantity <= 1}
//                                 className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </button>
//                               <span className="w-12 text-center text-sm">
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() =>
//                                   handleQuantityChange(item, item.quantity + 1)
//                                 }
//                                 className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
//                               >
//                                 <Plus className="w-3 h-3" />
//                               </button>
//                             </div>

//                             {/* Save for Later */}
//                             <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
//                               <Heart className="w-4 h-4 mr-2" />
//                               Save
//                             </button>
//                           </div>

//                           {/* Remove Button */}
//                           <button
//                             className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//                             onClick={() => handleRemoveItem(item)}
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" />
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="space-y-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-semibold">Order Summary</h3>
//             </div>
//             <div className="p-6 space-y-4">
//               {/* Coupon Code */}
//               <div>
//                 <p className="font-medium mb-2">Coupon Code</p>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Enter coupon code"
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value)}
//                     disabled={isApplyingCoupon}
//                     className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                   <button
//                     onClick={handleApplyCoupon}
//                     disabled={isApplyingCoupon || !couponCode.trim()}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isApplyingCoupon ? "Applying..." : "Apply"}
//                   </button>
//                 </div>
//               </div>

//               {appliedCoupon && (
//                 <div className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <div className="flex items-center">
//                         <Tag className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
//                         <span className="font-medium text-green-700 dark:text-green-300">
//                           {appliedCoupon.couponCode}
//                         </span>
//                       </div>
//                       <p className="text-sm text-green-600 dark:text-green-400 mt-1">
//                         {appliedCoupon.discountPercentage}% discount applied
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-green-700 dark:text-green-300">
//                         -${appliedCoupon.discountAmount.toFixed(2)}
//                       </p>
//                       <button
//                         onClick={handleRemoveCoupon}
//                         className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-1"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//               {/* Price Breakdown */}
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span className="font-medium">${subTotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span>${shippingFees.toFixed(2)}</span>
//                 </div>
//                 {appliedCoupon && (
//                   <div className="flex justify-between text-green-600 dark:text-green-400">
//                     <span>Discount ({appliedCoupon.couponCode})</span>
//                     <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//               {/* Total */}
//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>

//               {/* Checkout Button */}
//               <Link
//                 href="/shop/checkout"
//                 className="block w-full text-center py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Proceed to Checkout
//               </Link>

//               {/* Continue Shopping */}
//               <Link
//                 href="/shop"
//                 className="flex items-center justify-center w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <ShoppingBag className="w-4 h-4 mr-2" />
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>

//           {/* Security Info */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//             <div className="p-6">
//               <div className="text-center space-y-2">
//                 <div className="flex justify-center gap-4 text-gray-500 dark:text-gray-400">
//                   <span>🔒 Secure Checkout</span>
//                   <span>🔄 30-Day Returns</span>
//                   <span>📦 Free Shipping</span>
//                 </div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Your payment information is encrypted and secure.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Skeleton Loader
// const CartSkeleton = () => (
//   <div className="container mx-auto px-4 py-8">
//     <div className="mb-8">
//       <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
//       <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 space-y-4">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//             <div className="p-6">
//               <div className="flex gap-4">
//                 <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="flex justify-between mt-4">
//                     <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                     <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//           </div>
//           <div className="p-6 space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
//                 <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default CartPage;

//////////////

// app/shop/cart/page.tsx






// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/app/cart-store/useCartStore";
// import { useToast } from "@/app/projects/components/ui/use-toast";
// import { Trash2, Plus, Minus, Heart, ShoppingBag, X } from "lucide-react";
// import { AppliedCouponType, CartProductType } from "@/app/lib/types";
// import { useSession } from "@/app/SessionProvider";

// const CartPage = () => {
//   const {
//     cart,
//     updateProductQuantity,
//     removeFromCart,
//     setCart,
//     setAppliedCoupon,
//     removeCoupon,
//     appliedCoupon,
//   } = useCartStore();

//   const { toast } = useToast();
//   const [couponCode, setCouponCode] = useState("");
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [shippingMethod] = useState<"free" | "express">("free");
//   const [loading, setLoading] = useState(false);
//   const [removeModal, setRemoveModal] = useState<{
//     isOpen: boolean;
//     product: CartProductType | null;
//   }>({
//     isOpen: false,
//     product: null,
//   });

//   const { user } = useSession();

//   // Component mount olduğunda cart'ı localStorage'dan yükle
//   useEffect(() => {
//     const loadCartFromStorage = () => {
//       try {
//         setLoading(true);
//         const savedCart = localStorage.getItem("cart-store");

//         if (savedCart) {
//           const parsedData = JSON.parse(savedCart);
//           const cartFromStorage = parsedData.state?.cart || [];

//           if (cartFromStorage.length > 0) {
//             setCart(cartFromStorage);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load cart from storage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCartFromStorage();
//   }, [setCart]);

//   const handleQuantityChange = (
//     product: CartProductType,
//     newQuantity: number
//   ) => {
//     if (newQuantity < 1) return;

//     try {
//       updateProductQuantity(product, newQuantity);
//       toast({
//         title: "Quantity updated",
//         description: "Item quantity has been updated.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update quantity.",
//         variant: "destructive",
//       });
//     }
//   };

//   const openRemoveModal = (product: CartProductType) => {
//     setRemoveModal({
//       isOpen: true,
//       product,
//     });
//   };

//   const closeRemoveModal = () => {
//     setRemoveModal({
//       isOpen: false,
//       product: null,
//     });
//   };

//   const handleRemoveItem = () => {
//     if (!removeModal.product) return;

//     try {
//       removeFromCart(removeModal.product);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart.",
//       });
//       closeRemoveModal();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to remove item.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleApplyCoupon = async () => {
//   if (!couponCode.trim()) {
//     toast({
//       title: "Error",
//       description: "Please enter a coupon code.",
//       variant: "destructive",
//     });
//     return;
//   }

//   setIsApplyingCoupon(true);

//   try {
//     // Sepet toplamını hesapla
//     const cartTotal = getSubTotal();

//     // 1. Kuponu doğrula
//     const validateResponse = await fetch("/api/oneshop/coupon/validate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         couponCode: couponCode.trim().toUpperCase(),
//         userId: user?.id,
//         cartTotal: cartTotal,
//       }),
//     });

//     const validateData = await validateResponse.json();

//     if (!validateData.valid || !validateData.coupon) {
//       throw new Error(validateData.message || "Invalid coupon");
//     }

//     // 2. Kuponu store'a uygula
//     setAppliedCoupon(validateData.coupon);
//     setCouponCode("");

//     // 3. Başarılı mesajı göster
//     toast({
//       title: "Success!",
//       description: validateData.message || "Coupon has been applied successfully.",
//     });

//   } catch (error) {
//     toast({
//       title: "Error",
//       description:
//         error instanceof Error ? error.message : "Failed to apply coupon.",
//       variant: "destructive",
//     });
//   } finally {
//     setIsApplyingCoupon(false);
//   }
// };

// const handleRemoveCoupon = async () => {
//   if (!appliedCoupon) return;

//   try {
//     // Kuponu store'dan kaldır
//     removeCoupon();

//     // API'ye kupon kaldırma isteği gönder (isteğe bağlı)
//     await fetch("/api/oneshop/coupon/remove", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         couponId: appliedCoupon.couponId,
//         userId: user?.id,
//       }),
//     });

//     toast({
//       title: "Coupon removed",
//       description: "Coupon has been removed from your cart.",
//     });
//   } catch (error) {
//     console.error("Failed to remove coupon:", error);
//     // Store'dan kaldırma başarılı oldu, sadece toast göster
//     toast({
//       title: "Coupon removed",
//       description: "Coupon has been removed from your cart.",
//     });
//   }
// };



//   // Helper functions - store'dan gelen değerleri kullan
//   const getSubTotal = () => {
//     return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const getShippingFees = () => {
//     return shippingMethod === "free" ? 0 : 9.99;
//   };

//   const getTotal = () => {
//     const subTotal = getSubTotal();
//     const shippingFees = getShippingFees();

//     if (appliedCoupon) {
//       return Math.max(
//         0,
//         subTotal + shippingFees - appliedCoupon.discountAmount
//       );
//     }

//     return subTotal + shippingFees;
//   };

//   const getItemCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   // Store'a göre gruplama
//   const getStoreGroupedItems = () => {
//     const grouped: Record<string, CartProductType[]> = {};

//     cart.forEach((item) => {
//       const storeId = item.storeId || "store-1";
//       if (!grouped[storeId]) {
//         grouped[storeId] = [];
//       }
//       grouped[storeId].push(item);
//     });

//     return grouped;
//   };

//   const subTotal = getSubTotal();
//   const shippingFees = getShippingFees();
//   const total = getTotal();
//   const itemCount = getItemCount();
//   const storeGroupedItems = getStoreGroupedItems();

//   if (loading && cart.length === 0) {
//     return <CartSkeleton />;
//   }

//   if (cart.length === 0 && !loading) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
//             <ShoppingBag className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">
//             Looks like you haven't added any items to your cart yet. Start
//             shopping to add items.
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
//     <>
//       {/* Remove Confirmation Modal */}
//       {removeModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Remove Item</h3>
//                 <button
//                   onClick={closeRemoveModal}
//                   className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 mb-6">
//                 Are you sure you want to remove{" "}
//                 <span className="font-medium">{removeModal.product?.name}</span>{" "}
//                 from your cart?
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeRemoveModal}
//                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRemoveItem}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Shopping Cart</h1>
//           <p className="text-gray-500">
//             {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items - Responsive yapı */}
//           <div className="lg:col-span-2">
//             {Object.entries(storeGroupedItems).map(([storeId, storeItems]) => (
//               <div
//                 key={storeId}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
//               >
//                 <div>
//                   {storeItems.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}-${item.sizeId}`}
//                       className="p-6 border-t border-gray-100 dark:border-gray-700"
//                     >
//                       <div className="flex flex-col sm:flex-row gap-4">
//                         {/* Product Image */}
//                         <div className="relative w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 overflow-hidden">
//                           <Image
//                             src={item.image || "/placeholder-product.jpg"}
//                             alt={item.name}
//                             width={200}
//                             height={200}
//                             className="object-contain rounded-md bg-white max-w-full max-h-full"
//                             sizes="(max-width: 640px) 100vw, 96px"
//                           />
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-1 flex flex-col justify-between">
//                           {/* Name, Size, SKU, Price */}
//                           <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3">
//                             <div className="flex-1">
//                               <Link
//                                 href={`/shop/productdetails/${item.productSlug}/${item.variantSlug}`}
//                                 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 text-lg"
//                               >
//                                 {item.name}
//                               </Link>
//                               <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                 <div className="flex flex-wrap gap-2">
//                                   <span>Size: {item.size}</span>
//                                   <span>•</span>
//                                   <span>SKU: {item.sku}</span>
//                                 </div>

//                                 {/* Mobilde fiyat */}
//                                 <div className="sm:hidden mt-2">
//                                   <p className="font-bold text-lg">
//                                     ${(item.price * item.quantity).toFixed(2)}
//                                   </p>
//                                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                                     ${item.price.toFixed(2)} each
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Desktop fiyat */}
//                             <div className="hidden sm:block text-right">
//                               <p className="font-bold text-lg">
//                                 ${(item.price * item.quantity).toFixed(2)}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 ${item.price.toFixed(2)} each
//                               </p>
//                             </div>
//                           </div>

//                           {/* Actions */}
//                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
//                             <div className="flex items-center justify-start gap-4 flex-wrap">
//                               {/* Quantity Selector */}
//                               <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
//                                 <button
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item,
//                                       item.quantity - 1
//                                     )
//                                   }
//                                   disabled={item.quantity <= 1}
//                                   className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                   <Minus className="w-3 h-3" />
//                                 </button>
//                                 <span className="w-12 text-center text-sm">
//                                   {item.quantity}
//                                 </span>
//                                 <button
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item,
//                                       item.quantity + 1
//                                     )
//                                   }
//                                   className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                 </button>
//                               </div>

//                               {/* Save Button Desktop */}
//                               <button className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
//                                 <Heart className="w-4 h-4 mr-2" /> Save
//                               </button>
//                             </div>

//                             <div className="flex items-center justify-end gap-4 flex-wrap">
//                               {/* Save Button Mobile */}
//                               <button className="sm:hidden flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
//                                 <Heart className="w-4 h-4 mr-2" /> Save
//                               </button>

//                               {/* Remove Button */}
//                               <button
//                                 className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//                                 onClick={() => openRemoveModal(item)}
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" /> Remove
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary - Responsive yapı */}
//           <div className="lg:sticky lg:top-8 space-y-6">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-lg font-semibold">Order Summary</h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 {/* Coupon Code */}
//                 <div>
//                   <p className="font-medium mb-2">Coupon Code</p>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Enter coupon code"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       disabled={isApplyingCoupon || !!appliedCoupon}
//                       className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={
//                         isApplyingCoupon ||
//                         !couponCode.trim() ||
//                         !!appliedCoupon
//                       }
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isApplyingCoupon ? "Applying..." : "Apply"}
//                     </button>
//                   </div>
//                 </div>

//                 {appliedCoupon && (
//                   <div className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//                       <div>
//                         <div className="flex items-center">
//                           <span className="font-medium text-green-700 dark:text-green-300">
//                             {appliedCoupon.couponCode}
//                           </span>
//                         </div>
//                         <p className="text-sm text-green-600 dark:text-green-400 mt-1">
//                           {appliedCoupon.discountPercentage}% discount applied
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-green-700 dark:text-green-300">
//                           -${appliedCoupon.discountAmount.toFixed(2)}
//                         </p>
//                         <button
//                           onClick={handleRemoveCoupon}
//                           className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-1"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span className="font-medium">${subTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>${shippingFees.toFixed(2)}</span>
//                   </div>
//                   {appliedCoupon && (
//                     <div className="flex justify-between text-green-600 dark:text-green-400">
//                       <span>Discount ({appliedCoupon.couponCode})</span>
//                       <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//                 {/* Total */}
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>

//                 {/* Checkout Button */}
//                 <Link
//                   href="/shop/checkout"
//                   className="block w-full text-center py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Proceed to Checkout
//                 </Link>

//                 {/* Continue Shopping */}
//                 <Link
//                   href="/shop"
//                   className="flex items-center justify-center w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <ShoppingBag className="w-4 h-4 mr-2" />
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>

//             {/* Security Info - Responsive düzen */}
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6">
//                 <div className="text-center space-y-2">
//                   <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-gray-500 dark:text-gray-400">
//                     <span>🔒 Secure Checkout</span>
//                     <span className="hidden sm:inline">🔄 30-Day Returns</span>
//                     <span>📦 Free Shipping</span>
//                   </div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Your payment information is encrypted and secure.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Skeleton Loader - Responsive yapı
// const CartSkeleton = () => (
//   <div className="container mx-auto px-4 py-8">
//     <div className="mb-8">
//       <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
//       <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 space-y-4">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//             </div>
//             <div className="p-6">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="w-full sm:w-24 h-64 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4">
//                     <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                     <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
//           </div>
//           <div className="p-6 space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
//                 <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default CartPage;











//New














// "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCartStore } from "@/app/cart-store/useCartStore";
// import { useToast } from "@/app/projects/components/ui/use-toast";
// import { Trash2, Plus, Minus, Heart, ShoppingBag, X } from "lucide-react";
// import { AppliedCouponType, CartProductType } from "@/app/lib/types";
// import { useSession } from "@/app/SessionProvider";

// const CartPage = () => {
//   const {
//     cart,
//     updateProductQuantity,
//     removeFromCart,
//     setCart,
//     setAppliedCoupon,
//     removeCoupon,
//     appliedCoupon,
//   } = useCartStore();

//   const { toast } = useToast();
//   const [couponCode, setCouponCode] = useState("");
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
//   const [shippingMethod] = useState<"free" | "express">("free");
//   const [loading, setLoading] = useState(false);
//   const [removeModal, setRemoveModal] = useState<{
//     isOpen: boolean;
//     product: CartProductType | null;
//   }>({
//     isOpen: false,
//     product: null,
//   });

//   const { user } = useSession();

//   // Component mount olduğunda cart'ı localStorage'dan yükle
//   useEffect(() => {
//     const loadCartFromStorage = () => {
//       try {
//         setLoading(true);
//         const savedCart = localStorage.getItem("cart-store");

//         if (savedCart) {
//           const parsedData = JSON.parse(savedCart);
//           const cartFromStorage = parsedData.state?.cart || [];

//           if (cartFromStorage.length > 0) {
//             setCart(cartFromStorage);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load cart from storage:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCartFromStorage();
//   }, [setCart]);

//   // Memoize edilmiş helper fonksiyonlar
//   const getSubTotal = useMemo(() => {
//     return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   }, [cart]);

//   const getShippingFees = useMemo(() => {
//     return shippingMethod === "free" ? 0 : 9.99;
//   }, [shippingMethod]);

//   const getTotal = useMemo(() => {
//     const subTotal = getSubTotal;
//     const shippingFees = getShippingFees;

//     if (appliedCoupon) {
//       return Math.max(
//         0,
//         subTotal + shippingFees - appliedCoupon.discountAmount
//       );
//     }

//     return subTotal + shippingFees;
//   }, [getSubTotal, getShippingFees, appliedCoupon]);

//   const getItemCount = useMemo(() => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   }, [cart]);

//   // Store'a göre gruplama - useMemo ile optimize
//   const getStoreGroupedItems = useMemo(() => {
//     const grouped: Record<string, CartProductType[]> = {};

//     cart.forEach((item) => {
//       const storeId = item.storeId || "store-1";
//       if (!grouped[storeId]) {
//         grouped[storeId] = [];
//       }
//       grouped[storeId].push(item);
//     });

//     return grouped;
//   }, [cart]);

//   const handleQuantityChange = useCallback(
//     (product: CartProductType, newQuantity: number) => {
//       if (newQuantity < 1) return;

//       try {
//         updateProductQuantity(product, newQuantity);
//         toast({
//           title: "Quantity updated",
//           description: "Item quantity has been updated.",
//         });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to update quantity.",
//           variant: "destructive",
//         });
//       }
//     },
//     [updateProductQuantity, toast]
//   );

//   const openRemoveModal = useCallback((product: CartProductType) => {
//     setRemoveModal({
//       isOpen: true,
//       product,
//     });
//   }, []);

//   const closeRemoveModal = useCallback(() => {
//     setRemoveModal({
//       isOpen: false,
//       product: null,
//     });
//   }, []);

//   const handleRemoveItem = useCallback(() => {
//     if (!removeModal.product) return;

//     try {
//       removeFromCart(removeModal.product);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart.",
//       });
//       closeRemoveModal();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to remove item.",
//         variant: "destructive",
//       });
//     }
//   }, [removeModal.product, removeFromCart, toast, closeRemoveModal]);

//   const handleApplyCoupon = useCallback(async () => {
//     if (!couponCode.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a coupon code.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsApplyingCoupon(true);

//     try {
//       const cartTotal = getSubTotal;

//       // Paralel fetch için abort controller
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 10000);

//       const validateResponse = await fetch("/api/oneshop/coupon/validate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           couponCode: couponCode.trim().toUpperCase(),
//           userId: user?.id,
//           cartTotal: cartTotal,
//         }),
//         signal: controller.signal,
//         // Önbellekleme ekleyerek hızlandır
//         cache: 'no-store'
//       });

//       clearTimeout(timeoutId);

//       const validateData = await validateResponse.json();

//       if (!validateData.valid || !validateData.coupon) {
//         throw new Error(validateData.message || "Invalid coupon");
//       }

//       setAppliedCoupon(validateData.coupon);
//       setCouponCode("");

//       toast({
//         title: "Success!",
//         description: validateData.message || "Coupon has been applied successfully.",
//       });

//     } catch (error) {
//       if (error instanceof Error && error.name === 'AbortError') {
//         toast({
//           title: "Timeout",
//           description: "Request timed out. Please try again.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Error",
//           description:
//             error instanceof Error ? error.message : "Failed to apply coupon.",
//           variant: "destructive",
//         });
//       }
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   }, [couponCode, toast, user?.id, getSubTotal, setAppliedCoupon]);

//   const handleRemoveCoupon = useCallback(async () => {
//     if (!appliedCoupon) return;

//     try {
//       removeCoupon();

//       // Arka planda API çağrısı - bekleme yapma
//       fetch("/api/oneshop/coupon/remove", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           couponId: appliedCoupon.couponId,
//           userId: user?.id,
//         }),
//         cache: 'no-store'
//       }).catch(console.error);

//       toast({
//         title: "Coupon removed",
//         description: "Coupon has been removed from your cart.",
//       });
//     } catch (error) {
//       console.error("Failed to remove coupon:", error);
//       toast({
//         title: "Coupon removed",
//         description: "Coupon has been removed from your cart.",
//       });
//     }
//   }, [appliedCoupon, removeCoupon, user?.id, toast]);

//   if (loading && cart.length === 0) {
//     return <CartSkeleton />;
//   }

//   if (cart.length === 0 && !loading) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
//             <ShoppingBag className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">
//             Looks like you haven't added any items to your cart yet. Start
//             shopping to add items.
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
//     <>
//       {/* Remove Confirmation Modal */}
//       {removeModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Remove Item</h3>
//                 <button
//                   onClick={closeRemoveModal}
//                   className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 mb-6">
//                 Are you sure you want to remove{" "}
//                 <span className="font-medium">{removeModal.product?.name}</span>{" "}
//                 from your cart?
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeRemoveModal}
//                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRemoveItem}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Shopping Cart</h1>
//           <p className="text-gray-500">
//             {getItemCount} item{getItemCount !== 1 ? "s" : ""} in your cart
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             {Object.entries(getStoreGroupedItems).map(([storeId, storeItems]) => (
//               <div
//                 key={storeId}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
//               >
//                 <div>
//                   {storeItems.map((item) => (
//                     <div
//                       key={`${item.productId}-${item.variantId}-${item.sizeId}`}
//                       className="p-6 border-t border-gray-100 dark:border-gray-700"
//                     >
//                       <div className="flex flex-col sm:flex-row gap-4">
//                         {/* Product Image */}
//                         <div className="relative w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 overflow-hidden">
//                           <Image
//                             src={item.image || "/placeholder-product.jpg"}
//                             alt={item.name}
//                             width={200}
//                             height={200}
//                             className="object-contain rounded-md bg-white max-w-full max-h-full"
//                             sizes="(max-width: 640px) 100vw, 96px"
//                             loading="lazy"
//                           />
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-1 flex flex-col justify-between">
//                           <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3">
//                             <div className="flex-1">
//                               <Link
//                                 href={`/shop/productdetails/${item.productSlug}/${item.variantSlug}`}
//                                 className="font-medium hover:text-blue-600 dark:hover:text-blue-400 text-lg"
//                               >
//                                 {item.name}
//                               </Link>
//                               <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                 <div className="flex flex-wrap gap-2">
//                                   <span>Size: {item.size}</span>
//                                   <span>•</span>
//                                   <span>SKU: {item.sku}</span>
//                                 </div>

//                                 <div className="sm:hidden mt-2">
//                                   <p className="font-bold text-lg">
//                                     ${(item.price * item.quantity).toFixed(2)}
//                                   </p>
//                                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                                     ${item.price.toFixed(2)} each
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="hidden sm:block text-right">
//                               <p className="font-bold text-lg">
//                                 ${(item.price * item.quantity).toFixed(2)}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 ${item.price.toFixed(2)} each
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
//                             <div className="flex items-center justify-start gap-4 flex-wrap">
//                               <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
//                                 <button
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item,
//                                       item.quantity - 1
//                                     )
//                                   }
//                                   disabled={item.quantity <= 1}
//                                   className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                   <Minus className="w-3 h-3" />
//                                 </button>
//                                 <span className="w-12 text-center text-sm">
//                                   {item.quantity}
//                                 </span>
//                                 <button
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item,
//                                       item.quantity + 1
//                                     )
//                                   }
//                                   className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                 </button>
//                               </div>

//                               <button className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
//                                 <Heart className="w-4 h-4 mr-2" /> Save
//                               </button>
//                             </div>

//                             <div className="flex items-center justify-end gap-4 flex-wrap">
//                               <button className="sm:hidden flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
//                                 <Heart className="w-4 h-4 mr-2" /> Save
//                               </button>

//                               <button
//                                 className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
//                                 onClick={() => openRemoveModal(item)}
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" /> Remove
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:sticky lg:top-8 space-y-6">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="text-lg font-semibold">Order Summary</h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div>
//                   <p className="font-medium mb-2">Coupon Code</p>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Enter coupon code"
//                       value={couponCode}
//                       onChange={(e) => setCouponCode(e.target.value)}
//                       disabled={isApplyingCoupon || !!appliedCoupon}
//                       className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                     <button
//                       onClick={handleApplyCoupon}
//                       disabled={
//                         isApplyingCoupon ||
//                         !couponCode.trim() ||
//                         !!appliedCoupon
//                       }
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isApplyingCoupon ? "Applying..." : "Apply"}
//                     </button>
//                   </div>
//                 </div>

//                 {appliedCoupon && (
//                   <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
//                       <div>
//                         <div className="flex items-center">
//                           <span className="font-medium text-green-700 dark:text-green-300">
//                             {appliedCoupon.couponCode}
//                           </span>
//                         </div>
//                         <p className="text-sm text-green-600 dark:text-green-400 mt-1">
//                           {appliedCoupon.discountPercentage}% discount applied
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-green-700 dark:text-green-300">
//                           -${appliedCoupon.discountAmount.toFixed(2)}
//                         </p>
//                         <button
//                           onClick={handleRemoveCoupon}
//                           className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-1"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span className="font-medium">${getSubTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>${getShippingFees.toFixed(2)}</span>
//                   </div>
//                   {appliedCoupon && (
//                     <div className="flex justify-between text-green-600 dark:text-green-400">
//                       <span>Discount ({appliedCoupon.couponCode})</span>
//                       <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total</span>
//                   <span>${getTotal.toFixed(2)}</span>
//                 </div>

//                 <Link
//                   href="/shop/checkout"
//                   className="block w-full text-center py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Proceed to Checkout
//                 </Link>

//                 <Link
//                   href="/shop"
//                   className="flex items-center justify-center w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <ShoppingBag className="w-4 h-4 mr-2" />
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="p-6">
//                 <div className="text-center space-y-2">
//                   <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-gray-500 dark:text-gray-400">
//                     <span>🔒 Secure Checkout</span>
//                     <span className="hidden sm:inline">🔄 30-Day Returns</span>
//                     <span>📦 Free Shipping</span>
//                   </div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Your payment information is encrypted and secure.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Skeleton Loader
// const CartSkeleton = () => (
//   <div className="container mx-auto px-4 py-8">
//     <div className="mb-8">
//       <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
//       <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <div className="lg:col-span-2 space-y-4">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//               <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//             </div>
//             <div className="p-6">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="w-full sm:w-24 h-64 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                   <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                   <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4">
//                     <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                     <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//           </div>
//           <div className="p-6 space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//                 <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default CartPage;












"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/cart-store/useCartStore";
import { useToast } from "@/app/projects/components/ui/use-toast";
import { Trash2, Plus, Minus, Heart, ShoppingBag, X } from "lucide-react";
import { AppliedCouponType, CartProductType } from "@/app/lib/types";
import { useSession } from "@/app/SessionProvider";

// Memoized Cart Item Component
const CartItem = memo(({ 
  item, 
  onQuantityChange, 
  onRemove 
}: { 
  item: CartProductType;
  onQuantityChange: (item: CartProductType, quantity: number) => void;
  onRemove: (item: CartProductType) => void;
}) => {
  const itemTotal = useMemo(() => item.price * item.quantity, [item.price, item.quantity]);

  return (
    <div className="p-6 border-t border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 overflow-hidden">
          <Image
            src={item.image || "/placeholder-product.jpg"}
            alt={item.name}
            width={200}
            height={200}
            className="object-contain rounded-md bg-white max-w-full max-h-full"
            sizes="(max-width: 640px) 100vw, 96px"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3">
            <div className="flex-1">
              <Link
                href={`/shop/productdetails/${item.productSlug}/${item.variantSlug}`}
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400 text-lg"
              >
                {item.name}
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <div className="flex flex-wrap gap-2">
                  <span>Size: {item.size}</span>
                  <span>•</span>
                  <span>SKU: {item.sku}</span>
                </div>

                <div className="sm:hidden mt-2">
                  <p className="font-bold text-lg">
                    ${itemTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="font-bold text-lg">
                ${itemTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${item.price.toFixed(2)} each
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-center justify-start gap-4 flex-wrap">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => onQuantityChange(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-12 text-center text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(item, item.quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Heart className="w-4 h-4 mr-2" /> Save
              </button>
            </div>

            <div className="flex items-center justify-end gap-4 flex-wrap">
              <button className="sm:hidden flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Heart className="w-4 h-4 mr-2" /> Save
              </button>

              <button
                className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                onClick={() => onRemove(item)}
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

// Memoized Store Section Component
const StoreSection = memo(({ 
  storeId, 
  items, 
  onQuantityChange, 
  onRemove 
}: {
  storeId: string;
  items: CartProductType[];
  onQuantityChange: (item: CartProductType, quantity: number) => void;
  onRemove: (item: CartProductType) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div>
        {items.map((item) => (
          <CartItem
            key={`${item.productId}-${item.variantId}-${item.sizeId}`}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
});

StoreSection.displayName = 'StoreSection';

// Memoized Order Summary Component
const OrderSummary = memo(({
  subTotal,
  shippingFees,
  appliedCoupon,
  couponCode,
  isApplyingCoupon,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  getTotal
}: {
  subTotal: number;
  shippingFees: number;
  appliedCoupon: AppliedCouponType | null;
  couponCode: string;
  isApplyingCoupon: boolean;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  getTotal: number;
}) => {
  return (
    <div className="lg:sticky lg:top-8 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Order Summary</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="font-medium mb-2">Coupon Code</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                disabled={isApplyingCoupon || !!appliedCoupon}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={onApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim() || !!appliedCoupon}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>

          {appliedCoupon && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-green-700 dark:text-green-300">
                      {appliedCoupon.couponCode}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {appliedCoupon.discountPercentage}% discount applied
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 dark:text-green-300">
                    -${appliedCoupon.discountAmount.toFixed(2)}
                  </p>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingFees.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount ({appliedCoupon.couponCode})</span>
                <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4"></div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${getTotal.toFixed(2)}</span>
          </div>

          <Link
            href="/shop/checkout"
            className="block w-full text-center py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="text-center space-y-2">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-gray-500 dark:text-gray-400">
              <span>🔒 Secure Checkout</span>
              <span className="hidden sm:inline">🔄 30-Day Returns</span>
              <span>📦 Free Shipping</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

OrderSummary.displayName = 'OrderSummary';

// Memoized Empty Cart Component
const EmptyCart = memo(() => (
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-md mx-auto text-center">
      <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
      <p className="text-gray-500 mb-8">
        Looks like you haven't added any items to your cart yet. Start
        shopping to add items.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

// Skeleton Loader
const CartSkeleton = memo(() => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-8">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-64 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4">
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
));

CartSkeleton.displayName = 'CartSkeleton';

const CartPage = () => {
  const {
    cart,
    updateProductQuantity,
    removeFromCart,
    setCart,
    setAppliedCoupon,
    removeCoupon,
    appliedCoupon,
  } = useCartStore();

  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [shippingMethod] = useState<"free" | "express">("free");
  const [loading, setLoading] = useState(false);
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    product: CartProductType | null;
  }>({
    isOpen: false,
    product: null,
  });

  const { user } = useSession();

  // Component mount olduğunda cart'ı localStorage'dan yükle
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem("cart-store");

        if (savedCart) {
          const parsedData = JSON.parse(savedCart);
          const cartFromStorage = parsedData.state?.cart || [];

          if (cartFromStorage.length > 0) {
            setCart(cartFromStorage);
          }
        }
      } catch (error) {
        console.error("Failed to load cart from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromStorage();
  }, [setCart]);

  // Memoize edilmiş helper fonksiyonlar
  const getSubTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const getShippingFees = useMemo(() => {
    return shippingMethod === "free" ? 0 : 9.99;
  }, [shippingMethod]);

  const getTotal = useMemo(() => {
    const subTotal = getSubTotal;
    const shippingFees = getShippingFees;

    if (appliedCoupon) {
      return Math.max(
        0,
        subTotal + shippingFees - appliedCoupon.discountAmount
      );
    }

    return subTotal + shippingFees;
  }, [getSubTotal, getShippingFees, appliedCoupon]);

  const getItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Store'a göre gruplama - useMemo ile optimize
  const getStoreGroupedItems = useMemo(() => {
    const grouped: Record<string, CartProductType[]> = {};

    cart.forEach((item) => {
      const storeId = item.storeId || "store-1";
      if (!grouped[storeId]) {
        grouped[storeId] = [];
      }
      grouped[storeId].push(item);
    });

    return grouped;
  }, [cart]);

  const handleQuantityChange = useCallback(
    (product: CartProductType, newQuantity: number) => {
      if (newQuantity < 1) return;

      try {
        updateProductQuantity(product, newQuantity);
        toast({
          title: "Quantity updated",
          description: "Item quantity has been updated.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update quantity.",
          variant: "destructive",
        });
      }
    },
    [updateProductQuantity, toast]
  );

  const openRemoveModal = useCallback((product: CartProductType) => {
    setRemoveModal({
      isOpen: true,
      product,
    });
  }, []);

  const closeRemoveModal = useCallback(() => {
    setRemoveModal({
      isOpen: false,
      product: null,
    });
  }, []);

  const handleRemoveItem = useCallback(() => {
    if (!removeModal.product) return;

    try {
      removeFromCart(removeModal.product);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      closeRemoveModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  }, [removeModal.product, removeFromCart, toast, closeRemoveModal]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const cartTotal = getSubTotal;

      // Paralel fetch için abort controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const validateResponse = await fetch("/api/oneshop/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          userId: user?.id,
          cartTotal: cartTotal,
        }),
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      const validateData = await validateResponse.json();

      if (!validateData.valid || !validateData.coupon) {
        throw new Error(validateData.message || "Invalid coupon");
      }

      setAppliedCoupon(validateData.coupon);
      setCouponCode("");

      toast({
        title: "Success!",
        description: validateData.message || "Coupon has been applied successfully.",
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "Request timed out. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to apply coupon.",
          variant: "destructive",
        });
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode, toast, user?.id, getSubTotal, setAppliedCoupon]);

  const handleRemoveCoupon = useCallback(async () => {
    if (!appliedCoupon) return;

    try {
      removeCoupon();

      // Arka planda API çağrısı - bekleme yapma
      fetch("/api/oneshop/coupon/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponId: appliedCoupon.couponId,
          userId: user?.id,
        }),
        cache: 'no-store'
      }).catch(console.error);

      toast({
        title: "Coupon removed",
        description: "Coupon has been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to remove coupon:", error);
      toast({
        title: "Coupon removed",
        description: "Coupon has been removed from your cart.",
      });
    }
  }, [appliedCoupon, removeCoupon, user?.id, toast]);

  // Memoize store sections render
  const storeSections = useMemo(() => {
    return Object.entries(getStoreGroupedItems).map(([storeId, storeItems]) => (
      <StoreSection
        key={storeId}
        storeId={storeId}
        items={storeItems}
        onQuantityChange={handleQuantityChange}
        onRemove={openRemoveModal}
      />
    ));
  }, [getStoreGroupedItems, handleQuantityChange, openRemoveModal]);

  if (loading && cart.length === 0) {
    return <CartSkeleton />;
  }

  if (cart.length === 0 && !loading) {
    return <EmptyCart />;
  }

  return (
    <>
      {/* Remove Confirmation Modal */}
      {removeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Remove Item</h3>
                <button
                  onClick={closeRemoveModal}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to remove{" "}
                <span className="font-medium">{removeModal.product?.name}</span>{" "}
                from your cart?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeRemoveModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveItem}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-500">
            {getItemCount} item{getItemCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {storeSections}
          </div>

          {/* Order Summary */}
          <OrderSummary
            subTotal={getSubTotal}
            shippingFees={getShippingFees}
            appliedCoupon={appliedCoupon}
            couponCode={couponCode}
            isApplyingCoupon={isApplyingCoupon}
            onCouponCodeChange={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            getTotal={getTotal}
          />
        </div>
      </div>
    </>
  );
};

export default CartPage;