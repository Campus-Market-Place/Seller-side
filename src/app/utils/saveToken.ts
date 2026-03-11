// src/utils/saveToken.ts
export function saveToken(token: string) {
    try {
      localStorage.setItem("authToken", token);
    } catch (err) {
      console.warn("Could not save auth token:", err);
    }
  }