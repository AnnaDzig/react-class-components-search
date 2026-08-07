import { getTranslations } from "next-intl/server";

async function Header() {
  const t = await getTranslations("header");

  return (
    <header className="mb-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
        {t("eyebrow")}
      </p>

      <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">
        {t("title")}
      </h1>

      <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        {t("description")}
      </p>
    </header>
  );
}

export default Header;
