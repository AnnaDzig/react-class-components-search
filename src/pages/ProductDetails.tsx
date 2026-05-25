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
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Details panel
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Product Details
          </h2>
        </div>

        <button
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              alt={product.title}
              className="h-64 w-full object-contain p-6"
              src={product.thumbnail}
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  {product.category}
                </p>

                <h3 className="text-xl font-bold text-slate-900">
                  {product.title}
                </h3>
              </div>

              <p className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                ${product.price}
              </p>
            </div>

            <p className="leading-6 text-slate-600">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Rating</p>
              <p className="text-slate-600">{product.rating}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Stock</p>
              <p className="text-slate-600">{product.stock}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Brand</p>
              <p className="text-slate-600">{product.brand ?? "No brand"}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Availability</p>
              <p className="text-slate-600">{product.availabilityStatus}</p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-900">Product ID</dt>
              <dd className="text-slate-600">{product.id}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900">SKU</dt>
              <dd className="text-slate-600">{product.sku}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900">Warranty</dt>
              <dd className="text-slate-600">{product.warrantyInformation}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900">Shipping</dt>
              <dd className="text-slate-600">{product.shippingInformation}</dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900">Return policy</dt>
              <dd className="text-slate-600">{product.returnPolicy}</dd>
            </div>
          </dl>

          {product.tags.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-slate-900">Tags</h4>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.reviews.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-slate-900">Reviews</h4>

              <div className="space-y-3">
                {product.reviews.slice(0, 2).map((review) => (
                  <article
                    className="rounded-xl border border-slate-200 bg-white p-4"
                    key={`${review.reviewerEmail}-${review.comment}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">
                        {review.reviewerName}
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {review.rating}/5
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default ProductDetails;
