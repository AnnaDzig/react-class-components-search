import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Pagination from "../components/Pagination";

describe("Pagination", () => {
  it("does not render pagination when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders current page and total pages", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("disables Previous button on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("disables Next button on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange with previous page when Previous is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("calls onPageChange with next page when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });
});
