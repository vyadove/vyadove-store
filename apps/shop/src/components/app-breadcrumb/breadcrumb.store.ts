import type { IconType } from "react-icons";

import { create } from "zustand";

export interface RouteStack {
  name: string;
  path?: string;
  icon?: IconType;
}

interface BreadcrumbStore {
  isBreadCrumbVisible: boolean;
  showHideBreadCrumb: (value?: boolean) => void;

  routeStack: RouteStack[];
}

export const useAppBreadcrumbStore = create<BreadcrumbStore>(
  (set, getState, store) => ({
    isBreadCrumbVisible: false,
    routeStack: [],
    showHideBreadCrumb: (value) =>
      set({ isBreadCrumbVisible: value ?? !getState().isBreadCrumbVisible }),
  }),
);

export default useAppBreadcrumbStore;
