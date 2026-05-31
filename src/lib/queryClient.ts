import { QueryClient } from "@tanstack/react-query";

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

const queryCacheTtl = Number(
  import.meta.env.VITE_QUERY_CACHE_TTL ?? DEFAULT_CACHE_TTL,
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: queryCacheTtl,
      gcTime: queryCacheTtl,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
