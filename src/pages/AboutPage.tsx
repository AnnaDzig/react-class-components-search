import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">About This App</h1>

        <p className="mt-4 text-slate-600">
          This product search application was created as part of the RS School
          React course. It demonstrates React, TypeScript, functional
          components, hooks, routing, and API data loading.
        </p>

        <p className="mt-4 text-slate-600">Author: Anna Dzhyhota</p>

        <a
          className="mt-5 inline-block font-semibold text-slate-900 underline"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer">
          RS School React Course
        </a>

        <div className="mt-6">
          <Link
            className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white"
            to="/">
            Back to app
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AboutPage;
