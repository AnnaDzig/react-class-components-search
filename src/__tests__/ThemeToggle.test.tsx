import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import ThemeProvider from "../context/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

function renderThemeToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders dark theme button by default", () => {
    renderThemeToggle();

    expect(
      screen.getByRole("button", { name: /dark theme/i }),
    ).toBeInTheDocument();

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("switches from light theme to dark theme", async () => {
    const user = userEvent.setup();

    renderThemeToggle();

    await user.click(screen.getByRole("button", { name: /dark theme/i }));

    expect(
      screen.getByRole("button", { name: /light theme/i }),
    ).toBeInTheDocument();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("switches from dark theme back to light theme", async () => {
    const user = userEvent.setup();

    renderThemeToggle();

    await user.click(screen.getByRole("button", { name: /dark theme/i }));
    await user.click(screen.getByRole("button", { name: /light theme/i }));

    expect(
      screen.getByRole("button", { name: /dark theme/i }),
    ).toBeInTheDocument();

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
