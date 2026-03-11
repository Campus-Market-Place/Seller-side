// src/utils/auth.ts

const AUTH_TOKEN_KEY = "token";
const AUTH_DEBUG_PREFIX = "[AUTH][utils]";

function maskToken(token: string | null): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

/**
 * Extract the Telegram Web App token from the URL
 */
export function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  console.log(`${AUTH_DEBUG_PREFIX} getTokenFromUrl`, {
    hasToken: Boolean(token),
    token: maskToken(token),
  });
  return token;
}

/**
 * Get token from localStorage
 */
export function getTokenFromStorage(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  console.log(`${AUTH_DEBUG_PREFIX} getTokenFromStorage`, {
    hasToken: Boolean(token),
    token: maskToken(token),
  });
  return token;
}

/**
 * Remove token from URL for security
 */
export function removeTokenFromUrl() {
  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * Get token safely for API calls
 * First checks localStorage, then URL, and saves URL token if found
 */
export function getToken(): string {
  // 1️⃣ Try localStorage first
  let token = getTokenFromStorage();
  if (token) {
    console.log(`${AUTH_DEBUG_PREFIX} getToken success (from storage)`, {
      token: maskToken(token),
    });
    return token;
  }

  // 2️⃣ Fallback to URL token
  token = getTokenFromUrl();
  if (token) {
    console.log(`${AUTH_DEBUG_PREFIX} getToken success (from URL)`, {
      token: maskToken(token),
    });
    try {
      // Save token to localStorage for next requests
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log(`${AUTH_DEBUG_PREFIX} saved token to localStorage`);
    } catch (err) {
      console.warn(`${AUTH_DEBUG_PREFIX} could not save token`, err);
    }
    return token;
  }

  // 3️⃣ If no token found
  console.error(`${AUTH_DEBUG_PREFIX} getToken failed`, {
    reason: "No auth token in URL or localStorage",
  });
  throw new Error("No auth token found. Please login via Telegram bot.");
}