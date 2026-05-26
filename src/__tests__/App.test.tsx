import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProductsStore } from "../store/productsStore";
import { fetchProductById, fetchProducts } from "../api/productsApi";
import HomePage from "../pages/HomePage";
import ProductDetails from "../pages/ProductDetails";
import type { Product, ProductsResponse } from "../types/product";
import { createMockProduct } from "./test-utils/mockProduct";

vi.mock("../api/productsApi", () => ({
  LIMIT: 10,
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);
const mockedFetchProductById = vi.mocked(fetchProductById);

const mockProductsResponse: ProductsResponse = {
  products: [createMockProduct()],
  total: 1,
  skip: 0,
  limit: 10,
};

const emptyProductsResponse: ProductsResponse = {
  products: [],
  total: 0,
  skip: 0,
  limit: 10,
};

const mockProductDetails: Product = createMockProduct({
  description: "Apple smartphone details",
});

function renderHomePage(initialRoute = "/?page=1") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route index element={<HomePage />} />

        <Route path="products/:productId" element={<HomePage />}>
          <Route index element={<ProductDetails />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

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
  });

  it("renders the page and loads products on mount", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    renderHomePage();

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 1);
    });

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });

  it("uses saved search term from store on mount", async () => {
    useProductsStore.setState({
      searchTerm: "phone",
      lastSearchedTerm: "phone",
    });

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    renderHomePage();

    expect(screen.getByRole("textbox")).toHaveValue("phone");

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("phone", 1);
    });
  });

  it("shows an error message when loading products fails", async () => {
    mockedFetchProducts.mockRejectedValueOnce(new Error("Network error"));

    renderHomePage();

    expect(
      await screen.findByText(
        /unable to load products. please check your connection or try again later/i,
      ),
    ).toBeInTheDocument();
  });

  it("saves trimmed search term and loads products when user clicks search", async () => {
    const user = userEvent.setup();

    mockedFetchProducts.mockResolvedValueOnce(emptyProductsResponse);

    mockedFetchProducts.mockResolvedValueOnce({
      products: [
        createMockProduct({
          id: 2,
          title: "MacBook Pro",
          description: "Apple laptop",
          thumbnail: "https://example.com/macbook.png",
        }),
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^search$/i }),
      ).not.toBeDisabled();
    });

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /^search$/i });

    await user.clear(input);
    await user.type(input, "  macbook  ");
    await user.click(button);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("macbook", 1);
    });

    expect(localStorage.getItem("searchTerm")).toBe("macbook");
    expect(screen.getByRole("textbox")).toHaveValue("macbook");
    expect(await screen.findByText("MacBook Pro")).toBeInTheDocument();
  });

  it("does not search again when search term is the same as last searched term", async () => {
    const user = userEvent.setup();

    useProductsStore.setState({
      searchTerm: "phone",
      lastSearchedTerm: "phone",
    });

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    renderHomePage();

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
      expect(mockedFetchProducts).toHaveBeenCalledWith("phone", 1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^search$/i }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
  });

  it("loads products for the page from the URL", async () => {
    mockedFetchProducts.mockResolvedValueOnce({
      products: [
        createMockProduct({
          id: 11,
          title: "Product from page 2",
          description: "Second page product",
          thumbnail: "https://example.com/page-2.png",
        }),
      ],
      total: 30,
      skip: 10,
      limit: 10,
    });

    renderHomePage("/?page=2");

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 2);
    });

    expect(await screen.findByText("Product from page 2")).toBeInTheDocument();
  });

  it("opens product details when product details route is visited", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);
    mockedFetchProductById.mockResolvedValueOnce(mockProductDetails);

    renderHomePage("/products/1?page=1");

    expect(await screen.findByText("Apple smartphone")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchProductById).toHaveBeenCalledWith("1");
    });

    expect(
      await screen.findByRole("heading", { name: /product details/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Apple smartphone details")).toBeInTheDocument();
    expect(screen.getAllByText("iPhone 15").length).toBeGreaterThanOrEqual(2);
  });

  it("closes product details when close button is clicked", async () => {
    const user = userEvent.setup();

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);
    mockedFetchProductById.mockResolvedValueOnce(mockProductDetails);

    renderHomePage("/products/1?page=1");

    expect(
      await screen.findByRole("heading", { name: /product details/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /product details/i }),
      ).not.toBeInTheDocument();
    });

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });
  it("uses page 1 when URL page value is invalid", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    renderHomePage("/?page=invalid");

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 1);
    });

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
  });
  it("loads next page when Next pagination button is clicked", async () => {
    const user = userEvent.setup();

    mockedFetchProducts.mockResolvedValueOnce({
      products: [createMockProduct()],
      total: 30,
      skip: 0,
      limit: 10,
    });

    mockedFetchProducts.mockResolvedValueOnce({
      products: [
        createMockProduct({
          id: 11,
          title: "Product from next page",
          description: "Next page product",
          thumbnail: "https://example.com/next-page.png",
        }),
      ],
      total: 30,
      skip: 10,
      limit: 10,
    });

    renderHomePage("/?page=1");

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 2);
    });

    expect(
      await screen.findByText("Product from next page"),
    ).toBeInTheDocument();
  });
  it("opens product details when product card is clicked", async () => {
    const user = userEvent.setup();

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);
    mockedFetchProductById.mockResolvedValueOnce(mockProductDetails);

    renderHomePage("/?page=1");

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /iphone 15/i }));

    await waitFor(() => {
      expect(mockedFetchProductById).toHaveBeenCalledWith("1");
    });

    expect(
      await screen.findByRole("heading", { name: /product details/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Apple smartphone details")).toBeInTheDocument();
  });
  it("adds page 1 to the URL when page search param is missing", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    renderHomePage("/");

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 1);
    });

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
  });
});
