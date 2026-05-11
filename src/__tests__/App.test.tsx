import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchProducts } from "../api/productsApi";
const mockProductsResponse = {
  products: [
    {
      id: 1,
      title: "iPhone",
      description: "Apple phone",
      price: 999,
      discountPercentage: 10,
      rating: 4.5,
      stock: 20,
      brand: "Apple",
      category: "smartphones",
      thumbnail: "iphone.jpg",
      images: ["iphone.jpg"],
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

    await vi.advanceTimersByTimeAsync(300);

    await expect(resultPromise).rejects.toThrow("Request failed. Status: 500");
  });
});
