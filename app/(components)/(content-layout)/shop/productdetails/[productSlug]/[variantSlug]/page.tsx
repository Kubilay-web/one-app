// "use client"

// import { useEffect, useState, Suspense } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { toast } from "react-hot-toast"
// import {
//   Star,
//   Heart,
//   ShoppingCart,
//   Share2,
//   ChevronLeft,
//   Truck,
//   Shield,
//   RefreshCw,
//   Check,
//   Package,
// } from "lucide-react"
// import { useSession } from "@/app/SessionProvider"
// import { CartProductType } from "@/app/lib/types"
// import { useCartStore } from "@/app/cart-store/useCartStore"

// interface ProductVariant {
//   id: string
//   variantName: string
//   variantDescription: string
//   variantImage: string
//   slug: string
//   isSale: boolean
//   saleEndDate?: string
//   keywords: string
//   sku: string
//   sales: number
//   weight: number
//   sizes: Size[]
//   images: ProductImage[]
//   colors: Color[]
//   specs: Spec[]
//   product?: {
//     id: string
//     name: string
//     description: string
//     slug: string
//     storeId: string
//     category?: {
//       name: string
//       url: string
//     }
//     subCategory?: {
//       name: string
//       url: string
//     }
//   }
//   createdAt: string
//   updatedAt: string
// }

// interface Size {
//   id: string
//   size: string
//   quantity: number
//   price: number
//   discount: number
// }

// interface ProductImage {
//   id: string
//   url: string
//   alt: string
// }

// interface Color {
//   id: string
//   name: string
// }

// interface Spec {
//   id: string
//   name: string
//   value: string
// }

// interface Product {
//   id: string
//   name: string
//   description: string
//   slug: string
//   brand: string
//   rating: number
//   sales: number
//   numReviews: number
//   shippingFeeMethod: string
//   views: number
//   freeShippingForAllCountries: boolean
//   createdAt: string
//   updatedAt: string
//   store?: {
//     id: string
//     name: string
//     logo: string
//     averageRating: number
//   }
//   category?: {
//     id: string
//     name: string
//     url: string
//   }
//   subCategory?: {
//     id: string
//     name: string
//     url: string
//   }
//   specs: Spec[]
//   variants: ProductVariant[]
//   reviews: Review[]
// }

// interface Review {
//   id: string
//   variant: string
//   variantImage?: string
//   review: string
//   rating: number
//   color: string
//   size: string
//   quantity: string
//   likes: number
//   images: ReviewImage[]
//   user: {
//     id: string
//     username: string
//     displayName: string
//     avatarUrl?: string
//   }
//   createdAt: string
// }

// interface ReviewImage {
//   id: string
//   url: string
//   alt: string
// }

// interface WishlistItem {
//   id: string
//   productId: string
//   variantId: string
//   sizeId?: string
// }

// const ProductDetailsPage = () => {
//   const params = useParams()
//   const router = useRouter()
//   const { user } = useSession()

//   const [product, setProduct] = useState<Product | null>(null)
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
//   const [selectedSize, setSelectedSize] = useState<Size | null>(null)
//   const [selectedColor, setSelectedColor] = useState<Color | null>(null)
//   const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)
//   const [quantity, setQuantity] = useState(1)
//   const [loading, se$oading] = useState(true)
//   const [addingToCart, setAddingToCart] = useState(false)
//   const [isInWishlist, setIsInWishlist] = useState(false)
//   const [reviews, setReviews] = useState<Review[]>([])
//   const [averageRating, setAverageRating] = useState(0)
//   const [ratingDistribution, setRatingDistribution] = useState<any[]>([])
//   const [activeTab, setActiveTab] = useState("description")
//   const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

//     const addToCart = useCartStore((state) => state.addToCart);

//   // Fetch product and variant data
//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         se$oading(true)

//         // Fetch product details
//         const productResponse = await fetch(`/api/oneshop/products/${params.productSlug}`)
//         if (!productResponse.ok) {
//           throw new Error("Product not found")
//         }

//         const productData: Product = await productResponse.json()
//         setProduct(productData)

//         // Fetch variant details
//         const variantResponse = await fetch(
//           `/api/oneshop/products/${params.productSlug}/variants/${params.variantSlug}`
//         )

//         if (variantResponse.ok) {
//           const variantData = await variantResponse.json()
//           setSelectedVariant(variantData.variant)

//           // Select first image
//           if (variantData.variant.images?.length > 0) {
//             setSelectedImage(variantData.variant.images[0])
//           }

//           // Select first size
//           if (variantData.variant.sizes?.length > 0) {
//             setSelectedSize(variantData.variant.sizes[0])
//           }

//           // Select first color
//           if (variantData.variant.colors?.length > 0) {
//             setSelectedColor(variantData.variant.colors[0])
//           }
//         } else {
//           throw new Error("Variant not found")
//         }

//         // Fetch reviews
//         const reviewsResponse = await fetch(
//           `/api/oneshop/products/${params.productSlug}/reviews`
//         )
//         if (reviewsResponse.ok) {
//           const reviewsData = await reviewsResponse.json()
//           setReviews(reviewsData.reviews || [])
//           setAverageRating(reviewsData.stats?.averageRating || 0)
//           setRatingDistribution(reviewsData.stats?.ratingDistribution || [])
//         }

//         // Fetch wishlist if user is logged in
//         if (user) {
//           const wishlistResponse = await fetch("/api/oneshop/wishlist")
//           if (wishlistResponse.ok) {
//             const wishlistData = await wishlistResponse.json()
//             setWishlistItems(wishlistData)

//             // Check if current product variant is in wishlist
//             const isWishlisted = wishlistData.some(
//               (item: WishlistItem) =>
//                 item.productId === productData.id &&
//                 item.variantId === selectedVariant?.id
//             )
//             setIsInWishlist(isWishlisted)
//           }
//         }
//       } catch (error) {
//         console.error("Error loading product data:", error)
//         toast.error("Failed to load product data")
//       } finally {
//         se$oading(false)
//       }
//     }

//     if (params.productSlug && params.variantSlug) {
//       fetchProductData()
//     }
//   }, [params.productSlug, params.variantSlug, user])

//   // Update wishlist status when selectedVariant changes
//   useEffect(() => {
//     if (user && selectedVariant) {
//       const isWishlisted = wishlistItems.some(
//         (item) =>
//           item.productId === product?.id &&
//           item.variantId === selectedVariant.id
//       )
//       setIsInWishlist(isWishlisted)
//     }
//   }, [selectedVariant, product, wishlistItems, user])

//   // Add to cart

//   const handleAddToCart = () => {
//   if (!product || !selectedVariant || !selectedSize) {
//     toast.error("Please select size and variant")
//     return
//   }

//   // CartItem oluştur
//   const cartItem: CartProductType = {
//     productId: product.id,
//     variantId: selectedVariant.id,
//     sizeId: selectedSize.id,
//     productSlug: product.slug,
//     variantSlug: selectedVariant.slug,
//     sku: selectedVariant.sku,
//     name: `${product.name} - ${selectedVariant.variantName}`,
//     image: selectedImage?.url || selectedVariant.variantImage,
//     size: selectedSize.size,
//     price: selectedSize.price - (selectedSize.price * selectedSize.discount) / 100,
//     quantity: quantity,
//     shippingFee: product.freeShippingForAllCountries ? 0 : 5, // Varsayılan shipping fee
//     totalPrice: (selectedSize.price - (selectedSize.price * selectedSize.discount) / 100) * quantity
//   }

//   // Zustand store'u kullanarak sepete ekle
//   addToCart(cartItem)
//   toast.success("Product added to cart!")
// }

//   // Add/remove from wishlist
//   const handleWishlistToggle = async () => {
//     if (!user) {
//       toast.error("Please login to add to wishlist")
//       router.push("/auth/login")
//       return
//     }

//     if (!product || !selectedVariant) {
//       toast.error("Product information not found")
//       return
//     }

//     try {
//       const response = await fetch("/api/oneshop/wishlist", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           variantId: selectedVariant.id,
//           sizeId: selectedSize?.id,
//         }),
//       })

//       if (response.ok) {
//         const result = await response.json()

//         if (result.message === "Removed from wishlist") {
//           setIsInWishlist(false)
//           setWishlistItems(prev => prev.filter(item =>
//             !(item.productId === product.id && item.variantId === selectedVariant.id)
//           ))
//           toast.success("Removed from wishlist")
//         } else {
//           setIsInWishlist(true)
//           setWishlistItems(prev => [...prev, {
//             id: result.id,
//             productId: product.id,
//             variantId: selectedVariant.id,
//             sizeId: selectedSize?.id
//           }])
//           toast.success("Added to wishlist")
//         }
//       } else {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Operation failed")
//       }
//     } catch (error: any) {
//       console.error("Wishlist operation error:", error)
//       toast.error(error.message || "Operation failed")
//     }
//   }

//   // Share product
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           ti$e: product?.name,
//           text: product?.description?.substring(0, 100) + "...",
//           url: window.location.href,
//         })
//       } catch (error) {
//         console.error("Share error:", error)
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast.success("Link copied to clipboard!")
//     }
//   }

//   // Buy now
//   const handleBuyNow = async () => {
//     if (!user) {
//       toast.error("Please login to purchase")
//       router.push("/auth/login")
//       return
//     }

//     if (!selectedVariant || !selectedSize) {
//       toast.error("Please select a size")
//       return
//     }

//     try {
//       // First add to cart
//       const cartItem = {
//         productId: product!.id,
//         variantId: selectedVariant.id,
//         sizeId: selectedSize.id,
//         productSlug: product!.slug,
//         variantSlug: selectedVariant.slug,
//         sku: selectedVariant.sku,
//         name: product!.name,
//         image: selectedImage?.url || selectedVariant.variantImage,
//         size: selectedSize.size,
//         price: selectedSize.price - (selectedSize.price * selectedSize.discount) / 100,
//         quantity,
//         shippingFee: 0,
//       }

//       const cartResponse = await fetch("/api/oneshop/cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(cartItem),
//       })

//       if (cartResponse.ok) {
//         // Redirect to checkout
//         router.push("/checkout")
//       } else {
//         throw new Error("Failed to add to cart")
//       }
//     } catch (error: any) {
//       console.error("Buy now error:", error)
//       toast.error(error.message || "Failed to proceed to checkout")
//     }
//   }

//   // Helper functions
//   const getRatingStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`h-5 w-5 ${
//           i < Math.floor(rating)
//             ? "text-yellow-400 fill-current"
//             : "text-gray-300 dark:text-gray-600"
//         }`}
//       />
//     ))
//   }

//   const getDiscountedPrice = (price: number, discount: number) => {
//     return price - (price * discount) / 100
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   // Product not found
//   if (!product || !selectedVariant) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
//         <Link
//           href="/shop"
//           className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
//         >
//           Back to Shop
//         </Link>
//       </div>
//     )
//   }

//   // Calculate discounted price
//   const discountPrice = selectedSize
//     ? getDiscountedPrice(selectedSize.price, selectedSize.discount)
//     : 0

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Breadcrumb */}
//       <div className="border-b border-gray-200 dark:border-gray-800 py-4">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//             <Link href="/" className="hover:text-primary">
//               Home
//             </Link>
//             <ChevronLeft className="h-4 w-4" />
//             <Link href="/shop" className="hover:text-primary">
//               Shop
//             </Link>
//             <ChevronLeft className="h-4 w-4" />
//             <Link
//               href={`/shop/category/${product.category?.url || '#'}`}
//               className="hover:text-primary"
//             >
//               {product.category?.name || "Category"}
//             </Link>
//             <ChevronLeft className="h-4 w-4" />
//             <span className="text-primary font-medium">
//               {product.name}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Product Details */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Product Images */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//               <Image
//                 src={selectedImage?.url || selectedVariant.variantImage}
//                 alt={selectedImage?.alt || product.name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 priority
//               />

//               {/* Discount and Wishlist Buttons */}
//               <div className="absolute top-4 right-4 flex space-x-2">
//                 {selectedSize?.discount && selectedSize.discount > 0 && (
//                   <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                     {selectedSize.discount}% OFF
//                   </div>
//                 )}
//                 <button
//                   onClick={handleWishlistToggle}
//                   className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
//                   aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   <Heart
//                     className={`h-6 w-6 transition-colors ${
//                       isInWishlist
//                         ? "fill-red-500 text-red-500"
//                         : "text-gray-600 dark:text-gray-400"
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* Thumbnail Images */}
//             <div className="grid grid-cols-4 gap-3">
//               <button
//                 onClick={() => setSelectedImage(null)}
//                 className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
//                   !selectedImage
//                     ? "border-primary"
//                     : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                 }`}
//               >
//                 <Image
//                   src={selectedVariant.variantImage}
//                   alt={product.name}
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 25vw, 12.5vw"
//                 />
//               </button>

//               {selectedVariant.images?.map((image) => (
//                 <button
//                   key={image.id}
//                   onClick={() => setSelectedImage(image)}
//                   className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
//                     selectedImage?.id === image.id
//                       ? "border-primary"
//                       : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                   }`}
//                 >
//                   <Image
//                     src={image.url}
//                     alt={image.alt || product.name}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 768px) 25vw, 12.5vw"
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Store Info */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center space-x-3">
//                 <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
//                   <Image
//                     src={product.store?.logo || "/images/default-store.png"}
//                     alt={product.store?.name || "Store"}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-lg truncate">
//                     {product.store?.name || "Store"}
//                   </h3>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <div className="flex items-center">
//                       <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                       <span className="ml-1 text-sm">
//                         {product.store?.averageRating?.toFixed(1) || "0.0"}
//                       </span>
//                     </div>
//                     <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
//                       • Visit Store
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
//                   onClick={() => product.store?.id && router.push(`/store/${product.store.id}`)}
//                 >
//                   Visit Store
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Product Information */}
//           <div className="space-y-6">
//             {/* Product Ti$e and Rating */}
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {product.name} - {selectedVariant.variantName}
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 mt-2">
//                 <div className="flex items-center">
//                   <div className="flex">
//                     {getRatingStars(averageRating)}
//                   </div>
//                   <span className="ml-2 font-semibold">
//                     {averageRating.toFixed(1)}
//                   </span>
//                   <span className="ml-2 text-gray-500 dark:text-gray-400">
//                     ({product.numReviews || 0} reviews)
//                   </span>
//                 </div>
//                 <span className="text-gray-500 dark:text-gray-400">•</span>
//                 <span className="text-gray-500 dark:text-gray-400">
//                   {product.sales || 0} sold
//                 </span>
//                 <span className="text-gray-500 dark:text-gray-400">•</span>
//                 <span className="text-gray-500 dark:text-gray-400">
//                   {product.views || 0} views
//                 </span>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="space-y-2">
//               <div className="flex flex-wrap items-center gap-3">
//                 {selectedSize?.discount && selectedSize.discount > 0 ? (
//                   <>
//                     <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                       {discountPrice.toFixed(2)} $
//                     </span>
//                     <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
//                       {selectedSize.price.toFixed(2)} $
//                     </span>
//                     <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-sm font-semibold">
//                       {selectedSize.discount}% off
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-3xl font-bold text-gray-900 dark:text-white">
//                     {selectedSize?.price.toFixed(2) || "0.00"} $
//                   </span>
//                 )}
//               </div>
//               <p className={`text-sm ${product.freeShippingForAllCountries ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
//                 {product.freeShippingForAllCountries
//                   ? "Free shipping"
//                   : "Shipping cost applies"}
//               </p>
//             </div>

//             {/* Color Selection */}
//             {selectedVariant.colors && selectedVariant.colors.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="font-semibold text-lg">Color:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedVariant.colors.map((color) => (
//                     <button
//                       key={color.id}
//                       onClick={() => setSelectedColor(color)}
//                       className={`px-4 py-2 rounded-lg border-2 transition-colors ${
//                         selectedColor?.id === color.id
//                           ? "border-primary bg-primary/10 text-primary"
//                           : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary"
//                       }`}
//                     >
//                       {color.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {selectedVariant.sizes && selectedVariant.sizes.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="font-semibold text-lg">Size:</h3>
//                 <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
//                   {selectedVariant.sizes.map((size) => (
//                     <button
//                       key={size.id}
//                       onClick={() => setSelectedSize(size)}
//                       disabled={size.quantity === 0}
//                       className={`px-3 py-2 rounded-lg border-2 transition-colors text-center ${
//                         selectedSize?.id === size.id
//                           ? "border-primary bg-primary/10 text-primary"
//                           : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary"
//                       } ${
//                         size.quantity === 0
//                           ? "opacity-50 cursor-not-allowed"
//                           : ""
//                       }`}
//                     >
//                       <div className="space-y-1">
//                         <div className="font-medium">{size.size}</div>
//                         {size.discount > 0 ? (
//                           <div className="text-xs space-y-0.5">
//                             <div className="line-through text-gray-500 dark:text-gray-400">
//                               {size.price.toFixed(2)} $
//                             </div>
//                             <div className="text-red-500 font-semibold">
//                               {getDiscountedPrice(size.price, size.discount).toFixed(2)} $
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-xs font-semibold">
//                             {size.price.toFixed(2)} $
//                           </div>
//                         )}
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           {size.quantity} in stock
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity Selection */}
//             <div className="space-y-3">
//               <h3 className="font-semibold text-lg">Quantity:</h3>
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="px-4 py-2 min-w-[60px] text-center font-medium">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     disabled={quantity >= (selectedSize?.quantity || 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">
//                   Stock: {selectedSize?.quantity || 0} available
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={addingToCart || !selectedSize || (selectedSize.quantity || 0) === 0}
//                 className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
//               >
//                 {addingToCart ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <>
//                     <ShoppingCart className="h-5 w-5 mr-2" />
//                     Add to Cart
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={!selectedSize || (selectedSize.quantity || 0) === 0}
//                 className="flex-1 bg-white dark:bg-gray-800 text-primary border-2 border-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Buy Now
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
//                 aria-label="Share"
//               >
//                 <Share2 className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Delivery Information */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                   <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">Free Shipping</div>
//                   <div className="text-sm text-gray-500 dark:text-gray-400">
//                     Orders over 150 $
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                   <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">Easy Returns</div>
//                   <div className="text-sm text-gray-500 dark:text-gray-400">
//                     Within 30 days
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                   <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">Secure Shopping</div>
//                   <div className="text-sm text-gray-500 dark:text-gray-400">
//                     256-bit SSL
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Details Tabs */}
//         <div className="mt-12">
//           <div className="border-b border-gray-200 dark:border-gray-800">
//             <div className="flex space-x-8 overflow-x-auto pb-1">
//               {["description", "specs", "reviews", "qa"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`py-4 px-1 font-medium text-lg border-b-2 transition-colors whitespace-nowrap ${
//                     activeTab === tab
//                       ? "border-primary text-primary"
//                       : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//                   }`}
//                 >
//                   {tab === "description" && "Description"}
//                   {tab === "specs" && "Specifications"}
//                   {tab === "reviews" && "Reviews"}
//                   {tab === "qa" && "Q&A"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="py-8">
//             {activeTab === "description" && (
//               <div className="prose dark:prose-invert max-w-none">
//                 <h3 className="text-2xl font-bold mb-4">Product Description</h3>
//                 <p className="text-gray-700 dark:text-gray-300 mb-4">
//                   {product.description}
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-300 mb-4">
//                   {selectedVariant.variantDescription}
//                 </p>

//                 <h4 className="text-xl font-semibold mt-6 mb-3">Key Features</h4>
//                 <ul className="space-y-2">
//                   <li className="flex items-start">
//                     <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                     <span>High-quality materials</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                     <span>Long-lasting durability</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                     <span>Easy to clean and maintain</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                     <span>Environmentally friendly production</span>
//                   </li>
//                 </ul>
//               </div>
//             )}

//             {activeTab === "specs" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-6">Product Specifications</h3>
//                   <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
//                     <h4 className="font-semibold text-lg mb-4">General Specifications</h4>
//                     <dl className="space-y-3">
//                       {product.specs?.map((spec) => (
//                         <div key={spec.id} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
//                           <dt className="text-gray-600 dark:text-gray-400 font-medium">
//                             {spec.name}
//                           </dt>
//                           <dd className="font-semibold text-gray-900 dark:text-white">
//                             {spec.value}
//                           </dd>
//                         </div>
//                       ))}
//                     </dl>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-2xl font-bold mb-6">Variant Specifications</h3>
//                   <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
//                     <h4 className="font-semibold text-lg mb-4">Variant Details</h4>
//                     <dl className="space-y-3">
//                       {selectedVariant.specs?.map((spec) => (
//                         <div key={spec.id} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
//                           <dt className="text-gray-600 dark:text-gray-400 font-medium">
//                             {spec.name}
//                           </dt>
//                           <dd className="font-semibold text-gray-900 dark:text-white">
//                             {spec.value}
//                           </dd>
//                         </div>
//                       ))}
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "reviews" && (
//               <div className="space-y-8">
//                 {/* Rating Summary */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   <div className="lg:col-span-1">
//                     <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
//                       <div className="text-center mb-6">
//                         <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">
//                           {averageRating.toFixed(1)}
//                         </div>
//                         <div className="flex justify-center mb-2">
//                           {getRatingStars(averageRating)}
//                         </div>
//                         <div className="text-gray-500 dark:text-gray-400">
//                           {product.numReviews || 0} reviews
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         {[5, 4, 3, 2, 1].map((rating) => {
//                           const ratingData = ratingDistribution.find(
//                             (r) => r.rating === rating
//                           )
//                           const totalReviews = product.numReviews || 1
//                           const percentage = ratingData
//                             ? (ratingData._count.rating / totalReviews) * 100
//                             : 0

//                           return (
//                             <div key={rating} className="flex items-center">
//                               <div className="flex items-center w-16">
//                                 <span className="text-sm font-medium mr-2">{rating}</span>
//                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                               </div>
//                               <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                                 <div
//                                   className="h-full bg-yellow-400 transition-all duration-300"
//                                   style={{ width: `${percentage}%` }}
//                                 />
//                               </div>
//                               <div className="w-12 text-right text-sm text-gray-500 dark:text-gray-400">
//                                 {ratingData?._count.rating || 0}
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Reviews List */}
//                   <div className="lg:col-span-2">
//                     <div className="space-y-6">
//                       {reviews.length > 0 ? (
//                         reviews.map((review) => (
//                           <div
//                             key={review.id}
//                             className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
//                           >
//                             <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
//                               <div className="flex items-start space-x-3">
//                                 <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
//                                   {review.user.avatarUrl ? (
//                                     <Image
//                                       src={review.user.avatarUrl}
//                                       alt={review.user.displayName}
//                                       fill
//                                       className="object-cover"
//                                     />
//                                   ) : (
//                                     <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
//                                       {review.user.displayName?.charAt(0) || 'U'}
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div>
//                                   <div className="font-semibold text-gray-900 dark:text-white">
//                                     {review.user.displayName || "User"}
//                                   </div>
//                                   <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
//                                     <div className="flex">
//                                       {[...Array(5)].map((_, i) => (
//                                         <Star
//                                           key={i}
//                                           className={`h-3 w-3 ${
//                                             i < review.rating
//                                               ? "text-yellow-400 fill-current"
//                                               : "text-gray-300 dark:text-gray-600"
//                                           }`}
//                                         />
//                                       ))}
//                                     </div>
//                                     <span>•</span>
//                                     <span>
//                                       {new Date(review.createdAt).toLocaleDateString('en-US', {
//                                         year: 'numeric',
//                                         month: 'long',
//                                         day: 'numeric'
//                                       })}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                               {review.variant && (
//                                 <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
//                                   {review.variant}
//                                 </div>
//                               )}
//                             </div>

//                             <p className="text-gray-700 dark:text-gray-300 mb-4">
//                               {review.review}
//                             </p>

//                             {review.images && review.images.length > 0 && (
//                               <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
//                                 {review.images.map((image) => (
//                                   <div
//                                     key={image.id}
//                                     className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700"
//                                   >
//                                     <Image
//                                       src={image.url}
//                                       alt={image.alt || "Review image"}
//                                       fill
//                                       className="object-cover"
//                                     />
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
//                               <div className="flex items-center space-x-4">
//                                 <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
//                                   <Heart className="h-4 w-4" />
//                                   <span>{review.likes || 0}</span>
//                                 </button>
//                                 <button className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
//                                   Reply
//                                 </button>
//                                 <button className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
//                                   Report
//                                 </button>
//                               </div>
//                               <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-wrap gap-2">
//                                 {review.color && (
//                                   <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//                                     Color: {review.color}
//                                   </span>
//                                 )}
//                                 {review.size && (
//                                   <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//                                     Size: {review.size}
//                                   </span>
//                                 )}
//                                 {review.quantity && (
//                                   <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//                                     {review.quantity} unit{review.quantity !== '1' ? 's' : ''}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-12">
//                           <div className="text-gray-400 dark:text-gray-500 mb-4">
//                             No reviews yet
//                           </div>
//                           <button
//                             onClick={() => setActiveTab("description")}
//                             className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
//                           >
//                             Be the first to review
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "qa" && (
//               <div className="space-y-6">
//                 <div className="text-center py-12">
//                   <h3 className="text-2xl font-bold mb-4">Questions & Answers</h3>
//                   <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
//                     No questions have been asked about this product yet. Be the first to ask a question!
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                     <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
//                       Ask a Question
//                     </button>
//                     <button
//                       onClick={() => setActiveTab("reviews")}
//                       className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       Read Reviews
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Similar Products */}
//         <div className="mt-12">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Similar Products
//             </h2>
//             <Link
//               href={`/shop/category/${product.category?.url || '#'}`}
//               className="text-primary hover:text-primary/80 font-medium transition-colors"
//             >
//               View All →
//             </Link>
//           </div>

//           {/* Similar products grid - placeholder */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
//               <div className="relative aspect-square">
//                 <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//                 <div className="relative z-10 p-4">
//                   <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 inline-block">
//                     <Package className="h-6 w-6 text-gray-400" />
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h4 className="font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
//                   Similar Product
//                 </h4>
//                 <div className="flex items-center justify-between">
//                   <div className="text-lg font-bold text-primary">
//                     299.99 $
//                   </div>
//                   <div className="flex items-center">
//                     <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                     <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">4.5</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Loading skeleton component
// const LoadingSkeleton = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="border-b border-gray-200 dark:border-gray-800 py-4">
//         <div className="container mx-auto px-4">
//           <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left column skeleton */}
//           <div className="space-y-4">
//             <div className="aspect-square rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
//             <div className="grid grid-cols-4 gap-3">
//               {[...Array(4)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="aspect-square rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse"
//                 ></div>
//               ))}
//             </div>
//             <div className="bg-gray-300 dark:bg-gray-700 rounded-xl p-4 animate-pulse">
//               <div className="flex items-center space-x-3">
//                 <div className="h-12 w-12 rounded-full bg-gray-400 dark:bg-gray-600"></div>
//                 <div className="flex-1">
//                   <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-32 mb-2"></div>
//                   <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded w-24"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right column skeleton */}
//           <div className="space-y-6">
//             <div>
//               <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse mb-4"></div>
//               <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
//             </div>
//             <div className="space-y-4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="space-y-2">
//                   <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
//                   <div className="flex space-x-2">
//                     {[...Array(3)].map((_, j) => (
//                       <div
//                         key={j}
//                         className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"
//                       ></div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Main component with Suspense wrapper
// export default function ProductDetailsPageWrapper() {
//   return (
//     <Suspense fallback={<LoadingSkeleton />}>
//       <ProductDetailsPage />
//     </Suspense>
//   )
// }

////////////////

"use client";

import { useEffect, useState, Suspense, Fragment, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  Truck,
  Shield,
  RefreshCw,
  Check,
  Package,
  Tag,
  Tags,
  CheckCircle,
  Image as ImageIcon,
  MessageCircle,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Send,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { useSession } from "@/app/SessionProvider";
import { CartProductType } from "@/app/lib/types";
import { useCartStore } from "@/app/cart-store/useCartStore";
import SpkSwiperJs from "@/shared/@spk-reusable-components/spk-packages/spk-swiperjs";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import {
  productDetailsData,
  ProductSwiperComponent,
  TestimonialsSwiperComponent,
} from "@/shared/data/apps/ecommers/customer/product-details-data";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Lightboxcomponent } from "@/shared/@spk-reusable-components/spk-packages/spk-lightbox-component";

// Interfaces
interface ProductVariant {
  id: string;
  variantName: string;
  variantDescription: string;
  variantImage: string;
  slug: string;
  isSale: boolean;
  saleEndDate?: string;
  keywords: string;
  sku: string;
  sales: number;
  weight: number;
  sizes: Size[];
  images: ProductImage[];
  colors: Color[];
  specs: Spec[];
  product?: {
    id: string;
    name: string;
    description: string;
    slug: string;
    storeId: string;
    category?: {
      name: string;
      url: string;
    };
    subCategory?: {
      name: string;
      url: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface Size {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface Color {
  id: string;
  name: string;
  code?: string;
}

interface Spec {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  brand: string;
  rating: number;
  sales: number;
  numReviews: number;
  shippingFeeMethod: string;
  views: number;
  freeShippingForAllCountries: boolean;
  createdAt: string;
  updatedAt: string;
  store?: {
    id: string;
    name: string;
    logo: string;
    averageRating: number;
  };
  category?: {
    id: string;
    name: string;
    url: string;
  };
  subCategory?: {
    id: string;
    name: string;
    url: string;
  };
  specs: Spec[];
  variants: ProductVariant[];
}

interface Review {
  id: string;
  variant: string;
  variantImage?: string;
  review: string;
  rating: number;
  color: string;
  size: string;
  quantity: string;
  likes: number;
  images: ReviewImage[];
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface ReviewImage {
  id: string;
  url: string;
  alt: string;
}

interface WishlistItem {
  id: string;
  productId: string;
  variantId: string;
  sizeId?: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  upvotes: number;
  downvotes: number;
  userVote?: "upvote" | "downvote" | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  variantSlug: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  store?: {
    name: string;
    logo: string;
  };
}

interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  variantName: string;
  price: number;
  originalPrice: number;
  variantSlug: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);

  // Zoom states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoomOverlay, setShowZoomOverlay] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoomedImageRef = useRef<HTMLDivElement>(null);

  // New states for features
  const [questions, setQuestions] = useState<Question[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    review: "",
    color: "",
    size: "",
    variant: "",
    images: [] as File[],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">(
    "reviews",
  );

  const addToCart = useCartStore((state) => state.addToCart);

  const breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 20 },
    480: { slidesPerView: 2, spaceBetween: 30 },
    640: { slidesPerView: 3, spaceBetween: 40 },
    1440: { slidesPerView: 4, spaceBetween: 40 },
  };

  // Fetch all product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await fetch(
          `/api/oneshop/products/${params.productSlug}`,
        );
        if (!productResponse.ok) throw new Error("Product not found");
        const productData: Product = await productResponse.json();
        setProduct(productData);

        // Fetch variant details
        const variantResponse = await fetch(
          `/api/oneshop/products/${params.productSlug}/variants/${params.variantSlug}`,
        );

        let currentVariant = null;
        if (variantResponse.ok) {
          const variantData = await variantResponse.json();
          currentVariant = variantData.variant;
          setSelectedVariant(currentVariant);

          // Select first image
          if (currentVariant.images?.length > 0) {
            setSelectedImage(currentVariant.images[0]);
            const slides = currentVariant.images.map((img: ProductImage) => ({
              src: img.url,
            }));
            setLightboxSlides(slides);
          }

          // Select first size and color
          if (currentVariant.sizes?.length > 0) {
            setSelectedSize(currentVariant.sizes[0]);
          }
          if (currentVariant.colors?.length > 0) {
            setSelectedColor(currentVariant.colors[0]);
          }
        }

        // Fetch all related data in parallel
        const [reviewsRes, questionsRes, relatedRes, similarRes, wishlistRes] =
          await Promise.all([
            fetch(`/api/oneshop/products/${params.productSlug}/reviews`),
            fetch(`/api/oneshop/products/${params.productSlug}/questions`),
            fetch(`/api/oneshop/products/${params.productSlug}/related`),
            fetch(`/api/oneshop/products/${params.productSlug}/similar`),
            user ? fetch("/api/oneshop/wishlist") : Promise.resolve(null),
          ]);

        // Process reviews
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
          setAverageRating(reviewsData.stats?.averageRating || 0);
          setRatingDistribution(reviewsData.stats?.ratingDistribution || []);
        }

        // Process questions
        if (questionsRes.ok) {
          const questionsData = await questionsRes.json();
          setQuestions(questionsData.questions || []);
        }

        // Process related products
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedProducts(relatedData.products || []);
        }

        // Process similar products
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          setSimilarProducts(similarData.products || []);
        }

        // Process wishlist
        if (wishlistRes?.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlistItems(wishlistData);
          if (user && currentVariant) {
            const isWishlisted = wishlistData.some(
              (item: WishlistItem) =>
                item.productId === productData.id &&
                item.variantId === currentVariant.id,
            );
            setIsInWishlist(isWishlisted);
          }
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (params.productSlug && params.variantSlug) {
      fetchProductData();
    }
  }, [params.productSlug, params.variantSlug, user]);

  // Add to wishlist function
  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    if (!product || !selectedVariant) return;

    try {
      const response = await fetch("/api/oneshop/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          sizeId: selectedSize?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
        toast.success(
          data.inWishlist ? "Added to wishlist!" : "Removed from wishlist",
        );
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // Delete review function
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/oneshop/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        toast.success("Review deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Submit review function
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      router.push("/login");
      return;
    }

    if (!reviewData.rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewData.review.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", reviewData.rating.toString());
      formData.append("review", reviewData.review);
      formData.append("variant", selectedVariant.variantName);
      formData.append("color", selectedColor?.name || "");
      formData.append("size", selectedSize?.size || "");
      formData.append("quantity", quantity.toString());

      reviewData.images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      const response = await fetch(
        `/api/oneshop/products/${product?.slug}/reviews`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setReviewData({
          rating: 0,
          review: "",
          color: "",
          size: "",
          variant: "",
          images: [],
        });
        setShowReviewForm(false);
        toast.success("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  // Handle file upload for review images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setReviewData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray],
      }));
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (index: number) => {
    setReviewData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZooming || !imageContainerRef.current) return;

    const container = imageContainerRef.current;
    const rect = container.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(5, prev + 0.5));
    if (!isZooming) {
      setIsZooming(true);
      setShowZoomOverlay(true);
    }
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(1, prev - 0.5));
    if (zoomLevel <= 1.5) {
      setIsZooming(false);
      setShowZoomOverlay(false);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZooming(false);
    setShowZoomOverlay(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const handleToggleZoom = () => {
    if (isZooming) {
      handleResetZoom();
    } else {
      setIsZooming(true);
      setShowZoomOverlay(true);
      setZoomLevel(2);
    }
  };

  // Add to cart function

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedSize) {
      toast.error("Please select size and variant");
      return;
    }

    // Stock kontrolü
    const availableStock = selectedSize.quantity || 0;
    const existingCartItem = useCartStore
      .getState()
      .cart.find(
        (item) =>
          item.productId === product.id &&
          item.variantId === selectedVariant.id &&
          item.sizeId === selectedSize.id,
      );

    const alreadyInCart = existingCartItem ? existingCartItem.quantity : 0;
    const totalRequested = alreadyInCart + quantity;

    if (totalRequested > availableStock) {
      const availableToAdd = Math.max(0, availableStock - alreadyInCart);

      if (availableToAdd === 0) {
        toast.error("This item is out of stock");
        return;
      } else {
        toast.error(`Only ${availableToAdd} items available in stock`);
        setQuantity(availableToAdd);
        return;
      }
    }

    const discountPrice =
      selectedSize.price - (selectedSize.price * selectedSize.discount) / 100;
    const shippingFee = calculateShippingFee();

    const cartItem: CartProductType = {
      productId: product.id,
      variantId: selectedVariant.id,
      sizeId: selectedSize.id,
      productSlug: product.slug,
      variantSlug: selectedVariant.slug,
      sku: selectedVariant.sku,
      name: product.name,
      image: selectedImage?.url || selectedVariant.variantImage,
      size: selectedSize.size,
      price: discountPrice,
      quantity: quantity,
      shippingFee: shippingFee,
      totalPrice: discountPrice * quantity,
      storeId: product.store?.id || "",
      storeName: product.store?.name || "Unknown Store",
      storeLogo: product.store?.logo || "/images/default-store.png",
      storeUrl: product.store?.id ? `/store/${product.store.id}` : "#",
      variantName: selectedVariant.variantName,
      variantImage: selectedVariant.variantImage,
      stock: selectedSize.quantity, // Stock bilgisini ekliyoruz
      weight: selectedVariant.weight || 0,
      shippingMethod: product.shippingFeeMethod || "standard",
      shippingService: "Standard Delivery",
      extraShippingFee: 0,
      deliveryTimeMin: 3,
      deliveryTimeMax: 7,
      isFreeShipping: product.freeShippingForAllCountries,
      discount: selectedSize.discount,
      discountedPrice: discountPrice,
      categoryId: product.category?.id,
      categoryName: product.category?.name,
      categoryUrl: product.category?.url,
    };

    setAddingToCart(true);
    try {
      addToCart(cartItem);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // Helper functions
  const calculateShippingFee = () => {
    if (!product || !selectedSize) return 0;
    if (product.freeShippingForAllCountries) return 0;
    let fee = 5;
    const weight = selectedVariant?.weight || 0;
    if (weight > 5) fee += 2;
    return fee;
  };

  const getDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  const getRatingStars = (rating: number, size: string = "text-[0.75rem]") => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`ri-star-s-fill ${size} ${
          i < Math.floor(rating)
            ? "text-warning"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <Link
          href="/shop"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountPrice = selectedSize
    ? getDiscountedPrice(selectedSize.price, selectedSize.discount)
    : 0;

  return (
    <Fragment>
      {/* Breadcrumb */}
      <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
        <div className="container">
          <Seo title={"Product Details"} />
          <Pageheader
            Updated={true}
            breadcrumbs={["Apps", "Ecommerce", "Customer"]}
            currentpage="Product Details"
          />
        </div>
      </div>

      {/* Main Section */}
      <section className="section !py-4">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6">
            {/* Product Images */}
            <div className="xl:col-span-6 col-span-12">
              <div className="box">
                <div className="box-body !p-2">
                  <div className="hs-tooltip ti-main-tooltip !absolute top-2 end-2 z-[1]">
                    <button
                      onClick={handleWishlistToggle}
                      className="hs-tooltip-toggle ti-btn ti-btn-icon !rounded-full !bg-white dark:!bg-bodybg top-wishlist-icon"
                    >
                      <i
                        className={`ri-heart-fill ${isInWishlist ? "text-danger" : "text-gray-400"}`}
                      ></i>
                      <span className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm">
                        {isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                      </span>
                    </button>
                  </div>

                  {/* Enhanced Image Container with Zoom */}
                  <div className="box !border-0 !mb-0">
                    <div className="ecommerce-gallery relative">
                      {selectedSize?.discount && selectedSize.discount > 0 && (
                        <span className="absolute top-3 left-3 z-10 badge bg-warning tag-badge text-white">
                          {selectedSize.discount}% OFF
                        </span>
                      )}

                      {/* Zoom Controls */}
                      <div className="absolute top-3 right-3 z-10 flex gap-1">
                        <button
                          onClick={handleZoomIn}
                          className="ti-btn ti-btn-icon !rounded-full !bg-white/90 dark:!bg-gray-800/90 backdrop-blur-sm"
                          title="Zoom In"
                        >
                          <ZoomIn size={16} />
                        </button>
                        <button
                          onClick={handleZoomOut}
                          className="ti-btn ti-btn-icon !rounded-full !bg-white/90 dark:!bg-gray-800/90 backdrop-blur-sm"
                          title="Zoom Out"
                          disabled={zoomLevel <= 1}
                        >
                          <ZoomOut size={16} />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="ti-btn ti-btn-icon !rounded-full !bg-white/90 dark:!bg-gray-800/90 backdrop-blur-sm"
                          title="Reset Zoom"
                        >
                          <RotateCw size={16} />
                        </button>
                        <button
                          onClick={() => setOpenLightbox(true)}
                          className="ti-btn ti-btn-icon !rounded-full !bg-white/90 dark:!bg-gray-800/90 backdrop-blur-sm"
                          title="Fullscreen"
                        >
                          <Maximize2 size={16} />
                        </button>
                      </div>

                      {/* Main Image Container */}
                      <div
                        ref={imageContainerRef}
                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-zoom-in"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() =>
                          isZooming && setShowZoomOverlay(true)
                        }
                        onMouseLeave={() => setShowZoomOverlay(false)}
                        onClick={handleToggleZoom}
                      >
                        {/* Main Image */}
                        <div
                          className={`relative w-full h-full transition-transform duration-300 ${isZooming ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                          style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }}
                        >
                          <Image
                            priority
                            fill
                            alt={product.name}
                            src={
                              selectedImage?.url || selectedVariant.variantImage
                            }
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>

                        {/* Zoom Overlay */}
                        {showZoomOverlay && isZooming && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-black/5"></div>
                            <div
                              className="absolute w-32 h-32 border-2 border-white/80 shadow-lg rounded-lg pointer-events-none"
                              style={{
                                left: `calc(${zoomPosition.x}% - 64px)`,
                                top: `calc(${zoomPosition.y}% - 64px)`,
                              }}
                            ></div>
                          </div>
                        )}

                        {/* Zoom Level Indicator */}
                        {isZooming && (
                          <div className="absolute bottom-3 left-3 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {zoomLevel.toFixed(1)}x
                          </div>
                        )}
                      </div>

                      {/* Image Gallery Thumbnails */}
                      {selectedVariant.images &&
                        selectedVariant.images.length > 0 && (
                          <div className="mt-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {selectedVariant.images.map((image, index) => (
                                <button
                                  key={image.id}
                                  onClick={() => {
                                    setSelectedImage(image);
                                    handleResetZoom();
                                  }}
                                  className={`relative mt-10 flex-shrink-0 w-20 h-20 rounded border-2 ${selectedImage?.id === image.id ? "border-primary" : "border-transparent"}`}
                                >
                                  <div className="relative w-full h-full rounded overflow-hidden">
                                    <Image
                                      fill
                                      src={image.url}
                                      alt={
                                        image.alt ||
                                        `Product image ${index + 1}`
                                      }
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                  </div>
                                </button>
                              ))}
                            </div>
                            <div className="text-center mt-2">
                              <span className="ti-btn ti-btn-soft-primary classifyimage-btn !rounded-full cursor-pointer text-sm">
                                <ImageIcon
                                  className="me-2 bg-primary !text-white feature-icons !border-0"
                                  size={14}
                                />
                                {selectedVariant.images.length} Images
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Lightbox (for fullscreen view) */}
                  {lightboxSlides.length > 0 && (
                    <Lightboxcomponent
                      close={() => setOpenLightbox(false)}
                      zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                      open={openLightbox}
                      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                      slides={lightboxSlides}
                      index={0}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="xl:col-span-6 col-span-12">
              <div className="box">
                <div className="box-body">
                  <div>
                    <p className="text-[1.125rem] font-semibold mb-0">
                      {product.name} - {selectedVariant.variantName}
                    </p>

                    <p className="text-[1.125rem] mb-5">
                      {getRatingStars(averageRating, "text-[0.875rem]")}
                      <span className="font-semibold ms-1">
                        {averageRating.toFixed(1)}
                        <Link
                          scroll={false}
                          className="text-info ms-2"
                          href="#reviews"
                        >
                          ({product.numReviews || 0} Reviews)
                        </Link>
                      </span>
                    </p>

                    {/* Price */}
                    <div className="grid grid-cols-12 gap-x-6 mb-4">
                      <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                        <p className="mb-1 leading-none text-[0.6875rem] text-success font-semibold">
                          Special Offer
                        </p>
                        <p className="mb-2">
                          <span className="h3 font-semibold">
                            <sup className="text-[0.875rem]">$</sup>
                            {discountPrice.toFixed(2)}
                          </span>
                          {selectedSize?.discount &&
                            selectedSize.discount > 0 && (
                              <span className="ms-3 badge bg-danger/[0.15] text-danger">
                                {selectedSize.discount}% Off
                              </span>
                            )}
                        </p>
                        {selectedSize?.discount &&
                          selectedSize.discount > 0 && (
                            <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.75rem]">
                              M.R.P - <s>${selectedSize.price.toFixed(2)}</s>
                            </p>
                          )}
                      </div>

                      {/* Colors */}
                      {selectedVariant.colors &&
                        selectedVariant.colors.length > 0 && (
                          <div className="xxl:col-span-6 xl:col-span-7 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 xxl:mt-0 mt-3">
                            <p className="mb-2 text-[0.9375rem] font-semibold">
                              Color
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedVariant.colors.map((color) => (
                                <button
                                  key={color.id}
                                  onClick={() => setSelectedColor(color)}
                                  className={`ti-btn ti-btn-outline-light text-dark !m-0 !rounded-md ${
                                    selectedColor?.id === color.id
                                      ? "!bg-primary !text-white !border-primary"
                                      : ""
                                  }`}
                                >
                                  {color.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-[0.9375rem] font-semibold mb-1">
                        Description :
                      </p>
                      <p className="text-textmuted dark:text-textmuted/50 mb-0 text-[0.8125rem]">
                        {product.description?.substring(0, 150)}
                        {product.description &&
                          product.description.length > 150 && (
                            <Link
                              scroll={false}
                              href="#!"
                              className="text-decoration-underline text-textmuted dark:text-textmuted/50"
                            >
                              Read More ?
                            </Link>
                          )}
                      </p>
                    </div>

                    {/* Size Selection */}
                    {selectedVariant.sizes &&
                      selectedVariant.sizes.length > 0 && (
                        <div className="mb-4">
                          <div className="grid grid-cols-12 gap-x-6">
                            <div className="xxl:col-span-12 col-span-12">
                              <p className="text-[0.9375rem] font-semibold mb-2">
                                Available Size :
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedVariant.sizes.map((size) => (
                                  <button
                                    key={size.id}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={size.quantity === 0}
                                    className={`ti-btn ti-btn-outline-light text-dark !m-0 !rounded-md ${
                                      selectedSize?.id === size.id
                                        ? "!bg-primary !text-white !border-primary"
                                        : ""
                                    } ${size.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    {size.size}
                                    {size.discount > 0 && (
                                      <span className="ms-1 text-xs text-success">
                                        -{size.discount}%
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Quantity */}
                    <div className="mb-4">
                      <p className="text-[0.9375rem] font-semibold mb-2">
                        Quantity :
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={quantity >= (selectedSize?.quantity || 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Stock: {selectedSize?.quantity || 0} available
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-stretch gap-2 mb-0">
                      <button
                        onClick={handleAddToCart}
                        disabled={
                          addingToCart ||
                          !selectedSize ||
                          (selectedSize.quantity || 0) === 0
                        }
                        className="ti-btn ti-btn-lg ti-btn-soft-primary"
                      >
                        {addingToCart ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <ShoppingCart className="ti ti-shopping-cart-plus" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        disabled={
                          !selectedSize || (selectedSize.quantity || 0) === 0
                        }
                        className="ti-btn ti-btn-lg ti-btn-primary"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details & Reviews Tabs */}
            <div className="lg:col-span-8 col-span-12">
              <div className="box">
                <div className="box-header">
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`px-4 py-2 font-medium ${activeTab === "reviews" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      Reviews & Ratings
                    </button>
                    <button
                      onClick={() => setActiveTab("questions")}
                      className={`px-4 py-2 font-medium ${activeTab === "questions" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      Questions & Answers
                    </button>
                  </div>
                </div>
                <div className="box-body">
                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div id="reviews">
                      {/* Rating Summary */}
                      <div className="grid grid-cols-12 gap-x-6 mb-6">
                        <div className="xxl:col-span-4 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                          <div className="flex items-top mb-3">
                            <div className="me-2 leading-none">
                              <i className="ri-star-fill text-[1.5625rem] text-warning"></i>
                            </div>
                            <div className="leading-none">
                              <p className="mb-1 font-semibold">
                                {averageRating.toFixed(1)} out of 5
                              </p>
                              <p className="mb-0 text-textmuted dark:text-textmuted/50 text-[0.6875rem]">
                                Based on ({product.numReviews || 0}) ratings
                              </p>
                            </div>
                          </div>

                          {/* Rating Distribution */}
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const ratingData = ratingDistribution.find(
                              (r) => r.rating === rating,
                            );
                            const totalReviews = product.numReviews || 1;
                            const percentage = ratingData
                              ? (ratingData._count.rating / totalReviews) * 100
                              : 0;

                            return (
                              <div
                                key={rating}
                                className="flex items-center mb-3"
                              >
                                <div className="text-[0.75rem] me-2 font-semibold flex gap-1 items-center">
                                  {rating}
                                  <i className="ri-star-fill text-[0.625rem]"></i>
                                </div>
                                <div className="progress progress-xs flex-grow">
                                  <div
                                    className="progress-bar !bg-success"
                                    role="progressbar"
                                    style={{ width: `${percentage}%` }}
                                    aria-valuenow={percentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                  ></div>
                                </div>
                                <div className="text-textmuted dark:text-textmuted/50 ms-2 text-[0.75rem]">
                                  ({ratingData?._count.rating || 0})
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Review Button */}
                        <div className="xxl:col-span-8 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12 xxl:mt-0 mt-3">
                          <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="ti-btn ti-btn-primary mb-4"
                          >
                            <MessageCircle className="me-2" size={16} />
                            Write a Review
                          </button>

                          {/* Write Review Form */}
                          {showReviewForm && (
                            <div className="box mb-6 border-2 border-primary/20">
                              <div className="box-header bg-primary/5 border-b border-primary/10">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-lg font-semibold text-primary">
                                    Write Your Review
                                  </h4>
                                  <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="ti-btn ti-btn-sm ti-btn-soft-light"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                              <div className="box-body">
                                <div className="space-y-4">
                                  {/* Rating Selection */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Rating{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() =>
                                            setReviewData((prev) => ({
                                              ...prev,
                                              rating: star,
                                            }))
                                          }
                                          className={`text-2xl ${
                                            reviewData.rating >= star
                                              ? "text-yellow-500"
                                              : "text-gray-300 dark:text-gray-600"
                                          } hover:text-yellow-400 transition-colors`}
                                        >
                                          ★
                                        </button>
                                      ))}
                                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        {reviewData.rating}/5
                                      </span>
                                    </div>
                                  </div>

                                  {/* Review Text */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Review{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                      value={reviewData.review}
                                      onChange={(e) =>
                                        setReviewData((prev) => ({
                                          ...prev,
                                          review: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                      rows={4}
                                      placeholder="Share your experience with this product..."
                                    />
                                  </div>

                                  {/* Product Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Color
                                      </label>
                                      <input
                                        type="text"
                                        value={selectedColor?.name || ""}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
                                        placeholder="Selected color"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Size
                                      </label>
                                      <input
                                        type="text"
                                        value={selectedSize?.size || ""}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
                                        placeholder="Selected size"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-2">
                                        Variant
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          selectedVariant?.variantName || ""
                                        }
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
                                        placeholder="Selected variant"
                                      />
                                    </div>
                                  </div>

                                  {/* Image Upload */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Upload Images (Optional)
                                    </label>
                                    <div className="space-y-3">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                      />
                                      {reviewData.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                          {reviewData.images.map(
                                            (file, index) => (
                                              <div
                                                key={index}
                                                className="relative aspect-square rounded-lg overflow-hidden border"
                                              >
                                                <Image
                                                  src={URL.createObjectURL(
                                                    file,
                                                  )}
                                                  alt={`Preview ${index + 1}`}
                                                  fill
                                                  className="object-cover"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleRemoveImage(index)
                                                  }
                                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                  <X size={12} />
                                                </button>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Submit Button */}
                                  <div className="flex justify-end gap-3">
                                    <button
                                      onClick={() => setShowReviewForm(false)}
                                      className="ti-btn ti-btn-outline"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={handleSubmitReview}
                                      className="ti-btn ti-btn-primary"
                                      disabled={
                                        !reviewData.rating ||
                                        !reviewData.review.trim()
                                      }
                                    >
                                      Submit Review
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Reviews List */}

                          {reviews.length > 0 ? (
                            <div className="xxl:col-span-8 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12 xxl:mt-0 mt-3">
                              <SpkSwiperJs
                                slides={reviews.map((review) => (
                                  <div className="swiper-slide">
                                    {/* Aynı review kutusu içeriği */}
                                    <div className="box" key={review.id}>
                                      <div className="box-body">
                                        <div className="sm:flex block items-top mb-3">
                                          <div className="flex flex-grow">
                                            <div className="me-2">
                                              <span className="avatar avatar-sm avatar-rounded relative">
                                                {review.user.avatarUrl ? (
                                                  <Image
                                                    fill
                                                    src={review.user.avatarUrl}
                                                    alt={
                                                      review.user.displayName
                                                    }
                                                    sizes="32px"
                                                  />
                                                ) : (
                                                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                    {review.user.displayName?.charAt(
                                                      0,
                                                    ) || "U"}
                                                  </div>
                                                )}
                                              </span>
                                            </div>
                                            <div className="leading-none me-2">
                                              <p className="mb-1 font-semibold text-[0.875rem]">
                                                {review.user.displayName ||
                                                  review.user.username}
                                              </p>
                                              <div className="mb-1">
                                                {getRatingStars(review.rating)}
                                              </div>
                                              <div className="text-[0.6875rem] text-textmuted dark:text-textmuted/50">
                                                {new Date(
                                                  review.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="sm:ps-0 sm:mt-0 mt-3 ps-2">
                                            {review.user.id === user?.id && (
                                              <button
                                                onClick={() =>
                                                  handleDeleteReview(review.id)
                                                }
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <Trash2 size={14} />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                        <p className="mb-3 ps-2">
                                          {review.review}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 ps-2">
                                          {review.size && (
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                              Size: {review.size}
                                            </span>
                                          )}
                                          {review.color && (
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                              Color: {review.color}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                spaceBetween={30}
                                centeredSlides={true}
                                autoplay={true}
                                className="mySwiper swiper swiper-reviews"
                              />
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 dark:text-gray-400">
                                No reviews yet
                              </p>
                              <button
                                onClick={() => setShowReviewForm(true)}
                                className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                              >
                                Be the first to review
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions Tab */}
                  {activeTab === "questions" && (
                    <div>
                      {/* Remove or show message for question asking form */}
                      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <HelpCircle
                            className="text-blue-500 mt-1"
                            size={20}
                          />
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-300">
                              Product Questions
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              Questions for this product are added by the
                              seller. Please contact the seller for your
                              questions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Questions List */}
                      {questions.length > 0 ? (
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <div className="box" key={question.id}>
                              <div className="box-body">
                                <div className="sm:flex block items-top mb-3">
                                  <div className="flex flex-grow">
                                    <div className="me-2">
                                      <span className="avatar avatar-sm avatar-rounded bg-primary/10 text-primary flex items-center justify-center">
                                        <i className="ri-store-line text-[0.875rem]"></i>
                                      </span>
                                    </div>
                                    <div className="leading-none me-2">
                                      <p className="mb-1 font-semibold text-[0.875rem]">
                                        Seller
                                      </p>
                                      <div className="text-[0.6875rem] text-textmuted dark:text-textmuted/50">
                                        {new Date(
                                          question.createdAt,
                                        ).toLocaleDateString("en-US", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sm:ps-0 sm:mt-0 mt-3 ps-2">
                                    <span className="badge bg-success/10 text-success border-success/20">
                                      Official Answer
                                    </span>
                                  </div>
                                </div>

                                {/* Question */}
                                <div className="mb-3">
                                  <p className="font-semibold mb-2 text-primary">
                                    <i className="ri-question-line me-2"></i>
                                    Question
                                  </p>
                                  <p className="text-gray-700 dark:text-gray-300 ps-2">
                                    {question.question}
                                  </p>
                                </div>

                                {/* Answer */}
                                {question.answer && (
                                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                                    <p className="font-semibold mb-2 text-green-600 dark:text-green-400">
                                      <i className="ri-checkbox-circle-line me-2"></i>
                                      Seller's Answer
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                      {question.answer}
                                    </p>
                                    {question.updatedAt &&
                                      question.updatedAt !==
                                        question.createdAt && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                          <i className="ri-time-line me-1"></i>
                                          Updated on{" "}
                                          {new Date(
                                            question.updatedAt,
                                          ).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </p>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <HelpCircle className="text-gray-400" size={32} />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            No questions yet
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            No questions have been added for this product yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details Table */}
              <div className="box mt-4">
                <div className="box-header">
                  <div className="box-title">Product Specifications</div>
                </div>
                <div className="box-body !p-0">
                  <div className="table-responsive">
                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full">
                      {product.specs?.map((spec) => (
                        <tr key={spec.id}>
                          <th scope="row" className="font-semibold">
                            {spec.name}
                          </th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="row" className="font-semibold">
                          Brand
                        </th>
                        <td>{product.brand || "Not specified"}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="font-semibold">
                          Weight
                        </th>
                        <td>{selectedVariant?.weight || 0} kg</td>
                      </tr>
                      <tr>
                        <th scope="row" className="font-semibold">
                          SKU
                        </th>
                        <td>{selectedVariant?.sku || "N/A"}</td>
                      </tr>
                    </Spktables>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 col-span-12">
              {/* Similar Products */}
              <div className="box overflow-hidden">
                <div className="box-header">
                  <div className="box-title">Similar Products</div>
                </div>
                <div className="box-body !p-0">
                  <div className="table-responsive">
                    <Spktables tableClass="ti-custom-table ti-custom-table-head w-full">
                      {similarProducts.map((similarProduct) => (
                        <tr key={similarProduct.id}>
                          <td>
                            <Link
                              href={`/shop/productdetails/${similarProduct.slug}/${similarProduct.variantSlug}`}
                            >
                              <div className="flex items-top">
                                <div className="similar-products-image me-2 relative">
                                  <div className="relative w-16 h-16">
                                    <Image
                                      fill
                                      src={similarProduct.image}
                                      alt={similarProduct.name}
                                      className="object-cover rounded"
                                    />
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <p className="mb-1 text-[0.875rem] font-semibold similar-product-name text-truncate">
                                    {similarProduct.name}
                                  </p>
                                  <p className="mb-2 text-xs text-gray-500">
                                    {similarProduct.variantName}
                                  </p>
                                  <p className="mb-0">
                                    <span className="badge bg-success text-white">
                                      {similarProduct.rating}
                                      <i className="ri-star-s-fill ms-1"></i>
                                    </span>
                                    <span className="text-textmuted dark:text-textmuted/50 ms-1">
                                      ({similarProduct.reviews})
                                    </span>
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="mb-0 text-[1rem] font-semibold">
                                    ${similarProduct.price}
                                  </p>
                                  <p className="mb-0 text-textmuted dark:text-textmuted/50 text-xs">
                                    <s>${similarProduct.originalPrice}</s>
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </Spktables>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="box mt-4">
                <div className="box-header">
                  <div className="box-title">Shipping Info</div>
                </div>
                <div className="box-body">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Truck className="text-primary" size={20} />
                      <div>
                        <p className="font-semibold text-sm">
                          {product.freeShippingForAllCountries
                            ? "Free Worldwide Shipping"
                            : `Shipping: $${calculateShippingFee().toFixed(2)}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.freeShippingForAllCountries
                            ? "Delivered within 5-10 business days"
                            : "Standard delivery: 3-7 business days"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="text-green-500" size={20} />
                      <div>
                        <p className="font-semibold text-sm">30-Day Returns</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Easy returns within 30 days of purchase
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-blue-500" size={20} />
                      <div>
                        <p className="font-semibold text-sm">
                          Verified Quality
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Quality checked and verified
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="box mt-4">
                <div className="box-body">
                  <div className="flex items-center flex-wrap gap-2">
                    <p className="text-[0.9375rem] mb-0 me-4 font-semibold">
                      Share :
                    </p>
                    <div className="btn-list mb-0">
                      <button className="ti-btn ti-btn-sm ti-btn-icon me-2 ti-btn-soft-success">
                        <i className="ri-share-line"></i>
                      </button>
                      <button className="ti-btn ti-btn-sm ti-btn-icon me-2 ti-btn-soft-warning">
                        <i className="ri-instagram-line"></i>
                      </button>
                      <button className="ti-btn ti-btn-sm ti-btn-icon me-2 ti-btn-soft-secondary">
                        <i className="ri-twitter-x-line"></i>
                      </button>
                      <button className="ti-btn ti-btn-sm ti-btn-icon me-2 ti-btn-soft-danger">
                        <i className="ri-youtube-line"></i>
                      </button>
                      <button className="ti-btn ti-btn-sm ti-btn-icon ti-btn-soft-info">
                        <i className="ri-facebook-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="section-sm">
        <div className="container">
          <h5 className="heading-title">Related Products</h5>
          <p className="mb-4">Products you might be interested in</p>
          {relatedProducts.length > 0 ? (
            <SpkSwiperJs
              slides={relatedProducts.map((product) => (
                <div key={product.id} className="box">
                  <div className="box-body">
                    <Link
                      href={`/shop/productdetails/${product.slug}/${product.variantSlug}`}
                    >
                      <div className="relative aspect-square mb-3">
                        <Image
                          fill
                          src={product.image}
                          alt={product.name}
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <h6 className="font-semibold mb-2">{product.name}</h6>
                      <div className="flex items-center mb-2">
                        {getRatingStars(product.rating)}
                        <span className="ms-2 text-sm text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">${product.price}</p>
                          <p className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                        </div>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
              slidesPerView={4}
              spaceBetween={30}
              autoplay={true}
              breakpoint={breakpoints}
              className="mySwiper swiper swiper-related-products"
            />
          ) : (
            <p className="text-center text-gray-500">
              No related products found
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-sm">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-4 col-span-12">
              <div className="box card-style-3 custom-card">
                <div className="box-body">
                  <div className="flex items-start gap-3">
                    <div className="min-w-fit">
                      <span className="avatar bg-info text-white">
                        <Truck className="text-[1.25rem]" />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="mb-0 font-semibold text-[1rem] text-info">
                        {product.freeShippingForAllCountries
                          ? "Free Worldwide Shipping"
                          : "Reliable Delivery"}
                      </p>
                      <p className="mb-0 text-[0.8125rem] text-textmuted dark:text-textmuted/50">
                        {product.freeShippingForAllCountries
                          ? "Free shipping for all countries"
                          : "Fast and reliable delivery service"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 col-span-12">
              <div className="box card-style-3 custom-card">
                <div className="box-body">
                  <div className="flex items-start gap-3">
                    <div className="min-w-fit">
                      <span className="avatar bg-warning text-white">
                        <Tags className="text-[1.25rem]" />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="mb-0 font-semibold text-[1rem] text-warning">
                        Best Price Guarantee
                      </p>
                      <p className="mb-0 text-[0.8125rem] text-textmuted dark:text-textmuted/50">
                        We guarantee the best price for this product
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 col-span-12">
              <div className="box card-style-3 custom-card">
                <div className="box-body">
                  <div className="flex items-start gap-3">
                    <div className="min-w-fit">
                      <span className="avatar bg-danger text-white">
                        <RefreshCw className="text-[1.25rem]" />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="mb-0 font-semibold text-[1rem] text-danger">
                        Easy Returns
                      </p>
                      <p className="mb-0 text-[0.8125rem] text-textmuted dark:text-textmuted/50">
                        Easy returns within 30 days of purchase
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <Fragment>
      <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
        <div className="container">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
      </div>

      <section className="section !py-4">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-6 col-span-12">
              <div className="box">
                <div className="box-body !p-2">
                  <div className="aspect-square rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-6 col-span-12">
              <div className="box">
                <div className="box-body">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

// Main export with Suspense
export default function ProductDetailsWrapper() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductDetails />
    </Suspense>
  );
}
