import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProductById, fetchProducts } from "../api/productsApi";
import { createMockProduct } from "../__tests__/test-utils/mockProduct";
import { useProductsStore } from "../store/productsStore";

vi.mock("../api/productsApi", () => ({
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);
const mockedFetchProductById = vi.mocked(fetchProductById);

const firstProduct = createMockProduct({
  id: 1,
  title: "iPhone 15",
});

const secondProduct = createMockProduct({
  id: 2,
  title: "Samsung Galaxy",
  thumbnail: "https://example.com/samsung.png",
});

function resetProductsStore() {
  useProductsStore.setState({
    products: [],
    totalProducts: 0,
    isLoading: true,
    error: "",

    searchTerm: "",
    lastSearchedTerm: "",

    selectedItems: [],

    selectedProduct: null,
    isDetailsLoading: false,
    detailsError: "",
  });
}

describe("productsStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    resetProductsStore();
  });

  it("sets search term", () => {
    useProductsStore.getState().setSearchTerm("phone");

    expect(useProductsStore.getState().searchTerm).toBe("phone");
  });

  it("sets last searched term and saves it to localStorage", () => {
    useProductsStore.getState().setLastSearchedTerm("laptop");

    expect(useProductsStore.getState().searchTerm).toBe("laptop");
    expect(useProductsStore.getState().lastSearchedTerm).toBe("laptop");
    expect(localStorage.getItem("searchTerm")).toBe("laptop");
  });

  it("loads products successfully", async () => {
    mockedFetchProducts.mockResolvedValueOnce({
      products: [firstProduct, secondProduct],
      total: 2,
      skip: 0,
      limit: 10,
    });

    await useProductsStore.getState().loadProducts("phone", 1);

    expect(mockedFetchProducts).toHaveBeenCalledWith("phone", 1);
    expect(useProductsStore.getState().products).toEqual([
      firstProduct,
      secondProduct,
    ]);
    expect(useProductsStore.getState().totalProducts).toBe(2);
    expect(useProductsStore.getState().error).toBe("");
    expect(useProductsStore.getState().isLoading).toBe(false);
  });

  it("stores error when loading products fails", async () => {
    mockedFetchProducts.mockRejectedValueOnce(new Error("Network error"));

    await useProductsStore.getState().loadProducts("phone", 1);

    expect(mockedFetchProducts).toHaveBeenCalledWith("phone", 1);
    expect(useProductsStore.getState().products).toEqual([]);
    expect(useProductsStore.getState().totalProducts).toBe(0);
    expect(useProductsStore.getState().error).toBe(
      "Unable to load products. Please check your connection or try again later.",
    );
    expect(useProductsStore.getState().isLoading).toBe(false);
  });

  it("loads product details successfully", async () => {
    mockedFetchProductById.mockResolvedValueOnce(firstProduct);

    await useProductsStore.getState().loadProductDetails("1");

    expect(mockedFetchProductById).toHaveBeenCalledWith("1");
    expect(useProductsStore.getState().selectedProduct).toEqual(firstProduct);
    expect(useProductsStore.getState().detailsError).toBe("");
    expect(useProductsStore.getState().isDetailsLoading).toBe(false);
  });

  it("stores error when loading product details fails", async () => {
    mockedFetchProductById.mockRejectedValueOnce(new Error("Request failed"));

    await useProductsStore.getState().loadProductDetails("1");

    expect(mockedFetchProductById).toHaveBeenCalledWith("1");
    expect(useProductsStore.getState().selectedProduct).toBeNull();
    expect(useProductsStore.getState().detailsError).toBe(
      "Unable to load product details.",
    );
    expect(useProductsStore.getState().isDetailsLoading).toBe(false);
  });

  it("clears product details", () => {
    useProductsStore.setState({
      selectedProduct: firstProduct,
      isDetailsLoading: true,
      detailsError: "Some error",
    });

    useProductsStore.getState().clearProductDetails();

    expect(useProductsStore.getState().selectedProduct).toBeNull();
    expect(useProductsStore.getState().isDetailsLoading).toBe(false);
    expect(useProductsStore.getState().detailsError).toBe("");
  });

  it("selects an item", () => {
    useProductsStore.getState().toggleSelectedItem(firstProduct);

    expect(useProductsStore.getState().selectedItems).toEqual([firstProduct]);
  });

  it("unselects an already selected item", () => {
    useProductsStore.getState().toggleSelectedItem(firstProduct);
    useProductsStore.getState().toggleSelectedItem(firstProduct);

    expect(useProductsStore.getState().selectedItems).toEqual([]);
  });

  it("checks whether an item is selected", () => {
    useProductsStore.getState().toggleSelectedItem(firstProduct);

    expect(useProductsStore.getState().isItemSelected(firstProduct.id)).toBe(
      true,
    );
    expect(useProductsStore.getState().isItemSelected(secondProduct.id)).toBe(
      false,
    );
  });

  it("clears selected items", () => {
    useProductsStore.getState().toggleSelectedItem(firstProduct);
    useProductsStore.getState().toggleSelectedItem(secondProduct);

    useProductsStore.getState().clearSelectedItems();

    expect(useProductsStore.getState().selectedItems).toEqual([]);
  });
});
