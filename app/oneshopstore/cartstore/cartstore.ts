import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  sizeId: string;
  productSlug: string;
  variantSlug: string;
  sku: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  shippingFee: number;
  totalPrice: number;
  storeId: string;
  store?: {
    id: string;
    name: string;
    url: string;
  };
}

interface Cart {
  id: string;
  userId: string;
  couponId?: string;
  subTotal: number;
  total: number;
  shippingFees: number;
  cartItems: CartItem[];
  coupon?: {
    id: string;
    code: string;
    discount: number;
  };
}

interface CartStore {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id' | 'totalPrice'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed values
  getSubTotal: () => number;
  getTotal: () => number;
  getShippingFees: () => number;
  getItemCount: () => number;
  getStoreGroupedItems: () => Record<string, CartItem[]>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/oneshop/cart');
          if (!response.ok) throw new Error('Failed to fetch cart');
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.items || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch cart',
            isLoading: false,
          });
        }
      },

      addToCart: async (item) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/oneshop/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add to cart');
          }
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.cart.cartItems || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add to cart',
            isLoading: false,
          });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/oneshop/cart?itemId=${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update quantity');
          }
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.cart.cartItems || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update quantity',
            isLoading: false,
          });
        }
      },

      removeFromCart: async (itemId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/oneshop/cart?itemId=${itemId}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove item');
          }
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.cart.cartItems || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove item',
            isLoading: false,
          });
        }
      },

      applyCoupon: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/oneshop/cart/coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to apply coupon');
          }
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.cart.cartItems || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to apply coupon',
            isLoading: false,
          });
        }
      },

      removeCoupon: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/oneshop/cart/coupon', {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove coupon');
          }
          
          const data = await response.json();
          set({
            cart: data.cart,
            items: data.cart.cartItems || [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove coupon',
            isLoading: false,
          });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const currentItems = get().items;
          
          // Tüm öğeleri teker teker sil
          for (const item of currentItems) {
            await fetch(`/api/oneshop/cart?itemId=${item.id}`, {
              method: 'DELETE',
            });
          }
          
          set({
            cart: null,
            items: [],
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to clear cart',
            isLoading: false,
          });
        }
      },

      // Computed getters
      getSubTotal: () => {
        const cart = get().cart;
        return cart?.subTotal || get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getTotal: () => {
        const cart = get().cart;
        if (cart?.coupon) {
          const discount = (cart.coupon.discount / 100) * cart.subTotal;
          return cart.subTotal - discount + cart.shippingFees;
        }
        return cart?.total || get().getSubTotal() + get().getShippingFees();
      },

      getShippingFees: () => {
        const cart = get().cart;
        return cart?.shippingFees || get().items.reduce((sum, item) => sum + item.shippingFee, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getStoreGroupedItems: () => {
        const items = get().items;
        const grouped: Record<string, CartItem[]> = {};
        
        items.forEach(item => {
          const storeId = item.storeId;
          if (!grouped[storeId]) {
            grouped[storeId] = [];
          }
          grouped[storeId].push(item);
        });
        
        return grouped;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        cart: state.cart,
        items: state.items,
      }),
    }
  )
);