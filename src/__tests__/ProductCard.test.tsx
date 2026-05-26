import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProductCard from "../components/ProductCard";
import { useProductsStore } from "../store/productsStore";
import { createMockProduct } from "./test-utils/mockProduct";

const product = createMockProduct();

describe("ProductCard", () => {
  beforeEach(() => {
    useProductsStore.setState({
      selectedItems: [],
    });
  });

  it("renders product title and description", () => {
    render(<ProductCard product={product} onClick={vi.fn()} />);

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });

  it("renders product image and extra product info", () => {
    render(<ProductCard product={product} onClick={vi.fn()} />);

    expect(screen.getByAltText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("smartphones")).toBeInTheDocument();
    expect(screen.getByText("$999")).toBeInTheDocument();
    expect(screen.getByText("Rating: 4.5")).toBeInTheDocument();
    expect(screen.getByText("Stock: 20")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("calls onClick when product card is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    await user.click(screen.getByRole("button", { name: /iphone 15/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed on product card", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    const card = screen.getByRole("button", { name: /iphone 15/i });

    card.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Space key is pressed on product card", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    const card = screen.getByRole("button", { name: /iphone 15/i });

    card.focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when another key is pressed on product card", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    const card = screen.getByRole("button", { name: /iphone 15/i });

    card.focus();
    await user.keyboard("{Escape}");

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("selects product when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ProductCard product={product} onClick={handleClick} />);

    await user.click(
      screen.getByRole("checkbox", { name: /select iphone 15/i }),
    );

    expect(useProductsStore.getState().selectedItems).toEqual([product]);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("unselects product when selected checkbox is clicked again", async () => {
    const user = userEvent.setup();

    render(<ProductCard product={product} onClick={vi.fn()} />);

    const checkbox = screen.getByRole("checkbox", {
      name: /select iphone 15/i,
    });

    await user.click(checkbox);
    expect(useProductsStore.getState().selectedItems).toEqual([product]);

    await user.click(checkbox);
    expect(useProductsStore.getState().selectedItems).toEqual([]);
  });
});
