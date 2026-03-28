import { apiFetch } from "./client";


export const getSellerProfile = async () => {
  return apiFetch('/api/seller-profile'); 
  //console.log("seller preofile url: ", '/api/seller-profile');

};

/*export async function updateProfile(data: any) {
    return apiFetch("/api/seller-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }*/

    export async function updateProfile(data: any) {
      const formData = new FormData();
    
      Object.keys(data).forEach((key) => {
        const value = data[key];
    
        if (!value) return;
    
        if (key === "profileImage" && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append("profileImage", file);
          });
        } else {
          formData.append(key, value);
        }
      });
    
      return apiFetch("/api/seller-profile", {
        method: "PUT",
        body: formData,
        // Remove the invalid property
      });
    }

   /* export async function updateProfile(data: any) {
      const formData = new FormData();
    
      // Append text fields
      formData.append("shopName", data.shopName);
      formData.append("description", data.description);
      formData.append("campusLocation", data.campusLocation);
      formData.append("mainPhone", data.mainPhone);
      formData.append("secondaryPhone", data.secondaryPhone);
      formData.append("instagram", data.instagram || "");
      formData.append("telegram", data.telegram);
      formData.append("tiktok", data.tiktok || "");
      formData.append("agreedToRules", "true");
    
      // ✅ Append image file properly
      if (data.profileImage && data.profileImage[0] instanceof File) {
        formData.append("profileImage", data.profileImage[0]);
      }
    
      const res = await fetch("/api/seller-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // IMPORTANT
        },
        body: formData, // ❗ NOT JSON
      });
    
      return res.json();
    }

*/
