import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories } from "@/app/api/categoriesApi";
import { getDashboardStats } from "@/app/api/dashboard";
import { getFollowers } from "@/app/api/followers";
import { getNotifications } from "@/app/api/notifications";
import { getShopProducts, getProductById, getMyProducts } from "@/app/api/products";
import { getSellerProfile } from "@/app/api/seller-profile";
import { getShopById } from "@/app/api/shop-profile";
import { cacheTtl } from "@/app/lib/queryClient";
import { queryKeys } from "@/app/lib/queryKeys";

export function useSellerProfileQuery() {
  return useQuery({
    queryKey: queryKeys.sellerProfile,
    queryFn: getSellerProfile,
    staleTime: cacheTtl.shopDetail,
    gcTime: cacheTtl.shopDetail * 3,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: cacheTtl.categories,
    gcTime: cacheTtl.categories * 2,
  });
}

export function useShopDetailQuery(shopId?: string) {
  return useQuery({
    queryKey: queryKeys.shopDetail(shopId || "unknown"),
    queryFn: () => getShopById(shopId as string),
    enabled: Boolean(shopId),
    staleTime: cacheTtl.shopDetail,
    gcTime: cacheTtl.shopDetail * 3,
  });
}

export function useShopProductsQuery(shopId?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.shopProducts(shopId || "unknown", page, limit),
    queryFn: () => getShopProducts(shopId as string, page, limit),
    enabled: Boolean(shopId),
    staleTime: cacheTtl.products,
    gcTime: cacheTtl.products * 3,
    placeholderData: keepPreviousData,
  });
}

export function useProductDetailQuery(productId?: string) {
  return useQuery({
    queryKey: queryKeys.productDetail(productId || "unknown"),
    queryFn: () => getProductById(productId as string),
    enabled: Boolean(productId),
    staleTime: cacheTtl.productDetail,
    gcTime: cacheTtl.productDetail * 3,
    placeholderData: keepPreviousData,
  });
}

export function useSavedProductsQuery() {
  return useQuery({
    queryKey: queryKeys.savedProducts,
    queryFn: getMyProducts,
    staleTime: cacheTtl.savedProducts,
    gcTime: cacheTtl.savedProducts * 3,
    placeholderData: keepPreviousData,
  });
}

export function useFollowersQuery(shopId?: string) {
  return useQuery({
    queryKey: queryKeys.followers(shopId || "unknown"),
    queryFn: () => getFollowers(shopId as string),
    enabled: Boolean(shopId),
    staleTime: cacheTtl.products,
    gcTime: cacheTtl.products * 3,
    placeholderData: keepPreviousData,
  });
}

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: getDashboardStats,
    staleTime: cacheTtl.default,
    gcTime: cacheTtl.default * 3,
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: getNotifications,
    staleTime: cacheTtl.savedProducts,
    gcTime: cacheTtl.savedProducts * 3,
  });
}
