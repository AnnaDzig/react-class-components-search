import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProducts } from "../api/productsApi";
import HomePage from "../pages/HomePage";
import type { ProductsResponse } from "../types/product";

vi.mock("../api/productsApi", () => ({
  LIMIT: 10,
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

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/?page=1"]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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

  it("uses saved search term from localStorage on mount", async () => {
    localStorage.setItem("searchTerm", "phone");

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

    localStorage.setItem("searchTerm", "phone");

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
    expect(localStorage.getItem("searchTerm")).toBe("phone");
  });
});
