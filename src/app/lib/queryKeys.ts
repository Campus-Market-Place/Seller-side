export const queryKeys = {
  sellerProfile: ["seller-profile"] as const,
  categories: ["categories"] as const,
  dashboardStats: ["dashboard-stats"] as const,
  notifications: ["notifications"] as const,
  savedProducts: ["saved-products"] as const,
  shopDetail: (shopId: string) => ["shop-detail", shopId] as const,
  shopProducts: (shopId: string, page = 1, limit = 20) => ["shop-products", shopId, page, limit] as const,
  productDetail: (productId: string) => ["product-detail", productId] as const,
  followers: (shopId: string) => ["followers", shopId] as const,
};
