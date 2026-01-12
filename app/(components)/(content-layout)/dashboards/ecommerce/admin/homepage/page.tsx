"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Section {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  active: boolean;
  order: number;
  data: Record<string, any>;
  images: ImageData[];
  createdAt?: string;
  updatedAt?: string;
}

interface ImageData {
  id: string;
  url: string;
  alt?: string;
  type: string;
  order: number;
  link?: string;
  productSlug?: string;
  variantId?: string;
  size?: string;
  sectionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function LandingPageAdmin() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterActive, setFilterActive] = useState<string>("all");

  const [newSection, setNewSection] = useState({
    type: "banner",
    title: "",
    subtitle: "",
    active: true,
    order: 0,
  });

  const sectionTypes = [
    {
      value: "banner",
      label: "Banner",
      icon: "bi-image",
      color: "bg-blue-500",
    },
    {
      value: "categories",
      label: "Categories",
      icon: "bi-grid-3x3",
      color: "bg-green-500",
    },
    { value: "deals", label: "Deals", icon: "bi-tag", color: "bg-red-500" },
    {
      value: "products",
      label: "Products",
      icon: "bi-bag",
      color: "bg-purple-500",
    },
    {
      value: "newsletter",
      label: "Newsletter",
      icon: "bi-envelope",
      color: "bg-yellow-500",
    },
    {
      value: "features",
      label: "Features",
      icon: "bi-star",
      color: "bg-pink-500",
    },
    {
      value: "stats",
      label: "Statistics",
      icon: "bi-graph-up",
      color: "bg-indigo-500",
    },
    {
      value: "cta",
      label: "Call to Action",
      icon: "bi-megaphone",
      color: "bg-orange-500",
    },
    {
      value: "download",
      label: "App Download",
      icon: "bi-phone",
      color: "bg-teal-500",
    },
    { value: "hero", label: "Hero", icon: "bi-window", color: "bg-cyan-500" },
    {
      value: "limited",
      label: "Limited Offer",
      icon: "bi-clock",
      color: "bg-rose-500",
    },
  ];

  const sizeOptions = [
    { value: "", label: "None" },
    { value: "large", label: "Large" },
    { value: "medium", label: "Medium" },
    { value: "small", label: "Small" },
  ];

  // Responsive kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimize edilmiş fetch fonksiyonu
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("/api/oneshop/admin/landingpage/sections", {
        signal: controller.signal,
        next: { revalidate: 0 },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setSections(data);
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to load sections");
        console.error("Fetch error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Filtreleme
  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      searchTerm === "" ||
      section.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || section.type === filterType;
    const matchesActive =
      filterActive === "all" ||
      (filterActive === "active" && section.active) ||
      (filterActive === "inactive" && !section.active);

    return matchesSearch && matchesType && matchesActive;
  });

  // Cloudinary upload fonksiyonu
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!
    );
    formData.append("folder", "landing-page");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Section'a resim ekleme
  const addImageToSection = async (
    sectionId: string,
    file: File,
    type: string = "gallery"
  ) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);

      const res = await fetch(
        `/api/oneshop/admin/landingpage/sections/${sectionId}/images`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: imageUrl,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            type,
            order: 0,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add image");
      }

      toast.success("Image uploaded successfully");

      // Optimize update
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                images: [...(section.images || []), data],
              }
            : section
        )
      );

      if (editingSection?.id === sectionId) {
        setEditingSection((prev) =>
          prev
            ? {
                ...prev,
                images: [...(prev.images || []), data],
              }
            : prev
        );
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Resim güncelleme

  const updateImage = async (imageId: string, updates: Partial<ImageData>) => {
    try {
      // CRITICAL: İd'yi ve diğer immutable field'ları kaldır
      const { id, sectionId, createdAt, updatedAt, ...cleanUpdates } = updates;

      console.log(
        "🔄 Frontend: Cleaned updates for image",
        imageId,
        cleanUpdates
      );

      const res = await fetch(
        `/api/oneshop/admin/landingpage/images/${imageId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanUpdates), // Sadece temiz data gönder
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.error || `HTTP ${res.status}: Update failed`
        );
      }

      toast.success("Image updated successfully");

      // Optimize update - frontend state'ini güncelle
      const finalUpdates = { ...cleanUpdates };
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          images:
            section.images?.map((img) =>
              img.id === imageId ? { ...img, ...finalUpdates } : img
            ) || [],
        }))
      );

      if (editingSection) {
        setEditingSection((prev) =>
          prev
            ? {
                ...prev,
                images:
                  prev.images?.map((img) =>
                    img.id === imageId ? { ...img, ...finalUpdates } : img
                  ) || [],
              }
            : prev
        );
      }

      setEditingImage(null);
      return responseData;
    } catch (error: any) {
      console.error("❌ Frontend: Failed to update image:", error);
      toast.error(`Update failed: ${error.message}`);
      throw error;
    }
  };

  // Resim silme
  const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const res = await fetch(
        `/api/oneshop/admin/landingpage/images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      toast.success("Image deleted successfully");

      // Optimize update
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          images: section.images?.filter((img) => img.id !== imageId) || [],
        }))
      );

      if (editingSection) {
        setEditingSection((prev) =>
          prev
            ? {
                ...prev,
                images: prev.images?.filter((img) => img.id !== imageId) || [],
              }
            : prev
        );
      }
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  // Section oluşturma
  const createSection = async () => {
    try {
      const res = await fetch("/api/oneshop/admin/landingpage/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Create failed");
      }

      toast.success("Section created successfully");
      setShowAddModal(false);
      setNewSection({
        type: "banner",
        title: "",
        subtitle: "",
        active: true,
        order: sections.length + 1,
      });

      setSections((prev) => [...prev, data]);
    } catch (error: any) {
      toast.error(`Create failed: ${error.message}`);
    }
  };

  // Section güncelleme
  const updateSection = async (
    sectionId: string,
    updates: Partial<Section>
  ) => {
    try {
      const res = await fetch(
        `/api/oneshop/admin/landingpage/sections/${sectionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      toast.success("Section updated successfully");

      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        )
      );

      setEditingSection(null);
      setShowSectionModal(false);
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  // Section silme
  const deleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(
        `/api/oneshop/admin/landingpage/sections/${sectionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      toast.success("Section deleted successfully");

      setSections((prev) => prev.filter((section) => section.id !== sectionId));
      setSectionToDelete(null);
      setShowDeleteModal(false);
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  // Active toggle
  const toggleActive = async (sectionId: string, currentActive: boolean) => {
    await updateSection(sectionId, { active: !currentActive });
  };

  // Demo data seed
  const seedDemoData = async () => {
    if (!confirm("This will replace all existing data. Continue?")) return;

    try {
      const res = await fetch("/api/oneshop/admin/landingpage/seed", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Seeding failed");
      }

      toast.success("Demo data seeded successfully");
      fetchSections();
    } catch (error: any) {
      toast.error(`Seed failed: ${error.message}`);
    }
  };

  // Reset all data
  const resetData = async () => {
    if (!confirm("This will delete ALL data. Are you sure?")) return;

    try {
      const res = await fetch("/api/oneshop/admin/landingpage/reset", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      toast.success("All data reset successfully");
      setSections([]);
      setEditingSection(null);
    } catch (error: any) {
      toast.error(`Reset failed: ${error.message}`);
    }
  };

  // Link oluşturma
  const generatePreviewLink = (image: ImageData) => {
    if (image.link && image.link.trim() !== "") {
      return image.link;
    }

    if (image.productSlug && image.productSlug.trim() !== "") {
      const params = new URLSearchParams();

      if (image.variantId && image.variantId.trim() !== "") {
        params.append("variant", image.variantId);
      }

      if (image.size && image.size.trim() !== "") {
        params.append("size", image.size);
      }

      const queryString = params.toString();
      const basePath = `/shop/productdetails/${image.productSlug}`;

      return queryString ? `${basePath}?${queryString}` : basePath;
    }

    return "#";
  };

  // Resim editor modal
  const renderImageEditor = () => {
    if (!editingImage) return null;

    const handleSave = async () => {
      try {
        // Sadece güncellenebilir field'ları al
        const updates = {
          alt: editingImage.alt?.trim() || null,
          link: editingImage.link?.trim() || null,
          productSlug: editingImage.productSlug?.trim() || null,
          variantId: editingImage.variantId?.trim() || null,
          size: editingImage.size?.trim() || null,
          // Diğer field'ları koru
          url: editingImage.url,
          type: editingImage.type,
          order: editingImage.order,
        };

        console.log("💾 Saving image updates (cleaned):", updates);
        await updateImage(editingImage.id, updates);
      } catch (error) {
        console.error("Save error:", error);
      }
    };

    const handleInputChange = (field: keyof ImageData, value: string) => {
      setEditingImage((prev) => ({
        ...prev!,
        [field]: value,
      }));
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden shadow-2xl mx-2 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="sticky top-0 z-10 p-4 sm:p-6 border-b dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                  Edit Image Link
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure product redirect
                </p>
              </div>
              <button
                onClick={() => setEditingImage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <i className="bi bi-x-lg text-lg text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            {/* Image Preview */}
            <div className="aspect-square relative mb-4 sm:mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner">
              <Image
                src={editingImage.url}
                alt={editingImage.alt || "Image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 400px"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm truncate">
                  {editingImage.alt || "No description"}
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* Direct Link */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <i className="bi bi-link-45deg text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      Direct Product Link
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Full URL path to product
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                  value={editingImage.link || ""}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  placeholder="/shop/productdetails/product-slug"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    OR
                  </span>
                </div>
              </div>

              {/* Structured Fields */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <i className="bi bi-box text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        Product Details
                      </h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Dynamic link generation
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Slug
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                        value={editingImage.productSlug || ""}
                        onChange={(e) =>
                          handleInputChange("productSlug", e.target.value)
                        }
                        placeholder="product-slug"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none"
                          value={editingImage.size || ""}
                          onChange={(e) =>
                            handleInputChange("size", e.target.value)
                          }
                        >
                          {sizeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Variant ID
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                          value={editingImage.variantId || ""}
                          onChange={(e) =>
                            handleInputChange("variantId", e.target.value)
                          }
                          placeholder="variant-id"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <i className="bi bi-eye text-purple-600 dark:text-purple-400"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      Generated Link
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Preview of the final URL
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <code className="text-xs sm:text-sm break-all text-gray-800 dark:text-gray-200 font-mono">
                    {generatePreviewLink(editingImage)}
                  </code>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span className="text-sm">Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    <span className="text-sm">Save Changes</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-700 active:scale-[0.98]"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Section editor modal
  const renderSectionEditorModal = () => {
    if (!editingSection) return null;

    const handleImageClick = (image: ImageData) => {
      setEditingImage({ ...image });
    };

    const handleMultipleUpload = async (files: FileList) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        await addImageToSection(editingSection.id, file);
      }
    };

    const handleFileClick = () => {
      fileInputRef.current?.click();
    };

    const handleSave = () => {
      updateSection(editingSection.id, editingSection);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl mx-2 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="sticky top-0 z-10 p-4 sm:p-6 border-b dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                  Edit Section
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure section details and images
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingSection(null);
                  setShowSectionModal(false);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors self-end sm:self-center"
                aria-label="Close"
              >
                <i className="bi bi-x-lg text-lg text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                  <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="bi bi-gear text-blue-500"></i>
                    Section Configuration
                  </h5>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Section Type
                        </label>
                        <div className="relative">
                          <select
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-sm"
                            value={editingSection.type}
                            onChange={(e) =>
                              setEditingSection({
                                ...editingSection,
                                type: e.target.value,
                              })
                            }
                          >
                            {sectionTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-3 pointer-events-none">
                            <i className="bi bi-chevron-down text-gray-400"></i>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                          value={editingSection.order}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        value={editingSection.title || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter section title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subtitle
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm min-h-[100px]"
                        value={editingSection.subtitle || ""}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Enter section subtitle"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow">
                          <i className="bi bi-eye text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Visibility
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Show/hide on landing page
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingSection.active}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              active: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Management */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h5 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <i className="bi bi-images text-purple-500"></i>
                        Image Gallery
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {editingSection.images?.length || 0} images • Click to
                        add product links
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <i className="bi bi-info-circle"></i>
                        <span>Drag & drop supported</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="mb-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleMultipleUpload(e.target.files)
                      }
                      className="hidden"
                      disabled={uploading}
                    />
                    <div
                      className="border-3 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50"
                      onClick={handleFileClick}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mx-auto mb-4">
                        <i className="bi bi-cloud-arrow-up text-3xl sm:text-4xl text-blue-600 dark:text-blue-400"></i>
                      </div>
                      <h6 className="font-semibold text-gray-900 dark:text-white text-lg sm:text-xl mb-2">
                        {uploading ? "Uploading..." : "Drop images here"}
                      </h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        PNG, JPG, WebP up to 10MB
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium rounded-lg transition-all"
                      >
                        <i className="bi bi-plus-circle"></i>
                        Select Files
                      </button>
                    </div>
                  </div>

                  {/* Image Grid */}
                  {editingSection.images &&
                    editingSection.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {editingSection.images.map((image) => {
                          const previewLink = generatePreviewLink(image);
                          const sectionType = sectionTypes.find(
                            (t) => t.value === editingSection.type
                          );

                          return (
                            <div
                              key={image.id}
                              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                              {/* Image Container */}
                              <div
                                className="aspect-square relative cursor-pointer overflow-hidden"
                                onClick={() => handleImageClick(image)}
                              >
                                <Image
                                  src={image.url}
                                  alt={image.alt || "Image"}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
                                />

                                {/* Link Indicator */}
                                {(image.link || image.productSlug) && (
                                  <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-lg">
                                    <i className="bi bi-link-45deg mr-1"></i>
                                    Linked
                                  </div>
                                )}

                                {/* Type Badge */}
                                <div
                                  className={`absolute top-2 left-2 ${sectionType?.color || "bg-gray-600"} text-white text-[10px] font-semibold px-2 py-1 rounded-lg shadow`}
                                >
                                  {image.type}
                                </div>

                                {/* Edit Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                  <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                                      <i className="bi bi-pencil text-white text-xl"></i>
                                    </div>
                                    <p className="text-white font-semibold text-sm">
                                      Edit Link
                                    </p>
                                    <p className="text-white/80 text-xs mt-1">
                                      Click to configure
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Image Info */}
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {image.alt?.substring(0, 20) || "No title"}
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleImageClick(image)}
                                      className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 transition-all"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil text-blue-600 dark:text-blue-400 text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() => deleteImage(image.id)}
                                      className="w-7 h-7 rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/50 dark:hover:to-red-700/50 transition-all"
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash text-red-600 dark:text-red-400 text-xs"></i>
                                    </button>
                                  </div>
                                </div>

                                {(image.link || image.productSlug) && (
                                  <div className="mt-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg">
                                    <p className="text-[10px] text-gray-700 dark:text-gray-300 truncate font-medium">
                                      <i className="bi bi-box-arrow-up-right mr-1"></i>
                                      {previewLink.length > 25
                                        ? `${previewLink.substring(0, 25)}...`
                                        : previewLink}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>

              {/* Right Column - Preview & Actions */}
              <div className="space-y-6">
                {/* Preview Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
                  <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="bi bi-eye text-purple-500"></i>
                    Preview
                  </h5>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${sectionTypes.find((t) => t.value === editingSection.type)?.color || "bg-gray-600"}`}
                        >
                          <i className="bi text-white text-lg">
                            {
                              sectionTypes.find(
                                (t) => t.value === editingSection.type
                              )?.icon
                            }
                          </i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {editingSection.type.charAt(0).toUpperCase() +
                              editingSection.type.slice(1)}{" "}
                            Section
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Order: #{editingSection.order}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Images
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {editingSection.images?.length || 0}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Linked
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {editingSection.images?.filter(
                            (img) => img.link || img.productSlug
                          ).length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
                  <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="bi bi-lightning text-orange-500"></i>
                    Actions
                  </h5>
                  <div className="space-y-3">
                    <button
                      onClick={handleSave}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-check-lg"></i>
                      Save Changes
                    </button>

                    <button
                      onClick={() => {
                        setSectionToDelete(editingSection.id);
                        setShowDeleteModal(true);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/30 dark:hover:to-red-700/30 text-red-700 dark:text-red-300 font-semibold rounded-xl transition-all duration-200 border border-red-300 dark:border-red-700/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-trash"></i>
                      Delete Section
                    </button>

                    <button
                      onClick={() => {
                        setEditingSection(null);
                        setShowSectionModal(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
                  <h5 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <i className="bi bi-info-circle text-cyan-500"></i>
                    Status
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${editingSection.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"}`}
                      >
                        {editingSection.active ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Created
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {editingSection.createdAt
                          ? new Date(
                              editingSection.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Updated
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {editingSection.updatedAt
                          ? new Date(
                              editingSection.updatedAt
                            ).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Section Modal
  const renderAddSectionModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[95vh] overflow-hidden shadow-2xl mx-2 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="sticky top-0 z-10 p-6 border-b dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                  Create New Section
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add a new section to your landing page
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <i className="bi bi-x-lg text-lg text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Section Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sectionTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setNewSection({ ...newSection, type: type.value })
                      }
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        newSection.type === type.value
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg scale-[1.02]"
                          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${type.color}`}
                        >
                          <i
                            className={`bi ${type.icon} text-white text-xl`}
                          ></i>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newSection.title}
                    onChange={(e) =>
                      setNewSection({ ...newSection, title: e.target.value })
                    }
                    placeholder="e.g., Summer Sale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newSection.subtitle}
                    onChange={(e) =>
                      setNewSection({ ...newSection, subtitle: e.target.value })
                    }
                    placeholder="e.g., Up to 50% off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Order Position
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={newSection.order}
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        order: parseInt(e.target.value) || sections.length,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={createSection}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <i className="bi bi-plus-circle"></i>
                Create Section
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700 active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const renderDeleteModal = () => {
    if (!showDeleteModal || !sectionToDelete) return null;

    const section = sections.find((s) => s.id === sectionToDelete);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl mx-2 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
                <i className="bi bi-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                  Delete Section
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {section && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-800/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${sectionTypes.find((t) => t.value === section.type)?.color || "bg-gray-600"}`}
                  >
                    <i className="bi text-white">
                      {sectionTypes.find((t) => t.value === section.type)?.icon}
                    </i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {section.title || "Untitled Section"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {section.images?.length || 0} images • Created{" "}
                      {section.createdAt
                        ? new Date(section.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <i className="bi bi-exclamation-circle"></i>
                <span className="text-sm font-medium">
                  Warning: This will permanently delete:
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle text-green-500"></i>
                  The section and all its data
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle text-green-500"></i>
                  All associated images ({section?.images?.length || 0})
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle text-green-500"></i>
                  Any product links configured
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  deleteSection(sectionToDelete);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <i className="bi bi-trash"></i>
                Delete Permanently
              </button>
              <button
                onClick={() => {
                  setSectionToDelete(null);
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700 active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading sections...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Landing Page Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Design and manage your homepage sections
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={seedDemoData}
                className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center gap-2"
              >
                <i className="bi bi-magic"></i>
                <span className="hidden sm:inline">Seed Demo</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center gap-2"
              >
                <i className="bi bi-plus-circle"></i>
                <span className="hidden sm:inline">New Section</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Sections
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {sections.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                <i className="bi bi-layers text-blue-600 dark:text-blue-400 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Sections
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {sections.filter((s) => s.active).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                <i className="bi bi-eye text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Images
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {sections.reduce(
                    (acc, section) => acc + (section.images?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                <i className="bi bi-images text-purple-600 dark:text-purple-400 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Linked Images
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {sections.reduce(
                    (acc, section) =>
                      acc +
                      (section.images?.filter(
                        (img) => img.link || img.productSlug
                      ).length || 0),
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                <i className="bi bi-link-45deg text-amber-600 dark:text-amber-400 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search sections by title or subtitle..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {sectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <button
                onClick={fetchSections}
                className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700 flex items-center gap-2"
              >
                <i className="bi bi-arrow-clockwise"></i>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSections.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mx-auto mb-6">
                  <i className="bi bi-layers text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No sections found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchTerm || filterType !== "all" || filterActive !== "all"
                    ? "Try changing your search filters"
                    : "Get started by creating your first section"}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] inline-flex items-center gap-2"
                >
                  <i className="bi bi-plus-circle"></i>
                  Create First Section
                </button>
              </div>
            </div>
          ) : (
            filteredSections
              .sort((a, b) => a.order - b.order)
              .map((section) => {
                const sectionType = sectionTypes.find(
                  (t) => t.value === section.type
                );
                const linkedImages =
                  section.images?.filter((img) => img.link || img.productSlug)
                    .length || 0;

                return (
                  <div
                    key={section.id}
                    className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="p-5 border-b dark:border-gray-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${sectionType?.color || "bg-gray-600"}`}
                          >
                            <i
                              className={`bi ${sectionType?.icon} text-white text-xl`}
                            ></i>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[180px]">
                              {section.title || "Untitled Section"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sectionType?.label} • Order: #{section.order}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${section.active ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"}`}
                        >
                          {section.active ? "Active" : "Hidden"}
                        </div>
                      </div>

                      {section.subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                          {section.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {section.images?.length || 0}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Images
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {linkedImages}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Linked
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {section.order}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Order
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleActive(section.id, section.active)
                          }
                          className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                            section.active
                              ? "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800"
                              : "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50"
                          }`}
                        >
                          <i
                            className={`bi ${section.active ? "bi-eye-slash" : "bi-eye"}`}
                          ></i>
                          <span className="text-sm">
                            {section.active ? "Hide" : "Show"}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setShowSectionModal(true);
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <i className="bi bi-pencil"></i>
                          <span className="text-sm">Edit</span>
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t dark:border-gray-800">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <i className="bi bi-clock"></i>
                          <span>
                            Updated{" "}
                            {section.updatedAt
                              ? new Date(section.updatedAt).toLocaleDateString()
                              : "Never"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSectionToDelete(section.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete section"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Empty State for no filters */}
        {sections.length > 0 && filteredSections.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No sections match your filters. Try adjusting your search
              criteria.
            </p>
          </div>
        )}

        {/* Reset Warning - Bottom */}
        {sections.length > 0 && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-800/10 border border-red-200 dark:border-red-800/30 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
                    <i className="bi bi-exclamation-triangle text-red-600 dark:text-red-400"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      Danger Zone
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This will permanently delete all sections and images
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetData}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 hover:from-red-200 hover:to-red-300 dark:hover:from-red-800/50 dark:hover:to-red-700/50 text-red-700 dark:text-red-300 font-medium rounded-lg transition-all duration-200 border border-red-300 dark:border-red-700/30 flex items-center gap-2"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30 hover:shadow-3xl active:scale-95 transition-all duration-200"
          aria-label="Add new section"
        >
          <i className="bi bi-plus text-2xl"></i>
        </button>
      )}

      {/* Modals */}
      {renderAddSectionModal()}
      {renderSectionEditorModal()}
      {renderDeleteModal()}
      {renderImageEditor()}
    </div>
  );
}
