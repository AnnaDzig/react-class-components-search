import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SelectedItemsFlyout from "../components/SelectedItemsFlyout";
import { useProductsStore } from "../store/productsStore";
import { downloadProductsCsv } from "../utils/csv";
import { createMockProduct } from "./test-utils/mockProduct";

vi.mock("../utils/csv", () => ({
  downloadProductsCsv: vi.fn(),
}));

const mockedDownloadProductsCsv = vi.mocked(downloadProductsCsv);

const firstProduct = createMockProduct({
  id: 1,
  title: "iPhone 15",
});

const secondProduct = createMockProduct({
  id: 2,
  title: "Samsung Galaxy",
  thumbnail: "https://example.com/samsung.png",
});

describe("SelectedItemsFlyout", () => {
  beforeEach(() => {
    useProductsStore.setState({
      selectedItems: [],
    });

    vi.clearAllMocks();
  });

  it("does not render when there are no selected items", () => {
    render(<SelectedItemsFlyout />);

    expect(screen.queryByText(/selected items/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /unselect all/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it("renders selected items count when items are selected", () => {
    useProductsStore.setState({
      selectedItems: [firstProduct, secondProduct],
    });

    render(<SelectedItemsFlyout />);

    expect(screen.getByText("Selected items: 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /unselect all/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download/i }),
    ).toBeInTheDocument();
  });

  it("clears selected items when Unselect all button is clicked", async () => {
    const user = userEvent.setup();

    useProductsStore.setState({
      selectedItems: [firstProduct, secondProduct],
    });

    render(<SelectedItemsFlyout />);

    await user.click(screen.getByRole("button", { name: /unselect all/i }));

    expect(useProductsStore.getState().selectedItems).toEqual([]);
    expect(screen.queryByText(/selected items/i)).not.toBeInTheDocument();
  });

  it("downloads selected items when Download button is clicked", async () => {
    const user = userEvent.setup();

    useProductsStore.setState({
      selectedItems: [firstProduct, secondProduct],
    });

    render(<SelectedItemsFlyout />);

    await user.click(screen.getByRole("button", { name: /download/i }));

    expect(mockedDownloadProductsCsv).toHaveBeenCalledWith([
      firstProduct,
      secondProduct,
    ]);
    expect(mockedDownloadProductsCsv).toHaveBeenCalledTimes(1);
  });
});
