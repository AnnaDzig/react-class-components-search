import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import NotFoundPage from "../pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("renders a clear 404 page", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/the page you are looking for does not exist/i),
    ).toBeInTheDocument();
  });

  it("renders a link back to the main app", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /return to main app/i }),
    ).toHaveAttribute("href", "/");
  });
});
