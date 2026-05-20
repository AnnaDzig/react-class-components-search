import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ErrorBoundary from "../components/ErrorBoundary";
import ErrorButton from "../components/ErrorButton";

describe("ErrorButton", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the test error button", () => {
    render(<ErrorButton />);

    expect(
      screen.getByRole("button", { name: /test error boundary/i }),
    ).toBeInTheDocument();
  });

  it("throws an error after the button is clicked and ErrorBoundary shows fallback UI", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>,
    );

    await user.click(
      screen.getByRole("button", { name: /test error boundary/i }),
    );

    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/the application encountered an unexpected error/i),
    ).toBeInTheDocument();
  });
});
