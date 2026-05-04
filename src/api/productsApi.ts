import type { ProductsResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com/products';
const LIMIT = 10;
function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export async function fetchProducts(
  searchTerm: string
): Promise<ProductsResponse> {
  await delay(300);

  const trimmedTerm = searchTerm.trim();

  const url = trimmedTerm
    ? `${BASE_URL}/search?q=${encodeURIComponent(trimmedTerm)}&limit=${LIMIT}&skip=0`
    : `${BASE_URL}?limit=${LIMIT}&skip=0`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed. Status: ${response.status}`);
  }

  return response.json() as Promise<ProductsResponse>;
}
