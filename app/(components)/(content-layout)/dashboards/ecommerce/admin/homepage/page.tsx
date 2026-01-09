"use client";

import { useState, useEffect } from "react";
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
  images: any[];
}

export default function LandingPageAdmin() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSection, setNewSection] = useState({
    type: "banner",
    title: "",
    subtitle: "",
    active: true,
    order: 0
  });

  const sectionTypes = [
    { value: "banner", label: "Banner Section" },
    { value: "categories", label: "Categories Section" },
    { value: "deals", label: "Today Deals" },
    { value: "products", label: "Products Section" },
    { value: "newsletter", label: "Newsletter" },
    { value: "features", label: "Features" },
    { value: "stats", label: "Statistics" },
    { value: "cta", label: "Call to Action" },
    { value: "download", label: "Download App" }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/oneshop/admin/landingpage/sections");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSections(data);
    } catch (error) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const addImageToSection = async (sectionId: string, file: File, type: string = "gallery") => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      
      const res = await fetch(`/api/oneshop/admin/landingpage/sections/${sectionId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: imageUrl,
          alt: file.name,
          type,
          order: 0
        })
      });

      if (!res.ok) throw new Error("Failed to add image");
      
      toast.success("Image uploaded");
      fetchSections();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    
    try {
      const res = await fetch(`/api/oneshop/admin/landingpage/images/${imageId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted");
      fetchSections();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const createSection = async () => {
    try {
      const res = await fetch("/api/oneshop/admin/landingpage/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection)
      });

      if (!res.ok) throw new Error("Create failed");
      
      toast.success("Section created");
      setShowAddModal(false);
      setNewSection({
        type: "banner",
        title: "",
        subtitle: "",
        active: true,
        order: 0
      });
      fetchSections();
    } catch (error) {
      toast.error("Failed to create section");
    }
  };

  const updateSection = async (sectionId: string, updates: Partial<Section>) => {
    try {
      const res = await fetch(`/api/oneshop/admin/landingpage/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Section updated");
      fetchSections();
    } catch (error) {
      toast.error("Failed to update section");
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section and all its images?")) return;
    
    try {
      const res = await fetch(`/api/oneshop/admin/landingpage/sections/${sectionId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Section deleted");
      setEditingSection(null);
      fetchSections();
    } catch (error) {
      toast.error("Failed to delete section");
    }
  };

  const toggleActive = async (sectionId: string, currentActive: boolean) => {
    await updateSection(sectionId, { active: !currentActive });
  };

  const seedDemoData = async () => {
    if (!confirm("This will replace all existing data. Continue?")) return;
    
    try {
      const res = await fetch("/api/oneshop/admin/landingpage/seed", {
        method: "POST"
      });

      if (!res.ok) throw new Error("Seeding failed");
      toast.success("Demo data seeded successfully");
      fetchSections();
    } catch (error) {
      toast.error("Failed to seed data");
    }
  };

  const resetData = async () => {
    if (!confirm("This will delete ALL data. Are you sure?")) return;
    
    try {
      const res = await fetch("/api/oneshop/admin/landingpage/reset", {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Reset failed");
      toast.success("All data reset");
      fetchSections();
    } catch (error) {
      toast.error("Failed to reset data");
    }
  };

  const renderSectionEditor = () => {
    if (!editingSection) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="ti-form-label">Section Type</label>
            <select
              className="ti-form-control"
              value={editingSection.type}
              onChange={(e) => setEditingSection({...editingSection, type: e.target.value})}
            >
              {sectionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="ti-form-label">Order</label>
            <input
              type="number"
              className="ti-form-control"
              value={editingSection.order}
              onChange={(e) => setEditingSection({...editingSection, order: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="ti-form-label">Title</label>
          <input
            type="text"
            className="ti-form-control"
            value={editingSection.title || ""}
            onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
            placeholder="Section title"
          />
        </div>

        <div>
          <label className="ti-form-label">Subtitle</label>
          <input
            type="text"
            className="ti-form-control"
            value={editingSection.subtitle || ""}
            onChange={(e) => setEditingSection({...editingSection, subtitle: e.target.value})}
            placeholder="Section subtitle"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={editingSection.active}
            onChange={(e) => setEditingSection({...editingSection, active: e.target.checked})}
            className="ti-form-checkbox"
          />
          <label htmlFor="active" className="ms-2">Active</label>
        </div>

        {/* Image Management */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Images</h4>
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                for (const file of files) {
                  await addImageToSection(editingSection.id, file);
                }
              }}
              className="ti-form-control"
              disabled={uploading}
            />
          </div>

          {editingSection.images && editingSection.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {editingSection.images.map((image) => (
                <div key={image.id} className="border rounded p-2 relative">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={image.url}
                      alt={image.alt || "Image"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="text-xs text-textmuted">Type: {image.type}</div>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="ti-btn ti-btn-outline-danger ti-btn-xs w-full mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => updateSection(editingSection.id, editingSection)}
            className="ti-btn ti-btn-primary flex-1"
          >
            Save Changes
          </button>
          <button
            onClick={() => deleteSection(editingSection.id)}
            className="ti-btn ti-btn-danger flex-1"
          >
            Delete Section
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Landing Page Manager</h1>
              <p className="text-textmuted">Manage your homepage sections</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={seedDemoData}
                className="ti-btn ti-btn-success"
              >
                Seed Demo Data
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="ti-btn ti-btn-primary"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>

        {/* Add Section Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-bodybg rounded-lg w-full max-w-md">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Add New Section</h4>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="ti-btn ti-btn-outline-light ti-btn-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="ti-form-label">Section Type</label>
                    <select
                      className="ti-form-control"
                      value={newSection.type}
                      onChange={(e) => setNewSection({...newSection, type: e.target.value})}
                    >
                      {sectionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="ti-form-label">Title</label>
                    <input
                      type="text"
                      className="ti-form-control"
                      value={newSection.title}
                      onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="ti-form-label">Subtitle</label>
                    <input
                      type="text"
                      className="ti-form-control"
                      value={newSection.subtitle}
                      onChange={(e) => setNewSection({...newSection, subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="ti-form-label">Order</label>
                    <input
                      type="number"
                      className="ti-form-control"
                      value={newSection.order}
                      onChange={(e) => setNewSection({...newSection, order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={createSection}
                    className="ti-btn ti-btn-primary flex-1"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="ti-btn ti-btn-outline-light flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Section List */}
          <div className="xl:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Sections ({sections.length})</div>
              </div>
              <div className="box-body">
                {sections.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="bi bi-layers text-4xl text-textmuted mb-3"></i>
                    <p className="text-textmuted mb-4">No sections configured</p>
                    <button
                      onClick={seedDemoData}
                      className="ti-btn ti-btn-primary"
                    >
                      Seed Demo Data
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div
                          key={section.id}
                          className={`border rounded-lg p-4 ${section.active ? 'border-primary' : 'border-defaultborder'}`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`badge ${section.active ? 'bg-success' : 'bg-secondary'}`}>
                                  {section.active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="badge bg-light text-dark">
                                  {section.type}
                                </span>
                              </div>
                              <h4 className="font-medium">{section.title || "No title"}</h4>
                              <p className="text-sm text-textmuted mb-0">{section.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleActive(section.id, section.active)}
                                className={`ti-btn ti-btn-sm ${section.active ? 'ti-btn-success' : 'ti-btn-outline-light'}`}
                              >
                                {section.active ? 'Active' : 'Inactive'}
                              </button>
                              <button
                                onClick={() => setEditingSection(section)}
                                className="ti-btn ti-btn-primary ti-btn-sm"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-textmuted">
                            Order: {section.order} • Images: {section.images?.length || 0}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <span>Reset will delete all data.</span>
                <button
                  onClick={resetData}
                  className="ti-btn ti-btn-outline-danger ti-btn-sm ms-3"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          </div>

          {/* Editor Sidebar */}
          <div className="xl:col-span-4 col-span-12">
            {editingSection ? (
              <div className="box sticky top-6">
                <div className="box-header flex justify-between items-center">
                  <div className="box-title">Edit Section</div>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="ti-btn ti-btn-outline-light ti-btn-sm"
                  >
                    Close
                  </button>
                </div>
                <div className="box-body">
                  {renderSectionEditor()}
                </div>
              </div>
            ) : (
              <div className="box">
                <div className="box-body">
                  <div className="text-center mb-4">
                    <i className="bi bi-layout-text-window text-4xl text-primary mb-3"></i>
                    <h4 className="font-medium">Landing Page Manager</h4>
                    <p className="text-textmuted text-sm">
                      Add and manage sections for your landing page
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="ti-btn ti-btn-primary w-full"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Section
                    </button>
                    <a
                      href="/"
                      target="_blank"
                      className="ti-btn ti-btn-outline-info w-full"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Landing Page
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}