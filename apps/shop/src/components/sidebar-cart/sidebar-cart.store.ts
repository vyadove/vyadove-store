import { create } from "zustand";

interface SidebarCartStore {
  isCartOpen: boolean;
  toggleCart: (value?: boolean) => void;
}

export const useSidebarCartStore = create<SidebarCartStore>(
  (set, getState, store) => ({
    isCartOpen: false,
    toggleCart: (value) => set({ isCartOpen: value ?? !getState().isCartOpen }),
  }),
);

export default useSidebarCartStore;
