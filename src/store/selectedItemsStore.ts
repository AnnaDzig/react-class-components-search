import { create } from "zustand";

import type { Product } from "../types/product";

interface SelectedItemsState {
  selectedItems: Product[];
  toggleSelectedItem: (product: Product) => void;
  clearSelectedItems: () => void;
  isItemSelected: (productId: number) => boolean;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  selectedItems: [],

  toggleSelectedItem: (product) => {
    const isSelected = get().selectedItems.some(
      (item) => item.id === product.id,
    );

    if (isSelected) {
      set((state) => ({
        selectedItems: state.selectedItems.filter(
          (item) => item.id !== product.id,
        ),
      }));

      return;
    }

    set((state) => ({
      selectedItems: [...state.selectedItems, product],
    }));
  },

  clearSelectedItems: () => {
    set({ selectedItems: [] });
  },

  isItemSelected: (productId) => {
    return get().selectedItems.some((item) => item.id === productId);
  },
}));
