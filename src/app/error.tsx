"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
          Application error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          The application encountered an unexpected error.
        </p>

        <p className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {error.message}
        </p>

        <button
          className="mt-6 rounded-lg bg-slate-900 px-5 py-2 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          type="button"
          onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}

export default ErrorPage;
