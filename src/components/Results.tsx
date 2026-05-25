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
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
            <p className="font-medium text-slate-600 dark:text-slate-300">
              Loading products...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
          <p className="font-medium text-red-700 dark:text-red-300">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          <p className="font-medium text-slate-600 dark:text-slate-300">
            No products found.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-[auto_96px_1fr] gap-4 bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white dark:bg-slate-800">
          <p>Select</p>
          <p>Image</p>
          <p>Product</p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700">
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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Results
      </h2>

      {renderContent()}
    </section>
  );
}

export default Results;
