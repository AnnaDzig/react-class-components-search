import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Results from "../components/Results";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import type { Product } from "../types/product";
import { createMockProduct } from "./test-utils/mockProduct";

const products = [
  createMockProduct({
    id: 1,
    title: "iPhone 15",
    description: "Apple smartphone",
  }),
  createMockProduct({
    id: 2,
    title: "Samsung Galaxy",
    description: "Android smartphone",
    thumbnail: "https://example.com/samsung.png",
  }),
];

function renderResults({
  products = [],
  isLoading = false,
  error = "",
  onProductClick = vi.fn(),
}: {
  products?: Product[];
  isLoading?: boolean;
  error?: string;
  onProductClick?: (productId: number) => void;
}) {
  return render(
    <Results
      products={products}
      isLoading={isLoading}
      error={error}
      onProductClick={onProductClick}
    />,
  );
}

describe("Results", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({
      selectedItems: [],
    });
  });

  it("renders the Results heading", () => {
    renderResults({});

    expect(
      screen.getByRole("heading", { name: /results/i }),
    ).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    renderResults({ isLoading: true });

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    renderResults({
      error: "Request failed. Status: 500",
    });

    expect(screen.getByText("Request failed. Status: 500")).toBeInTheDocument();
  });

  it("shows no products message when product list is empty", () => {
    renderResults({});

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders list headings when products are provided", () => {
    renderResults({ products });

    expect(screen.getByText(/select/i)).toBeInTheDocument();
    expect(screen.getByText(/image/i)).toBeInTheDocument();
    expect(screen.getByText(/product/i)).toBeInTheDocument();
  });

  it("renders all product titles and descriptions", () => {
    renderResults({ products });

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();

    expect(screen.getByText("Samsung Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Android smartphone")).toBeInTheDocument();
  });

  it("renders product images", () => {
    renderResults({ products });

    expect(screen.getByAltText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByAltText("Samsung Galaxy")).toBeInTheDocument();
  });

  it("calls onProductClick with product id when product card is clicked", async () => {
    const user = userEvent.setup();
    const onProductClick = vi.fn();

    renderResults({ products, onProductClick });

    await user.click(screen.getByRole("button", { name: /iphone 15/i }));

    expect(onProductClick).toHaveBeenCalledWith(1);
    expect(onProductClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onProductClick when product checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onProductClick = vi.fn();

    renderResults({ products, onProductClick });

    await user.click(
      screen.getByRole("checkbox", { name: /select iphone 15/i }),
    );

    expect(onProductClick).not.toHaveBeenCalled();
    expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);
  });

  it("prioritizes loading state over error and products", () => {
    renderResults({
      products,
      isLoading: true,
      error: "Something went wrong",
    });

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    expect(screen.queryByText("iPhone 15")).not.toBeInTheDocument();
  });

  it("prioritizes error state over empty products message", () => {
    renderResults({
      error: "Something went wrong",
    });

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText(/no products found/i)).not.toBeInTheDocument();
  });
});
