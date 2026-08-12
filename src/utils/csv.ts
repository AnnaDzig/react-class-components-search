import type { Product } from "@/types/product";

const escapeCsvValue = (value: string | number) => {
  const stringValue = String(value);

  return `"${stringValue.replaceAll('"', '""')}"`;
};

export const createProductsCsv = (products: Product[]) => {
  const headers = [
    "ID",
    "Name",
    "Description",
    "Category",
    "Brand",
    "Price",
    "Rating",
    "Stock",
    "Availability",
    "Thumbnail",
  ];

  const rows = products.map((product) => [
    product.id,
    product.title,
    product.description,
    product.category,
    product.brand ?? "",
    product.price,
    product.rating,
    product.stock,
    product.availabilityStatus,
    product.thumbnail,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};
