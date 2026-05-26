import type { Product } from "../../types/product";

export const createMockProduct = (
  overrides: Partial<Product> = {},
): Product => ({
  id: 1,
  title: "iPhone 15",
  description: "Apple smartphone",
  category: "smartphones",
  price: 999,
  discountPercentage: 10,
  rating: 4.5,
  stock: 20,
  tags: ["phone", "apple"],
  brand: "Apple",
  sku: "PHONE-001",
  weight: 1,
  dimensions: {
    width: 10,
    height: 20,
    depth: 2,
  },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships tomorrow",
  availabilityStatus: "In Stock",
  reviews: [],
  returnPolicy: "30 days return",
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2025-04-30T09:41:02.053Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "123456789",
    qrCode: "https://example.com/qr.png",
  },
  images: ["https://example.com/image.png"],
  thumbnail: "https://example.com/thumb.png",
  ...overrides,
});
