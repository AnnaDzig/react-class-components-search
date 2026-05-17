
function Header () {
    return (
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Class Components
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          Product Search App
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Search products, keep your last search, and handle loading and errors
          with class-based React components.
        </p>
      </header>
    );
  }

export default Header;
