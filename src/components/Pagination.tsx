import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchTerm: string;
}

async function Pagination({
  currentPage,
  totalPages,
  searchTerm,
}: PaginationProps) {
  const t = await getTranslations("pagination");

  if (totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, totalPages);

  const getQuery = (page: number) => {
    if (!searchTerm) {
      return { page };
    }

    return {
      query: searchTerm,
      page,
    };
  };

  return (
    <nav className="mt-6 flex items-center justify-center gap-3">
      {currentPage === 1 ? (
        <span className="cursor-not-allowed rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-400 opacity-50 dark:border-slate-600 dark:bg-slate-900">
          {t("previous")}
        </span>
      ) : (
        <Link
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          href={{
            pathname: "/",
            query: getQuery(previousPage),
          }}>
          {t("previous")}
        </Link>
      )}

      <span className="font-medium text-slate-700 dark:text-slate-300">
        {t("page", { currentPage, totalPages })}
      </span>

      {currentPage === totalPages ? (
        <span className="cursor-not-allowed rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-400 opacity-50 dark:border-slate-600 dark:bg-slate-900">
          {t("next")}
        </span>
      ) : (
        <Link
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          href={{
            pathname: "/",
            query: getQuery(nextPage),
          }}>
          {t("next")}
        </Link>
      )}
    </nav>
  );
}

export default Pagination;
