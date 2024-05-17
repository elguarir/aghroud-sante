import { create } from "zustand";

type SheetStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useSheet = create<SheetStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
