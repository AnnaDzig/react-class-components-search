import { Link, Outlet } from "react-router-dom";

import ErrorButton from "./components/ErrorButton";
import Header from "./components/Header";

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Header />

        <nav className="mb-6 flex justify-center">
          <Link
            className="rounded-lg bg-white px-5 py-2 font-medium text-slate-700 shadow hover:text-slate-900"
            to="/about">
            About
          </Link>
        </nav>

        <Outlet />

        <div className="mt-6 flex justify-end">
          <ErrorButton />
        </div>
      </div>
    </main>
  );
}

export default App;
