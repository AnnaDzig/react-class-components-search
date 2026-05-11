import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

describe("Results", () => {
  it("renders the Results heading", () => {
    render(<Results products={[]} isLoading={false} error="" />);

    expect(
      screen.getByRole("heading", { name: /results/i }),
    ).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<Results products={[]} isLoading={true} error="" />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    render(
      <Results
        products={[]}
        isLoading={false}
        error="Request failed. Status: 500"
      />,
    );

    expect(screen.getByText("Request failed. Status: 500")).toBeInTheDocument();
  });

  it("shows no products message when product list is empty", () => {
    render(<Results products={[]} isLoading={false} error="" />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders table headings when products are provided", () => {
    render(<Results products={products} isLoading={false} error="" />);

    expect(screen.getByText(/item name/i)).toBeInTheDocument();
    expect(screen.getByText(/item description/i)).toBeInTheDocument();
  });

  it("renders all product titles and descriptions", () => {
    render(<Results products={products} isLoading={false} error="" />);

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();

    expect(screen.getByText("Samsung Galaxy")).toBeInTheDocument();
    expect(screen.getByText("Android smartphone")).toBeInTheDocument();
  });

  it("prioritizes loading state over error and products", () => {
    render(
      <Results
        products={products}
        isLoading={true}
        error="Something went wrong"
      />,
    );

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    expect(screen.queryByText("iPhone 15")).not.toBeInTheDocument();
  });

  it("prioritizes error state over empty products message", () => {
    render(
      <Results products={[]} isLoading={false} error="Something went wrong" />,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText(/no products found/i)).not.toBeInTheDocument();
  });
});
