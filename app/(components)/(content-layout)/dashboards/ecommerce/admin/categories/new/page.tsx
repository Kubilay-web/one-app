"use client";

import dynamic from "next/dynamic";
import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dynamic imports for better performance
const SpkSelect = dynamic(
  () =>
    import("@/shared/@spk-reusable-components/spk-packages/spk-reactselect"),
  { ssr: false }
);

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

interface CategoryFormData {
  name: string;
  image: string;
  url: string;
  featured: boolean;
}

const AdminNewCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    image: "",
    url: "",
    featured: false,
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Auto-generate URL from name
      if (name === "name") {
        const urlSlug = value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");
        setFormData((prev) => ({
          ...prev,
          url: urlSlug,
        }));
      }
    }
  };

  // Handle image upload


  // handleImageUpload fonksiyonunu güncelleyin
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // Tüm dosyaları döngü ile işleyin
  const uploadPromises = Array.from(files).map(async (file) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!file.type.startsWith("image/") && !validTypes.includes(file.type)) {
      toast.error(`Invalid file type for ${file.name}: ${file.type}`);
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File ${file.name} size exceeds 5MB limit.`);
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/oneshop/admin/categories/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return {
        name: file.name,
        url: data.fileUrl,
        publicId: data.publicId,
        size: file.size,
      };
    } catch (error) {
      console.error(`Upload error for ${file.name}:`, error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  });

  setUploadingImage(true);

  try {
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result !== null);
    
    if (successfulUploads.length > 0) {
      // İlk başarılı yüklenen resmi formData'ya ekleyin
      setFormData((prev) => ({
        ...prev,
        image: successfulUploads[0].url,
      }));
      
      toast.success(`${successfulUploads.length} image(s) uploaded successfully!`);
    }
    
    // Eğer multiple upload için galeri yapıyorsanız:
    // setGalleryImages(prev => [...prev, ...successfulUploads.map(img => img.url)]);
    
  } catch (error) {
    console.error("Batch upload error:", error);
  } finally {
    setUploadingImage(false);
    // Input'u resetleyin
    e.target.value = '';
  }
};

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/oneshop/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      toast.success("Category created successfully!");

      // Redirect to categories list after a short delay
      setTimeout(() => {
        router.push("/ecommerce/admin/categories");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(
        error.message || "Failed to create category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      router.push("/ecommerce/admin/categories");
    }
  };

  return (
    <Fragment>
      <div className="main-content landing-main ecommerce-main">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"New Category - Admin"} />
            <Pageheader
              Updated={true}
              breadcrumbs={["Apps", "Ecommerce", "Admin", "Categories"]}
              currentpage="New Category"
            />
          </div>
        </div>

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                <div className="grid grid-cols-12 gap-x-6">
                  <div className="lg:col-span-8 col-span-12">
                    <div className="box">
                      <div className="box-header">
                        <div className="box-title flex-grow-1">
                          Create New Category
                        </div>
                        <Link
                          href="/ecommerce/admin/categories"
                          className="ti-btn ti-btn-outline-light btn-wave waves-effect waves-light !text-dark !m-0"
                        >
                          <i className="bi bi-arrow-left rtl:rotate-180 inline-flex me-1"></i>{" "}
                          Back to Categories
                        </Link>
                      </div>
                      <div className="box-body">
                        <form onSubmit={handleSubmit}>
                          <div className="grid grid-cols-12 gap-6">
                            {/* Category Name */}
                            <div className="xl:col-span-6 col-span-12">
                              <label htmlFor="name" className="ti-form-label">
                                Category Name *
                              </label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                placeholder="Enter category name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            {/* Category URL (Slug) */}
                            <div className="xl:col-span-6 col-span-12">
                              <label htmlFor="url" className="ti-form-label">
                                URL Slug *
                              </label>
                              <input
                                type="text"
                                id="url"
                                name="url"
                                className="form-control"
                                placeholder="category-url-slug"
                                value={formData.url}
                                onChange={handleInputChange}
                                required
                              />
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                This will be used in the URL. Use lowercase
                                letters, numbers, and hyphens.
                              </p>
                            </div>

                            {/* Category Image Upload */}
                            <div className="xl:col-span-12 col-span-12">
                              <label className="ti-form-label">
                                Category Image *
                              </label>

                              {/* Image Preview */}
                              {formData.image && (
                                <div className="mb-3">
                                  <div className="relative inline-block">
                                    <div className="avatar avatar-xl bg-gray-300 dark:bg-light avatar-square">
                                      <Image
                                        src={formData.image}
                                        alt="Category preview"
                                        className="w-100 h-100 object-cover"
                                        width={120}
                                        height={120}
                                      />
                                      <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="badge rounded-pill bg-danger avatar-badge text-white cursor-pointer"
                                      >
                                        <i className="fe fe-x text-[0.75rem]"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Upload Button */}
                              <div className="btn-list">
                                <div>
                                  <label
                                    htmlFor="category-image-upload"
                                    className="sr-only"
                                  >
                                    Choose file
                                  </label>
                                  <input
                                    type="file"
                                    id="category-image-upload"
                                    name="category-image-upload"
                                    className="block w-full border border-defaultborder focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-defaultborder dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                      file:border-0
                                      file:bg-light file:me-4
                                      file:py-2 file:px-4
                                      dark:file:bg-black/20 dark:file:text-white/50 cursor-pointer"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                  />
                                  {uploadingImage && (
                                    <p className="text-xs text-blue-500 mt-1">
                                      Uploading image...
                                    </p>
                                  )}
                                  <p className="mb-0 mt-2 text-[0.75rem] text-textmuted dark:text-textmuted/50">
                                    Recommended size: 400x400 pixels. Max file
                                    size: 5MB. Supports: JPG, PNG, WebP, GIF.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="xl:col-span-12 col-span-12">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="featured"
                                  name="featured"
                                  className="ti-form-checkbox"
                                  checked={formData.featured}
                                  onChange={handleInputChange}
                                />
                                <label
                                  htmlFor="featured"
                                  className="ti-form-checkbox-label ms-2"
                                >
                                  Mark as Featured Category
                                </label>
                              </div>
                              <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                Featured categories will be highlighted on the
                                homepage.
                              </p>
                            </div>

                            {/* Buttons */}
                            <div className="xl:col-span-12 col-span-12">
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={handleCancel}
                                  className="ti-btn ti-btn-outline-light btn-wave waves-effect waves-light"
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="ti-btn ti-btn-primary btn-wave waves-effect waves-light"
                                  disabled={
                                    loading ||
                                    uploadingImage ||
                                    !formData.name ||
                                    !formData.image
                                  }
                                >
                                  {loading ? (
                                    <>
                                      <i className="bi bi-arrow-clockwise animate-spin me-1"></i>
                                      Creating...
                                    </>
                                  ) : (
                                    "Create Category"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Help Section */}
                  <div className="lg:col-span-4 col-span-12">
                    <div className="box">
                      <div className="box-header">
                        <div className="box-title">
                          <i className="bi bi-info-circle me-2"></i>
                          Guidelines
                        </div>
                      </div>
                      <div className="box-body">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="me-3 text-success">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                              <h6 className="text-sm font-semibold mb-1">
                                Naming Conventions
                              </h6>
                              <p className="text-xs text-textmuted dark:text-textmuted/50">
                                Use clear, descriptive names that customers will
                                understand.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="me-3 text-success">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                              <h6 className="text-sm font-semibold mb-1">
                                URL Slugs
                              </h6>
                              <p className="text-xs text-textmuted dark:text-textmuted/50">
                                Keep URLs short, lowercase, and use hyphens
                                instead of spaces.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="me-3 text-success">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                              <h6 className="text-sm font-semibold mb-1">
                                Images
                              </h6>
                              <p className="text-xs text-textmuted dark:text-textmuted/50">
                                Use high-quality, square images with transparent
                                backgrounds when possible.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="me-3 text-success">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                              <h6 className="text-sm font-semibold mb-1">
                                Featured Categories
                              </h6>
                              <p className="text-xs text-textmuted dark:text-textmuted/50">
                                Featured categories appear prominently on the
                                homepage and get more visibility.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="box mt-4">
                      <div className="box-header">
                        <div className="box-title">
                          <i className="bi bi-bar-chart me-2"></i>
                          Category Stats
                        </div>
                      </div>
                      <div className="box-body">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-light dark:bg-black/20 rounded">
                            <div className="text-2xl font-bold text-primary">
                              0
                            </div>
                            <div className="text-xs text-textmuted dark:text-textmuted/50">
                              Subcategories
                            </div>
                          </div>
                          <div className="text-center p-3 bg-light dark:bg-black/20 rounded">
                            <div className="text-2xl font-bold text-primary">
                              0
                            </div>
                            <div className="text-xs text-textmuted dark:text-textmuted/50">
                              Products
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="section bg-banner lg:px-0 px-4 !py-[4.375rem]">
          <div className="grid grid-cols-12 gap-x-6 justify-center">
            <div className="lg:col-span-3 col-span-1 text-center"></div>
            <div className="lg:col-span-6 col-span-10 text-center">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">
                  &#128073; Download our free mobile apps today
                </h3>
              </div>
              <h6 className="mb-4 opacity-90 text-white">
                Labore no sed ipsum ipsum nonumy. Sit ipsum sanctus ea magna
                est. Kasd diam rebum sit ipsum ipsum erat et kasd.Est amet sit
                vero sanctus labore no sed ipsum ipsum nonumy vero sanctus
                labore..
              </h6>
              <div className="btn-list">
                <Link
                  scroll={false}
                  href="#!"
                  className="ti-btn bg-black app-store relative"
                >
                  <Image
                    src="../../../assets/images/media/apps/play-store.png"
                    alt="Google Play"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  Google Play
                </Link>
                <Link
                  scroll={false}
                  href="#!"
                  className="ti-btn bg-black app-store relative"
                >
                  <Image
                    src="../../../assets/images/media/apps/apple-store.png"
                    alt="App Store"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  App Store
                </Link>
              </div>
            </div>
            <div className="lg:col-span-3 col-span-1 text-center"></div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default AdminNewCategoryPage;
