import { create } from "zustand";

interface State {
  showTopNav: boolean;
  defaultValue?: boolean;
}

interface Setters {
  setShowTopNav: (value: boolean) => void;
  setDefaultValue: (value?: boolean) => void;

  // generic all setter
  setState: (state: State) => void;
}

export const useNavStore = create<State & Setters>((set) => ({
  showTopNav: false,
  setShowTopNav: (value: boolean) => set({ showTopNav: value }),
  setDefaultValue: (value?: boolean) => set({ defaultValue: value }),

  setState: (state: State) => set(state),
}));

export default useNavStore;
