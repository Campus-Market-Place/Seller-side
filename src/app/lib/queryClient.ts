import { QueryClient } from "@tanstack/react-query";

const MINUTE = 60 * 1000;

export const cacheTtl = {
  categories: 30 * MINUTE,
  products: 5 * MINUTE,
  productDetail: 10 * MINUTE,
  shopDetail: 30 * MINUTE,
  savedProducts: 2 * MINUTE,
  default: 5 * MINUTE,
} as const;

// In React Query v5, gcTime is the cache retention time (cacheTime equivalent).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: cacheTtl.default,
      gcTime: cacheTtl.default * 3,
      retry: 1,
    },
  },
});
