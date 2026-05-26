import { useTheme } from "../context/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      type="button"
      onClick={toggleTheme}>
      {theme === "light" ? "Dark theme" : "Light theme"}
    </button>
  );
}

export default ThemeToggle;
