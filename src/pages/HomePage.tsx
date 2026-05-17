import { useEffect, useRef, useState } from "react";

import { fetchProducts } from "../api/productsApi";
import Results from "../components/Results";
import Search from "../components/Search";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Product } from "../types/product";

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    "searchTerm",
    "",
  );

  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);
  const [lastSearchedTerm, setLastSearchedTerm] = useState(savedSearchTerm);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const initialSearchTerm = useRef(lastSearchedTerm);

  useEffect(() => {
    let shouldIgnoreResult = false;

    const loadInitialProducts = async (): Promise<void> => {
      try {
        const data = await fetchProducts(initialSearchTerm.current);

        if (!shouldIgnoreResult) {
          setProducts(data.products);
        }
      } catch {
        if (!shouldIgnoreResult) {
          setProducts([]);
          setError(
            "Unable to load products. Please check your connection or try again later.",
          );
        }
      } finally {
        if (!shouldIgnoreResult) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialProducts();

    return () => {
      shouldIgnoreResult = true;
    };
  }, []);

  const loadProducts = async (currentSearchTerm: string): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchProducts(currentSearchTerm);

      setProducts(data.products);
    } catch {
      setProducts([]);
      setError(
        "Unable to load products. Please check your connection or try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (): void => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === lastSearchedTerm) {
      return;
    }

    setSavedSearchTerm(trimmedSearchTerm);
    setSearchTerm(trimmedSearchTerm);
    setLastSearchedTerm(trimmedSearchTerm);

    void loadProducts(trimmedSearchTerm);
  };

  return (
    <>
      <Search
        searchTerm={searchTerm}
        isLoading={isLoading}
        onChange={handleSearchChange}
        onSearch={handleSearchSubmit}
      />

      <Results products={products} isLoading={isLoading} error={error} />
    </>
  );
}

export default HomePage;
