// app/(components)/(content-layout)/dashboards/shop/seller/stores/[storeUrl]/products/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSession } from '@/app/SessionProvider';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  Loader2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  BarChart3,
  ShoppingBag,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tag,
  DollarSign,
  Layers,
  Star,
  MessageSquare,
  Copy,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/projects/components/ui/dropdown-menu';

import { Badge } from '@/app/projects/components/ui/badge';
import { Button } from '@/app/projects/components/ui/button';
import { Input } from '@/app/projects/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/projects/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/projects/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/projects/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/projects/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/projects/components/ui/tooltip';

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
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  variants: Array<{
    id: string;
    variantName: string;
    variantImage: string;
    sku: string;
    sizes: Array<{
      quantity: number;
      price: number;
      discount: number;
    }>;
    images: Array<{
      url: string;
    }>;
  }>;
  _count: {
    variants: number;
    reviews: number;
  };
  totalStock: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

interface Category {
  id: string;
  name: string;
}

const SellerProductsPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useSession();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState<{ id: string; name: string } | null>(null);

  // Filtre state'leri
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  // Debounce için
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Verileri yükle
  useEffect(() => {
    if (user && params.storeUrl) {
      fetchData();
    }
  }, [user, params.storeUrl, searchParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Store bilgilerini al
      const storeRes = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}`);
      if (!storeRes.ok) throw new Error('Store not found');
      const storeData = await storeRes.json();
      setStoreInfo(storeData);

      // Kategorileri al
      const categoriesRes = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/categories`);
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      // URL parametrelerini oluştur
      const queryParams = new URLSearchParams();
      if (searchParams.get('search')) queryParams.set('search', searchParams.get('search')!);
      
      const categoryParam = searchParams.get('category');
      if (categoryParam && categoryParam !== 'all') queryParams.set('category', categoryParam);
      
      const statusParam = searchParams.get('status');
      if (statusParam && statusParam !== 'all') queryParams.set('status', statusParam);
      
      if (searchParams.get('sortBy')) queryParams.set('sortBy', searchParams.get('sortBy')!);
      if (searchParams.get('sortOrder')) queryParams.set('sortOrder', searchParams.get('sortOrder')!);
      if (searchParams.get('page')) queryParams.set('page', searchParams.get('page')!);
      if (searchParams.get('limit')) queryParams.set('limit', searchParams.get('limit')!);

      // Ürünleri al
      const productsRes = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/products/main?${queryParams}`);
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
      setPagination(productsData.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 10,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [params.storeUrl, searchParams, user]);

  // Arama için debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (value) {
        newSearchParams.set('search', value);
        newSearchParams.set('page', '1'); // Arama yapınca 1. sayfaya dön
      } else {
        newSearchParams.delete('search');
      }
      router.push(`?${newSearchParams.toString()}`);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Filtreleri uygula
  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) {
      newSearchParams.set('search', searchQuery);
    } else {
      newSearchParams.delete('search');
    }
    
    // Boş string yerine "all" kullan
    if (selectedCategory && selectedCategory !== 'all') {
      newSearchParams.set('category', selectedCategory);
    } else {
      newSearchParams.delete('category');
    }
    
    if (selectedStatus && selectedStatus !== 'all') {
      newSearchParams.set('status', selectedStatus);
    } else {
      newSearchParams.delete('status');
    }
    
    if (sortBy) {
      newSearchParams.set('sortBy', sortBy);
    }
    
    if (sortOrder) {
      newSearchParams.set('sortOrder', sortOrder);
    }
    
    newSearchParams.set('page', '1'); // Filtre değişince 1. sayfaya dön
    
    router.push(`?${newSearchParams.toString()}`);
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    router.push(`?page=1`);
  };

  // Sayfa değiştir
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  // Ürün seç/deseç
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Tümünü seç/deseç
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  // Ürün silme
  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      fetchData(); // Listeyi yenile
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  // Toplu silme
  const handleBulkDelete = async () => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/products/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          productIds: selectedProducts,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete products');
      }

      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchData(); // Listeyi yenile
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete products');
    }
  };

  // Stok durumuna göre badge renkleri
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: 'Out of Stock',
        variant: 'destructive' as const,
        icon: <XCircle className="h-3 w-3" />,
      };
    } else if (stock <= 10) {
      return {
        label: 'Low Stock',
        variant: 'warning' as const,
        icon: <AlertCircle className="h-3 w-3" />,
      };
    } else {
      return {
        label: 'In Stock',
        variant: 'success' as const,
        icon: <CheckCircle className="h-3 w-3" />,
      };
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    router.push('/');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!storeInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Store not found</h3>
          <p className="mt-2 text-gray-600">The store you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => router.push('/seller/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">
              Manage products for <span className="font-semibold">{storeInfo.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href={`/seller/stores/${params.storeUrl}/products/new`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{pagination.totalProducts}</div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">
                {products.reduce((sum, product) => sum + product.totalStock, 0)}
              </div>
              <Layers className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">
                {products.reduce((sum, product) => sum + product.sales, 0)}
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">
                {products.length > 0
                  ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
                  : '0.0'}
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Select */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By Select */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order Select */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={applyFilters} variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Apply
              </Button>

              <Button onClick={clearFilters} variant="ghost">
                Clear
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkDeleteDialogOpen(true)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Showing {products.length} of {pagination.totalProducts} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-600">
                {searchParams.toString() ? 'Try adjusting your filters' : 'Get started by adding your first product'}
              </p>
              <div className="mt-6">
                <Link href={`/seller/stores/${params.storeUrl}/products/new`}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.totalStock);
                    const firstVariant = product.variants[0];
                    
                    // Fiyat hesaplaması
                    let minPrice = 0;
                    let maxPrice = 0;
                    
                    if (firstVariant && firstVariant.sizes.length > 0) {
                      const prices = firstVariant.sizes.map(size => {
                        const discountedPrice = size.price - (size.price * (size.discount / 100));
                        return discountedPrice;
                      });
                      minPrice = Math.min(...prices);
                      maxPrice = Math.max(...prices);
                    }

                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0">
                              {firstVariant?.variantImage ? (
                                <Image
                                  src={firstVariant.variantImage}
                                  alt={product.name}
                                  fill
                                  className="rounded-md object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="h-full w-full rounded-md bg-gray-200 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.description?.substring(0, 50) || 'No description'}...
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product._count?.variants || 0} variant{(product._count?.variants || 0) !== 1 ? 's' : ''}
                                </Badge>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MessageSquare className="h-3 w-3" />
                                        {product._count?.reviews || 0}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{product._count?.reviews || 0} reviews</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{product.category?.name || 'Uncategorized'}</div>
                            {product.subCategory && (
                              <div className="text-xs text-gray-500">{product.subCategory.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={stockStatus.variant} className="gap-1">
                              {stockStatus.icon}
                              {stockStatus.label}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {product.totalStock} unit{product.totalStock !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {minPrice === maxPrice ? (
                              <div className="font-medium">{formatPrice(minPrice)}</div>
                            ) : (
                              <div className="font-medium">
                                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                              </div>
                            )}
                            {firstVariant?.sizes?.some(size => size.discount > 0) && (
                              <div className="text-xs text-green-600 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Discount available
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{product.sales}</div>
                            <div className="text-xs text-gray-500">sales</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
                            <span className="text-sm text-gray-500">({product.numReviews || 0})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{formatDate(product.createdAt)}</div>
                            <div className="text-xs text-gray-500">Added</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      router.push(`/seller/stores/${params.storeUrl}/products/${product.id}`)
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      router.push(`/seller/stores/${params.storeUrl}/products/${product.id}/edit`)
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setProductToDelete(product.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/seller/stores/${params.storeUrl}/products/${product.id}/analytics`)
                                  }
                                >
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Copy product URL
                                    const productUrl = `${window.location.origin}/product/${product.slug}`;
                                    navigator.clipboard.writeText(productUrl);
                                    toast.success('Product URL copied to clipboard');
                                  }}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setProductToDelete(product.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {products.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalProducts)}
              </span>{' '}
              of <span className="font-medium">{pagination.totalProducts}</span> products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Export/Import Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Bulk Operations</CardTitle>
          <CardDescription>Import or export products in bulk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Products (CSV)
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import Products (CSV)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
            >
              Delete {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerProductsPage;