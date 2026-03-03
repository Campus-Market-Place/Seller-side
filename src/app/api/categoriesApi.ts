import { apiFetch } from './client';

export const getCategories = async () => {
  const res = await apiFetch("/api/categories");
  return res.data.categories; // returns an array of categories
};
