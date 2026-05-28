// ═══════════════════════════════════════════════
// PriceAlert.live — Secure Config
// Keys loaded from .env — NEVER hardcode here
// ═══════════════════════════════════════════════
export const CONFIG = {
  SERP_API_KEY: import.meta.env.VITE_SERP_API_KEY  || "",
  ADSENSE_ID:   import.meta.env.VITE_ADSENSE_ID    || "",
  ADMIN_PASS:   import.meta.env.VITE_ADMIN_PASS     || "admin123",
};
