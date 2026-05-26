import { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

import { LIMIT } from "../api/productsApi";
import Pagination from "../components/Pagination";
import Results from "../components/Results";
import Search from "../components/Search";
import { useProductsStore } from "../store/productsStore";

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

  const products = useProductsStore((state) => state.products);
  const totalProducts = useProductsStore((state) => state.totalProducts);
  const isLoading = useProductsStore((state) => state.isLoading);
  const error = useProductsStore((state) => state.error);

  const searchTerm = useProductsStore((state) => state.searchTerm);
  const lastSearchedTerm = useProductsStore((state) => state.lastSearchedTerm);

  const setSearchTerm = useProductsStore((state) => state.setSearchTerm);
  const setLastSearchedTerm = useProductsStore(
    (state) => state.setLastSearchedTerm,
  );
  const loadProducts = useProductsStore((state) => state.loadProducts);

  const totalPages = Math.ceil(totalProducts / LIMIT);

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" }, { replace: true });
      return;
    }

    void loadProducts(lastSearchedTerm, currentPage);
  }, [
    currentPage,
    lastSearchedTerm,
    loadProducts,
    searchParams,
    setSearchParams,
  ]);

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (): void => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === lastSearchedTerm && currentPage === 1) {
      return;
    }

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <Search
          searchTerm={searchTerm}
          isLoading={isLoading}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />

        <Results
          products={products}
          isLoading={isLoading}
          error={error}
          onProductClick={handleProductClick}
        />

        {!isLoading && products.length > 0 && (
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
