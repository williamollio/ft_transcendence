import { create } from "zustand";
import { Dispatch, SetStateAction } from "react";

// describes the shape of the state
interface DrawersStore {
  isLeftOpen: boolean;
  setIsLeftOpen: (lftopen: boolean) => void;
}
// Dispatch<SetStateAction<DrawersStore>>
// allows the TypeScript compiler to infer the correct type of the state
export const useDrawersStore = create<DrawersStore>(
  (set: Dispatch<SetStateAction<DrawersStore>>) => ({
    isLeftOpen: false,
    setIsLeftOpen: (lftopen: boolean) =>
      set((state) => ({ ...state, isLeftOpen: lftopen })),
  })
);
