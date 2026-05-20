import type { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com/products";

export const LIMIT = 10;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function fetchProducts(
  searchTerm: string,
  page = 1,
): Promise<ProductsResponse> {
  await delay(300);

  const trimmedTerm = searchTerm.trim();
  const skip = (page - 1) * LIMIT;

  const url = trimmedTerm
    ? `${BASE_URL}/search?q=${encodeURIComponent(trimmedTerm)}&limit=${LIMIT}&skip=${skip}`
    : `${BASE_URL}?limit=${LIMIT}&skip=${skip}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed. Status: ${response.status}`);
  }

  return response.json() as Promise<ProductsResponse>;
}
export async function fetchProductById(id: string): Promise<Product> {
  await delay(300);

  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Request failed. Status: ${response.status}`);
  }

  return response.json() as Promise<Product>;
}
