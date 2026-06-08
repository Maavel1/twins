const RETURN_KEY = "twins:authReturn";

export function saveAuthReturn(hash = "#top") {
  try {
    sessionStorage.setItem(RETURN_KEY, hash);
  } catch {
    // sessionStorage may be blocked
  }
}

export function consumeAuthReturn(fallback = "#top") {
  try {
    const hash = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return hash || fallback;
  } catch {
    return fallback;
  }
}
