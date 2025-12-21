import { create } from "zustand";

interface SidebarCartStore {
  isCartOpen: boolean;
  /** True if cart was auto-opened (via addItem), false if manually opened */
  shouldAutoClose: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: (value?: boolean) => void;
  /** Open cart with auto-close enabled (used after addItem) */
  openCartWithAutoClose: () => void;
  /** Cancel auto-close (when user interacts with cart) */
  cancelAutoClose: () => void;
}

export const useSidebarCartStore = create<SidebarCartStore>(
  (set, getState) => ({
    isCartOpen: false,
    shouldAutoClose: false,

    openCart: () => set({ isCartOpen: true, shouldAutoClose: false }),

    closeCart: () => set({ isCartOpen: false, shouldAutoClose: false }),

    toggleCart: (value) => {
      const newValue = value ?? !getState().isCartOpen;

      set({ isCartOpen: newValue, shouldAutoClose: false });
    },

    openCartWithAutoClose: () =>
      set({ isCartOpen: true, shouldAutoClose: true }),

    cancelAutoClose: () => set({ shouldAutoClose: false }),
  }),
);

export default useSidebarCartStore;
