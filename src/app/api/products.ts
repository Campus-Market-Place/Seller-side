import { apiFetch } from "./client";

export const getMyProducts = () => {
  return apiFetch("/api/products");
};

export const getProductById = (id: string) => {
  return apiFetch(`/api/products/${id}`);
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

export const getProductDetails = (id: string) => {
  return apiFetch(`/api/products/details/${id}`, {
    method: "GET",
  });
};


// api/products.ts
export const updateProduct = (
  productId: string,
  data: {
    name: string;
    price: number;
    status: 'active' | 'hidden';
    image?: File | string; // allow file or existing URL
  }
) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', String(data.price));
  formData.append('isActive', data.status === 'active' ? 'true' : 'false');

  // Only append file if user selected one
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }

  return apiFetch(`/api/products/${productId}`, {
    method: 'PUT',
    body: formData,
    // Do NOT set 'Content-Type'; browser will set it automatically for FormData
  });
};