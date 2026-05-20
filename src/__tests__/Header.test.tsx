import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Header from "../components/Header";

describe("Header", () => {
  it("renders the app label", () => {
    render(<Header />);

    expect(screen.getByText(/class components/i)).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<Header />);

    expect(
      screen.getByRole("heading", { name: /product search app/i }),
    ).toBeInTheDocument();
  });

  it("renders the app description", () => {
    render(<Header />);

    expect(
      screen.getByText(
        /search products, keep your last search, and handle loading and errors/i,
      ),
    ).toBeInTheDocument();
  });
});
