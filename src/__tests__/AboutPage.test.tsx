import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ThemeProvider from "../context/ThemeProvider";
import AboutPage from "../pages/AboutPage";

function renderAboutPage() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("AboutPage", () => {
  it("renders information about the app and author", () => {
    renderAboutPage();

    expect(
      screen.getByRole("heading", { name: /about this app/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/anna dzhyhota/i)).toBeInTheDocument();
  });

  it("renders a link to the RS School React course", () => {
    renderAboutPage();

    const courseLink = screen.getByRole("link", {
      name: /rs school react course/i,
    });

    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      "href",
      "https://rs.school/courses/reactjs",
    );
  });

  it("renders a link back to the homepage", () => {
    renderAboutPage();

    expect(
      screen.getByRole("link", { name: /back to homepage/i }),
    ).toHaveAttribute("href", "/?page=1");
  });
});
