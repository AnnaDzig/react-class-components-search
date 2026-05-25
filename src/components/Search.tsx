import type { KeyboardEvent } from "react";

interface SearchProps {
  searchTerm: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

function Search({ searchTerm, isLoading, onChange, onSearch }: SearchProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Search
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-300"
          type="text"
          value={searchTerm}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
        />

        <button
          className="rounded-lg bg-slate-900 px-6 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-600 dark:disabled:text-slate-300"
          type="button"
          onClick={onSearch}
          disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </section>
  );
}

export default Search;
