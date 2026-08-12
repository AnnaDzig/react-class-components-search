"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

function getSearchParamsObject(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries());
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (routing.locales.includes(firstSegment as Locale)) {
    const pathWithoutLocale = segments.slice(1).join("/");

    return pathWithoutLocale ? `/${pathWithoutLocale}` : "/";
  }

  return pathname;
}

function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("language");

  const query = getSearchParamsObject(searchParams);
  const cleanPathname = removeLocaleFromPathname(pathname);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {t("label")}:
      </span>

      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={{
              pathname: cleanPathname,
              query,
            }}
            locale={locale}
            className={
              isActive
                ? "rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                : "rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            }>
            {t(locale)}
          </Link>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
