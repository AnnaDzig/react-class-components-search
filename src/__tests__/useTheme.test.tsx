import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useTheme } from "../context/useTheme";

function TestComponent() {
  useTheme();

  return <div>Test component</div>;
}

describe("useTheme", () => {
  it("throws an error when used outside ThemeProvider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useTheme must be used inside ThemeProvider",
    );
  });
});
