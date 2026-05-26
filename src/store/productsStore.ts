import { create } from "zustand";

import { fetchProductById, fetchProducts } from "../api/productsApi";
import type { Product } from "../types/product";

interface ProductsStoreState {
  products: Product[];
  totalProducts: number;
  isLoading: boolean;
  error: string;

  searchTerm: string;
  lastSearchedTerm: string;

  selectedItems: Product[];

  selectedProduct: Product | null;
  isDetailsLoading: boolean;
  detailsError: string;

  setSearchTerm: (value: string) => void;
  setLastSearchedTerm: (value: string) => void;

  loadProducts: (searchTerm: string, page: number) => Promise<void>;
  loadProductDetails: (productId: string) => Promise<void>;
  clearProductDetails: () => void;

  toggleSelectedItem: (product: Product) => void;
  clearSelectedItems: () => void;
  isItemSelected: (productId: number) => boolean;
}

const getInitialSearchTerm = (): string => {
  return localStorage.getItem("searchTerm") ?? "";
};

export const useProductsStore = create<ProductsStoreState>((set, get) => ({
  products: [],
  totalProducts: 0,
  isLoading: true,
  error: "",

  searchTerm: getInitialSearchTerm(),
  lastSearchedTerm: getInitialSearchTerm(),

  selectedItems: [],

  selectedProduct: null,
  isDetailsLoading: false,
  detailsError: "",

  setSearchTerm: (value) => {
    set({ searchTerm: value });
  },

  setLastSearchedTerm: (value) => {
    localStorage.setItem("searchTerm", value);

    set({
      searchTerm: value,
      lastSearchedTerm: value,
    });
  },

  loadProducts: async (searchTerm, page) => {
    set({
      isLoading: true,
      error: "",
    });

    try {
      const data = await fetchProducts(searchTerm, page);

      set({
        products: data.products,
        totalProducts: data.total,
        error: "",
      });
    } catch {
      set({
        products: [],
        totalProducts: 0,
        error:
          "Unable to load products. Please check your connection or try again later.",
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  loadProductDetails: async (productId) => {
    set({
      selectedProduct: null,
      isDetailsLoading: true,
      detailsError: "",
    });

    try {
      const product = await fetchProductById(productId);

      set({
        selectedProduct: product,
        detailsError: "",
      });
    } catch {
      set({
        selectedProduct: null,
        detailsError: "Unable to load product details.",
      });
    } finally {
      set({
        isDetailsLoading: false,
      });
    }
  },

  clearProductDetails: () => {
    set({
      selectedProduct: null,
      isDetailsLoading: false,
      detailsError: "",
    });
  },

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
