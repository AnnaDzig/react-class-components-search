import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/product";

import ProductCard from "./ProductCard";

interface ResultsProps {
  products: Product[];
  currentPage: number;
  searchTerm: string;
  locale: Locale;
  errorMessage?: string;
}

async function Results({
  products,
  currentPage,
  searchTerm,
  locale,
  errorMessage,
}: ResultsProps) {
  const t = await getTranslations("results");

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("title")}
        </h2>

        <div className="flex min-h-40 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="font-medium text-red-700 dark:text-red-300">
            {errorMessage}
          </p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("title")}
        </h2>

        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            {t("empty")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {t("title")}
      </h2>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-[auto_96px_1fr] gap-4 bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white dark:bg-slate-800">
          <p>{t("select")}</p>
          <p>{t("image")}</p>
          <p>{t("product")}</p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentPage={currentPage}
              searchTerm={searchTerm}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Results;
