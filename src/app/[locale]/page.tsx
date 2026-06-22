import { getTranslations } from "next-intl/server";

import { LIMIT, fetchProducts } from "@/api/productsApi";
import Pagination from "@/components/Pagination";
import ProductDetails from "@/components/ProductDetails";
import Results from "@/components/Results";
import Search from "@/components/Search";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

type HomePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
  searchParams?: Promise<{
    page?: string;
    query?: string;
    productId?: string;
  }>;
};

function getValidPage(value: string | undefined): number {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function getSearchTerm(value: string | undefined): string {
  return value?.trim() ?? "";
}

export default async function HomePage({
  params,
  searchParams,
}: HomePageProps) {
  const { locale } = await params;
  const search = await searchParams;

  const currentPage = getValidPage(search?.page);
  const searchTerm = getSearchTerm(search?.query);
  const productId = search?.productId;

  const tResults = await getTranslations("results");

  let products: Product[] = [];
  let totalPages = 0;
  let errorMessage: string | undefined;

  try {
    const data = await fetchProducts(searchTerm, currentPage);

    products = data.products;
    totalPages = Math.ceil(data.total / LIMIT);
  } catch {
    errorMessage = tResults("error");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <Search searchTerm={searchTerm} />

        <Results
          products={products}
          currentPage={currentPage}
          searchTerm={searchTerm}
          errorMessage={errorMessage}
          locale={locale}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchTerm={searchTerm}
        />
      </div>

      <ProductDetails
        productId={productId}
        currentPage={currentPage}
        searchTerm={searchTerm}
      />
    </div>
  );
}
