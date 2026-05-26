import { describe, expect, it, vi } from "vitest";

import { createProductsCsv, downloadProductsCsv } from "../utils/csv";
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

describe("csv helpers", () => {
  it("creates csv content from products", () => {
    const csv = createProductsCsv([product]);

    expect(csv).toContain('"ID","Name","Description"');
    expect(csv).toContain('"1"');
    expect(csv).toContain('"Essence Mascara Lash Princess"');
    expect(csv).toContain('"Popular mascara"');
    expect(csv).toContain('"beauty"');
    expect(csv).toContain('"9.99"');
  });

  it("downloads csv file with selected items count in filename", () => {
    const clickMock = vi.fn();
    const revokeObjectUrlMock = vi.fn();

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:test-url"),
      revokeObjectURL: revokeObjectUrlMock,
    });

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue({
        href: "",
        download: "",
        click: clickMock,
      } as unknown as HTMLAnchorElement);

    downloadProductsCsv([product]);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectUrlMock).toHaveBeenCalledWith("blob:test-url");

    createElementSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
