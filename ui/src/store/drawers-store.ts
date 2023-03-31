import { create } from "zustand";
import { Dispatch, SetStateAction } from "react";

// describes the shape of the state
interface DrawersStore {
  isRightOpen: boolean;
  setIsRightOpen: (rghtopen: boolean) => void;
}
// Dispatch<SetStateAction<DrawersStore>>
// allows the TypeScript compiler to infer the correct type of the state
export const useDrawersStore = create<DrawersStore>(
  (set: Dispatch<SetStateAction<DrawersStore>>) => ({
    isRightOpen: false,
    setIsRightOpen: (rghtopen: boolean) =>
      set((state) => ({ ...state, isRightOpen: rghtopen })),
  })
);
