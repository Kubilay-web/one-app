"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Link from "next/link";

// Dinamik import
const SpkSelect = dynamic(
  () =>
    import(
      "@/shared/@spk-reusable-components/spk-packages/spk-reactselect"
    ),
  { ssr: false }
);

interface Product {
  id: string;
  name: string;
  slug: string;
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
}

interface SizeForm {
  id?: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface ColorForm {
  id?: string;
  name: string;
}

interface SpecForm {
  id?: string;
  name: string;
  value: string;
}

interface ImageForm {
  id?: string;
  url: string;
  alt: string;
  file?: File;
}

export default function SellerNewProductVariantPage() {
  const params = useParams();
  const router = useRouter();
  const storeUrl = params.storeUrl as string;
  const productId = params.productId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    variantName: "",
    variantDescription: "",
    variantImage: "",
    slug: "",
    keywords: "",
    sku: "",
    weight: "",
    isSale: false,
    saleEndDate: "",
  });

  // Arrays
  const [sizes, setSizes] = useState<SizeForm[]>([
    { size: "", quantity: 0, price: 0, discount: 0 },
  ]);
  const [colors, setColors] = useState<ColorForm[]>([{ name: "" }]);
  const [specs, setSpecs] = useState<SpecForm[]>([
    { name: "", value: "" },
  ]);
  const [images, setImages] = useState<ImageForm[]>([]);

  // Fetch product info
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/products/${productId}/variants`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data.product);
        
        // Generate default SKU and slug
        if (data.product) {
          const baseSlug = data.product.slug;
          const timestamp = Date.now();
          setFormData(prev => ({
            ...prev,
            slug: `${baseSlug}-variant-${timestamp}`,
            sku: `SKU-${timestamp}`,
          }));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product information");
      } finally {
        setLoading(false);
      }
    };

    if (storeUrl && productId) {
      fetchProduct();
    }
  }, [storeUrl, productId]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle size changes
  const handleSizeChange = (index: number, field: keyof SizeForm, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { size: "", quantity: 0, price: 0, discount: 0 }]);
  };

  const removeSize = (index: number) => {
    if (sizes.length > 1) {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
    }
  };

  // Handle color changes
  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], name: value };
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, { name: "" }]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

  // Handle spec changes
  const handleSpecChange = (index: number, field: keyof SpecForm, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const addSpec = () => {
    setSpecs([...specs, { name: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    if (specs.length > 1) {
      const newSpecs = specs.filter((_, i) => i !== index);
      setSpecs(newSpecs);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Preview için URL oluştur
        const previewUrl = URL.createObjectURL(file);
        
        // Sunucuya yükle
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const response = await fetch(
          `/api/oneshop/seller/stores/${storeUrl}/products/${productId}/variants/images`,
          {
            method: 'POST',
            body: uploadFormData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Resmi listeye ekle
          setImages(prev => [
            ...prev,
            {
              url: data.url,
              alt: data.alt,
              file: file,
            }
          ]);

          // İlk resmi ana resim olarak ayarla
          if (i === 0 && !formData.variantImage) {
            setFormData(prev => ({ ...prev, variantImage: data.url }));
          }
        } else {
          toast.error(`Failed to upload image: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // Eğer kaldırılan resim ana resimse, ilk resmi ana resim yap
    if (images[index].url === formData.variantImage && newImages.length > 0) {
      setFormData(prev => ({ ...prev, variantImage: newImages[0].url }));
    } else if (newImages.length === 0) {
      setFormData(prev => ({ ...prev, variantImage: "" }));
    }
  };

  const setMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, variantImage: url }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.variantName.trim()) {
      toast.error("Variant name is required");
      return false;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return false;
    }

    // En az bir boyut kontrolü
    const validSizes = sizes.filter(size => 
      size.size.trim() && size.quantity > 0 && size.price > 0
    );
    
    if (validSizes.length === 0) {
      toast.error("At least one valid size is required");
      return false;
    }

    return true;
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Sadece geçerli boyutları gönder
      const validSizes = sizes.filter(size => 
        size.size.trim() && size.quantity > 0 && size.price > 0
      );
      
      // Sadece geçerli renkleri gönder
      const validColors = colors.filter(color => color.name.trim());
      
      // Sadece geçerli özellikleri gönder
      const validSpecs = specs.filter(spec => spec.name.trim() && spec.value.trim());

      const payload = {
        ...formData,
        weight: parseFloat(formData.weight) || 0,
        sizes: validSizes,
        colors: validColors,
        specs: validSpecs,
        images: images.map(img => ({
          url: img.url,
          alt: img.alt || formData.variantName,
        })),
      };

      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Variant created successfully");
        const data = await response.json();
        
        // Ürün detay sayfasına yönlendir
        router.push(`/ecommerce/seller/stores/${storeUrl}/products/${productId}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create variant");
      }
    } catch (error) {
      console.error("Error creating variant:", error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="main-content">
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"New Variant"} />
            <Pageheader
              Updated={true}
              breadcrumbs={["Dashboard", "Shop", "Seller", "Stores", "Products", "New Variant"]}
              currentpage="Loading..."
            />
          </div>
        </div>
        <div className="container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading product information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"New Variant"} />
            <Pageheader
              Updated={true}
              breadcrumbs={["Dashboard", "Shop", "Seller", "Stores", "Products", "New Variant"]}
              currentpage="Create New Variant"
            />
          </div>
        </div>
        {/* End:: Breadcrumb */}

        {/* Start:: Main Content */}
        <section className="section !py-6">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header flex justify-between items-center">
                    <div className="box-title flex-grow-1">
                      Create New Variant for: {product?.name}
                    </div>
                    <Link
                      href={`/dashboard/shop/seller/stores/${storeUrl}/products/${productId}`}
                      className="ti-btn ti-btn-outline-light btn-wave"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Product
                    </Link>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="box-body">
                      <div className="grid grid-cols-12 gap-6">
                        {/* Basic Information */}
                        <div className="xl:col-span-8 col-span-12">
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header">
                              <div className="box-title">Basic Information</div>
                            </div>
                            <div className="box-body">
                              <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-6 col-span-12">
                                  <label className="ti-form-label">Variant Name *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="variantName"
                                    value={formData.variantName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Blue Color, Large Size"
                                    required
                                  />
                                </div>
                                
                                <div className="xl:col-span-6 col-span-12">
                                  <label className="ti-form-label">Slug *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="product-name-variant"
                                    required
                                  />
                                  <div className="text-xs text-muted mt-1">
                                    URL-friendly version of the name
                                  </div>
                                </div>
                                
                                <div className="xl:col-span-6 col-span-12">
                                  <label className="ti-form-label">SKU *</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    placeholder="SKU-001"
                                    required
                                  />
                                </div>
                                
                                <div className="xl:col-span-6 col-span-12">
                                  <label className="ti-form-label">Weight (kg)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="0.5"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                                
                                <div className="xl:col-span-12 col-span-12">
                                  <label className="ti-form-label">Description</label>
                                  <textarea
                                    className="form-control"
                                    name="variantDescription"
                                    value={formData.variantDescription}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Describe this variant..."
                                  ></textarea>
                                </div>
                                
                                <div className="xl:col-span-12 col-span-12">
                                  <label className="ti-form-label">Keywords</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleInputChange}
                                    placeholder="comma,separated,keywords"
                                  />
                                  <div className="text-xs text-muted mt-1">
                                    For search engine optimization
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sizes & Pricing */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header flex justify-between items-center">
                              <div className="box-title">Sizes & Pricing</div>
                              <button
                                type="button"
                                onClick={addSize}
                                className="ti-btn ti-btn-outline-primary ti-btn-sm"
                              >
                                <i className="bi bi-plus me-1"></i> Add Size
                              </button>
                            </div>
                            <div className="box-body">
                              <div className="overflow-x-auto">
                                <table className="table min-w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-start">Size *</th>
                                      <th className="text-start">Quantity *</th>
                                      <th className="text-start">Price ($) *</th>
                                      <th className="text-start">Discount (%)</th>
                                      <th className="text-start">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sizes.map((size, index) => (
                                      <tr key={index}>
                                        <td>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={size.size}
                                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                            placeholder="S, M, L, XL"
                                            required
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={size.quantity}
                                            onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                            min="0"
                                            required
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={size.price}
                                            onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            step="0.01"
                                            required
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={size.discount}
                                            onChange={(e) => handleSizeChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                          />
                                        </td>
                                        <td>
                                          {sizes.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeSize(index)}
                                              className="ti-btn ti-btn-outline-danger ti-btn-sm"
                                            >
                                              <i className="bi bi-trash"></i>
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          {/* Colors */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header flex justify-between items-center">
                              <div className="box-title">Colors</div>
                              <button
                                type="button"
                                onClick={addColor}
                                className="ti-btn ti-btn-outline-primary ti-btn-sm"
                              >
                                <i className="bi bi-plus me-1"></i> Add Color
                              </button>
                            </div>
                            <div className="box-body">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {colors.map((color, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={color.name}
                                      onChange={(e) => handleColorChange(index, e.target.value)}
                                      placeholder="Color name"
                                    />
                                    {colors.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeColor(index)}
                                        className="ti-btn ti-btn-outline-danger ti-btn-sm"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Specifications */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header flex justify-between items-center">
                              <div className="box-title">Specifications</div>
                              <button
                                type="button"
                                onClick={addSpec}
                                className="ti-btn ti-btn-outline-primary ti-btn-sm"
                              >
                                <i className="bi bi-plus me-1"></i> Add Spec
                              </button>
                            </div>
                            <div className="box-body">
                              <div className="overflow-x-auto">
                                <table className="table min-w-full">
                                  <thead>
                                    <tr>
                                      <th className="text-start">Specification Name</th>
                                      <th className="text-start">Value</th>
                                      <th className="text-start">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {specs.map((spec, index) => (
                                      <tr key={index}>
                                        <td>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={spec.name}
                                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                                            placeholder="e.g., Material, Dimensions"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            className="form-control"
                                            value={spec.value}
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            placeholder="e.g., Cotton, 10x20cm"
                                          />
                                        </td>
                                        <td>
                                          {specs.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => removeSpec(index)}
                                              className="ti-btn ti-btn-outline-danger ti-btn-sm"
                                            >
                                              <i className="bi bi-trash"></i>
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sidebar - Images & Actions */}
                        <div className="xl:col-span-4 col-span-12">
                          {/* Main Image */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header">
                              <div className="box-title">Main Image</div>
                            </div>
                            <div className="box-body">
                              {formData.variantImage ? (
                                <div className="text-center">
                                  <img
                                    src={formData.variantImage}
                                    alt="Main variant"
                                    className="w-full h-64 object-cover rounded-lg mb-3"
                                  />
                                  <div className="text-sm text-muted">
                                    This will be the main display image
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 border-2 border-dashed border-defaultborder rounded-lg">
                                  <i className="bi bi-image text-4xl text-muted mb-3"></i>
                                  <p className="text-muted">No main image selected</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional Images */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header">
                              <div className="box-title">Additional Images</div>
                            </div>
                            <div className="box-body">
                              <div className="mb-4">
                                <label className="ti-form-label">Upload Images</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={handleImageUpload}
                                  multiple
                                  accept="image/*"
                                  disabled={uploadingImages}
                                />
                                <div className="text-xs text-muted mt-1">
                                  You can upload multiple images
                                </div>
                                {uploadingImages && (
                                  <div className="mt-2 text-sm text-info">
                                    <i className="bi bi-arrow-clockwise animate-spin me-2"></i>
                                    Uploading images...
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {images.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={image.url}
                                      alt={image.alt}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setMainImage(image.url)}
                                        className={`ti-btn ti-btn-sm ${formData.variantImage === image.url
                                            ? "ti-btn-success"
                                            : "ti-btn-outline-light"
                                          }`}
                                        title="Set as main"
                                      >
                                        <i className="bi bi-star-fill"></i>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="ti-btn ti-btn-outline-danger ti-btn-sm"
                                        title="Remove"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                    {formData.variantImage === image.url && (
                                      <div className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                                        Main
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {images.length === 0 && (
                                <div className="text-center py-6">
                                  <i className="bi bi-images text-3xl text-muted mb-2"></i>
                                  <p className="text-muted">No images uploaded yet</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sale Options */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10 mb-6">
                            <div className="box-header">
                              <div className="box-title">Sale Options</div>
                            </div>
                            <div className="box-body">
                              <div className="flex items-center mb-4">
                                <input
                                  type="checkbox"
                                  id="isSale"
                                  name="isSale"
                                  checked={formData.isSale}
                                  onChange={handleInputChange}
                                  className="ti-form-checkbox"
                                />
                                <label htmlFor="isSale" className="ms-2">
                                  Put this variant on sale
                                </label>
                              </div>

                              {formData.isSale && (
                                <div>
                                  <label className="ti-form-label">Sale End Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="saleEndDate"
                                    value={formData.saleEndDate}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Form Actions */}
                          <div className="box !shadow-none border border-defaultborder dark:border-defaultborder/10">
                            <div className="box-body">
                              <div className="space-y-4">
                                <div className="alert alert-info">
                                  <div className="d-flex">
                                    <div className="me-3">
                                      <i className="bi bi-info-circle"></i>
                                    </div>
                                    <div>
                                      <p className="mb-0 text-sm">
                                        Make sure all required fields are filled before submitting.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <Link
                                    href={`/dashboard/shop/seller/stores/${storeUrl}/products/${productId}`}
                                    className="ti-btn ti-btn-outline-light flex-1"
                                  >
                                    Cancel
                                  </Link>
                                  <button
                                    type="submit"
                                    className="ti-btn ti-btn-primary flex-1"
                                    disabled={submitting}
                                  >
                                    {submitting ? (
                                      <>
                                        <i className="bi bi-arrow-clockwise animate-spin me-2"></i>
                                        Creating...
                                      </>
                                    ) : (
                                      "Create Variant"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End:: Main Content */}
      </div>

      <style jsx>{`
        .table th {
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          background-color: #f9fafb;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table tr:last-child td {
          border-bottom: none;
        }
        
        @media (max-width: 768px) {
          .table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </Fragment>
  );
}