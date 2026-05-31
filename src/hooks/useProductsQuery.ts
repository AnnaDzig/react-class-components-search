import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "../api/productsApi";
import { productQueryKeys } from "../api/queryKeys";

export function useProductsQuery(searchTerm: string, page: number) {
  return useQuery({
    queryKey: productQueryKeys.list(searchTerm, page),
    queryFn: () => fetchProducts(searchTerm, page),
  });
}
