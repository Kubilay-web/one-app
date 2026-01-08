// app/cart-store/useCartStore.ts
import { CartProductType } from "@/app/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppliedCouponType {
  couponId: string;
  couponCode: string;
  discountPercentage: number;
  discountAmount: number;
  expiryDate: string;
}

interface State {
  cart: CartProductType[];
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number; // ← BU EKLENDİ
  appliedCoupon: AppliedCouponType | null;
}

interface Actions {
  addToCart: (item: CartProductType) => void;
  updateProductQuantity: (product: CartProductType, quantity: number) => void;
  removeMultipleFromCart: (items: CartProductType[]) => void;
  removeFromCart: (item: CartProductType) => void;
  emptyCart: () => void;
  setCart: (newCart: CartProductType[]) => void;
  setAppliedCoupon: (coupon: AppliedCouponType | null) => void;
  removeCoupon: () => void;
  setShippingFee: (fee: number) => void;
  clearCart: () => void;
  
  // Hesaplama fonksiyonları
  calculateSubtotal: () => number;
  calculateDiscount: () => number;
  calculateTotal: () => number;
  recalculateAll: () => void;
}

const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  subtotal: 0,
  shippingFee: 0,
  totalPrice: 0, // ← BU EKLENDİ
  appliedCoupon: null,
};

export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      subtotal: INITIAL_STATE.subtotal,
      shippingFee: INITIAL_STATE.shippingFee,
      totalPrice: INITIAL_STATE.totalPrice,
      appliedCoupon: INITIAL_STATE.appliedCoupon,

      // HESAPLAMA FONKSİYONLARI
      calculateSubtotal: () => {
        const cart = get().cart;
        return cart.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
      },

      calculateDiscount: () => {
        const appliedCoupon = get().appliedCoupon;
        return appliedCoupon ? appliedCoupon.discountAmount : 0;
      },

      calculateTotal: () => {
        const subtotal = get().calculateSubtotal();
        const discount = get().calculateDiscount();
        const shippingFee = get().shippingFee;
        
        // Total = Subtotal - Discount + Shipping
        return Math.max(0, subtotal - discount + shippingFee);
      },

      recalculateAll: () => {
        const subtotal = get().calculateSubtotal();
        const total = get().calculateTotal();
        
        set({ 
          subtotal,
          totalPrice: total 
        });
      },

      // CART İŞLEMLERİ
      addToCart: (product: CartProductType) => {
        if (!product) return;
        
        const cart = get().cart;
        const cartItem = cart.find(
          (item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
        );
        
        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
              ? { 
                  ...item, 
                  quantity: item.quantity + product.quantity,
                  totalPrice: item.price * (item.quantity + product.quantity)
                }
              : item
          );
          
          set(() => ({
            cart: updatedCart,
            totalItems: updatedCart.length,
          }));
          
          get().recalculateAll();
        } else {
          const newItem = {
            ...product,
            totalPrice: product.price * product.quantity
          };
          
          const updatedCart = [...cart, newItem];
          
          set(() => ({
            cart: updatedCart,
            totalItems: updatedCart.length,
          }));
          
          get().recalculateAll();
        }
      },

      updateProductQuantity: (product: CartProductType, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(product);
          return;
        }

        const cart = get().cart;
        const updatedCart = cart.map((item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
            ? { 
                ...item, 
                quantity: quantity,
                totalPrice: item.price * quantity
              }
            : item
        );

        set(() => ({
          cart: updatedCart,
        }));

        get().recalculateAll();
      },

      removeFromCart: (product: CartProductType) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.productId === product.productId &&
              item.variantId === product.variantId &&
              item.sizeId === product.sizeId
            )
        );

        set(() => ({
          cart: updatedCart,
          totalItems: updatedCart.length,
        }));

        get().recalculateAll();
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      },

      removeMultipleFromCart: (products: CartProductType[]) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !products.some(
              (product) =>
                product.productId === item.productId &&
                product.variantId === item.variantId &&
                product.sizeId === item.sizeId
            )
        );

        set(() => ({
          cart: updatedCart,
          totalItems: updatedCart.length,
        }));

        get().recalculateAll();
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      },

      emptyCart: () => {
        set(() => ({
          cart: [],
          totalItems: 0,
          subtotal: 0,
          shippingFee: 0,
          totalPrice: 0,
          appliedCoupon: null,
        }));

        localStorage.removeItem("cart");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("shippingFee");
      },

      setCart: (newCart: CartProductType[]) => {
        const cartWithTotals = newCart.map(item => ({
          ...item,
          totalPrice: item.price * item.quantity
        }));
        
        const savedCoupon = localStorage.getItem("appliedCoupon");
        const appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;
        
        const savedShippingFee = localStorage.getItem("shippingFee");
        const shippingFee = savedShippingFee ? parseFloat(savedShippingFee) : 0;
        
        const subtotal = cartWithTotals.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        
        const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
        const totalPrice = Math.max(0, subtotal - discount + shippingFee);

        set(() => ({
          cart: cartWithTotals,
          totalItems: cartWithTotals.length,
          subtotal: subtotal,
          shippingFee: shippingFee,
          totalPrice: totalPrice,
          appliedCoupon: appliedCoupon,
        }));
      },

      setAppliedCoupon: (coupon: AppliedCouponType | null) => {
        if (!coupon) {
          set(() => ({
            appliedCoupon: null,
          }));
          
          get().recalculateAll();
          localStorage.removeItem("appliedCoupon");
        } else {
          set(() => ({
            appliedCoupon: coupon,
          }));
          
          get().recalculateAll();
          localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
        }
      },

      removeCoupon: () => {
        set(() => ({
          appliedCoupon: null,
        }));
        
        get().recalculateAll();
        localStorage.removeItem("appliedCoupon");
      },

      setShippingFee: (fee: number) => {
        const feeValue = Math.max(0, fee);
        
        set(() => ({
          shippingFee: feeValue,
        }));
        
        get().recalculateAll();
        localStorage.setItem("shippingFee", feeValue.toString());
      },

      clearCart: () => {
        localStorage.removeItem("cart");
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("shippingFee");
        set({ 
          cart: [], 
          totalItems: 0, 
          subtotal: 0,
          shippingFee: 0,
          totalPrice: 0,
          appliedCoupon: null 
        });
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        cart: state.cart,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
        shippingFee: state.shippingFee,
        totalPrice: state.totalPrice,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);