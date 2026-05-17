import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchProducts, LIMIT } from "../api/productsApi";
import Pagination from "../components/Pagination";
import Results from "../components/Results";
import Search from "../components/Search";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Product } from "../types/product";

function getValidPage(value: string | null): number {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = getValidPage(searchParams.get("page"));

  const [products, setProducts] = useState<Product[]>([]);

  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    "searchTerm",
    "",
  );

  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);
  const [lastSearchedTerm, setLastSearchedTerm] = useState(savedSearchTerm);

  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const initialSearchTerm = useRef(lastSearchedTerm);
  const initialPage = useRef(currentPage);

  const totalPages = Math.ceil(totalProducts / LIMIT);

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" }, { replace: true });
      return;
    }

    let shouldIgnoreResult = false;

    const loadInitialProducts = async (): Promise<void> => {
      try {
        const data = await fetchProducts(
          initialSearchTerm.current,
          initialPage.current,
        );

        if (!shouldIgnoreResult) {
          setProducts(data.products);
          setTotalProducts(data.total);
        }
      } catch {
        if (!shouldIgnoreResult) {
          setProducts([]);
          setTotalProducts(0);
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
  }, [searchParams, setSearchParams]);

  const loadProducts = async (
    currentSearchTerm: string,
    page: number,
  ): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchProducts(currentSearchTerm, page);

      setProducts(data.products);
      setTotalProducts(data.total);
    } catch {
      setProducts([]);
      setTotalProducts(0);
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

    if (trimmedSearchTerm === lastSearchedTerm && currentPage === 1) {
      return;
    }

    setSavedSearchTerm(trimmedSearchTerm);
    setSearchTerm(trimmedSearchTerm);
    setLastSearchedTerm(trimmedSearchTerm);

    navigate("/?page=1");
    void loadProducts(trimmedSearchTerm, 1);
  };

  const handlePageChange = (page: number): void => {
    navigate(`/?page=${page}`);
    void loadProducts(lastSearchedTerm, page);
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

      {!isLoading && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

export default HomePage;
