import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProducts } from "../api/productsApi";
import type { ProductsResponse } from "../types/product";

const mockProductsResponse: ProductsResponse = {
  products: [
    {
      id: 1,
      title: "iPhone",
      description: "Apple phone",
    },
  ],
  total: 1,
  skip: 0,
  limit: 10,
};

describe("fetchProducts", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("fetches products with default URL when search term is empty", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockProductsResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const resultPromise = fetchProducts("");

    await vi.advanceTimersByTimeAsync(300);

    const result = await resultPromise;

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=10&skip=0",
    );
    expect(result).toEqual(mockProductsResponse);
  });

  it("fetches products with default URL when search term contains only spaces", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockProductsResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const resultPromise = fetchProducts("   ");

    await vi.advanceTimersByTimeAsync(300);

    const result = await resultPromise;

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=10&skip=0",
    );
    expect(result).toEqual(mockProductsResponse);
  });

  it("trims and encodes search term before calling API", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockProductsResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const resultPromise = fetchProducts("  samsung phone  ");

    await vi.advanceTimersByTimeAsync(300);

    const result = await resultPromise;

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=samsung%20phone&limit=10&skip=0",
    );
    expect(result).toEqual(mockProductsResponse);
  });

  it("encodes special characters in search term", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockProductsResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const resultPromise = fetchProducts("phone & tablet");

    await vi.advanceTimersByTimeAsync(300);

    await resultPromise;

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=phone%20%26%20tablet&limit=10&skip=0",
    );
  });

  it("throws an error when API response is not ok", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    const resultPromise = fetchProducts("phone");

    const expectation = expect(resultPromise).rejects.toThrow(
      "Request failed. Status: 500",
    );

    await vi.advanceTimersByTimeAsync(300);

    await expectation;
  });
  it("fetches products with correct skip value for page 2", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        total: 100,
        skip: 10,
        limit: 10,
      }),
    } as Response);

    const resultPromise = fetchProducts("", 2);

    await vi.runAllTimersAsync();
    await resultPromise;

    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=10&skip=10",
    );
  });
  it("fetches searched products with correct skip value for page 3", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        total: 100,
        skip: 20,
        limit: 10,
      }),
    } as Response);

    const resultPromise = fetchProducts("phone", 3);

    await vi.runAllTimersAsync();
    await resultPromise;

    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=phone&limit=10&skip=20",
    );
  });
});
