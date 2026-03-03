import { apiFetch } from "./client";

export const getNotifications = () => {
  return apiFetch("/api/notifications");
};
