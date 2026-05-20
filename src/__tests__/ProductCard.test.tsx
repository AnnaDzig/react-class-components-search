import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

const product: Product = {
  id: 1,
  title: "iPhone 15",
  description: "Apple smartphone",
};

describe("ProductCard", () => {
  it("renders product title and description", () => {
    render(<ProductCard product={product} onClick={vi.fn()} />);

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });

  it("calls onClick when product card is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    await user.click(
      screen.getByRole("button", { name: /iphone 15 apple smartphone/i }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
