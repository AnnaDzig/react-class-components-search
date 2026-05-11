import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "../App";
import { fetchProducts } from "../api/productsApi";
import type { ProductsResponse } from "../types/product";

vi.mock("../api/productsApi", () => ({
  fetchProducts: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);

const mockProductsResponse: ProductsResponse = {
  products: [
    {
      id: 1,
      title: "iPhone 15",
      description: "Apple smartphone",
    },
  ],
  total: 1,
  skip: 0,
  limit: 10,
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders the app and loads products on mount", async () => {
    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /product search app/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("");
    });

    expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });

  it("uses saved search term from localStorage on mount", async () => {
    localStorage.setItem("searchTerm", "phone");

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    render(<App />);

    expect(screen.getByRole("textbox")).toHaveValue("phone");

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("phone");
    });
  });

  it("shows an error message when loading products fails", async () => {
    mockedFetchProducts.mockRejectedValueOnce(new Error("Network error"));

    render(<App />);

    expect(
      await screen.findByText(
        /unable to load products. please check your connection or try again later/i,
      ),
    ).toBeInTheDocument();
  });
  it("saves trimmed search term and loads products when user clicks search", async () => {
    const user = userEvent.setup();

    mockedFetchProducts.mockResolvedValueOnce({
      products: [],
      total: 0,
      skip: 0,
      limit: 10,
    });

    mockedFetchProducts.mockResolvedValueOnce({
      products: [
        {
          id: 2,
          title: "MacBook Pro",
          description: "Apple laptop",
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^search$/i }),
      ).not.toBeDisabled();
    });

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /^search$/i });

    await user.type(input, "  macbook  ");
    await user.click(button);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("macbook");
    });

    expect(localStorage.getItem("searchTerm")).toBe("macbook");
    expect(screen.getByRole("textbox")).toHaveValue("macbook");
    expect(await screen.findByText("MacBook Pro")).toBeInTheDocument();
  });
  it("does not search again when search term is the same as last searched term", async () => {
    const user = userEvent.setup();

    localStorage.setItem("searchTerm", "phone");

    mockedFetchProducts.mockResolvedValueOnce(mockProductsResponse);

    render(<App />);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
      expect(mockedFetchProducts).toHaveBeenCalledWith("phone");
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^search$/i }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("searchTerm")).toBe("phone");
  });
});
