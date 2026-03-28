// src/utils/saveToken.ts
export function saveToken(token: string) {
  const normalizedToken = token.trim().replace(/^Bearer\s+/i, "");

  try {
    localStorage.setItem("token", normalizedToken);
    localStorage.removeItem("authToken");
  } catch (err) {
    console.warn("Could not save auth token:", err);
  }
}