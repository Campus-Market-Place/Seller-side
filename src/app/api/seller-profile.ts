import { apiFetch } from "./client";


export const getSellerProfile = async () => {
  return apiFetch('/api/seller-profile'); 
  //console.log("seller preofile url: ", '/api/seller-profile');

};

export async function updateProfile(data: any) {
    return apiFetch("/api/seller-profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }


