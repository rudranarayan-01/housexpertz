// Create this file at: store/cart.store.ts
import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  variantTitle: string | null;
  price: number;
  image: string;
  category: string;
}

interface CartState {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addItem: (newItem) =>
    set((state) => {
      // Check if item with exact same variant is already added
      const exists = state.cartItems.some(
        (item) =>
          item.id === newItem.id && item.variantTitle === newItem.variantTitle,
      );
      if (exists) return state;
      return { cartItems: [...state.cartItems, newItem] };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cartItems: [] }),

  getSubtotal: () => {
    return get().cartItems.reduce((sum, item) => sum + item.price, 0);
  },

  getTax: () => {
    return Math.round(get().getSubtotal() * 0.18); // 18% GST baseline
  },

  getTotalAmount: () => {
    return get().getSubtotal() + get().getTax();
  },
}));
