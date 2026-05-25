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
      className="grid w-full cursor-pointer grid-cols-[auto_96px_1fr] gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500"
      role="button"
      tabIndex={0}
      onClick={onClick}
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
          className="mt-1 h-4 w-4 cursor-pointer accent-slate-900"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
      </div>

      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
        <img
          alt={product.title}
          className="h-full w-full object-contain p-2"
          src={product.thumbnail}
        />
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {product.category}
            </p>

            <h3 className="line-clamp-1 font-semibold text-slate-900">
              {product.title}
            </h3>
          </div>

          <p className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            ${product.price}
          </p>
        </div>

        <p className="line-clamp-2 leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2 py-1">
            Rating: {product.rating}
          </span>

          <span className="rounded-full bg-slate-100 px-2 py-1">
            Stock: {product.stock}
          </span>

          <span className="rounded-full bg-slate-100 px-2 py-1">
            {product.availabilityStatus}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
