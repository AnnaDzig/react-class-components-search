import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { fetchProductById } from "@/api/productsApi";
import { Link } from "@/i18n/navigation";

interface ProductDetailsProps {
  productId: string | undefined;
  currentPage: number;
  searchTerm: string;
}

function getCloseQuery(currentPage: number, searchTerm: string) {
  if (!searchTerm) {
    return { page: currentPage };
  }

  return {
    page: currentPage,
    query: searchTerm,
  };
}

export default async function ProductDetails({
  productId,
  currentPage,
  searchTerm,
}: ProductDetailsProps) {
  const t = await getTranslations("details");

  if (!productId) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("panel")}
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("title")}
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300">{t("empty")}</p>
      </aside>
    );
  }

  let product;

  try {
    product = await fetchProductById(productId);
  } catch {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t("panel")}
            </p>

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {t("title")}
            </h2>
          </div>

          <Link
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            href={{
              pathname: "/",
              query: getCloseQuery(currentPage, searchTerm),
            }}>
            {t("close")}
          </Link>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="font-medium text-red-700 dark:text-red-300">
            {t("error")}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t("panel")}
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {t("title")}
          </h2>
        </div>

        <Link
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          href={{
            pathname: "/",
            query: getCloseQuery(currentPage, searchTerm),
          }}>
          {t("close")}
        </Link>
      </div>
      <div className="space-y-6">
        <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <Image
            alt={product.title}
            className="object-contain p-6"
            src={product.thumbnail}
            fill
            sizes="360px"
          />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {product.category}
              </p>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {product.title}
              </h3>
            </div>

            <p className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              ${product.price}
            </p>
          </div>

          <p className="leading-6 text-slate-600 dark:text-slate-300">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {t("rating")}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {product.rating}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {t("stock")}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {product.stock}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {t("brand")}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {product.brand ?? t("noBrand")}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {t("availability")}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {product.availabilityStatus}
            </p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t("productId")}
            </dt>
            <dd className="text-slate-600 dark:text-slate-300">{product.id}</dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t("sku")}
            </dt>
            <dd className="text-slate-600 dark:text-slate-300">
              {product.sku}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t("warranty")}
            </dt>
            <dd className="text-slate-600 dark:text-slate-300">
              {product.warrantyInformation}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t("shipping")}
            </dt>
            <dd className="text-slate-600 dark:text-slate-300">
              {product.shippingInformation}
            </dd>
          </div>

          <div>
            <dt className="font-semibold text-slate-900 dark:text-slate-100">
              {t("returnPolicy")}
            </dt>
            <dd className="text-slate-600 dark:text-slate-300">
              {product.returnPolicy}
            </dd>
          </div>
        </dl>

        {product.tags.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
              {t("tags")}
            </h4>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.reviews.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
              {t("reviews")}
            </h4>

            <div className="space-y-3">
              {product.reviews.slice(0, 2).map((review) => (
                <article
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                  key={`${review.reviewerEmail}-${review.comment}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {review.reviewerName}
                    </p>

                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {review.rating}/5
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
