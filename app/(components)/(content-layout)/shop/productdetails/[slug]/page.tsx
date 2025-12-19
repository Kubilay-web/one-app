"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProductDetailsStore } from "@/app/oneshopstore/cartstore/productdetailsstore";
import { useToast } from "@/app/projects/components/ui/use-toast";
import { useCartStore } from "@/app/oneshopstore/cartstore/cartstore";
import {
  Star,
  Truck,
  Shield,
  RefreshCw,
  Heart,
  ShoppingCart,
  CreditCard,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Package,
  Tag,
  ArrowLeft,
} from "lucide-react";

const ProductDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();

  // Product details store
  const {
    product,
    baseProduct,
    variants,
    allSizes,
    reviews,
    similarProducts,
    selectedSize,
    selectedColor,
    selectedImageIndex,
    quantity,
    isLoading,
    error,
    stats,

    fetchProductDetails,
    addToCart,
    buyNow,
    toggleWishlist,
    setSelectedSize,
    setSelectedColor,
    setSelectedImageIndex,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    getPrice,
    getDiscount,
    getFinalPrice,
    isInStock,
  } = useProductDetailsStore();

  // Cart store
  const { fetchCart } = useCartStore();

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch product details on mount
  useEffect(() => {
    if (slug) {
      fetchProductDetails(slug);
    }
  }, [slug, fetchProductDetails]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (!isInStock()) {
      toast({
        title: "Out of stock",
        description: "Selected quantity is not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(slug, selectedSize.id, quantity);

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });

      // Refresh cart
      fetchCart();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before buying.",
        variant: "destructive",
      });
      return;
    }

    if (!isInStock()) {
      toast({
        title: "Out of stock",
        description: "Selected quantity is not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await buyNow(slug, selectedSize.id, quantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process buy now.",
        variant: "destructive",
      });
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(slug, selectedSize?.id);
      setIsWishlisted(!isWishlisted);

      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted
          ? "Product has been removed from your wishlist."
          : "Product has been added to your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist.",
        variant: "destructive",
      });
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.variantName,
        text: `Check out ${product?.variantName} on our store!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Package className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-8">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const price = getPrice();
  const discount = getDiscount();
  const finalPrice = getFinalPrice();
  const hasDiscount = discount > 0;

  // Rating distribution
  const ratingDistribution = {
    5:
      stats.ratingDistribution.find((r: any) => r.rating === 5)?._count?._all ||
      0,
    4:
      stats.ratingDistribution.find((r: any) => r.rating === 4)?._count?._all ||
      0,
    3:
      stats.ratingDistribution.find((r: any) => r.rating === 3)?._count?._all ||
      0,
    2:
      stats.ratingDistribution.find((r: any) => r.rating === 2)?._count?._all ||
      0,
    1:
      stats.ratingDistribution.find((r: any) => r.rating === 1)?._count?._all ||
      0,
  };

  const totalRatingCount = Object.values(ratingDistribution).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-blue-600">
            Shop
          </Link>
          {baseProduct?.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/shop/category/${baseProduct.category.id}`}
                className="hover:text-blue-600"
              >
                {baseProduct.category.name}
              </Link>
            </>
          )}
          {baseProduct?.subCategory && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/shop/subcategory/${baseProduct.subCategory.id}`}
                className="hover:text-blue-600"
              >
                {baseProduct.subCategory.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-300 font-medium truncate max-w-xs">
            {product.variantName}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            {product.images.length > 0 ? (
              <Image
                src={
                  product.images[selectedImageIndex]?.url ||
                  product.variantImage
                }
                alt={product.variantName}
                fill
                className="object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {hasDiscount && (
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                  {discount}% OFF
                </span>
              )}
              {product.sales > 100 && (
                <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === 0
                        ? product.images.length - 1
                        : selectedImageIndex - 1
                    )
                  }
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === product.images.length - 1
                        ? 0
                        : selectedImageIndex + 1
                    )
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <Link
              href={`/store/${baseProduct?.store.url}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2"
            >
              {baseProduct?.store.name}
            </Link>
            <h1 className="text-3xl font-bold mb-2">{product.variantName}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {product.variantDescription}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(stats.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              ({stats.totalReviews} reviews)
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{product.sales} sold</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{product.views} views</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Price includes all applicable taxes
            </p>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      selectedColor?.id === color.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: color.name.toLowerCase() }}
                    />
                    <span>{color.name}</span>
                    {selectedColor?.id === color.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Size</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {allSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => {
                    console.log("Size clicked:", size); // DEBUG
                    console.log("Size ID:", size.id); // DEBUG
                    setSelectedSize(size);
                  }}
                  disabled={size.quantity === 0}
                  className={`
                    py-3 rounded-lg border text-center transition-colors
                    ${
                      selectedSize?.id === size.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }
                    ${
                      size.quantity === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                        : ""
                    }
                  `}
                >
                  <div className="font-medium">{size.size}</div>
                  <div className="text-xs text-gray-500">
                    {size.quantity === 0
                      ? "Out of stock"
                      : `${size.quantity} left`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={selectedSize?.quantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 h-10 text-center border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              />
              <button
                onClick={incrementQuantity}
                disabled={!selectedSize || quantity >= selectedSize.quantity}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="ml-4 text-sm text-gray-500">
                {selectedSize?.quantity || 0} available
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isInStock()}
              className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize || !isInStock()}
              className="flex-1 py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Buy Now
            </button>
            <button
              onClick={handleWishlistToggle}
              className="w-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
            </button>
            <button
              onClick={handleShare}
              className="w-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">30-Day Returns</p>
                <p className="text-sm text-gray-500">Easy return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-gray-500">100% secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {["description", "specifications", "reviews", "questions"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                  py-4 px-1 font-medium text-sm border-b-2 transition-colors
                  ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }
                `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "reviews" && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                      {stats.totalReviews}
                    </span>
                  )}
                </button>
              )
            )}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "description" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Product Description
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="mb-4">{baseProduct?.description}</p>
                <p className="mb-4">{product.variantDescription}</p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                  <li>High-quality materials</li>
                  <li>Durable construction</li>
                  <li>Comfortable fit</li>
                  <li>Modern design</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specifications" && product.specs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specs.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex border-b border-gray-100 dark:border-gray-800 py-3"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-1/3">
                      {spec.name}
                    </span>
                    <span className="w-2/3">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold mb-2">
                        {stats.averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(stats.averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-500">
                        {stats.totalReviews} reviews
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count =
                          ratingDistribution[
                            rating as keyof typeof ratingDistribution
                          ];
                        const percentage =
                          totalRatingCount > 0
                            ? (count / totalRatingCount) * 100
                            : 0;

                        return (
                          <div key={rating} className="flex items-center">
                            <div className="flex items-center w-16">
                              <span className="text-sm w-4">{rating}</span>
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 ml-1" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-2">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 w-12">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2">
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.slice(0, 5).map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                {review.user.avatarUrl ? (
                                  <Image
                                    src={review.user.avatarUrl}
                                    alt={review.user.displayName}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    {review.user.displayName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {review.user.displayName}
                                </p>
                                <div className="flex items-center gap-1">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              Size: {review.size} • Color: {review.color}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {review.review}
                          </p>
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.images.map((image) => (
                                <div
                                  key={image.id}
                                  className="relative w-20 h-20 rounded-md overflow-hidden"
                                >
                                  <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                              Helpful ({review.likes})
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Report
                            </button>
                          </div>
                        </div>
                      ))}

                      {reviews.length > 5 && (
                        <div className="text-center">
                          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            View All Reviews
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Be the first to review this product
                      </p>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div>
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
                <p className="text-gray-500 mb-4">
                  Have a question about this product?
                </p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ask a Question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar Products</h2>
            <Link
              href="/shop"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  {item.images.length > 0 ? (
                    <Image
                      src={item.images[0]?.url || item.variantImage}
                      alt={item.variantName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {item.sizes[0]?.discount > 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                      {item.sizes[0].discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1 truncate">
                    {item.product.store.name}
                  </p>
                  <h3 className="font-medium mb-2 truncate">
                    {item.variantName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">
                        ${item.sizes[0]?.price.toFixed(2) || "0.00"}
                      </span>
                      {item.sizes[0]?.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          $
                          {(
                            item.sizes[0].price /
                            (1 - item.sizes[0].discount / 100)
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1">4.5</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Store Info */}
      {baseProduct?.store && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              {baseProduct.store.logo ? (
                <Image
                  src={baseProduct.store.logo}
                  alt={baseProduct.store.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {baseProduct.store.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{baseProduct.store.name}</h3>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">
                    {baseProduct.store.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">2.5k Followers</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">95% Positive Ratings</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Link
                href={`/store/${baseProduct.store.url}`}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Visit Store
              </Link>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Follow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
