import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { productQueryKeys } from "../api/queryKeys";
import { LIMIT } from "../api/productsApi";
import Pagination from "../components/Pagination";
import Results from "../components/Results";
import Search from "../components/Search";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useProductsQuery } from "../hooks/useProductsQuery";

function getValidPage(value: string | null): number {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = getValidPage(searchParams.get("page"));

  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage(
    "searchTerm",
    "",
  );

  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);
  const [lastSearchedTerm, setLastSearchedTerm] = useState(savedSearchTerm);

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data, isLoading, isFetching, isError } = useProductsQuery(
    lastSearchedTerm,
    currentPage,
  );

  const products = data?.products ?? [];
  const totalProducts = data?.total ?? 0;
  const totalPages = Math.ceil(totalProducts / LIMIT);

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
  };

  const handlePageChange = (page: number): void => {
    navigate(`/?page=${page}`);
  };

  const handleProductClick = (productId: number): void => {
    navigate(`/products/${productId}?page=${currentPage}`);
  };

  const handleCloseDetails = (): void => {
    navigate(`/?page=${currentPage}`);
  };

  const handleRefreshProducts = async (): Promise<void> => {
    await queryClient.invalidateQueries({
      queryKey: productQueryKeys.list(lastSearchedTerm, currentPage),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <Search
              searchTerm={searchTerm}
              isLoading={isFetching}
              onChange={handleSearchChange}
              onSearch={handleSearchSubmit}
            />
          </div>

          <button
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={isFetching}
            type="button"
            onClick={handleRefreshProducts}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {isFetching && !isLoading && (
          <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            Updating products...
          </p>
        )}

        <Results
          products={products}
          isLoading={isLoading}
          error={
            isError
              ? "Unable to load products. Please check your connection or try again later."
              : ""
          }
          onProductClick={handleProductClick}
        />

        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Outlet context={{ onClose: handleCloseDetails }} />
    </div>
  );
}

export default HomePage;
