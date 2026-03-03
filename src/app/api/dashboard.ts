import { apiFetch } from "./client";

export const getDashboardStats = () => {
  return apiFetch("/api/dashboard");
};
