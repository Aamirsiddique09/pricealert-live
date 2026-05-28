// ═══════════════════════════════════════════════════════
// Vercel Serverless Function — SerpAPI Proxy
// SerpAPI key stays on SERVER — never exposed to browser
// ═══════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { q, gl, hl } = req.query;

  if (!q) return res.status(400).json({ error: "Query required" });

  // Key is SERVER-SIDE only — no VITE_ prefix — safe!
  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=${gl || "us"}&hl=${hl || "en"}&api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    // Only send what frontend needs — strip sensitive data
    const results = (data.shopping_results || []).map(item => ({
      title:           item.title,
      price:           item.price,
      extracted_price: item.extracted_price,
      source:          item.source,
      link:            item.link,
      thumbnail:       item.thumbnail,
      rating:          item.rating,
      reviews:         item.reviews,
      delivery:        item.delivery,
      badge:           item.badge,
    }));

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: "Search failed. Try again." });
  }
}
