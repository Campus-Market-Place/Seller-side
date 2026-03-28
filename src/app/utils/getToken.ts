// src/utils/auth.ts

const AUTH_TOKEN_KEY = "token";
const LEGACY_AUTH_TOKEN_KEY = "authToken";
const AUTH_DEBUG_PREFIX = "[AUTH][utils]";

function maskToken(token: string | null): string {
  if (!token) return "<none>";
  if (token.length <= 12) return `${token.slice(0, 4)}...`;
  return `${token.slice(0, 8)}...${token.slice(-4)} (len=${token.length})`;
}

function normalizeToken(rawToken: string | null): string | null {
  if (!rawToken) return null;

  const trimmed = rawToken.trim();
  if (!trimmed) return null;

  // Handle accidental `Bearer <token>` values if they are pasted/stored.
  const withoutBearer = trimmed.replace(/^Bearer\s+/i, "");
  const unquoted = withoutBearer.replace(/^['\"]|['\"]$/g, "");

  return unquoted || null;
}

/**
 * Extract the Telegram Web App token from the URL
 */
export function getTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = normalizeToken(params.get("token"));
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
  const token = normalizeToken(
    localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_AUTH_TOKEN_KEY)
  );

  // Keep storage key consistent if legacy key was used.
  if (!localStorage.getItem(AUTH_TOKEN_KEY) && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  }

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
    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

/**
 * Get token safely for API calls
 * First checks localStorage, then URL, and saves URL token if found
 */
export function getToken(): string {
  // 1) Prefer URL token so Telegram deep-link logins can override stale storage tokens.
  let token = getTokenFromUrl();
  if (token) {
    console.log(`${AUTH_DEBUG_PREFIX} getToken success (from URL)`, {
      token: maskToken(token),
    });

    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
      removeTokenFromUrl();
      console.log(`${AUTH_DEBUG_PREFIX} saved URL token to localStorage and cleaned URL`);
    } catch (err) {
      console.warn(`${AUTH_DEBUG_PREFIX} could not save URL token`, err);
    }

    return token;
  }

  // 2) Fallback to localStorage token.
  token = getTokenFromStorage();
  if (token) {
    console.log(`${AUTH_DEBUG_PREFIX} getToken success (from storage)`, {
      token: maskToken(token),
    });
    return token;
  }

  // 3) If no token found
  console.error(`${AUTH_DEBUG_PREFIX} getToken failed`, {
    reason: "No auth token in URL or localStorage",
  });
  throw new Error("No auth token found. Please login via Telegram bot.");
}