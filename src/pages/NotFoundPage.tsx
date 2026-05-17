import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900">
      <div className="max-w-xl rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>

        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist.
        </p>

        <Link
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2 font-medium text-white"
          to="/">
          Return to main app
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
