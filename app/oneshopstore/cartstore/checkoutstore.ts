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
  paymentMethod: "card" | "paypal" | "cod" | "upi" | null;
  shippingMethod: "standard" | "express";
  note: string;
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  shippingFee: number;
  estimatedDeliveryDays: {
    min: number;
    max: number;
  };
  shippingService: string;
  calculatedShipping: boolean;
  isProcessingPayment: boolean;

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

  setPaymentMethod: (method: "card" | "paypal" | "cod" | "upi") => void;
  setShippingMethod: (method: "standard" | "express") => void;
  setNote: (note: string) => void;

  calculateShippingFee: (
    cartItems: any[],
    countryId: string,
    storeId?: string
  ) => Promise<void>;
  setShippingFee: (fee: number) => void;
  setEstimatedDeliveryDays: (days: { min: number; max: number }) => void;
  setShippingService: (service: string) => void;
  resetShipping: () => void;

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
  shippingFee: 0,
  estimatedDeliveryDays: { min: 7, max: 31 },
  shippingService: "Standard Delivery",
  calculatedShipping: false,
  isProcessingPayment: false, // Yeni ekle

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

      // Step 2 validation - payment method
      if (step === 2 && !get().paymentMethod) {
        set({ error: "Please select a payment method" });
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

  setSelectedAddress: (id) => {
    set({ selectedAddressId: id });

    // Adres değiştiğinde shipping fee hesapla
    const { cart } = useCartStore.getState();
    const { shippingAddresses, calculateShippingFee } = get();

    const selectedAddress = shippingAddresses.find((addr) => addr.id === id);
    if (selectedAddress && selectedAddress.countryId && cart.length > 0) {
      calculateShippingFee(
        cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: item.price,
        })),
        selectedAddress.countryId
      );
    }
  },

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

  // Shipping fee calculation
  calculateShippingFee: async (cartItems, countryId, storeId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/oneshop/checkout/calculateshipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          countryId,
          storeId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to calculate shipping fee");
      }

      const data = await response.json();

      useCartStore.getState().setShippingFee(data.shippingFee);

      set({
        shippingFee: data.shippingFee,
        estimatedDeliveryDays: data.estimatedDeliveryDays,
        shippingService: data.shippingService,
        calculatedShipping: true,
        isLoading: false,
      });

      return data.shippingFee;
    } catch (error: any) {
      // Hata durumunda default değerleri kullan
      set({
        error: error.message || "Failed to calculate shipping fee",
        isLoading: false,
        calculatedShipping: false,
        shippingFee: get().shippingMethod === "express" ? 9.99 : 0,
      });
      return 0;
    }
  },

  setShippingFee: (fee) => set({ shippingFee: fee }),
  setEstimatedDeliveryDays: (days) => set({ estimatedDeliveryDays: days }),
  setShippingService: (service) => set({ shippingService: service }),
  resetShipping: () =>
    set({
      shippingFee: 0,
      estimatedDeliveryDays: { min: 7, max: 31 },
      shippingService: "Standard Delivery",
      calculatedShipping: false,
    }),

  // Payment and shipping actions
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setShippingMethod: (method) =>
    set({
      shippingMethod: method,
      // Express shipping seçildiyse ekstra ücret ekle
      shippingFee:
        method === "express" ? get().shippingFee + 9.99 : get().shippingFee,
    }),
  setNote: (note) => set({ note }),

  // Order placement with Stripe

  placeOrder: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        selectedAddressId,
        paymentMethod,
        shippingMethod,
        note,
        shippingFee,
        calculatedShipping,
      } = get();

      if (!selectedAddressId)
        throw new Error("Please select a shipping address");
      if (!paymentMethod) throw new Error("Please select a payment method");

      // Get cart directly
      const { cart, appliedCoupon, totalPrice } = useCartStore.getState();

      if (!cart || cart.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Format cart items
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
        shippingFee: item.shippingFee || 0,
        totalPrice: totalPrice,
      }));

      // Calculate shipping
      let finalShippingFee = shippingFee;
      if (!calculatedShipping || shippingFee === 0) {
        finalShippingFee = shippingMethod === "express" ? 9.99 : 0;
      }

      // Calculate total
      const subTotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const discountAmount = appliedCoupon?.discountAmount || 0;
      const total = totalPrice;

      const orderData = {
        shippingAddressId: selectedAddressId,
        paymentMethod,
        shippingMethod,
        note,
        shippingFee: finalShippingFee,
        total,
        discountAmount,
        cartItems,
        appliedCoupon: appliedCoupon || null,
      };

      console.log("Order Data:", orderData);

      // Send order to backend
      const response = await fetch("/api/oneshop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // TÜM ÖDEME YÖNTEMLERİ İÇİN CART'I TEMİZLE
      // Backend cart'ını temizle (API çağrısı gerekiyorsa)
      try {
        await fetch("/api/oneshop/cart", {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to clear backend cart:", error);
        // Backend cart temizleme hatasında bile devam et
      }

      // Frontend cart'ı temizle
      useCartStore.getState().clearCart();

      // Ödeme yöntemine göre yönlendirme
      if (paymentMethod === "card" || paymentMethod === "paypal") {
        // Stripe veya PayPal ödeme sayfasına yönlendir
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
          return;
        } else {
          throw new Error("No payment URL received");
        }
      } else {
        // COD veya UPI için success sayfasına git
        set({ step: 3, isLoading: false });
        return {
          success: true,
          order: data.order,
          message: "Order placed successfully!",
        };
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to place order";
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
      shippingFee: 0,
      estimatedDeliveryDays: { min: 7, max: 31 },
      shippingService: "Standard Delivery",
      calculatedShipping: false,
    });
  },
}));
