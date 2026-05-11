import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Search from "../components/Search";

describe("Search", () => {
  it("renders search title, input and button", () => {
    render(
      <Search
        searchTerm=""
        isLoading={false}
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /search/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays the value passed through searchTerm prop", () => {
    render(
      <Search
        searchTerm="phone"
        isLoading={false}
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox")).toHaveValue("phone");
  });

  it("calls onChange when user types in the input", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Search
        searchTerm=""
        isLoading={false}
        onChange={handleChange}
        onSearch={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.type(input, "laptop");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledWith("l");
    expect(handleChange).toHaveBeenLastCalledWith("p");
  });

  it("calls onSearch when search button is clicked", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(
      <Search
        searchTerm="laptop"
        isLoading={false}
        onChange={vi.fn()}
        onSearch={handleSearch}
      />,
    );

    await user.click(screen.getByRole("button", { name: /search/i }));

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls onSearch when Enter key is pressed in the input", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(
      <Search
        searchTerm="laptop"
        isLoading={false}
        onChange={vi.fn()}
        onSearch={handleSearch}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard("{Enter}");

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it("does not call onSearch when another key is pressed", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(
      <Search
        searchTerm="laptop"
        isLoading={false}
        onChange={vi.fn()}
        onSearch={handleSearch}
      />,
    );

    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard("{Escape}");

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it("shows loading text and disables button when isLoading is true", () => {
    render(
      <Search
        searchTerm="phone"
        isLoading={true}
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: /searching/i });

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Searching...");
  });

  it("shows normal search button when isLoading is false", () => {
    render(
      <Search
        searchTerm="phone"
        isLoading={false}
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    const button = screen.getByRole("button", { name: /search/i });

    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent("Search");
  });
});
