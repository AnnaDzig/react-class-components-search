import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          About This App
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          This product search application was created as part of the RS School
          React course. It demonstrates React, TypeScript, functional
          components, hooks, routing, and API data loading.
        </p>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Author: Anna Dzhyhota
        </p>

        <a
          className="mt-5 inline-block font-semibold text-slate-900 underline transition hover:text-slate-600 dark:text-slate-100 dark:hover:text-slate-300"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer">
          RS School React Course
        </a>

        <div className="mt-6">
          <Link
            className="inline-flex rounded-lg bg-slate-900 px-5 py-2 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            to="/?page=1">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
