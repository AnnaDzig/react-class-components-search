"use client";

import type { Product } from "@/types/product";
import { useSelectedItemsStore } from "@/store/selectedItemsStore";

interface ProductSelectCheckboxProps {
  product: Product;
}

function ProductSelectCheckbox({ product }: ProductSelectCheckboxProps) {
  const toggleSelectedItem = useSelectedItemsStore(
    (state) => state.toggleSelectedItem,
  );

  const isSelected = useSelectedItemsStore((state) =>
    state.isItemSelected(product.id),
  );

  return (
    <input
      aria-label={`Select ${product.title}`}
      checked={isSelected}
      className="mt-1 h-4 w-4 cursor-pointer accent-slate-900 dark:accent-slate-100"
      type="checkbox"
      onChange={() => toggleSelectedItem(product)}
    />
  );
}

export default ProductSelectCheckbox;
