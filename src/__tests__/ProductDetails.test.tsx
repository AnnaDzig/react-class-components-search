import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProductById } from "../api/productsApi";
import ProductDetails from "../pages/ProductDetails";
import { createMockProduct } from "./test-utils/mockProduct";

vi.mock("../api/productsApi", () => ({
  fetchProductById: vi.fn(),
}));

const mockedFetchProductById = vi.mocked(fetchProductById);

function DetailsLayout() {
  return <Outlet context={{ onClose: vi.fn() }} />;
}

function renderProductDetails(initialRoute = "/products/1") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<DetailsLayout />}>
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/products" element={<ProductDetails />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProductDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and renders product details", async () => {
    mockedFetchProductById.mockResolvedValueOnce(
      createMockProduct({
        description: "Detailed product description",
        reviews: [
          {
            rating: 5,
            comment: "Excellent product!",
            date: "2025-04-30T09:41:02.053Z",
            reviewerName: "Anna Tester",
            reviewerEmail: "anna@example.com",
          },
        ],
      }),
    );

    renderProductDetails();

    expect(screen.getByText(/loading details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchProductById).toHaveBeenCalledWith("1");
    });

    expect(
      await screen.findByRole("heading", { name: /product details/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(
      screen.getByText("Detailed product description"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Excellent product!")).toBeInTheDocument();
    expect(screen.getByText("Anna Tester")).toBeInTheDocument();
  });

  it("renders error message when product details loading fails", async () => {
    mockedFetchProductById.mockRejectedValueOnce(new Error("Request failed"));

    renderProductDetails();

    expect(
      await screen.findByText(/unable to load product details/i),
    ).toBeInTheDocument();
  });

  it("does not fetch product details when productId is missing", () => {
    renderProductDetails("/products");

    expect(mockedFetchProductById).not.toHaveBeenCalled();
  });

  it("renders fallback text when product has no brand", async () => {
    mockedFetchProductById.mockResolvedValueOnce(
      createMockProduct({
        brand: undefined,
      }),
    );

    renderProductDetails();

    expect(await screen.findByText("No brand")).toBeInTheDocument();
  });
});
