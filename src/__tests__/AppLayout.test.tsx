import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import App from "../App";
import ThemeProvider from "../context/ThemeProvider";

function renderAppLayout() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>Home outlet content</div>} />
          </Route>

          <Route path="/about" element={<div>About page mock</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("App layout", () => {
  afterEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders header, theme toggle, navigation and outlet content", () => {
    renderAppLayout();

    expect(
      screen.getByRole("heading", { name: /product search app/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /dark theme/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about",
    );

    expect(screen.getByText("Home outlet content")).toBeInTheDocument();
  });

  it("switches theme from the app layout", async () => {
    const user = userEvent.setup();

    renderAppLayout();

    await user.click(screen.getByRole("button", { name: /dark theme/i }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(
      screen.getByRole("button", { name: /light theme/i }),
    ).toBeInTheDocument();
  });
});
