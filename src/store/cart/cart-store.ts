import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartProduct } from '@/interfaces';

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  getSummaryInfo: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };
  addToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      getTotalItems: () => get().cart.reduce((acc, p) => acc + p.quantity, 0),
      getSummaryInfo: () => {
        const { cart } = get();
        const subTotal = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce((acc, p) => acc + p.quantity, 0);

        return { subTotal, tax, total, itemsInCart };
      },
      addToCart: (product: CartProduct) => {
        const { cart } = get();
        const productInCart = cart.some(
          (p) => p.id === product.id && p.size === product.size
        );
        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCart = cart.map((p) => {
          if (p.id === product.id && p.size === product.size) {
            return { ...p, quantity: p.quantity + product.quantity };
          }
          return p;
        });

        set({ cart: updatedCart });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCart = cart.map((p) => {
          if (p.id === product.id && p.size === product.size) {
            return { ...p, quantity };
          }
          return p;
        });

        set({ cart: updatedCart });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (p) => p.id !== product.id || p.size !== product.size
        );

        set({ cart: updatedCart });
      },
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'shopping-cart' }
  )
);
