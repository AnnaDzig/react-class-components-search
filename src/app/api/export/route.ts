import { createProductsCsv } from "@/utils/csv";
import type { Product } from "@/types/product";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.price === "number" &&
    typeof value.rating === "number" &&
    typeof value.stock === "number" &&
    typeof value.availabilityStatus === "string" &&
    typeof value.thumbnail === "string"
  );
}

function parseProducts(value: FormDataEntryValue | null): Product[] {
  if (typeof value !== "string") {
    return [];
  }

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isProduct);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const products = parseProducts(formData.get("products"));
  const csv = createProductsCsv(products);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${products.length}_items.csv"`,
    },
  });
}
