import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Course ID
    title: string;
    thumbnail: string;
    instructor_name: string;
    price: number;
    price_formatted: string;
}

interface CartState {
    items: CartItem[];
    appliedCoupon: { code: string; discount_amount: number | string; discount_type: string } | null;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    setAppliedCoupon: (coupon: { code: string; discount_amount: number | string; discount_type: string } | null) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            appliedCoupon: null,
            addItem: (item) => set((state) => {
                // Check if already in cart
                if (state.items.find(i => i.id === item.id)) {
                    return state;
                }
                return { items: [...state.items, item] };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),
            clearCart: () => set({ items: [], appliedCoupon: null }),
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price, 0);
            },
            getTotalItems: () => get().items.length,
            setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
        }),
        {
            name: 'elearning-cart-storage',
        }
    )
);
