import { useCartStore } from "@/app/cart-store/useCartStore";
import { create } from "zustand";

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  state: string;
  city: string;
  zip_code: string;
  default: boolean;
  countryId: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
}

interface Country {
  id: string;
  name: string;
  code: string;
}

interface CheckoutStore {
  // State
  step: number;
  shippingAddresses: ShippingAddress[];
  selectedAddressId: string | null;
  paymentMethod: "card" | "cod" | "upi" | null;
  shippingMethod: "standard" | "express";
  note: string;
  countries: Country[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  fetchShippingAddresses: () => Promise<void>;
  addShippingAddress: (address: Omit<ShippingAddress, "id">) => Promise<void>;
  updateShippingAddress: (
    id: string,
    address: Partial<ShippingAddress>
  ) => Promise<void>;
  deleteShippingAddress: (id: string) => Promise<void>;
  setSelectedAddress: (id: string) => void;

  fetchCountries: () => Promise<void>;

  setPaymentMethod: (method: "card" | "cod" | "upi") => void;
  setShippingMethod: (method: "standard" | "express") => void;
  setNote: (note: string) => void;

  placeOrder: () => Promise<{
    success: boolean;
    order?: any;
    paymentUrl?: string;
    sessionId?: string;
    error?: string;
  }>;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // Initial state
  step: 1,
  shippingAddresses: [],
  selectedAddressId: null,
  paymentMethod: null,
  shippingMethod: "standard",
  note: "",
  countries: [],
  isLoading: false,
  error: null,

  // Step actions
  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step } = get();
    const maxStep = 4;

    if (step < maxStep) {
      // Step 1 validation only - shipping address
      if (step === 1 && !get().selectedAddressId) {
        set({ error: "Please select a shipping address" });
        return;
      }

      // Clear error and go to next step
      set({ step: step + 1, error: null });
    }
  },

  prevStep: () => {
    const { step } = get();
    if (step > 1) {
      set({ step: step - 1, error: null });
    }
  },

  // Shipping address actions
  fetchShippingAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/oneshop/checkout/shippingaddress");
      if (!response.ok) throw new Error("Failed to fetch addresses");

      const addresses = await response.json();
      const defaultAddress = addresses.find(
        (addr: ShippingAddress) => addr.default
      );

      set({
        shippingAddresses: addresses,
        selectedAddressId: defaultAddress?.id || addresses[0]?.id || null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch addresses",
        isLoading: false,
      });
    }
  },

  addShippingAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/oneshop/checkout/shippingaddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add address");
      }

      const data = await response.json();
      set((state) => ({
        shippingAddresses: [...state.shippingAddresses, data.shippingAddress],
        selectedAddressId: address.default
          ? data.shippingAddress.id
          : state.selectedAddressId,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add address",
        isLoading: false,
      });
    }
  },

  updateShippingAddress: async (id, address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/oneshop/checkout/shippingaddress?id=${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update address");
      }

      const data = await response.json();
      set((state) => ({
        shippingAddresses: state.shippingAddresses.map((addr) =>
          addr.id === id ? data.shippingAddress : addr
        ),
        selectedAddressId: address.default ? id : state.selectedAddressId,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update address",
        isLoading: false,
      });
    }
  },

  deleteShippingAddress: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/oneshop/checkout/shippingaddress?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete address");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete address");
      }

      set((state) => {
        const addresses = state.shippingAddresses.filter(
          (addr) => addr.id !== id
        );
        let newSelectedId = state.selectedAddressId;

        if (state.selectedAddressId === id) {
          newSelectedId = addresses[0]?.id || null;
        }

        return {
          shippingAddresses: addresses,
          selectedAddressId: newSelectedId,
          isLoading: false,
        };
      });

      return data;
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete address",
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedAddress: (id) => set({ selectedAddressId: id }),

  // Country actions
  fetchCountries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/oneshop/checkout/countries");
      if (!response.ok) throw new Error("Failed to fetch countries");

      const countries = await response.json();
      set({ countries, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch countries",
        isLoading: false,
      });
    }
  },

  // Payment and shipping actions
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  setNote: (note) => set({ note }),

  // Order placement with Stripe


  // Order placement with Stripe

  placeOrder: async () => {
  set({ isLoading: true, error: null });
  try {
    const { selectedAddressId, paymentMethod, shippingMethod, note } = get();
    
    if (!selectedAddressId) throw new Error('Please select a shipping address');
    if (!paymentMethod) throw new Error('Please select a payment method');
    
    // Get cart directly
    const { cart } = useCartStore.getState();
    
    if (!cart || cart.length === 0) {
      throw new Error('Your cart is empty');
    }
    
    // Format cart items EXACTLY as backend expects
    const cartItems = cart.map((item: any) => ({
      productId: item.productId,
      variantId: item.variantId,
      sizeId: item.sizeId,
      productSlug: item.productSlug,
      variantSlug: item.variantSlug,
      sku: item.sku,
      name: item.name,
      image: item.image,
      size: item.size,
      price: Number(item.price),
      quantity: Number(item.quantity),
      // Backend'de bu alanlar var mı kontrol et
      shippingFee: item.shippingFee || 0,
      totalPrice: item.totalPrice || Number(item.price) * Number(item.quantity),
    }));
    
    // Debug
    console.log('Sending cart items:', cartItems);
    
    const orderData = {
      shippingAddressId: selectedAddressId,
      paymentMethod,
      shippingMethod,
      note,
      cartItems // Doğru formatta gönder
    };
    
    const response = await fetch('/api/oneshop/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to place order');
    }
    
    if (paymentMethod !== 'card') {
      useCartStore.getState().clearCart();
    }
    
    if (paymentMethod === 'cod' || paymentMethod === 'upi') {
      set({ step: 4, isLoading: false });
    }
    
    return { 
      success: true, 
      order: data.order,
      paymentUrl: data.paymentUrl,
      sessionId: data.sessionId
    };
  } catch (error: any) {
    const errorMsg = error.message || 'Failed to place order';
    set({ error: errorMsg, isLoading: false });
    return { success: false, error: errorMsg };
  }
},



  // Reset
  resetCheckout: () => {
    set({
      step: 1,
      selectedAddressId: null,
      paymentMethod: null,
      shippingMethod: "standard",
      note: "",
      error: null,
    });
  },
}));
