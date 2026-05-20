import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import AboutPage from "../pages/AboutPage";

describe("AboutPage", () => {
  it("renders information about the app and author", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /about this app/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/anna dzhyhota/i)).toBeInTheDocument();
  });

  it("renders a link to the RS School React course", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    const courseLink = screen.getByRole("link", {
      name: /rs school react course/i,
    });

    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      "href",
      "https://rs.school/courses/reactjs",
    );
  });

  it("renders a link back to the main app", () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /back to app/i })).toHaveAttribute(
      "href",
      "/?page=1",
    );
  });
});
