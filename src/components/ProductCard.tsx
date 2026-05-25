import { useSelectedItemsStore } from "../store/selectedItemsStore";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const toggleSelectedItem = useSelectedItemsStore(
    (state) => state.toggleSelectedItem,
  );

  const isSelected = useSelectedItemsStore((state) =>
    state.isItemSelected(product.id),
  );

  const handleCheckboxChange = () => {
    toggleSelectedItem(product);
  };

  return (
    <article
      className="grid w-full cursor-pointer grid-cols-[auto_1fr] gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[auto_220px_1fr]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}>
      <div onClick={(event) => event.stopPropagation()}>
        <input
          aria-label={`Select ${product.title}`}
          checked={isSelected}
          className="mt-1 h-4 w-4 cursor-pointer"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
      </div>

      <h3 className="font-semibold text-slate-900">{product.title}</h3>

      <p className="leading-6 text-slate-600">{product.description}</p>
    </article>
  );
}

export default ProductCard;
