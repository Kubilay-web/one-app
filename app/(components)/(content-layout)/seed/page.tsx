"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function SeedLandingPage() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ sections: number; images: number } | null>(null);

  const handleSeedData = async () => {
    if (!confirm("This will replace all existing landing page data with demo content. Are you sure?")) {
      return;
    }

    setSeeding(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/oneshop/admin/landingpage/seed", {
        method: "POST",
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Seeding failed");
      }

      const data = await response.json();
      setProgress(100);
      setResult(data.data);
      
      toast.success("✅ Landing page seeded successfully!");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/admin/landing-page");
      }, 3000);

    } catch (error) {
      toast.error("❌ Failed to seed landing page data");
      console.error("Seeding error:", error);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm("This will delete ALL landing page data. This action cannot be undone. Are you sure?")) {
      return;
    }

    try {
      const response = await fetch("/api/oneshop/admin/landingpage/reset", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Data reset successfully");
        setResult(null);
      } else {
        throw new Error("Reset failed");
      }
    } catch (error) {
      toast.error("Failed to reset data");
    }
  };

  const sectionsToCreate = [
    { name: "Hero Section", images: 1 },
    { name: "Main Banner", images: 5 },
    { name: "Categories", images: 6 },
    { name: "Today Deals", images: 3 },
    { name: "Popular Products", images: 8 },
    { name: "Newsletter", images: 1 },
    { name: "Features", images: 3 },
    { name: "Statistics", images: 1 },
    { name: "Call to Action", images: 1 },
    { name: "Download App", images: 2 },
    { name: "Testimonials", images: 0 },
    { name: "Brands", images: 0 }
  ];

  const totalImages = sectionsToCreate.reduce((sum, section) => sum + section.images, 0);

  return (
    <div className="main-content">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Seed Landing Page Data</div>
              </div>
              
              <div className="box-body">
                <div className="space-y-6">
                  {/* Warning Alert */}
                  <div className="alert alert-warning">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="bi bi-exclamation-triangle text-xl"></i>
                      </div>
                      <div>
                        <h6 className="alert-heading mb-2">⚠️ Important Warning</h6>
                        <p className="mb-0">
                          This action will replace all existing landing page sections and images with demo data.
                          Make sure to backup any important data before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* What will be created */}
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-4">What will be created:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sectionsToCreate.map((section, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{section.name}</span>
                            <span className="badge bg-light text-dark">
                              {section.images} {section.images === 1 ? 'image' : 'images'}
                            </span>
                          </div>
                          <div className="text-xs text-textmuted mt-1">
                            Order: {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <div className="flex gap-4">
                          <span className="badge bg-primary">
                            {sectionsToCreate.length} sections
                          </span>
                          <span className="badge bg-success">
                            {totalImages} images
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  {seeding && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Seeding in progress...</span>
                        <span className="text-primary font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-textmuted">
                        Adding sections and high-quality Unsplash images...
                      </p>
                    </div>
                  )}

                  {/* Result */}
                  {result && (
                    <div className="alert alert-success">
                      <div className="d-flex">
                        <div className="me-3">
                          <i className="bi bi-check-circle text-xl"></i>
                        </div>
                        <div>
                          <h6 className="alert-heading mb-2">✅ Seeding Completed!</h6>
                          <p className="mb-2">
                            Successfully created {result.sections} sections with {result.images} high-quality images.
                          </p>
                          <p className="mb-0 text-sm">
                            You will be redirected to the landing page manager in a few seconds...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push("/admin/landing-page")}
                      className="ti-btn ti-btn-outline-light flex-1"
                      disabled={seeding}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Manager
                    </button>
                    
                    <button
                      onClick={handleResetData}
                      className="ti-btn ti-btn-outline-danger flex-1"
                      disabled={seeding}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Reset All Data
                    </button>
                    
                    <button
                      onClick={handleSeedData}
                      className="ti-btn ti-btn-success flex-1"
                      disabled={seeding}
                    >
                      {seeding ? (
                        <>
                          <i className="bi bi-arrow-clockwise animate-spin me-2"></i>
                          Seeding...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-magic me-2"></i>
                          Seed Demo Data
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 col-span-12">
            <div className="box sticky top-6">
              <div className="box-header">
                <div className="box-title">Preview Images</div>
              </div>
              
              <div className="box-body">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-light rounded-lg mb-3">
                      <i className="bi bi-images text-4xl text-primary"></i>
                    </div>
                    <h6 className="font-medium">High-Quality Unsplash Images</h6>
                    <p className="text-sm text-textmuted mb-4">
                      All images are sourced from Unsplash for best quality and performance.
                    </p>
                  </div>

                  {/* Image Preview Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {unsplashImages.banners.slice(0, 2).map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video rounded overflow-hidden">
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={113}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs bg-black/70 px-2 py-1 rounded">
                            Banner {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {unsplashImages.products.slice(0, 2).map((url, index) => (
                      <div key={index + 2} className="relative group">
                        <div className="aspect-square rounded overflow-hidden">
                          <Image
                            src={url}
                            alt={`Product ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs bg-black/70 px-2 py-1 rounded">
                            Product {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h6 className="font-medium">Features Included:</h6>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>12 fully configured sections</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>20+ high-quality Unsplash images</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Responsive design ready</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>SEO optimized content</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <span>Easy to customize</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Links */}
                  <div className="pt-4 border-t">
                    <h6 className="font-medium mb-3">Quick Links</h6>
                    <div className="space-y-2">
                      <a
                        href="https://unsplash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary hover:text-primary-dark"
                      >
                        <i className="bi bi-box-arrow-up-right me-2"></i>
                        Browse more images on Unsplash
                      </a>
                      <a
                        href="/admin/landing-page/templates"
                        className="flex items-center text-sm text-primary hover:text-primary-dark"
                      >
                        <i className="bi bi-grid me-2"></i>
                        View template options
                      </a>
                      <a
                        href="/documentation/landing-page"
                        className="flex items-center text-sm text-primary hover:text-primary-dark"
                      >
                        <i className="bi bi-book me-2"></i>
                        Read documentation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Unsplash images for preview (moved outside component)
const unsplashImages = {
  banners: [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ],
  products: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w-400&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ]
};