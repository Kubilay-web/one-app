// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { Fragment } from 'react';
// import dynamic from 'next/dynamic';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import {
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Check,
//   X,
//   Star,
//   Package,
//   TrendingUp,
//   AlertCircle,
//   Download,
//   RefreshCw,
//   MoreVertical,
//   Folder,
//   Layers,
//   Grid,
//   Upload,
//   Image as ImageIcon,
//   Link as LinkIcon,
//   Hash
// } from 'lucide-react';
// import toast from 'react-hot-toast';

// // Types
// interface SubCategory {
//   id: string;
//   name: string;
//   image: string;
//   url: string;
//   featured: boolean;
//   productCount: number;
//   category: {
//     id: string;
//     name: string;
//     url: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// interface CategoryOption {
//   value: string;
//   label: string;
//   url: string;
//   image: string;
//   subCategoryCount: number;
//   productCount: number;
// }

// interface SubCategoryFormData {
//   name: string;
//   image: string;
//   url: string;
//   featured: boolean;
//   categoryId: string;
// }

// // Main component
// export default function AdminNewSubCategoryPage() {
//   const router = useRouter();

//   // State
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
//   const [featuredFilter, setFeaturedFilter] = useState<string>('ALL');
//   const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

//   // Form state
//   const [formData, setFormData] = useState<SubCategoryFormData>({
//     name: '',
//     image: '',
//     url: '',
//     featured: false,
//     categoryId: '',
//   });
//   const [formErrors, setFormErrors] = useState<Partial<SubCategoryFormData>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   // Pagination
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0,
//   });

//   // Fetch categories for dropdown
//   const fetchCategoryOptions = useCallback(async () => {
//     try {
//       const response = await fetch('/api/oneshop/admin/subcategories/options');
//       const data = await response.json();

//       if (data.success) {
//         setCategoryOptions(data.data);
//         // Set first category as default if none selected
//         if (data.data.length > 0 && !formData.categoryId) {
//           setFormData(prev => ({
//             ...prev,
//             categoryId: data.data[0].value,
//           }));
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       toast.error('Error loading categories');
//     }
//   }, [formData.categoryId]);

//   // Fetch subcategories
//   const fetchSubCategories = useCallback(async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams({
//         page: pagination.page.toString(),
//         limit: pagination.limit.toString(),
//         ...(searchTerm && { search: searchTerm }),
//         ...(categoryFilter !== 'ALL' && { categoryId: categoryFilter }),
//         ...(featuredFilter !== 'ALL' && { featured: featuredFilter }),
//         sortBy: 'createdAt',
//         sortOrder: 'desc',
//       });

//       const response = await fetch(`/api/oneshop/admin/subcategories?${params}`);
//       const data = await response.json();

//       if (data.success) {
//         setSubCategories(data.data);
//         setPagination(data.pagination);
//       } else {
//         toast.error(data.message || 'Failed to fetch subcategories');
//       }
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//       toast.error('Error fetching subcategories');
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.page, pagination.limit, searchTerm, categoryFilter, featuredFilter]);

//   // Handle image upload
//   const handleImageUpload = async (file: File) => {
//     try {
//       // Burada gerçek bir image upload API'si kullanılmalı
//       // Örnek olarak base64'e çeviriyoruz
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result as string;
//         setImagePreview(base64String);
//         setFormData(prev => ({ ...prev, image: base64String }));
//       };
//       reader.readAsDataURL(file);

//       toast.success('Image uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Error uploading image');
//     }
//   };

//   // Handle image file change
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
//     if (!validTypes.includes(file.type)) {
//       toast.error('Please upload a valid image file (JPEG, PNG, WebP, GIF)');
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }

//     setImageFile(file);
//     handleImageUpload(file);
//   };

//   // Generate URL from name
//   const generateUrlFromName = (name: string) => {
//     return name
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .trim();
//   };

//   // Handle name change and auto-generate URL
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const name = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       name,
//       url: generateUrlFromName(name),
//     }));
//   };

//   // Handle URL change
//   const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const url = e.target.value
//       .toLowerCase()
//       .replace(/[^a-z0-9-]/g, '-')
//       .replace(/-+/g, '-')
//       .trim();

//     setFormData(prev => ({ ...prev, url }));
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     const errors: Partial<SubCategoryFormData> = {};

//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     }

//     if (!formData.url.trim()) {
//       errors.url = 'URL is required';
//     } else if (!/^[a-z0-9-]+$/.test(formData.url)) {
//       errors.url = 'URL can only contain lowercase letters, numbers, and hyphens';
//     }

//     if (!formData.image.trim()) {
//       errors.image = 'Image is required';
//     }

//     if (!formData.categoryId) {
//       errors.categoryId = 'Category is required';
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error('Please fix the errors in the form');
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const response = await fetch('/api/oneshop/admin/subcategories', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Subcategory created successfully!');

//         // Reset form
//         setFormData({
//           name: '',
//           image: '',
//           url: '',
//           featured: false,
//           categoryId: categoryOptions[0]?.value || '',
//         });
//         setImagePreview('');
//         setImageFile(null);
//         setFormErrors({});

//         // Refresh the list
//         fetchSubCategories();
//       } else {
//         toast.error(data.message || 'Error creating subcategory');
//       }
//     } catch (error) {
//       console.error('Error creating subcategory:', error);
//       toast.error('Error creating subcategory');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle search
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   // Bulk operations
//   const handleBulkAction = async (action: 'delete' | 'update-featured', data?: any) => {
//     if (selectedSubCategories.length === 0) {
//       toast.error('Please select subcategories to perform this action');
//       return;
//     }

//     try {
//       setBulkLoading(true);

//       const response = await fetch('/api/oneshop/admin/subcategories/bulk', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           action,
//           subCategoryIds: selectedSubCategories,
//           data,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success(result.message);
//         setSelectedSubCategories([]);
//         fetchSubCategories();
//       } else {
//         toast.error(result.message);
//       }
//     } catch (error) {
//       console.error('Error performing bulk action:', error);
//       toast.error('Error performing bulk action');
//     } finally {
//       setBulkLoading(false);
//     }
//   };

//   // Handle subcategory deletion
//   const handleDeleteSubCategory = async (id: string, name: string) => {
//     if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

//     try {
//       const response = await fetch(`/api/onesshop/admin/subcategories/${id}`, {
//         method: 'DELETE',
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Subcategory deleted successfully');
//         fetchSubCategories();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting subcategory:', error);
//       toast.error('Error deleting subcategory');
//     }
//   };

//   // Handle page change
//   const handlePageChange = (newPage: number) => {
//     setPagination(prev => ({ ...prev, page: newPage }));
//   };

//   // Select all subcategories
//   const handleSelectAll = () => {
//     if (selectedSubCategories.length === subCategories.length) {
//       setSelectedSubCategories([]);
//     } else {
//       setSelectedSubCategories(subCategories.map(sc => sc.id));
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchSubCategories();
//     fetchCategoryOptions();
//   }, [fetchSubCategories, fetchCategoryOptions]);

//   return (
//     <Fragment>
//       <div className="main-content">
//         {/* Header */}
//         <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
//           <div className="container">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subcategories Management</h1>
//                 <p className="text-gray-600 dark:text-gray-400 mt-1">
//                   Create and manage product subcategories
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Link
//                   href="/admin/categories"
//                   className="ti-btn ti-btn-outline-light flex items-center gap-2"
//                 >
//                   <Folder className="w-4 h-4" />
//                   Manage Categories
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <section className="section">
//           <div className="container">
//             <div className="grid grid-cols-12 gap-6">
//               {/* Left Column - Form */}
//               <div className="lg:col-span-4 col-span-12">
//                 <div className="box">
//                   <div className="box-header">
//                     <div className="box-title flex items-center gap-2">
//                       <Plus className="w-5 h-5" />
//                       Add New Subcategory
//                     </div>
//                   </div>
//                   <div className="box-body">
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       {/* Name */}
//                       <div>
//                         <label htmlFor="name" className="ti-form-label flex items-center gap-2">
//                           <Hash className="w-4 h-4" />
//                           Subcategory Name
//                         </label>
//                         <input
//                           type="text"
//                           id="name"
//                           value={formData.name}
//                           onChange={handleNameChange}
//                           className={`ti-form-control ${formErrors.name ? 'border-danger' : ''}`}
//                           placeholder="Enter subcategory name"
//                         />
//                         {formErrors.name && (
//                           <p className="text-danger text-sm mt-1">{formErrors.name}</p>
//                         )}
//                       </div>

//                       {/* URL */}
//                       <div>
//                         <label htmlFor="url" className="ti-form-label flex items-center gap-2">
//                           <LinkIcon className="w-4 h-4" />
//                           URL Slug
//                         </label>
//                         <div className="relative">
//                           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                             /
//                           </div>
//                           <input
//                             type="text"
//                             id="url"
//                             value={formData.url}
//                             onChange={handleUrlChange}
//                             className={`ti-form-control pl-8 ${formErrors.url ? 'border-danger' : ''}`}
//                             placeholder="subcategory-url"
//                           />
//                         </div>
//                         {formErrors.url && (
//                           <p className="text-danger text-sm mt-1">{formErrors.url}</p>
//                         )}
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           This will be used in the URL: /category/your-url
//                         </p>
//                       </div>

//                       {/* Category Selection */}
//                       <div>
//                         <label htmlFor="category" className="ti-form-label flex items-center gap-2">
//                           <Layers className="w-4 h-4" />
//                           Parent Category
//                         </label>
//                         <select
//                           id="category"
//                           value={formData.categoryId}
//                           onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
//                           className={`ti-form-control ${formErrors.categoryId ? 'border-danger' : ''}`}
//                         >
//                           <option value="">Select a category</option>
//                           {categoryOptions.map(option => (
//                             <option key={option.value} value={option.value}>
//                               {option.label} ({option.subCategoryCount} subcategories)
//                             </option>
//                           ))}
//                         </select>
//                         {formErrors.categoryId && (
//                           <p className="text-danger text-sm mt-1">{formErrors.categoryId}</p>
//                         )}
//                       </div>

//                       {/* Image Upload */}
//                       <div>
//                         <label className="ti-form-label flex items-center gap-2">
//                           <ImageIcon className="w-4 h-4" />
//                           Subcategory Image
//                         </label>

//                         {/* Image Preview */}
//                         {imagePreview ? (
//                           <div className="mb-4">
//                             <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
//                               <Image
//                                 src={imagePreview}
//                                 alt="Preview"
//                                 fill
//                                 className="object-cover"
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setImagePreview('');
//                                   setFormData(prev => ({ ...prev, image: '' }));
//                                   setImageFile(null);
//                                 }}
//                                 className="absolute top-2 right-2 bg-danger text-white p-1 rounded-full hover:bg-danger/80 transition-colors"
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="border-2 border-dashed border-defaultborder dark:border-defaultborder/50 rounded-lg p-6 text-center mb-4">
//                             <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                             <p className="text-gray-600 dark:text-gray-400 mb-2">
//                               Upload subcategory image
//                             </p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                               PNG, JPG, GIF up to 5MB
//                             </p>
//                             <input
//                               type="file"
//                               id="image-upload"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               className="hidden"
//                             />
//                             <label
//                               htmlFor="image-upload"
//                               className="ti-btn ti-btn-outline-light cursor-pointer"
//                             >
//                               <Upload className="w-4 h-4 mr-2" />
//                               Choose Image
//                             </label>
//                           </div>
//                         )}

//                         {formErrors.image && (
//                           <p className="text-danger text-sm mt-1">{formErrors.image}</p>
//                         )}
//                       </div>

//                       {/* Featured */}
//                       <div>
//                         <label className="ti-form-label flex items-center gap-2">
//                           <Star className="w-4 h-4" />
//                           Featured Status
//                         </label>
//                         <div className="flex items-center gap-4 mt-2">
//                           <label className="inline-flex items-center">
//                             <input
//                               type="radio"
//                               checked={formData.featured}
//                               onChange={() => setFormData(prev => ({ ...prev, featured: true }))}
//                               className="ti-form-radio"
//                             />
//                             <span className="ms-2">Featured</span>
//                           </label>
//                           <label className="inline-flex items-center">
//                             <input
//                               type="radio"
//                               checked={!formData.featured}
//                               onChange={() => setFormData(prev => ({ ...prev, featured: false }))}
//                               className="ti-form-radio"
//                             />
//                             <span className="ms-2">Regular</span>
//                           </label>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                           Featured subcategories will be highlighted on the homepage
//                         </p>
//                       </div>

//                       {/* Submit Button */}
//                       <div className="pt-4 border-t border-defaultborder dark:border-defaultborder/10">
//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="ti-btn ti-btn-primary w-full flex items-center justify-center gap-2"
//                         >
//                           {isSubmitting ? (
//                             <>
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                               Creating...
//                             </>
//                           ) : (
//                             <>
//                               <Plus className="w-4 h-4" />
//                               Create Subcategory
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="box mt-6">
//                   <div className="box-header">
//                     <div className="box-title flex items-center gap-2">
//                       <TrendingUp className="w-5 h-5" />
//                       Quick Stats
//                     </div>
//                   </div>
//                   <div className="box-body">
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">Total Subcategories</p>
//                           <h3 className="text-xl font-bold mt-1">
//                             {pagination.total.toLocaleString()}
//                           </h3>
//                         </div>
//                         <div className="p-2 rounded-lg bg-primary/10 text-primary">
//                           <Layers className="w-6 h-6" />
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between pt-4 border-t border-defaultborder dark:border-defaultborder/10">
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
//                           <h3 className="text-xl font-bold mt-1">
//                             {subCategories.filter(sc => sc.featured).length}
//                           </h3>
//                         </div>
//                         <div className="p-2 rounded-lg bg-warning/10 text-warning">
//                           <Star className="w-6 h-6" />
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between pt-4 border-t border-defaultborder dark:border-defaultborder/10">
//                         <div>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
//                           <h3 className="text-xl font-bold mt-1">
//                             {subCategories.reduce((sum, sc) => sum + sc.productCount, 0).toLocaleString()}
//                           </h3>
//                         </div>
//                         <div className="p-2 rounded-lg bg-success/10 text-success">
//                           <Package className="w-6 h-6" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - List */}
//               <div className="lg:col-span-8 col-span-12">
//                 <div className="box">
//                   <div className="box-header">
//                     <div className="box-title flex items-center gap-2">
//                       <Grid className="w-5 h-5" />
//                       All Subcategories
//                     </div>
//                   </div>

//                   {/* Filters */}
//                   <div className="box-body border-b border-defaultborder dark:border-defaultborder/10">
//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <form onSubmit={handleSearch} className="flex-1 flex gap-2">
//                         <div className="relative flex-1">
//                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="Search subcategories..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="ti-form-control ps-10"
//                           />
//                         </div>
//                         <button
//                           type="submit"
//                           className="ti-btn ti-btn-primary"
//                           disabled={loading}
//                         >
//                           Search
//                         </button>
//                         {searchTerm && (
//                           <button
//                             type="button"
//                             onClick={() => setSearchTerm('')}
//                             className="ti-btn ti-btn-outline-light"
//                           >
//                             Clear
//                           </button>
//                         )}
//                       </form>

//                       <div className="flex gap-2">
//                         <select
//                           value={categoryFilter}
//                           onChange={(e) => {
//                             setCategoryFilter(e.target.value);
//                             setPagination(prev => ({ ...prev, page: 1 }));
//                           }}
//                           className="ti-form-control"
//                         >
//                           <option value="ALL">All Categories</option>
//                           {categoryOptions.map(option => (
//                             <option key={option.value} value={option.value}>
//                               {option.label}
//                             </option>
//                           ))}
//                         </select>

//                         <select
//                           value={featuredFilter}
//                           onChange={(e) => {
//                             setFeaturedFilter(e.target.value);
//                             setPagination(prev => ({ ...prev, page: 1 }));
//                           }}
//                           className="ti-form-control"
//                         >
//                           <option value="ALL">All Types</option>
//                           <option value="true">Featured</option>
//                           <option value="false">Regular</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* Bulk Actions */}
//                     {selectedSubCategories.length > 0 && (
//                       <div className="flex items-center gap-3 mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {selectedSubCategories.length} selected
//                         </span>
//                         <button
//                           onClick={() => handleBulkAction('update-featured', { featured: true })}
//                           disabled={bulkLoading}
//                           className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
//                         >
//                           <Star className="w-4 h-4" />
//                           Mark Featured
//                         </button>
//                         <button
//                           onClick={() => handleBulkAction('update-featured', { featured: false })}
//                           disabled={bulkLoading}
//                           className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
//                         >
//                           <Star className="w-4 h-4" />
//                           Remove Featured
//                         </button>
//                         <button
//                           onClick={() => {
//                             if (confirm(`Delete ${selectedSubCategories.length} subcategories?`)) {
//                               handleBulkAction('delete');
//                             }
//                           }}
//                           disabled={bulkLoading}
//                           className="ti-btn ti-btn-danger ti-btn-sm flex items-center gap-2"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                           Delete Selected
//                         </button>
//                         <button
//                           onClick={() => setSelectedSubCategories([])}
//                           className="ti-btn ti-btn-outline-light ti-btn-sm"
//                         >
//                           Clear
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Subcategories List */}
//                   <div className="box-body">
//                     {loading ? (
//                       <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                       </div>
//                     ) : subCategories.length === 0 ? (
//                       <div className="text-center py-12">
//                         <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                         <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           No subcategories found
//                         </h3>
//                         <p className="text-gray-500 dark:text-gray-400 mb-6">
//                           {searchTerm || categoryFilter !== 'ALL' || featuredFilter !== 'ALL'
//                             ? 'Try changing your filters'
//                             : 'Get started by creating a new subcategory'}
//                         </p>
//                         {searchTerm || categoryFilter !== 'ALL' || featuredFilter !== 'ALL' ? (
//                           <button
//                             onClick={() => {
//                               setSearchTerm('');
//                               setCategoryFilter('ALL');
//                               setFeaturedFilter('ALL');
//                             }}
//                             className="ti-btn ti-btn-primary"
//                           >
//                             Clear Filters
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => {
//                               setFormData({
//                                 name: '',
//                                 image: '',
//                                 url: '',
//                                 featured: false,
//                                 categoryId: categoryOptions[0]?.value || '',
//                               });
//                               setImagePreview('');
//                               setImageFile(null);
//                             }}
//                             className="ti-btn ti-btn-primary"
//                           >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Create Subcategory
//                           </button>
//                         )}
//                       </div>
//                     ) : (
//                       <>
//                         <div className="overflow-x-auto">
//                           <table className="ti-custom-table ti-custom-table-head">
//                             <thead>
//                               <tr>
//                                 <th scope="col" className="w-12">
//                                   <input
//                                     type="checkbox"
//                                     checked={subCategories.length > 0 && selectedSubCategories.length === subCategories.length}
//                                     onChange={handleSelectAll}
//                                     className="ti-form-checkbox"
//                                   />
//                                 </th>
//                                 <th scope="col">Subcategory</th>
//                                 <th scope="col">Category</th>
//                                 <th scope="col">Products</th>
//                                 <th scope="col">Status</th>
//                                 <th scope="col">Created</th>
//                                 <th scope="col" className="text-right">Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {subCategories.map((subCategory) => (
//                                 <tr key={subCategory.id} className="hover:bg-gray-50 dark:hover:bg-black/20">
//                                   <td>
//                                     <input
//                                       type="checkbox"
//                                       checked={selectedSubCategories.includes(subCategory.id)}
//                                       onChange={(e) => {
//                                         if (e.target.checked) {
//                                           setSelectedSubCategories(prev => [...prev, subCategory.id]);
//                                         } else {
//                                           setSelectedSubCategories(prev => prev.filter(id => id !== subCategory.id));
//                                         }
//                                       }}
//                                       className="ti-form-checkbox"
//                                     />
//                                   </td>
//                                   <td>
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
//                                         {subCategory.image ? (
//                                           <Image
//                                             src={subCategory.image}
//                                             alt={subCategory.name}
//                                             width={40}
//                                             height={40}
//                                             className="object-cover w-full h-full"
//                                           />
//                                         ) : (
//                                           <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
//                                             <ImageIcon className="w-5 h-5 text-gray-400" />
//                                           </div>
//                                         )}
//                                       </div>
//                                       <div>
//                                         <div className="flex items-center gap-2">
//                                           <Link
//                                             href={`/admin/subcategories/${subCategory.id}`}
//                                             className="font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
//                                           >
//                                             {subCategory.name}
//                                           </Link>
//                                           {subCategory.featured && (
//                                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
//                                               <Star className="w-3 h-3" />
//                                               Featured
//                                             </span>
//                                           )}
//                                         </div>
//                                         <div className="text-sm text-gray-600 dark:text-gray-400">
//                                           /{subCategory.url}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="flex items-center gap-2">
//                                       <Link
//                                         href={`/admin/categories/${subCategory.category.id}`}
//                                         className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/20 transition-colors"
//                                       >
//                                         {subCategory.category.name}
//                                       </Link>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="flex items-center gap-1">
//                                       <Package className="w-4 h-4 text-gray-400" />
//                                       <span className="font-medium">
//                                         {subCategory.productCount.toLocaleString()}
//                                       </span>
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${subCategory.featured ? 'bg-warning/10 text-warning dark:bg-warning/20' : 'bg-success/10 text-success dark:bg-success/20'}`}>
//                                       {subCategory.featured ? (
//                                         <>
//                                           <Star className="w-3 h-3" />
//                                           Featured
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Check className="w-3 h-3" />
//                                           Active
//                                         </>
//                                       )}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                                       {new Date(subCategory.createdAt).toLocaleDateString()}
//                                     </div>
//                                   </td>
//                                   <td>
//                                     <div className="flex items-center justify-end gap-2">
//                                       <Link
//                                         href={`/admin/subcategories/${subCategory.id}`}
//                                         className="ti-btn ti-btn-outline-light ti-btn-sm"
//                                         title="View"
//                                       >
//                                         <Eye className="w-4 h-4" />
//                                       </Link>
//                                       <Link
//                                         href={`/admin/subcategories/${subCategory.id}/edit`}
//                                         className="ti-btn ti-btn-outline-light ti-btn-sm"
//                                         title="Edit"
//                                       >
//                                         <Edit className="w-4 h-4" />
//                                       </Link>
//                                       <button
//                                         onClick={() => handleDeleteSubCategory(subCategory.id, subCategory.name)}
//                                         className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-danger/10 hover:text-danger"
//                                         title="Delete"
//                                       >
//                                         <Trash2 className="w-4 h-4" />
//                                       </button>
//                                       <div className="relative group">
//                                         <button
//                                           className="ti-btn ti-btn-outline-light ti-btn-sm"
//                                           title="More options"
//                                         >
//                                           <MoreVertical className="w-4 h-4" />
//                                         </button>
//                                         <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-defaultborder dark:border-defaultborder/10 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                                           <div className="py-1">
//                                             <Link
//                                               href={`/category/${subCategory.category.url}/${subCategory.url}`}
//                                               target="_blank"
//                                               className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
//                                             >
//                                               View on Site
//                                             </Link>
//                                             <button
//                                               onClick={() => {
//                                                 // Toggle featured status
//                                                 fetch(`/api/oneshop/admin/subcategories/${subCategory.id}`, {
//                                                   method: 'PATCH',
//                                                   headers: {
//                                                     'Content-Type': 'application/json',
//                                                   },
//                                                   body: JSON.stringify({
//                                                     featured: !subCategory.featured,
//                                                   }),
//                                                 }).then(() => {
//                                                   toast.success('Subcategory updated');
//                                                   fetchSubCategories();
//                                                 });
//                                               }}
//                                               className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
//                                             >
//                                               {subCategory.featured ? 'Remove Featured' : 'Mark as Featured'}
//                                             </button>
//                                             <Link
//                                               href={`/admin/products?subCategoryId=${subCategory.id}`}
//                                               className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
//                                             >
//                                               View Products
//                                             </Link>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>

//                         {/* Pagination */}
//                         {pagination.pages > 1 && (
//                           <div className="flex items-center justify-between mt-6 pt-6 border-t border-defaultborder dark:border-defaultborder/10">
//                             <div className="text-sm text-gray-600 dark:text-gray-400">
//                               Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
//                               {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                               {pagination.total} subcategories
//                             </div>
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handlePageChange(pagination.page - 1)}
//                                 disabled={pagination.page === 1 || loading}
//                                 className="ti-btn ti-btn-outline-light ti-btn-sm"
//                               >
//                                 Previous
//                               </button>
//                               {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                                 let pageNum;
//                                 if (pagination.pages <= 5) {
//                                   pageNum = i + 1;
//                                 } else if (pagination.page <= 3) {
//                                   pageNum = i + 1;
//                                 } else if (pagination.page >= pagination.pages - 2) {
//                                   pageNum = pagination.pages - 4 + i;
//                                 } else {
//                                   pageNum = pagination.page - 2 + i;
//                                 }

//                                 return (
//                                   <button
//                                     key={pageNum}
//                                     onClick={() => handlePageChange(pageNum)}
//                                     disabled={loading}
//                                     className={`ti-btn ti-btn-sm ${
//                                       pagination.page === pageNum
//                                         ? 'ti-btn-primary'
//                                         : 'ti-btn-outline-light'
//                                     }`}
//                                   >
//                                     {pageNum}
//                                   </button>
//                                 );
//                               })}
//                               <button
//                                 onClick={() => handlePageChange(pagination.page + 1)}
//                                 disabled={pagination.page === pagination.pages || loading}
//                                 className="ti-btn ti-btn-outline-light ti-btn-sm"
//                               >
//                                 Next
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick Tips */}
//                 <div className="box mt-6">
//                   <div className="box-header">
//                     <div className="box-title flex items-center gap-2">
//                       <AlertCircle className="w-5 h-5" />
//                       Tips & Best Practices
//                     </div>
//                   </div>
//                   <div className="box-body">
//                     <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
//                       <li className="flex items-start gap-2">
//                         <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
//                         <span>Use descriptive names that clearly indicate what products belong in this subcategory.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
//                         <span>URL slugs should be lowercase, use hyphens instead of spaces, and be SEO-friendly.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
//                         <span>Use high-quality, relevant images that represent the subcategory well.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
//                         <span>Featured subcategories appear on the homepage and in prominent places.</span>
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
//                         <span>Organize subcategories logically under appropriate parent categories.</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </Fragment>
//   );
// }








"use client";

import React, { Fragment, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
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
  RefreshCw,
  MoreVertical,
  Folder,
  Layers,
  Grid,
  Upload,
  Image as ImageIcon,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

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
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [featuredFilter, setFeaturedFilter] = useState<string>("ALL");
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  // Form state
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name: "",
    image: "",
    url: "",
    featured: false,
    categoryId: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<SubCategoryFormData>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [editFormData, setEditFormData] = useState<SubCategoryFormData>({
    name: "",
    image: "",
    url: "",
    featured: false,
    categoryId: "",
  });
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editUploading, setEditUploading] = useState(false);

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
      const response = await fetch("/api/oneshop/admin/subcategories/options");
      const data = await response.json();

      if (data.success) {
        setCategoryOptions(data.data);
        if (data.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data.data[0].value,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
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
        ...(categoryFilter !== "ALL" && { categoryId: categoryFilter }),
        ...(featuredFilter !== "ALL" && { featured: featuredFilter }),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const response = await fetch(
        `/api/oneshop/admin/subcategories?${params}`,
      );
      const data = await response.json();

      if (data.success) {
        setSubCategories(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    searchTerm,
    categoryFilter,
    featuredFilter,
  ]);

  // Handle image upload
  const handleImageUpload = async (file: File, isEdit: boolean = false) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditImagePreview(base64String);
          setEditFormData((prev) => ({ ...prev, image: base64String }));
        } else {
          setImagePreview(base64String);
          setFormData((prev) => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (isEdit) {
      setEditImageFile(file);
      handleImageUpload(file, true);
    } else {
      setImageFile(file);
      handleImageUpload(file, false);
    }
  };

  // Generate URL from name
  const generateUrlFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      url: generateUrlFromName(name),
    }));
  };

  // Handle URL change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData((prev) => ({ ...prev, url }));
  };

  // Handle edit name change
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setEditFormData((prev) => ({
      ...prev,
      name,
      url: generateUrlFromName(name),
    }));
  };

  // Handle edit URL change
  const handleEditUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setEditFormData((prev) => ({ ...prev, url }));
  };

  // Validate form
  const validateForm = (data: SubCategoryFormData): boolean => {
    const errors: Partial<SubCategoryFormData> = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    }

    if (!data.url.trim()) {
      errors.url = "URL is required";
    } else if (!/^[a-z0-9-]+$/.test(data.url)) {
      errors.url =
        "URL can only contain lowercase letters, numbers, and hyphens";
    }

    if (!data.image.trim()) {
      errors.image = "Image is required";
    }

    if (!data.categoryId) {
      errors.categoryId = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/oneshop/admin/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subcategory created successfully!");

        setFormData({
          name: "",
          image: "",
          url: "",
          featured: false,
          categoryId: categoryOptions[0]?.value || "",
        });
        setImagePreview("");
        setImageFile(null);
        setFormErrors({});

        fetchSubCategories();
      } else {
        toast.error(data.message || "Error creating subcategory");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("Error creating subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setEditFormData({
      name: subCategory.name,
      image: subCategory.image,
      url: subCategory.url,
      featured: subCategory.featured,
      categoryId: subCategory.category.id,
    });
    setEditImagePreview(subCategory.image);
    setEditModalOpen(true);
  };

  // Update subcategory
  const updateSubCategory = async () => {
    if (!validateForm(editFormData)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!selectedSubCategory) return;

    setEditLoading(true);
    try {
      const response = await fetch(`/api/oneshop/admin/subcategories/${selectedSubCategory.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subcategory updated successfully!");
        setEditModalOpen(false);
        setSelectedSubCategory(null);
        fetchSubCategories();
      } else {
        toast.error(data.message || "Error updating subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("Error updating subcategory");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Bulk operations
  const handleBulkAction = async (
    action: "delete" | "update-featured",
    data?: any,
  ) => {
    if (selectedSubCategories.length === 0) {
      toast.error("Please select subcategories to perform this action");
      return;
    }

    try {
      setBulkLoading(true);

      const response = await fetch("/api/oneshop/admin/subcategories/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Error performing bulk action:", error);
      toast.error("Error performing bulk action");
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/oneshop/admin/subcategories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subcategory deleted successfully");
        fetchSubCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error deleting subcategory");
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select all subcategories
  const handleSelectAll = () => {
    if (selectedSubCategories.length === subCategories.length) {
      setSelectedSubCategories([]);
    } else {
      setSelectedSubCategories(subCategories.map((sc) => sc.id));
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/oneshop/admin/subcategories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (response.ok) {
        toast.success(
          `Subcategory ${!currentFeatured ? "featured" : "unfeatured"}`,
        );
        fetchSubCategories();
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Error updating subcategory");
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
        {/* Header - Responsive */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  Subcategories Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create and manage product subcategories
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboards/ecommerce/admin/categories"
                  className="ti-btn ti-btn-outline-light flex items-center gap-2 text-sm"
                >
                  <Folder className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage Categories</span>
                  <span className="sm:hidden">Categories</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="section py-6">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-4 col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Add New Subcategory
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Subcategory Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleNameChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900 ${
                            formErrors.name
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="Enter subcategory name"
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      {/* URL */}
                      <div>
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium mb-2"
                        >
                          URL Slug <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded">
                            /
                          </span>
                          <input
                            type="text"
                            id="url"
                            value={formData.url}
                            onChange={handleUrlChange}
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900 ${
                              formErrors.url
                                ? "border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                            placeholder="subcategory-url"
                          />
                        </div>
                        {formErrors.url && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.url}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Used in URL: /category/{formData.url || "your-url"}
                        </p>
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium mb-2"
                        >
                          Parent Category{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                            }))
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900 appearance-none bg-none ${
                            formErrors.categoryId
                              ? "border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label} ({option.subCategoryCount}{" "}
                              subcategories)
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.categoryId}
                          </p>
                        )}
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subcategory Image{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        {imagePreview ? (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview("");
                                setFormData((prev) => ({ ...prev, image: "" }));
                                setImageFile(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center mb-3">
                            <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Upload subcategory image
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, false)}
                              className="hidden"
                            />
                            <label
                              htmlFor="image-upload"
                              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm"
                            >
                              <Upload className="w-4 h-4" />
                              Choose Image
                            </label>
                          </div>
                        )}

                        {formErrors.image && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.image}
                          </p>
                        )}
                      </div>

                      {/* Featured */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Featured Status
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              checked={formData.featured}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  featured: true,
                                }))
                              }
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="ms-2 text-sm">Featured</span>
                          </label>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="radio"
                              checked={!formData.featured}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  featured: false,
                                }))
                              }
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="ms-2 text-sm">Regular</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Featured subcategories appear on the homepage
                        </p>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full ti-btn ti-btn-primary flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Create Subcategory
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Stats - Responsive */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Quick Stats</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Subcategories
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                          {pagination.total.toLocaleString()}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Featured
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                          {subCategories.filter((sc) => sc.featured).length}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/10">
                        <Star className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Products
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                          {subCategories
                            .reduce((sum, sc) => sum + sc.productCount, 0)
                            .toLocaleString()}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-green-500/10">
                        <Package className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - List */}
              <div className="lg:col-span-8 col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Grid className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        All Subcategories
                      </h3>
                    </div>
                  </div>

                  {/* Filters - Responsive */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <form
                        onSubmit={handleSearch}
                        className="flex-1 flex gap-2"
                      >
                        <div className="relative flex-1">
                          {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                          <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900"
                          />
                        </div>
                        <button
                          type="submit"
                          className="ti-btn ti-btn-primary whitespace-nowrap"
                          disabled={loading}
                        >
                          Search
                        </button>
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm("")}
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
                            setPagination((prev) => ({ ...prev, page: 1 }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900"
                        >
                          <option value="ALL">All Categories</option>
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={featuredFilter}
                          onChange={(e) => {
                            setFeaturedFilter(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 1 }));
                          }}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900 appearance-none bg-none"
                        >
                          <option value="ALL">All Types</option>
                          <option value="true">Featured</option>
                          <option value="false">Regular</option>
                        </select>
                      </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedSubCategories.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSubCategories.length} selected
                        </span>
                        <button
                          onClick={() =>
                            handleBulkAction("update-featured", {
                              featured: true,
                            })
                          }
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Mark Featured
                        </button>
                        <button
                          onClick={() =>
                            handleBulkAction("update-featured", {
                              featured: false,
                            })
                          }
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm flex items-center gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Remove Featured
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete ${selectedSubCategories.length} subcategories?`,
                              )
                            ) {
                              handleBulkAction("delete");
                            }
                          }}
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-danger ti-btn-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
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

                  {/* Subcategories List - Responsive Table */}
                  <div className="p-0 overflow-x-auto">
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
                          {searchTerm ||
                          categoryFilter !== "ALL" ||
                          featuredFilter !== "ALL"
                            ? "Try changing your filters"
                            : "Get started by creating a new subcategory"}
                        </p>
                        {(searchTerm ||
                          categoryFilter !== "ALL" ||
                          featuredFilter !== "ALL") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setCategoryFilter("ALL");
                              setFeaturedFilter("ALL");
                            }}
                            className="ti-btn ti-btn-primary"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold w-12">
                                <input
                                  type="checkbox"
                                  checked={
                                    subCategories.length > 0 &&
                                    selectedSubCategories.length ===
                                      subCategories.length
                                  }
                                  onChange={handleSelectAll}
                                  className="w-4 h-4 text-primary focus:ring-primary"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">
                                Subcategory
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold hidden sm:table-cell">
                                Products
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">
                                Created
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {subCategories.map((subCategory) => (
                              <tr
                                key={subCategory.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubCategories.includes(
                                      subCategory.id,
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedSubCategories((prev) => [
                                          ...prev,
                                          subCategory.id,
                                        ]);
                                      } else {
                                        setSelectedSubCategories((prev) =>
                                          prev.filter(
                                            (id) => id !== subCategory.id,
                                          ),
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                  />
                                </td>
                                <td className="px-4 py-3">
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
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-gray-800 dark:text-white truncate max-w-[120px] sm:max-w-none">
                                          {subCategory.name}
                                        </span>
                                        {subCategory.featured && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                                            <Star className="w-3 h-3" />
                                            <span className="hidden sm:inline">
                                              Featured
                                            </span>
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate">
                                        /{subCategory.url}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {subCategory.category.name}
                                  </span>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                  <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">
                                      {subCategory.productCount.toLocaleString()}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                      subCategory.featured
                                        ? "bg-yellow-500/10 text-yellow-500"
                                        : "bg-green-500/10 text-green-500"
                                    }`}
                                  >
                                    {subCategory.featured ? (
                                      <Star className="w-3 h-3" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    {subCategory.featured
                                      ? "Featured"
                                      : "Active"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 hidden xl:table-cell">
                                  <div className="text-sm text-gray-600">
                                    {new Date(
                                      subCategory.createdAt,
                                    ).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Link
                                      href={`/dashboards/ecommerce/admin/subcategories/${subCategory.id}`}
                                      className="p-2 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() => openEditModal(subCategory)}
                                      className="p-2 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteSubCategory(
                                          subCategory.id,
                                          subCategory.name,
                                        )
                                      }
                                      className="p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="relative group">
                                      <button
                                        className="p-2 text-gray-500 hover:text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title="More options"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="py-1">
                                          <Link
                                            href={`/category/${subCategory.category.url}/${subCategory.url}`}
                                            target="_blank"
                                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                          >
                                            View on Site
                                          </Link>
                                          <button
                                            onClick={() =>
                                              toggleFeatured(
                                                subCategory.id,
                                                subCategory.featured,
                                              )
                                            }
                                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                          >
                                            {subCategory.featured
                                              ? "Remove Featured"
                                              : "Mark as Featured"}
                                          </button>
                                          <Link
                                            href={`/dashboards/ecommerce/admin/products?subCategoryId=${subCategory.id}`}
                                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
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

                        {/* Pagination - Responsive */}
                        {pagination.pages > 1 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                              Showing{" "}
                              {(pagination.page - 1) * pagination.limit + 1} to{" "}
                              {Math.min(
                                pagination.page * pagination.limit,
                                pagination.total,
                              )}{" "}
                              of {pagination.total} subcategories
                            </div>
                            <div className="flex gap-1 justify-center flex-wrap">
                              <button
                                onClick={() =>
                                  handlePageChange(pagination.page - 1)
                                }
                                disabled={pagination.page === 1 || loading}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                Previous
                              </button>
                              {Array.from(
                                { length: Math.min(5, pagination.pages) },
                                (_, i) => {
                                  let pageNum;
                                  if (pagination.pages <= 5) {
                                    pageNum = i + 1;
                                  } else if (pagination.page <= 3) {
                                    pageNum = i + 1;
                                  } else if (
                                    pagination.page >=
                                    pagination.pages - 2
                                  ) {
                                    pageNum = pagination.pages - 4 + i;
                                  } else {
                                    pageNum = pagination.page - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => handlePageChange(pageNum)}
                                      disabled={loading}
                                      className={`px-3 py-1 border rounded-md text-sm ${
                                        pagination.page === pageNum
                                          ? "bg-primary text-white border-primary"
                                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                },
                              )}
                              <button
                                onClick={() =>
                                  handlePageChange(pagination.page + 1)
                                }
                                disabled={
                                  pagination.page === pagination.pages ||
                                  loading
                                }
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

                {/* Quick Tips - Responsive */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-lg">
                        Tips & Best Practices
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Use descriptive names that clearly indicate what
                          products belong in this subcategory.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          URL slugs should be lowercase, use hyphens instead of
                          spaces, and be SEO-friendly.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Use high-quality, relevant images that represent the
                          subcategory well.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Featured subcategories appear on the homepage and in
                          prominent places.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Organize subcategories logically under appropriate
                          parent categories.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* EDIT SUBCATEGORY MODAL - Responsive with optimal height and scroll */}
      {editModalOpen && selectedSubCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-xl">Edit Subcategory</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update subcategory information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Subcategory Image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                    {editImagePreview ? (
                      <Image
                        src={editImagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      disabled={editUploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    {editUploading && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>
                {formErrors.image && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
                )}
              </div>

              {/* Subcategory Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={handleEditNameChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900"
                  placeholder="Enter subcategory name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded">/</span>
                  <input
                    type="text"
                    value={editFormData.url}
                    onChange={handleEditUrlChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900"
                    placeholder="subcategory-url"
                  />
                </div>
                {formErrors.url && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.url}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Used in URL: /category/{editFormData.url || "your-url"}
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.categoryId}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-900"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.subCategoryCount} subcategories)
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.categoryId}</p>
                )}
              </div>

              {/* Featured Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Status</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={editFormData.featured}
                      onChange={() =>
                        setEditFormData((prev) => ({ ...prev, featured: true }))
                      }
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ms-2 text-sm">Featured</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!editFormData.featured}
                      onChange={() =>
                        setEditFormData((prev) => ({ ...prev, featured: false }))
                      }
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ms-2 text-sm">Regular</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Featured subcategories appear on the homepage
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                      About Subcategory Management
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                      Changing subcategory details will affect all products in this subcategory.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setEditModalOpen(false)}
                className="ti-btn ti-btn-outline-light w-full sm:w-auto order-2 sm:order-1"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={updateSubCategory}
                className="ti-btn ti-btn-primary w-full sm:w-auto flex items-center justify-center gap-2 order-1 sm:order-2"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}



