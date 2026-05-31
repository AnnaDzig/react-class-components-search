import { useQuery } from "@tanstack/react-query";

import { fetchProductById } from "../api/productsApi";
import { productQueryKeys } from "../api/queryKeys";

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: productQueryKeys.detail(id ?? ""),
    queryFn: () => fetchProductById(id ?? ""),
    enabled: Boolean(id),
  });
}
