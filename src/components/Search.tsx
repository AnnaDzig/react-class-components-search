import { getTranslations } from "next-intl/server";

interface SearchProps {
  searchTerm: string;
}

async function Search({ searchTerm }: SearchProps) {
  const t = await getTranslations("search");

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {t("title")}
      </h2>

      <form className="flex flex-col gap-3 sm:flex-row" method="get">
        <input type="hidden" name="page" value="1" />

        <input
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-300"
          type="text"
          name="query"
          defaultValue={searchTerm}
          placeholder={t("placeholder")}
        />

        <button
          className="rounded-lg bg-slate-900 px-6 py-2 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          type="submit">
          {t("button")}
        </button>
      </form>
    </section>
  );
}

export default Search;
