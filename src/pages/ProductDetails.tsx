import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { useProductsStore } from "../store/productsStore";

interface DetailsOutletContext {
  onClose: () => void;
}

function ProductDetails() {
  const { productId } = useParams();
  const { onClose } = useOutletContext<DetailsOutletContext>();

  const product = useProductsStore((state) => state.selectedProduct);
  const isLoading = useProductsStore((state) => state.isDetailsLoading);
  const error = useProductsStore((state) => state.detailsError);
  const loadProductDetails = useProductsStore(
    (state) => state.loadProductDetails,
  );
  const clearProductDetails = useProductsStore(
    (state) => state.clearProductDetails,
  );

  useEffect(() => {
    if (!productId) {
      clearProductDetails();
      return;
    }

    void loadProductDetails(productId);

    return () => {
      clearProductDetails();
    };
  }, [productId, loadProductDetails, clearProductDetails]);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Details panel
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Product Details
          </h2>
        </div>

        <button
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          type="button"
          onClick={onClose}>
          Close
        </button>
      </div>

      {isLoading && (
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
            <p className="font-medium text-slate-600 dark:text-slate-300">
              Loading details...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {!isLoading && product && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <img
              alt={product.title}
              className="h-64 w-full object-contain p-6"
              src={product.thumbnail}
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {product.category}
                </p>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {product.title}
                </h3>
              </div>

              <p className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                ${product.price}
              </p>
            </div>

            <p className="leading-6 text-slate-600 dark:text-slate-300">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Rating
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {product.rating}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Stock
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {product.stock}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Brand
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {product.brand ?? "No brand"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Availability
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {product.availabilityStatus}
              </p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Product ID
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">
                {product.id}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                SKU
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">
                {product.sku}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Warranty
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">
                {product.warrantyInformation}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Shipping
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">
                {product.shippingInformation}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Return policy
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">
                {product.returnPolicy}
              </dd>
            </div>
          </dl>

          {product.tags.length > 0 && (
            <div>
              <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                Tags
              </h4>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.reviews.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                Reviews
              </h4>

              <div className="space-y-3">
                {product.reviews.slice(0, 2).map((review) => (
                  <article
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                    key={`${review.reviewerEmail}-${review.comment}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {review.reviewerName}
                      </p>

                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {review.rating}/5
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
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
