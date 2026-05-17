import { useEffect, useRef, useState } from "react";

import { fetchProducts } from "./api/productsApi";
import ErrorButton from "./components/ErrorButton";
import Header from "./components/Header";
import Results from "./components/Results";
import Search from "./components/Search";
import type { Product } from "./types/product";

function getSavedSearchTerm(): string {
  return localStorage.getItem("searchTerm") ?? "";
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState(getSavedSearchTerm);
  const [lastSearchedTerm, setLastSearchedTerm] = useState(getSavedSearchTerm);

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

    localStorage.setItem("searchTerm", trimmedSearchTerm);

    setSearchTerm(trimmedSearchTerm);
    setLastSearchedTerm(trimmedSearchTerm);

    void loadProducts(trimmedSearchTerm);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Header />

        <Search
          searchTerm={searchTerm}
          isLoading={isLoading}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />

        <Results products={products} isLoading={isLoading} error={error} />

        <div className="mt-6 flex justify-end">
          <ErrorButton />
        </div>
      </div>
    </main>
  );
}

export default App;
