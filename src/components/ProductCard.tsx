import Image from "next/image";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

import ProductSelectCheckbox from "./ProductSelectCheckbox";

interface ProductCardProps {
  product: Product;
  currentPage: number;
  searchTerm: string;
  locale: Locale;
}

function getProductQuery(
  productId: number,
  currentPage: number,
  searchTerm: string,
) {
  if (!searchTerm) {
    return {
      page: currentPage,
      productId,
    };
  }

  return {
    page: currentPage,
    query: searchTerm,
    productId,
  };
}

function ProductCard({
  product,
  currentPage,
  searchTerm,
  locale,
}: ProductCardProps) {
  const productHref = {
    pathname: "/",
    query: getProductQuery(product.id, currentPage, searchTerm),
  };

  return (
    <article className="grid grid-cols-[auto_96px_1fr] gap-4 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
      <ProductSelectCheckbox product={product} />

      <Link
        href={productHref}
        locale={locale}
        className="relative h-24 w-24 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <Image
          alt={product.title}
          className="object-contain p-2"
          src={product.thumbnail}
          fill
          sizes="96px"
        />
      </Link>

      <Link href={productHref} locale={locale} className="block">
        <h3 className="font-semibold text-slate-900 transition hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300">
          {product.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {product.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            ${product.price}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {product.category}
          </span>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
