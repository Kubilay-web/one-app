// app/(components)/(content-layout)/dashboards/shop/seller/stores/[storeUrl]/products/new/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/app/SessionProvider';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus, Trash2, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

// Types
interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
}

interface ProductVariant {
  variantName: string;
  variantDescription: string;
  variantImage: string;
  isSale: boolean;
  saleEndDate: string;
  keywords: string;
  sku: string;
  weight: number;
  sizes: {
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  colors: string[];
  images: string[];
}

interface Spec {
  name: string;
  value: string;
}

interface Question {
  question: string;
  answer: string;
}

const SellerNewProductsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [storeInfo, setStoreInfo] = useState<{ id: string; name: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    shippingFeeMethod: 'ITEM' as 'ITEM' | 'WEIGHT' | 'FIXED',
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      variantName: '',
      variantDescription: '',
      variantImage: '',
      isSale: false,
      saleEndDate: '',
      keywords: '',
      sku: '',
      weight: 0,
      sizes: [{ size: '', quantity: 0, price: 0, discount: 0 }],
      colors: [],
      images: [],
    },
  ]);
  
  const [specs, setSpecs] = useState<Spec[]>([{ name: '', value: '' }]);
  const [questions, setQuestions] = useState<Question[]>([{ question: '', answer: '' }]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Fetch store and categories on load
  useEffect(() => {
    if (user && params.storeUrl) {
      fetchStoreAndCategories();
    }
  }, [user, params.storeUrl]);

  const fetchStoreAndCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch store info
      const storeRes = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}`);
      if (!storeRes.ok) {
        if (storeRes.status === 404) {
          toast.error('Store not found');
          router.push('/seller/dashboard');
          return;
        }
        throw new Error('Failed to fetch store');
      }
      
      const storeData = await storeRes.json();
      setStoreInfo(storeData);

      // Fetch categories
      const categoriesRes = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/categories`);
      if (!categoriesRes.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load data');
      router.push('/seller/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File, folder: string = 'products'): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      const response = await fetch('/api/oneshop/seller/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Image uploaded successfully');
        return result.data.secure_url;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Handle variant image upload
  const handleVariantImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    variantIndex: number,
    isMainImage = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file, `stores/${params.storeUrl}/products`);
      
      if (isMainImage) {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].variantImage = imageUrl;
        setVariants(updatedVariants);
      } else {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].images.push(imageUrl);
        setVariants(updatedVariants);
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle variant changes
  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  // Handle size changes
  const handleSizeChange = (variantIndex: number, sizeIndex: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes[sizeIndex] = {
      ...updatedVariants[variantIndex].sizes[sizeIndex],
      [field]: field === 'quantity' || field === 'price' || field === 'discount' 
        ? parseFloat(value) || 0 
        : value,
    };
    setVariants(updatedVariants);
  };

  // Add new variant
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variantName: '',
        variantDescription: '',
        variantImage: '',
        isSale: false,
        saleEndDate: '',
        keywords: '',
        sku: '',
        weight: 0,
        sizes: [{ size: '', quantity: 0, price: 0, discount: 0 }],
        colors: [],
        images: [],
      },
    ]);
  };

  // Remove variant
  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Add new size to variant
  const addSize = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].sizes.push({
      size: '',
      quantity: 0,
      price: 0,
      discount: 0,
    });
    setVariants(updatedVariants);
  };

  // Remove size from variant
  const removeSize = (variantIndex: number, sizeIndex: number) => {
    const updatedVariants = [...variants];
    if (updatedVariants[variantIndex].sizes.length > 1) {
      updatedVariants[variantIndex].sizes = updatedVariants[variantIndex].sizes.filter(
        (_, i) => i !== sizeIndex
      );
      setVariants(updatedVariants);
    }
  };

  // Add color to variant
  const addColor = (variantIndex: number, color: string) => {
    if (!color.trim()) return;
    const updatedVariants = [...variants];
    if (!updatedVariants[variantIndex].colors.includes(color.trim())) {
      updatedVariants[variantIndex].colors.push(color.trim());
      setVariants(updatedVariants);
    }
  };

  // Remove color from variant
  const removeColor = (variantIndex: number, colorIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].colors.splice(colorIndex, 1);
    setVariants(updatedVariants);
  };

  // Handle spec changes
  const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    if (specs.length === 1) return;
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Handle question changes
  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return false;
    }

    if (!selectedCategory) {
      toast.error('Please select a category');
      return false;
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.variantName.trim()) {
        toast.error('Variant name is required');
        return false;
      }

      if (!variant.sku.trim()) {
        toast.error('SKU is required for all variants');
        return false;
      }

      if (variant.sizes.length === 0) {
        toast.error('At least one size is required for each variant');
        return false;
      }

      for (const size of variant.sizes) {
        if (!size.size.trim()) {
          toast.error('Size is required for all variants');
          return false;
        }
        
        if (size.price <= 0) {
          toast.error('Price must be greater than 0');
          return false;
        }
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!storeInfo) {
      toast.error('Store not found');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory || undefined,
        variants: variants.map(variant => ({
          ...variant,
          weight: parseFloat(variant.weight.toString()) || 0,
          saleEndDate: variant.isSale && variant.saleEndDate ? variant.saleEndDate : undefined,
        })),
        specs: specs.filter(spec => spec.name.trim() && spec.value.trim()),
        questions: questions.filter(q => q.question.trim() && q.answer.trim()),
        tags,
      };

      const response = await fetch(`/api/oneshop/seller/stores/${params.storeUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const product = await response.json();
      
      toast.success('Product created successfully!');
      router.push(`/seller/stores/${params.storeUrl}/products`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    router.push('/');
    return null;
  }

  if (!storeInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Store not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href={`/dashboards/ecommerce/seller/stores/${params.storeUrl}/products`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-2">
              Add a new product to <span className="font-semibold">{storeInfo.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {storeInfo.name}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
              1
            </div>
            <div className="w-24 h-1 bg-blue-600"></div>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
              2
            </div>
            <div className="w-24 h-1 bg-blue-200"></div>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full">
              3
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="font-medium text-blue-600">Basic Info</span>
          <span className="font-medium text-blue-600">Variants</span>
          <span>Advanced</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {categories
                  .find((c) => c.id === selectedCategory)
                  ?.subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Shipping Fee Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Fee Method
              </label>
              <select
                name="shippingFeeMethod"
                value={formData.shippingFeeMethod}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ITEM">Per Item</option>
                <option value="WEIGHT">By Weight</option>
                <option value="FIXED">Fixed Price</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type and press Enter to add tags"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter detailed product description..."
              required
            />
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </button>
          </div>

          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="border border-gray-200 rounded-xl p-6 mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Variant {variantIndex + 1}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`sale-${variantIndex}`}
                      checked={variant.isSale}
                      onChange={(e) => handleVariantChange(variantIndex, 'isSale', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`sale-${variantIndex}`} className="ml-2 text-sm text-gray-700">
                      On Sale
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(variantIndex)}
                    className="text-red-600 hover:text-red-700 p-1"
                    disabled={variants.length === 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    value={variant.variantName}
                    onChange={(e) => handleVariantChange(variantIndex, 'variantName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blue, Large"
                    required
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(variantIndex, 'sku', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SKU-001"
                    required
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={variant.keywords}
                    onChange={(e) => handleVariantChange(variantIndex, 'keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comma separated keywords"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.weight || ''}
                    onChange={(e) => handleVariantChange(variantIndex, 'weight', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.5"
                  />
                </div>

                {/* Sale End Date */}
                {variant.isSale && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale End Date
                    </label>
                    <input
                      type="date"
                      value={variant.saleEndDate}
                      onChange={(e) => handleVariantChange(variantIndex, 'saleEndDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Variant Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Description
                  </label>
                  <textarea
                    value={variant.variantDescription}
                    onChange={(e) => handleVariantChange(variantIndex, 'variantDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe this specific variant..."
                  />
                </div>
              </div>

              {/* Main Variant Image */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Variant Image *
                </label>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    {variant.variantImage ? (
                      <div className="relative w-40 h-40">
                        <Image
                          src={variant.variantImage}
                          alt="Variant main"
                          fill
                          className="object-cover rounded-lg"
                          sizes="160px"
                        />
                        <button
                          type="button"
                          onClick={() => handleVariantChange(variantIndex, 'variantImage', '')}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">No image</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 mt-2">Main image</span>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      id={`main-image-${variantIndex}`}
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(e, variantIndex, true)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`main-image-${variantIndex}`}
                      className={`inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer font-medium ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-sm text-gray-500 mt-3">
                      This will be the main display image for this variant. Recommended size: 800x800px.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Additional Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {variant.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`Variant ${variantIndex + 1} image ${imgIndex + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedVariants = [...variants];
                          updatedVariants[variantIndex].images.splice(imgIndex, 1);
                          setVariants(updatedVariants);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="aspect-square">
                    <input
                      type="file"
                      id={`additional-images-${variantIndex}`}
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(e, variantIndex, false)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`additional-images-${variantIndex}`}
                      className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Image</span>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Add more images to showcase different angles or details. Recommended size: 800x800px.
                </p>
              </div>

              {/* Colors */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Colors
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {variant.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full"
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-sm font-medium">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(variantIndex, colorIndex)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    id={`color-input-${variantIndex}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter color name or hex code"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        addColor(variantIndex, input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(`color-input-${variantIndex}`) as HTMLInputElement;
                      if (input.value.trim()) {
                        addColor(variantIndex, input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sizes and Prices */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Sizes and Prices *</h4>
                  <button
                    type="button"
                    onClick={() => addSize(variantIndex)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add Size
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size *
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity *
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price ($) *
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount (%)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {variant.sizes.map((size, sizeIndex) => (
                        <tr key={sizeIndex} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={size.size}
                              onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'size', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., S, M, L"
                              required
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={size.quantity}
                              onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              required
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.01"
                              value={size.price}
                              onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'price', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0.01"
                              required
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              step="0.01"
                              value={size.discount}
                              onChange={(e) => handleSizeChange(variantIndex, sizeIndex, 'discount', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max="100"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeSize(variantIndex, sizeIndex)}
                              className="text-red-600 hover:text-red-900"
                              disabled={variant.sizes.length === 1}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
            <button
              type="button"
              onClick={addSpec}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Specification
            </button>
          </div>
          
          <div className="space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specification name (e.g., Material)"
                  />
                </div>
                <div className="md:col-span-5">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specification value (e.g., Cotton)"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium"
                    disabled={specs.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>
          
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Question {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-700"
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter question..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={question.answer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <div>
            <button
              type="button"
              onClick={() => router.push(`/seller/stores/${params.storeUrl}/products`)}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              disabled={loading || uploading}
            >
              Cancel
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                // Save as draft functionality
                toast.info('Draft functionality coming soon');
              }}
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
              disabled={loading || uploading}
            >
              Save as Draft
            </button>
            
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Images...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Footer Help Text */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Check our <a href="/seller/help/products" className="text-blue-600 hover:underline">product creation guide</a></p>
      </div>
    </div>
  );
};

export default SellerNewProductsPage;