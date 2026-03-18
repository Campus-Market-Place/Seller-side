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

    // ❗ IMPORTANT: do NOT set Content-Type manually
    headers: {
      // leave empty or keep other headers if needed
    },
  });
}