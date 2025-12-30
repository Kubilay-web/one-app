"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Star, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Download,
  RefreshCw,
  MoreVertical,
  Folder,
  Layers,
  Grid,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types
interface SubCategory {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  productCount: number;
  category: {
    id: string;
    name: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CategoryOption {
  value: string;
  label: string;
  url: string;
  image: string;
  subCategoryCount: number;
  productCount: number;
}

interface SubCategoryFormData {
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
}

// Main component
export default function AdminNewSubCategoryPage() {
  const router = useRouter();
  
  // State
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<string>('ALL');
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: '',
    image: '',
    url: '',
    featured: false,
    categoryId: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<SubCategoryFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch categories for dropdown
  const fetchCategoryOptions = useCallback(async () => {
    try {
      const response = await fetch('/api/oneshop/admin/subcategories/options');
      const data = await response.json();

      if (data.success) {
        setCategoryOptions(data.data);
        // Set first category as default if none selected
        if (data.data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({
            ...prev,
            categoryId: data.data[0].value,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories');
    }
  }, [formData.categoryId]);

  // Fetch subcategories
  const fetchSubCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'ALL' && { categoryId: categoryFilter }),
        ...(featuredFilter !== 'ALL' && { featured: featuredFilter }),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/oneshop/admin/subcategories?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubCategories(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Error fetching subcategories');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, categoryFilter, featuredFilter]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      // Burada gerçek bir image upload API'si kullanılmalı
      // Örnek olarak base64'e çeviriyoruz
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    }
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    handleImageUpload(file);
  };

  // Generate URL from name
  const generateUrlFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle name change and auto-generate URL
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      url: generateUrlFromName(name),
    }));
  };

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({ ...prev, url }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<SubCategoryFormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.url.trim()) {
      errors.url = 'URL is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.url)) {
      errors.url = 'URL can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (!formData.image.trim()) {
      errors.image = 'Image is required';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/oneshop/admin/subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Subcategory created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          image: '',
          url: '',
          featured: false,
          categoryId: categoryOptions[0]?.value || '',
        });
        setImagePreview('');
        setImageFile(null);
        setFormErrors({});
        
        // Refresh the list
        fetchSubCategories();
      } else {
        toast.error(data.message || 'Error creating subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Error creating subcategory');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Bulk operations
  const handleBulkAction = async (action: 'delete' | 'update-featured', data?: any) => {
    if (selectedSubCategories.length === 0) {
      toast.error('Please select subcategories to perform this action');
      return;
    }

    try {
      setBulkLoading(true);
      
      const response = await fetch('/api/oneshop/admin/subcategories/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          subCategoryIds: selectedSubCategories,
          data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setSelectedSubCategories([]);
        fetchSubCategories();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Error performing bulk action');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/onesshop/admin/subcategories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subcategory deleted successfully');
        fetchSubCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory');
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Select all subcategories
  const handleSelectAll = () => {
    if (selectedSubCategories.length === subCategories.length) {
      setSelectedSubCategories([]);
    } else {
      setSelectedSubCategories(subCategories.map(sc => sc.id));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSubCategories();
    fetchCategoryOptions();
  }, [fetchSubCategories, fetchCategoryOptions]);

  return (
    <Fragment>
      <div className="main-content">
        {/* Header */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subcategories Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create and manage product subcategories
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/categories"
                  className="ti-btn ti-btn-outline-light flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  Manage Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-4 col-span-12">
                <div className="box">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add New Subcategory
                    </div>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="ti-form-label flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Subcategory Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleNameChange}
                          className={`ti-form-control ${formErrors.name ? 'border-danger' : ''}`}
                          placeholder="Enter subcategory name"
                        />
                        {formErrors.name && (
                          <p className="text-danger text-sm mt-1">{formErrors.name}</p>
                        )}
                      </div>

                      {/* URL */}
                      <div>
                        <label htmlFor="url" className="ti-form-label flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          URL Slug
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            /
                          </div>
                          <input
                            type="text"
                            id="url"
                            value={formData.url}
                            onChange={handleUrlChange}
                            className={`ti-form-control pl-8 ${formErrors.url ? 'border-danger' : ''}`}
                            placeholder="subcategory-url"
                          />
                        </div>
                        {formErrors.url && (
                          <p className="text-danger text-sm mt-1">{formErrors.url}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          This will be used in the URL: /category/your-url
                        </p>
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label htmlFor="category" className="ti-form-label flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          Parent Category
                        </label>
                        <select
                          id="category"
                          value={formData.categoryId}
                          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                          className={`ti-form-control ${formErrors.categoryId ? 'border-danger' : ''}`}
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label} ({option.subCategoryCount} subcategories)
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="text-danger text-sm mt-1">{formErrors.categoryId}</p>
                        )}
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="ti-form-label flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Subcategory Image
                        </label>
                        
                        {/* Image Preview */}
                        {imagePreview ? (
                          <div className="mb-4">
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview('');
                                  setFormData(prev => ({ ...prev, image: '' }));
                                  setImageFile(null);
                                }}
                                className="absolute top-2 right-2 bg-danger text-white p-1 rounded-full hover:bg-danger/80 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-defaultborder dark:border-defaultborder/50 rounded-lg p-6 text-center mb-4">
                            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              Upload subcategory image
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="image-upload"
                              className="ti-btn ti-btn-outline-light cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </label>
                          </div>
                        )}
                        
                        {formErrors.image && (
                          <p className="text-danger text-sm mt-1">{formErrors.image}</p>
                        )}
                      </div>

                      {/* Featured */}
                      <div>
                        <label className="ti-form-label flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Featured Status
                        </label>
                        <div className="flex items-center gap-4 mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={formData.featured}
                              onChange={() => setFormData(prev => ({ ...prev, featured: true }))}
                              className="ti-form-radio"
                            />
                            <span className="ms-2">Featured</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={!formData.featured}
                              onChange={() => setFormData(prev => ({ ...prev, featured: false }))}
                              className="ti-form-radio"
                            />
                            <span className="ms-2">Regular</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Featured subcategories will be highlighted on the homepage
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="ti-btn ti-btn-primary w-full flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Create Subcategory
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Quick Stats
                    </div>
                  </div>
                  <div className="box-body">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Subcategories</p>
                          <h3 className="text-xl font-bold mt-1">
                            {pagination.total.toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Layers className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
                          <h3 className="text-xl font-bold mt-1">
                            {subCategories.filter(sc => sc.featured).length}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-warning/10 text-warning">
                          <Star className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                          <h3 className="text-xl font-bold mt-1">
                            {subCategories.reduce((sum, sc) => sum + sc.productCount, 0).toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-2 rounded-lg bg-success/10 text-success">
                          <Package className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - List */}
              <div className="lg:col-span-8 col-span-12">
                <div className="box">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <Grid className="w-5 h-5" />
                      All Subcategories
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className="box-body border-b border-defaultborder dark:border-defaultborder/10">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ti-form-control ps-10"
                          />
                        </div>
                        <button
                          type="submit"
                          className="ti-btn ti-btn-primary"
                          disabled={loading}
                        >
                          Search
                        </button>
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="ti-btn ti-btn-outline-light"
                          >
                            Clear
                          </button>
                        )}
                      </form>

                      <div className="flex gap-2">
                        <select
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                          }}
                          className="ti-form-control"
                        >
                          <option value="ALL">All Categories</option>
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={featuredFilter}
                          onChange={(e) => {
                            setFeaturedFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                          }}
                          className="ti-form-control"
                        >
                          <option value="ALL">All Types</option>
                          <option value="true">Featured</option>
                          <option value="false">Regular</option>
                        </select>
                      </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedSubCategories.length > 0 && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSubCategories.length} selected
                        </span>
                        <button
                          onClick={() => handleBulkAction('update-featured', { featured: true })}
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Mark Featured
                        </button>
                        <button
                          onClick={() => handleBulkAction('update-featured', { featured: false })}
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Remove Featured
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${selectedSubCategories.length} subcategories?`)) {
                              handleBulkAction('delete');
                            }
                          }}
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-danger ti-btn-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Selected
                        </button>
                        <button
                          onClick={() => setSelectedSubCategories([])}
                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subcategories List */}
                  <div className="box-body">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : subCategories.length === 0 ? (
                      <div className="text-center py-12">
                        <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          No subcategories found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          {searchTerm || categoryFilter !== 'ALL' || featuredFilter !== 'ALL' 
                            ? 'Try changing your filters' 
                            : 'Get started by creating a new subcategory'}
                        </p>
                        {searchTerm || categoryFilter !== 'ALL' || featuredFilter !== 'ALL' ? (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setCategoryFilter('ALL');
                              setFeaturedFilter('ALL');
                            }}
                            className="ti-btn ti-btn-primary"
                          >
                            Clear Filters
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setFormData({
                                name: '',
                                image: '',
                                url: '',
                                featured: false,
                                categoryId: categoryOptions[0]?.value || '',
                              });
                              setImagePreview('');
                              setImageFile(null);
                            }}
                            className="ti-btn ti-btn-primary"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Subcategory
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="ti-custom-table ti-custom-table-head">
                            <thead>
                              <tr>
                                <th scope="col" className="w-12">
                                  <input
                                    type="checkbox"
                                    checked={subCategories.length > 0 && selectedSubCategories.length === subCategories.length}
                                    onChange={handleSelectAll}
                                    className="ti-form-checkbox"
                                  />
                                </th>
                                <th scope="col">Subcategory</th>
                                <th scope="col">Category</th>
                                <th scope="col">Products</th>
                                <th scope="col">Status</th>
                                <th scope="col">Created</th>
                                <th scope="col" className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subCategories.map((subCategory) => (
                                <tr key={subCategory.id} className="hover:bg-gray-50 dark:hover:bg-black/20">
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedSubCategories.includes(subCategory.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSubCategories(prev => [...prev, subCategory.id]);
                                        } else {
                                          setSelectedSubCategories(prev => prev.filter(id => id !== subCategory.id));
                                        }
                                      }}
                                      className="ti-form-checkbox"
                                    />
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                        {subCategory.image ? (
                                          <Image
                                            src={subCategory.image}
                                            alt={subCategory.name}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <ImageIcon className="w-5 h-5 text-gray-400" />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/admin/subcategories/${subCategory.id}`}
                                            className="font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
                                          >
                                            {subCategory.name}
                                          </Link>
                                          {subCategory.featured && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                                              <Star className="w-3 h-3" />
                                              Featured
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          /{subCategory.url}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/admin/categories/${subCategory.category.id}`}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/20 transition-colors"
                                      >
                                        {subCategory.category.name}
                                      </Link>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-1">
                                      <Package className="w-4 h-4 text-gray-400" />
                                      <span className="font-medium">
                                        {subCategory.productCount.toLocaleString()}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${subCategory.featured ? 'bg-warning/10 text-warning dark:bg-warning/20' : 'bg-success/10 text-success dark:bg-success/20'}`}>
                                      {subCategory.featured ? (
                                        <>
                                          <Star className="w-3 h-3" />
                                          Featured
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-3 h-3" />
                                          Active
                                        </>
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {new Date(subCategory.createdAt).toLocaleDateString()}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center justify-end gap-2">
                                      <Link
                                        href={`/admin/subcategories/${subCategory.id}`}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="View"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Link>
                                      <Link
                                        href={`/admin/subcategories/${subCategory.id}/edit`}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Link>
                                      <button
                                        onClick={() => handleDeleteSubCategory(subCategory.id, subCategory.name)}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-danger/10 hover:text-danger"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      <div className="relative group">
                                        <button
                                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                                          title="More options"
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-defaultborder dark:border-defaultborder/10 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                          <div className="py-1">
                                            <Link
                                              href={`/category/${subCategory.category.url}/${subCategory.url}`}
                                              target="_blank"
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              View on Site
                                            </Link>
                                            <button
                                              onClick={() => {
                                                // Toggle featured status
                                                fetch(`/api/oneshop/admin/subcategories/${subCategory.id}`, {
                                                  method: 'PATCH',
                                                  headers: {
                                                    'Content-Type': 'application/json',
                                                  },
                                                  body: JSON.stringify({
                                                    featured: !subCategory.featured,
                                                  }),
                                                }).then(() => {
                                                  toast.success('Subcategory updated');
                                                  fetchSubCategories();
                                                });
                                              }}
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              {subCategory.featured ? 'Remove Featured' : 'Mark as Featured'}
                                            </button>
                                            <Link
                                              href={`/admin/products?subCategoryId=${subCategory.id}`}
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              View Products
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-defaultborder dark:border-defaultborder/10">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                              {pagination.total} subcategories
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1 || loading}
                                className="ti-btn ti-btn-outline-light ti-btn-sm"
                              >
                                Previous
                              </button>
                              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                let pageNum;
                                if (pagination.pages <= 5) {
                                  pageNum = i + 1;
                                } else if (pagination.page <= 3) {
                                  pageNum = i + 1;
                                } else if (pagination.page >= pagination.pages - 2) {
                                  pageNum = pagination.pages - 4 + i;
                                } else {
                                  pageNum = pagination.page - 2 + i;
                                }

                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    disabled={loading}
                                    className={`ti-btn ti-btn-sm ${
                                      pagination.page === pageNum
                                        ? 'ti-btn-primary'
                                        : 'ti-btn-outline-light'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages || loading}
                                className="ti-btn ti-btn-outline-light ti-btn-sm"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Tips & Best Practices
                    </div>
                  </div>
                  <div className="box-body">
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Use descriptive names that clearly indicate what products belong in this subcategory.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>URL slugs should be lowercase, use hyphens instead of spaces, and be SEO-friendly.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Use high-quality, relevant images that represent the subcategory well.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Featured subcategories appear on the homepage and in prominent places.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Organize subcategories logically under appropriate parent categories.</span>
                      </li>
                    </ul>
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