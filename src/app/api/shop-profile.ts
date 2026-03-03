import { apiFetch } from "./client";

// Fetch full shop details by shopId
export const getShopById = async (shopId: string) => {
  // GET request using shopId from seller profile
  return apiFetch(`/api/shop/${shopId}`);
};
