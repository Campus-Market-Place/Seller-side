import { apiFetch } from "./client";


export const getSellerProfile = async () => {
  return apiFetch('/seller-profile'); 
};

export async function updateProfile(data: any) {
    return apiFetch("/seller-profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }


