import { create } from "zustand";

interface BreadcrumbStore {
  isBreadCrumbVisible: boolean;
  showHideBreadCrumb: (value?: boolean) => void;
  // links: Link[];
}

export const useSidebarCartStore = create<BreadcrumbStore>(
  (set, getState, store) => ({
    isBreadCrumbVisible: false,
    showHideBreadCrumb: (value) =>
      set({ isBreadCrumbVisible: value ?? !getState().isBreadCrumbVisible }),
  }),
);

export default useSidebarCartStore;
