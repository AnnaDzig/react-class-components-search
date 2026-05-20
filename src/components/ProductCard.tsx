import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      className="grid w-full grid-cols-1 gap-2 px-4 py-4 text-left transition hover:bg-slate-50 sm:grid-cols-[220px_1fr]"
      type="button"
      onClick={onClick}>
      <h3 className="font-semibold text-slate-900">{product.title}</h3>
      <p className="leading-6 text-slate-600">{product.description}</p>
    </button>
  );
}

export default ProductCard;
