"use client";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Seo from "@/shared/layouts-components/seo/seo";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  brand: string;
  rating: number;
  sales: number;
  numReviews: number;
  views: number;
  store: {
    id: string;
    name: string;
    logo: string;
  };
  category: {
    id: string;
    name: string;
    url: string;
  };
  subCategory: {
    id: string;
    name: string;
    url: string;
  };
  variants: Array<{
    id: string;
    variantName: string;
    variantImage: string;
    slug: string;
    isSale: boolean;
    saleEndDate: string | null;
    sizes: Array<{
      id: string;
      size: string;
      price: number;
      discount: number;
    }>;
    images: Array<{
      id: string;
      url: string;
    }>;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    review: string;
  }>;
  _count: {
    reviews: number;
    wishlist: number;
  };
}

interface Category {
  id: string;
  name: string;
  image: string;
  url: string;
  subCategories: Array<{
    id: string;
    name: string;
    url: string;
    _count: {
      product: number;
    };
  }>;
  _count: {
    products: number;
  };
}

interface Filter {
  categories: Category[];
  brands: Array<{
    brand: string;
    count: number;
  }>;
  priceRange: {
    min: number;
    max: number;
  };
  stores: Array<{
    id: string;
    name: string;
    logo: string;
  }>;
}

const BrowsePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filter | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // URL'den parametreleri oku
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setActiveFilters(params);
    setSortBy(params.sortBy || 'newest');
    setPriceRange({
      min: parseFloat(params.minPrice || '0'),
      max: parseFloat(params.maxPrice || '10000'),
    });
    setSearchQuery(params.q || '');
    setCurrentPage(parseInt(params.page || '1'));
  }, [searchParams]);
  
  // Verileri getir
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      // Aktif filtreleri ekle
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      // Sıralama
      params.append('sortBy', sortBy);
      
      // Fiyat aralığı
      params.append('minPrice', priceRange.min.toString());
      params.append('maxPrice', priceRange.max.toString());
      
      // Sayfa
      params.append('page', currentPage.toString());
      
      // Arama
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      
      // Paralel fetch
      const [productsRes, filtersRes] = await Promise.all([
        fetch(`/api/oneshop/browse/products?${params}`),
        fetch('/api/oneshop/browse/filters'),
      ]);
      
      if (!productsRes.ok || !filtersRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const productsData = await productsRes.json();
      const filtersData = await filtersRes.json();
      
      if (productsData.success) {
        setProducts(productsData.products);
        setTotalPages(productsData.meta.totalPages);
      }
      
      if (filtersData.success) {
        setFilters(filtersData.filters);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, sortBy, priceRange, currentPage, searchQuery]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Filtre ekle/kaldır
  const handleFilterChange = (key: string, value: string | null) => {
    const newFilters = { ...activeFilters };
    
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    
    // Sayfayı sıfırla
    delete newFilters.page;
    setCurrentPage(1);
    
    // URL'yi güncelle
    updateURL(newFilters);
  };
  
  // Fiyat filtresini güncelle
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    const newFilters = { ...activeFilters };
    
    if (min > 0) {
      newFilters.minPrice = min.toString();
    } else {
      delete newFilters.minPrice;
    }
    
    if (max < 10000) {
      newFilters.maxPrice = max.toString();
    } else {
      delete newFilters.maxPrice;
    }
    
    updateURL(newFilters);
  };
  
  // Sıralamayı değiştir
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const newFilters = { ...activeFilters, sortBy: value };
    updateURL(newFilters);
  };
  
  // Arama yap
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...activeFilters };
    
    if (searchQuery) {
      newFilters.q = searchQuery;
    } else {
      delete newFilters.q;
    }
    
    updateURL(newFilters);
  };
  
  // URL'yi güncelle
  const updateURL = (filters: Record<string, any>) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    router.push(`/shop/browse?${params.toString()}`);
  };
  
  // Sayfa değiştir
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newFilters = { ...activeFilters, page: page.toString() };
    updateURL(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Filtre temizle
  const clearFilters = () => {
    setActiveFilters({});
    setSortBy('newest');
    setPriceRange({ min: 0, max: 10000 });
    setSearchQuery('');
    setCurrentPage(1);
    router.push('/shop');
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const getProductImage = (product: Product) => {
    return product.variants[0]?.images[0]?.url || '../../../assets/images/ecommerce/png/1.png';
  };
  
  const getProductPrice = (product: Product) => {
    const variant = product.variants[0];
    if (!variant) return formatPrice(0);
    
    const size = variant.sizes[0];
    if (!size) return formatPrice(0);
    
    const discountedPrice = size.price * (1 - size.discount / 100);
    return formatPrice(discountedPrice);
  };
  
  const getOriginalPrice = (product: Product) => {
    const variant = product.variants[0];
    if (!variant) return null;
    
    const size = variant.sizes[0];
    if (!size || size.discount === 0) return null;
    
    return formatPrice(size.price);
  };
  
  // Aktif filtre sayısı
  const activeFilterCount = Object.keys(activeFilters).filter(
    key => !['page', 'sortBy', 'minPrice', 'maxPrice'].includes(key) && activeFilters[key]
  ).length;
  
  if (loading) {
    return (
      <div className="main-content landing-main ecommerce-main">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <Fragment>
      <div className="main-content landing-main ecommerce-main">
        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Browse Products"} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Apps', 'Ecommerce', 'Customer']} 
              currentpage="Browse Products" 
            />
          </div>
        </div>
        
        {/* Main Content */}
        <section className="section !py-6">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-3 col-span-12">
                <div className="box sticky top-4">
                  <div className="box-header flex justify-between items-center">
                    <div className="box-title">Filters</div>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="ti-btn ti-btn-sm ti-btn-ghost text-danger"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="box-body">
                    {/* Search */}
                    <div className="mb-6">
                      <form onSubmit={handleSearch}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="ti-btn ti-btn-primary"
                          >
                            <i className="ti ti-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    {/* Categories */}
                    {filters?.categories && filters.categories.length > 0 && (
                      <div className="mb-6">
                        <h6 className="font-semibold mb-3">Categories</h6>
                        <div className="space-y-2">
                          {filters.categories.map((category) => (
                            <div key={category.id}>
                              <button
                                onClick={() => handleFilterChange('category', category.id)}
                                className={`w-full text-start flex justify-between items-center p-2 rounded ${
                                  activeFilters.category === category.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-defaultborder/10'
                                }`}
                              >
                                <span>{category.name}</span>
                                <span className="text-textmuted text-sm">
                                  ({category._count.products})
                                </span>
                              </button>
                              
                              {/* Subcategories */}
                              {category.subCategories.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {category.subCategories.map((subCategory) => (
                                    <button
                                      key={subCategory.id}
                                      onClick={() => handleFilterChange('subCategory', subCategory.id)}
                                      className={`w-full text-start flex justify-between items-center p-1 rounded text-sm ${
                                        activeFilters.subCategory === subCategory.id
                                          ? 'bg-primary/5 text-primary'
                                          : 'hover:bg-defaultborder/5'
                                      }`}
                                    >
                                      <span>{subCategory.name}</span>
                                      <span className="text-textmuted text-xs">
                                        ({subCategory._count.product})
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Price Range */}
                    {filters?.priceRange && (
                      <div className="mb-6">
                        <h6 className="font-semibold mb-3">Price Range</h6>
                        <div className="px-2">
                          <input
                            type="range"
                            min="0"
                            max={filters.priceRange.max}
                            step="10"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange(priceRange.min, parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-sm">{formatPrice(priceRange.min)}</span>
                            <span className="text-sm">{formatPrice(priceRange.max)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Brands */}
                    {filters?.brands && filters.brands.length > 0 && (
                      <div className="mb-6">
                        <h6 className="font-semibold mb-3">Brands</h6>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {filters.brands.map((item) => (
                            <button
                              key={item.brand}
                              onClick={() => handleFilterChange('brand', item.brand)}
                              className={`w-full text-start flex justify-between items-center p-2 rounded ${
                                activeFilters.brand === item.brand
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-defaultborder/10'
                              }`}
                            >
                              <span>{item.brand}</span>
                              <span className="text-textmuted text-sm">
                                ({item.count})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Stores */}
                    {filters?.stores && filters.stores.length > 0 && (
                      <div className="mb-6">
                        <h6 className="font-semibold mb-3">Stores</h6>
                        <div className="space-y-2">
                          {filters.stores.map((store) => (
                            <button
                              key={store.id}
                              onClick={() => handleFilterChange('store', store.id)}
                              className={`w-full text-start flex items-center gap-3 p-2 rounded ${
                                activeFilters.store === store.id
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-defaultborder/10'
                              }`}
                            >
                              <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                {store.logo ? (
                                  <Image
                                    src={store.logo}
                                    alt={store.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <i className="ti ti-store text-primary"></i>
                                  </div>
                                )}
                              </div>
                              <span className="truncate">{store.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Products Grid */}
              <div className="lg:col-span-9 col-span-12">
                {/* Header */}
                <div className="box mb-6">
                  <div className="box-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h5 className="font-semibold mb-1">Browse Products</h5>
                        <p className="text-textmuted text-sm">
                          Showing {products.length} of {filters?.categories?.reduce((sum, cat) => sum + cat._count.products, 0) || 0} products
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Active Filters */}
                        {activeFilterCount > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(activeFilters).map(([key, value]) => {
                              if (!value || ['page', 'sortBy', 'minPrice', 'maxPrice'].includes(key)) return null;
                              
                              let displayValue = value;
                              if (key === 'category') {
                                displayValue = filters?.categories?.find(c => c.id === value)?.name || value;
                              } else if (key === 'subCategory') {
                                const category = filters?.categories?.find(c => 
                                  c.subCategories.find(sc => sc.id === value)
                                );
                                displayValue = category?.subCategories.find(sc => sc.id === value)?.name || value;
                              } else if (key === 'store') {
                                displayValue = filters?.stores?.find(s => s.id === value)?.name || value;
                              }
                              
                              return (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                >
                                  <span className="capitalize">{key}:</span>
                                  <span>{displayValue}</span>
                                  <button
                                    onClick={() => handleFilterChange(key, null)}
                                    className="ti-btn ti-btn-ghost ti-btn-sm !p-0 !h-4 !w-4"
                                  >
                                    <i className="ti ti-x text-xs"></i>
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Sort Dropdown */}
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="form-control !py-2"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="sales">Best Selling</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Products */}
                {products.length === 0 ? (
                  <div className="box">
                    <div className="box-body text-center py-12">
                      <div className="text-4xl mb-4">😕</div>
                      <h5 className="font-semibold mb-2">No products found</h5>
                      <p className="text-textmuted mb-4">
                        Try adjusting your filters or search term
                      </p>
                      <button
                        onClick={clearFilters}
                        className="ti-btn ti-btn-primary"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                      {products.map((product) => {
                        const variant = product.variants[0];
                        const size = variant?.sizes[0];
                        const discount = size?.discount || 0;
                        const currentPrice = size ? size.price * (1 - discount / 100) : 0;
                        const originalPrice = discount > 0 ? size?.price : null;
                        const isSale = variant?.isSale || false;
                        
                        return (
                          <div
                            key={product.id}
                            className="lg:col-span-4 md:col-span-6 col-span-12"
                          >
                            <div className="box card-style-2 hover:shadow-lg transition-shadow duration-300">
                              <div className="box-body !p-0">
                                {isSale && (
                                  <span className="badge bg-danger/[0.15] text-danger top-left-badge">
                                    Sale
                                  </span>
                                )}
                                {discount > 0 && (
                                  <div className="badge top-right-badge bg-success !text-white">
                                    <div className="badge-icon">
                                      <i className="ti ti-discount text-[0.875rem]"></i>
                                    </div>
                                    <div className="badge-text">{discount}% OFF</div>
                                  </div>
                                )}
                                <div className="card-img-top border-b border-dashed border-defaultborder dark:border-defaultborder/10 ">
                                  <Link
                                    href={`/ecommerce/customer/product-details/${product.slug}`}
                                    className="stretched-link"
                                  ></Link>
                                  <div className="btns-container-1 items-center gap-1">
                                    <Link
                                      href={`/ecommerce/customer/product-details/${product.slug}`}
                                      className="ti-btn ti-btn-icon ti-btn-primary !rounded-full"
                                    >
                                      <i className="ti ti-eye text-[0.875rem]"></i>
                                    </Link>
                                    <div className="hs-tooltip ti-main-tooltip">
                                      <Link
                                        href={`/ecommerce/customer/compare-products?product=${product.id}`}
                                        className="hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-primary !rounded-full"
                                      >
                                        <i className="ti ti-circle-half-2 text-[0.875rem]"></i>
                                        <span
                                          className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm"
                                          role="tooltip"
                                        >
                                          Compare
                                        </span>
                                      </Link>
                                    </div>
                                    <div className="hs-tooltip ti-main-tooltip">
                                      <Link
                                        href="/ecommerce/customer/cart"
                                        className="hs-tooltip-toggle ti-btn ti-btn-icon ti-btn-primary !rounded-full"
                                      >
                                        <i className="ti ti-shopping-cart-plus text-[0.875rem]"></i>
                                        <span
                                          className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm"
                                          role="tooltip"
                                        >
                                          Add to cart
                                        </span>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="img-box-2 p-2">
                                    <div className="relative w-full h-48">
                                      <Image
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        className="scale-img img-fluid w-full bg-light rounded"
                                        fill
                                        style={{ objectFit: 'contain' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-grow">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 relative rounded-full overflow-hidden">
                                          {product.store.logo ? (
                                            <Image
                                              src={product.store.logo}
                                              alt={product.store.name}
                                              fill
                                              className="object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                              <i className="ti ti-store text-primary text-xs"></i>
                                            </div>
                                          )}
                                        </div>
                                        <Link
                                          href={`/ecommerce/customer/shop?store=${product.store.id}`}
                                          className="inline-block text-primary text-[0.8125rem] font-semibold hover:underline"
                                        >
                                          {product.store.name}
                                        </Link>
                                      </div>
                                      <h6 className="mb-1 font-semibold text-[1rem]">
                                        <Link href={`/ecommerce/customer/product-details/${product.slug}`}>
                                          {product.name}
                                        </Link>
                                      </h6>
                                      <div className="flex items-baseline text-[0.6875rem]">
                                        <div className="min-w-fit">
                                          {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-warning me-1">
                                              <i className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}></i>
                                            </span>
                                          ))}
                                        </div>
                                        <p className="mb-0 ms-1 min-w-fit text-textmuted dark:text-textmuted/50">
                                          <span>({product._count.reviews})</span>
                                          <span> Reviews</span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="min-w-fit">
                                      <div className="hs-tooltip ti-main-tooltip">
                                        <button
                                          className="hs-tooltip-toggle btn btn-wishlist btn-icon rounded-circle"
                                        >
                                          <i className="bi bi-heart outline1"></i>
                                          <i className="bi bi-heart-fill filled"></i>
                                          <span
                                            className="hs-tooltip-content ti-main-tooltip-content !py-1 !px-2 !bg-black !text-[0.75rem] !rounded-sm !font-medium !text-white shadow-sm"
                                            role="tooltip"
                                          >
                                            Add to wishlist
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-baseline mt-4">
                                    <h5 className="font-semibold text-primary mb-0">
                                      {formatPrice(currentPrice)}
                                    </h5>
                                    {originalPrice && (
                                      <span className="text-[0.8125rem] ms-2 text-textmuted dark:text-textmuted/50 line-through">
                                        {formatPrice(originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Link
                                  href="/ecommerce/customer/cart"
                                  className="ti-btn ti-btn-soft-primary ti-btn-lg !border-0 btn-style-1 !m-0 !rounded-tl-md  rtl:!rounded-tr-md rtl:!rounded-tl-none"
                                >
                                  <i className="ti ti-shopping-cart-plus me-1"></i>Add to Cart
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <div className="box">
                          <div className="box-body">
                            <div className="flex justify-center">
                              <nav className="flex items-center gap-1">
                                <button
                                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                  disabled={currentPage === 1}
                                  className="ti-btn ti-btn-outline ti-btn-sm disabled:opacity-50"
                                >
                                  <i className="ti ti-chevron-left"></i>
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  let pageNum;
                                  if (totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                  } else {
                                    pageNum = currentPage - 2 + i;
                                  }
                                  
                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => handlePageChange(pageNum)}
                                      className={`ti-btn ti-btn-sm ${
                                        currentPage === pageNum
                                          ? 'ti-btn-primary'
                                          : 'ti-btn-outline'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                                
                                <button
                                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                  disabled={currentPage === totalPages}
                                  className="ti-btn ti-btn-outline ti-btn-sm disabled:opacity-50"
                                >
                                  <i className="ti ti-chevron-right"></i>
                                </button>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="section bg-banner-2 !text-white">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6 justify-center">
              <div className="lg:col-span-1 col-span-12 text-center"></div>
              <div className="lg:col-span-10 col-span-12 text-center">
                <div className="mb-4">
                  <h2 className="font-medium mb-2 !text-white">
                    &#128073; Get 20% Off Discount Coupon
                  </h2>
                  <h6 className="!text-white">By Subscribe our Newsletter</h6>
                </div>
                <div className="lg:col-span-4 col-span-12 text-center"></div>
                <div className="lg:col-span-4 col-span-12 !text-center">
                  <div className="custom-form-group">
                    <input
                      type="text"
                      className="form-control !rounded-full shadow-sm !py-3"
                      placeholder="Enter Your Email.."
                      aria-label="Email"
                    />
                    <button
                      className="ti-btn ti-btn-danger !bg-danger !border-0 custom-form-btn !rounded-full"
                      type="button"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-12 text-center"></div>
              </div>
              <div className="lg:col-span-1 col-span-12 text-center"></div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default BrowsePage;