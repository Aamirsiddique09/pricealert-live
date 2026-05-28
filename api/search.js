// search.js — Updated with WHATWG URL API
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { q, gl, hl } = req.query;

  if (!q) return res.status(400).json({ error: "Query required" });

  const apiKey = process.env.SERP_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  try {
    // ✅ Modern WHATWG URL API
    const apiUrl = new URL('https://serpapi.com/search.json');
    apiUrl.searchParams.set('engine', 'google_shopping');
    apiUrl.searchParams.set('q', q);
    apiUrl.searchParams.set('gl', gl || 'us');
    apiUrl.searchParams.set('hl', hl || 'en');
    apiUrl.searchParams.set('api_key', apiKey);

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    const results = (data.shopping_results || []).map(item => ({
      title: item.title,
      price: item.price,
      extracted_price: item.extracted_price,
      source: item.source,
      link: item.link,
      thumbnail: item.thumbnail,
      rating: item.rating,
      reviews: item.reviews,
      delivery: item.delivery,
      badge: item.badge,
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: "Search failed. Try again." });
  }
}
