import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ResultsProps {
  products: Product[];
  isLoading: boolean;
  error: string;
  onProductClick: (productId: number) => void;
}

function Results({ products, isLoading, error, onProductClick }: ResultsProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            <p className="font-medium text-slate-600">Loading products...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <p className="font-medium text-slate-600">No products found.</p>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white sm:grid-cols-[220px_1fr]">
          <p>Item Name</p>
          <p>Item Description</p>
        </div>

        <div className="divide-y divide-slate-200">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick(product.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-semibold">Results</h2>
      {renderContent()}
    </section>
  );
}

export default Results;
