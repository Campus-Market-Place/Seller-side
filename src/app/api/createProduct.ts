export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYmQwMTJmNi03M2I0LTRkZmEtOGMzMS00MzI0OGRiNzJmNDQiLCJyb2xlIjoiVVNFUiIsInVzZXJuYW1lIjoibWFtYV9taWEiLCJpYXQiOjE3NzEzMDc1OTksImV4cCI6MTc3MTkxMjM5OX0.VE69smayVwaqt9ecTmMI2EjFM3QqaPh9X1huRXtzHgc"; 
  
    const response = await fetch(`https://backend-ikou.onrender.com${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT include Content-Type here if body is FormData
        ...(options.headers || {}),
      },
    });
  
    if (!response.ok) {
      throw new Error("Request failed");
    }
  
    return response.json();
  }
  
  export async function createProduct(shopId: string, data: any) {
    const formData = new FormData();
  
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("categoryId", data.categoryId); // backend expects ID
  
    // append images (field name: 'image')
    data.images.forEach((file: File) => formData.append("image", file));
  
    return apiFetch(`/api/products/${shopId}`, {
      method: "POST",
      body: formData,
    });
  }
  
  
  