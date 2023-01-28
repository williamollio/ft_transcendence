import { create } from "zustand";
import { Dispatch, SetStateAction } from "react";

// describes the shape of the state
interface ImageStore {
  image: File | Blob |  null;
  setImage: (img: File | Blob) => void;
}
// Dispatch<SetStateAction<ImageStore>>
// allows the TypeScript compiler to infer the correct type of the state
export const useImageStore = create<ImageStore>(
  (set: Dispatch<SetStateAction<ImageStore>>) => ({
    image: null,
    setImage: (img: File | Blob) => set((state) => ({ ...state, image: img })),
  })
);
