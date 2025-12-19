import { create } from 'zustand';

interface Size {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface Color {
  id: string;
  name: string;
}

interface ProductVariant {
  id: string;
  variantName: string;
  variantDescription?: string;
  variantImage: string;
  slug: string;
  sku: string;
  weight: number;
  productId: string;
  sizes: Size[];
  images: { id: string; url: string; alt: string }[];
  colors: Color[];
  specs: { id: string; name: string; value: string }[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  brand: string;
  rating: number;
  numReviews: number;
  views: number;
  store: {
    id: string;
    name: string;
    logo: string;
    averageRating: number;
    url: string;
  };
  category?: {
    id: string;
    name: string;
  };
  subCategory?: {
    id: string;
    name: string;
  };
}

interface Review {
  id: string;
  variant: string;
  variantImage?: string;
  review: string;
  rating: number;
  color: string;
  size: string;
  quantity: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  images: { id: string; url: string; alt: string }[];
}

interface ProductDetailsStore {
  // State
  product: ProductVariant | null;
  baseProduct: Product | null;
  variants: ProductVariant[];
  allSizes: Size[];
  reviews: Review[];
  similarProducts: any[];
  selectedSize: Size | null;
  selectedColor: Color | null;
  selectedImageIndex: number;
  quantity: number;
  isLoading: boolean;
  error: string | null;
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: any[];
  };

  // Actions
  fetchProductDetails: (slug: string) => Promise<void>;
  fetchReviews: (slug: string, page?: number, filters?: any) => Promise<void>;
  addReview: (slug: string, reviewData: any) => Promise<void>;
  toggleWishlist: (slug: string, sizeId?: string) => Promise<void>;
  addToCart: (slug: string, sizeId: string, quantity: number) => Promise<void>;
  buyNow: (slug: string, sizeId: string, quantity: number) => Promise<void>;
  
  setSelectedSize: (size: Size | null) => void;
  setSelectedColor: (color: Color | null) => void;
  setSelectedImageIndex: (index: number) => void;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;

  // Computed
  getSelectedVariant: () => ProductVariant | null;
  getPrice: () => number;
  getDiscount: () => number;
  getFinalPrice: () => number;
  isInStock: () => boolean;
  isInWishlist: () => boolean;
}

export const useProductDetailsStore = create<ProductDetailsStore>((set, get) => ({
  // Initial state
  product: null,
  baseProduct: null,
  variants: [],
  allSizes: [],
  reviews: [],
  similarProducts: [],
  selectedSize: null,
  selectedColor: null,
  selectedImageIndex: 0,
  quantity: 1,
  isLoading: false,
  error: null,
  stats: {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [],
  },

  // Actions
  fetchProductDetails: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/oneshop/products/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch product details');
      
      const data = await response.json();
      
      set({
        product: data.product,
        baseProduct: data.product.product,
        variants: data.variants,
        allSizes: data.allSizes,
        reviews: data.reviews,
        similarProducts: data.similarProducts,
        stats: data.stats,
        selectedSize: data.product.sizes?.[0] || null,
        selectedColor: data.product.colors?.[0] || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product details',
        isLoading: false,
      });
    }
  },

  fetchReviews: async (slug: string, page = 1, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...filters,
      });
      
      const response = await fetch(`/api/oneshop/products/${slug}/reviews?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      set({ reviews: data.reviews });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
      });
    }
  },

  addReview: async (slug: string, reviewData: any) => {
    try {
      const response = await fetch(`/api/oneshop/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add review');
      }
      
      const data = await response.json();
      
      // Reviews listesini güncelle
      set((state) => ({
        reviews: [data.review, ...state.reviews],
        stats: {
          ...state.stats,
          averageRating: (state.stats.averageRating * state.stats.totalReviews + reviewData.rating) / (state.stats.totalReviews + 1),
          totalReviews: state.stats.totalReviews + 1,
        },
      }));
      
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add review',
      });
      throw error;
    }
  },

  toggleWishlist: async (slug: string, sizeId?: string) => {
    try {
      const response = await fetch(`/api/oneshop/products/${slug}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sizeId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update wishlist');
      }
      
      return await response.json();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update wishlist',
      });
      throw error;
    }
  },

  addToCart: async (slug: string, sizeId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/oneshop/products/${slug}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sizeId, quantity }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
      return await response.json();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to cart',
      });
      throw error;
    }
  },

  buyNow: async (slug: string, sizeId: string, quantity: number) => {
    const { addToCart } = get();
    
    try {
      // Önce sepete ekle
      const cartResult = await addToCart(slug, sizeId, quantity);
      
      if (cartResult.success) {
        // Sepete başarıyla eklendiyse, checkout sayfasına yönlendir
        window.location.href = '/shop/checkout';
      }
    } catch (error) {
      throw error;
    }
  },

  setSelectedSize: (size) => set({ selectedSize: size }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),
  incrementQuantity: () => set((state) => ({ quantity: state.quantity + 1 })),
  decrementQuantity: () => set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),

  // Computed getters
  getSelectedVariant: () => {
    const { product, selectedColor, selectedSize } = get();
    if (!product) return null;

    // Eğer renk veya beden seçiliyse, uygun variantı bul
    const variant = get().variants.find(v => 
      (!selectedColor || v.colors.some(c => c.id === selectedColor.id)) &&
      (!selectedSize || v.sizes.some(s => s.id === selectedSize.id))
    );

    return variant || product;
  },

  getPrice: () => {
    const { selectedSize } = get();
    return selectedSize?.price || 0;
  },

  getDiscount: () => {
    const { selectedSize } = get();
    return selectedSize?.discount || 0;
  },

  getFinalPrice: () => {
    const price = get().getPrice();
    const discount = get().getDiscount();
    return discount > 0 ? price * (1 - discount / 100) : price;
  },

  isInStock: () => {
    const { selectedSize, quantity } = get();
    return selectedSize ? selectedSize.quantity >= quantity : false;
  },

  isInWishlist: () => {
    // Bu fonksiyon wishlist kontrolü için API'yi kullanacak
    return false;
  },
}));