import { Component, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ErrorBoundary from "../components/ErrorBoundary";

class BrokenComponent extends Component {
  throwError(): never {
    throw new Error("Test error");
  }

  render(): ReactNode {
    this.throwError();

    return null;
  }
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>Application content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Application content")).toBeInTheDocument();
  });

  it("renders fallback UI when a child component throws an error", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/the application encountered an unexpected error/i),
    ).toBeInTheDocument();
  });

  it("logs the error to the console", () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalled();
  });
});
