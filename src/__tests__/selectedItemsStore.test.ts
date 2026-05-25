import { beforeEach, describe, expect, it } from "vitest";

import { useSelectedItemsStore } from "../store/selectedItemsStore";
import type { Product } from "../types/product";

const product: Product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "Popular mascara",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 99,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "BEA-ESS-ESS-001",
  weight: 4,
  dimensions: {
    width: 15.14,
    height: 13.08,
    depth: 22.99,
  },
  warrantyInformation: "1 week warranty",
  shippingInformation: "Ships in 3-5 business days",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "No return policy",
  minimumOrderQuantity: 48,
  meta: {
    createdAt: "2025-04-30T09:41:02.053Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "5784719087687",
    qrCode: "https://cdn.dummyjson.com/public/qr-code.png",
  },
  images: [
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
  ],
  thumbnail:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
};

describe("selected items store", () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({
      selectedItems: [],
    });
  });

  it("selects an item", () => {
    useSelectedItemsStore.getState().toggleSelectedItem(product);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([product]);
  });

  it("unselects an already selected item", () => {
    useSelectedItemsStore.getState().toggleSelectedItem(product);
    useSelectedItemsStore.getState().toggleSelectedItem(product);

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it("checks whether an item is selected", () => {
    useSelectedItemsStore.getState().toggleSelectedItem(product);

    expect(useSelectedItemsStore.getState().isItemSelected(product.id)).toBe(
      true,
    );
  });

  it("clears selected items", () => {
    useSelectedItemsStore.getState().toggleSelectedItem(product);
    useSelectedItemsStore.getState().clearSelectedItems();

    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});
