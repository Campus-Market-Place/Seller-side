// src/app/api/createProduct.ts
import { apiFetch } from "./client";

// Create a new product
export async function createProduct(shopId: string, data: any) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("categoryId", data.categoryId);

  data.images.forEach((file: File) => {
    formData.append("image", file);
  });

  return apiFetch(`/api/products/${shopId}`, {
    method: "POST",
    body: formData,
    headers: {}, // do NOT set Content-Type manually
  });
}

// Update an existing product
export async function updateProduct(productId: string, data: any) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.price !== undefined) formData.append("price", data.price.toString());
  if (data.categoryId) formData.append("categoryId", data.categoryId);

  data.images?.forEach((file: File) => formData.append("image", file));

  return apiFetch(`/api/products/${productId}`, {
    method: "PUT",
    body: formData,
    headers: {},
  });
}

// Get product details by ID
export async function getProductById(productId: string) {
  return apiFetch(`/api/products/${productId}`, {
    method: "GET",
  });
}