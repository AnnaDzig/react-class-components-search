import { describe, expect, it } from "vitest";

import { queryClient } from "../lib/queryClient";

describe("queryClient", () => {
  it("is configured with default query options", () => {
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.staleTime).toBeGreaterThan(0);
    expect(defaultOptions.queries?.gcTime).toBeGreaterThan(0);
  });
});
