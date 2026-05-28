// ═══════════════════════════════════════════════
// PriceAlert.live — Config
// SerpAPI key is SERVER-SIDE only (no VITE_ prefix)
// Browser only gets AdSense ID and admin pass
// ═══════════════════════════════════════════════
export const CONFIG = {
  // These are safe — public IDs only
  ADSENSE_ID:  import.meta.env.VITE_ADSENSE_ID  || "",
  ADMIN_PASS:  import.meta.env.VITE_ADMIN_PASS   || "admin123",

  // API endpoint — calls our serverless function (key stays hidden)
  SEARCH_API: "/api/search",
};
