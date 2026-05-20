import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Results from "../components/Results";
import type { Product } from "../types/product";

const products: Product[] = [
  {
    id: 1,
    title: "iPhone 15",
    description: "Apple smartphone",
  },
  {
    id: 2,
    title: "Samsung Galaxy",
    description: "Android smartphone",
  },
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

  it("renders table headings when products are provided", () => {
    renderResults({ products });

    expect(screen.getByText(/item name/i)).toBeInTheDocument();
    expect(screen.getByText(/item description/i)).toBeInTheDocument();
  });

  it("renders all product titles and descriptions", () => {
    renderResults({ products });

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();

    expect(screen.getByText("Samsung Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Android smartphone")).toBeInTheDocument();
  });

  it("calls onProductClick with product id when product is clicked", () => {
    const onProductClick = vi.fn();

    renderResults({ products, onProductClick });

    screen.getByRole("button", { name: /iphone 15 apple smartphone/i }).click();

    expect(onProductClick).toHaveBeenCalledWith(1);
    expect(onProductClick).toHaveBeenCalledTimes(1);
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
