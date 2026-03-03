import { apiFetch } from "./client";

export const getMyProducts = () => {
  return apiFetch("/api/products");
};

export const getProductById = (id: string) => {
  return apiFetch(`/api/products/${id}`);
};



export const updateProduct = (id: string, data: any) => {
  return apiFetch(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


// Get products for a seller
export const getShopProducts = async (shopId: string, page = 1, limit = 20) => {
  return apiFetch(`/api/products/shop/${shopId}?page=${page}&limit=${limit}`);
};

// Update product status (active / hidden)
export const updateProductStatus = async (productId: string, isActive: boolean) => {
  return apiFetch(`/api/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });
};



// Optionally delete a product if backend supports

export const deleteProduct = async (productId: string) => {
  return apiFetch(`/api/products/${productId}`, {
    method: "DELETE",
  });
};
