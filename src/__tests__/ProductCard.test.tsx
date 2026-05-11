// src/components/ProductCard.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductCard from "../components/ProductCard";

describe("ProductCard", () => {
  it("renders product title and description", () => {
    render(
      <ProductCard
        product={{
          id: 1,
          title: "iPhone 15",
          description: "Apple smartphone",
        }}
      />,
    );

    expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Apple smartphone")).toBeInTheDocument();
  });
});
