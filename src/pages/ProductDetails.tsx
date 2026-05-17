import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { fetchProductById } from "../api/productsApi";
import type { Product } from "../types/product";

interface DetailsOutletContext {
  onClose: () => void;
}

interface ProductDetailsState {
  product: Product | null;
  isLoading: boolean;
  error: string;
}

function ProductDetails() {
  const { productId } = useParams();
  const { onClose } = useOutletContext<DetailsOutletContext>();

  const [detailsState, setDetailsState] = useState<ProductDetailsState>({
    product: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    if (!productId) {
      return;
    }

    let shouldIgnoreResult = false;

    const loadProduct = async (): Promise<void> => {
      try {
        const data = await fetchProductById(productId);

        if (!shouldIgnoreResult) {
          setDetailsState({
            product: data,
            isLoading: false,
            error: "",
          });
        }
      } catch {
        if (!shouldIgnoreResult) {
          setDetailsState({
            product: null,
            isLoading: false,
            error: "Unable to load product details.",
          });
        }
      }
    };

    void loadProduct();

    return () => {
      shouldIgnoreResult = true;
    };
  }, [productId]);

  const { product, isLoading, error } = detailsState;

  return (
    <aside className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-semibold">Product Details</h2>

        <button
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
          type="button"
          onClick={onClose}>
          Close
        </button>
      </div>

      {isLoading && (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
            <p className="font-medium text-slate-600">Loading details...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!isLoading && product && (
        <div>
          <h3 className="text-xl font-bold text-slate-900">{product.title}</h3>

          <p className="mt-3 leading-6 text-slate-600">{product.description}</p>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-900">Product ID</dt>
              <dd className="text-slate-600">{product.id}</dd>
            </div>
          </dl>
        </div>
      )}
    </aside>
  );
}

export default ProductDetails;
