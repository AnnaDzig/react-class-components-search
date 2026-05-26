import type { Product } from "../types/product";

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

export const downloadProductsCsv = (products: Product[]) => {
  const csvContent = createProductsCsv(products);

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${products.length}_items.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
