import { useState, useEffect, useRef, useCallback } from "react";
import { CONFIG } from "./config.js";
import { COUNTRIES, STORES, TRENDING, CATEGORIES } from "./data.js";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const isAvail = (store, code) => store.available.includes(code);
const getShip = (store, code) => store.shipping[code] || store.shipping.default || "Varies";
const fmtPrice = (usd, code) => {
  const c = COUNTRIES[code] || COUNTRIES.US;
  const amt = usd * c.rate;
  return `${c.symbol}${amt >= 1000 ? amt.toLocaleString("en", { maximumFractionDigits: 0 }) : amt.toFixed(2)}`;
};

// ── GOOGLE AD COMPONENT ────────────────────────────────────────────────────────
// Replace slot IDs with your real Google AdSense slot IDs
function GoogleAd({ slot, style = {} }) {
  const adRef = useRef(null);
  useEffect(() => {
    if (CONFIG.ADSENSE_ID && adRef.current) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
    }
  }, []);

  if (!CONFIG.ADSENSE_ID) {
    // Placeholder shown until you add your AdSense ID
    return (
      <div style={{ background: "#0A0A0A", border: "1px dashed #181818", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0", ...style }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "16px" }}>📢</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#252525" }}>
            Ad Slot — Add VITE_ADSENSE_ID in .env to activate
          </span>
        </div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "7px", color: "#181818", border: "1px solid #141414", padding: "2px 6px", borderRadius: "3px" }}>AD</span>
      </div>
    );
  }

  return (
    <div style={{ margin: "14px 0", textAlign: "center", ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CONFIG.ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker({ country }) {
  const c = COUNTRIES[country] || COUNTRIES.US;
  const text = TRENDING.map(t => `${c.flag} ${t} — Compare Now`).join("   ·   ");
  const [x, setX] = useState(0);
  useEffect(() => {
    let id;
    const step = () => { setX(p => { const lim = text.length * 7.1; return p <= -lim ? 0 : p - 0.45; }); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [text]);
  return (
    <div style={{ overflow: "hidden", background: "linear-gradient(90deg,#FF9900,#FFB347)", padding: "7px 0" }}>
      <div style={{ whiteSpace: "nowrap", transform: `translateX(${x}px)`, display: "inline-block", fontFamily: "'Space Mono',monospace", fontSize: "11px", fontWeight: 700, color: "#000" }}>
        {text + "   ·   " + text}
      </div>
    </div>
  );
}

// ── PRODUCT RESULT CARD (from SerpAPI) ────────────────────────────────────────
function ProductCard({ item, country, isTop }) {
  const c = COUNTRIES[country] || COUNTRIES.US;
  const usd = parseFloat(item.extracted_price || item.price?.replace(/[^0-9.]/g, "") || 0);
  const converted = usd ? fmtPrice(usd, country) : item.price || "See price";
  const isFree = item.delivery?.toLowerCase().includes("free") || item.delivery === "$0.00 delivery";

  return (
    <div
      onClick={() => window.open(item.link, "_blank", "noopener,noreferrer")}
      style={{
        background: isTop ? "linear-gradient(135deg,#111,#0F0F0F)" : "#0A0A0A",
        border: `1.5px solid ${isTop ? "#FF990080" : "#1C1C1C"}`,
        borderRadius: "14px", padding: "16px 18px",
        display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap",
        cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF9900"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,153,0,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isTop ? "#FF990080" : "#1C1C1C"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {isTop && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,#FF9900,transparent)" }} />}

      {/* Product Image */}
      {item.thumbnail && (
        <img src={item.thumbnail} alt={item.title}
          style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "8px", background: "#fff", flexShrink: 0 }}
          onError={e => e.target.style.display = "none"} />
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: "140px" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
          {isTop && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FFD700", background: "#FFD70015", padding: "2px 7px", borderRadius: "3px" }}>⭐ CHEAPEST</span>}
          {item.badge && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF9900", background: "#FF990015", padding: "2px 7px", borderRadius: "3px" }}>{item.badge}</span>}
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "#ccc", lineHeight: 1.5, marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {item.title}
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {item.rating && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#FFD700" }}>★ {item.rating}</span>}
          {item.reviews && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#444" }}>{typeof item.reviews === "number" ? item.reviews.toLocaleString() : item.reviews} reviews</span>}
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#444" }}>{item.source}</span>
        </div>
      </div>

      {/* Shipping */}
      <div style={{ textAlign: "center", minWidth: "90px", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444", marginBottom: "3px" }}>SHIPPING</div>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: isFree ? "#00E5A0" : "#888", lineHeight: 1.2 }}>
          {isFree ? "FREE" : (item.delivery || "Check site")}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", minWidth: "110px", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444", marginBottom: "3px" }}>PRICE · {c.currency}</div>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "24px", color: isTop ? "#FF9900" : "#fff", lineHeight: 1 }}>{converted}</div>
        {usd > 0 && country !== "US" && (
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#333", marginTop: "2px" }}>(${usd.toFixed(2)} USD)</div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: "#FF9900", borderRadius: "8px", padding: "9px 14px", flexShrink: 0 }}>
        <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: "#000" }}>BUY ↗</span>
      </div>
    </div>
  );
}

// ── STORE REDIRECT ROW ────────────────────────────────────────────────────────
function StoreRow({ store, country, query, rank }) {
  const avail = isAvail(store, country);
  const ship = getShip(store, country);
  const c = COUNTRIES[country] || COUNTRIES.US;
  const isTop = rank === 0 && avail;
  return (
    <div
      onClick={() => avail && window.open(store.url(query, country), "_blank", "noopener,noreferrer")}
      style={{ background: !avail ? "#070707" : isTop ? "#0F0F0F" : "#0A0A0A", border: `1.5px solid ${!avail ? "#141414" : isTop ? store.color + "70" : "#1C1C1C"}`, borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", opacity: avail ? 1 : 0.4, cursor: avail ? "pointer" : "default", transition: "all 0.18s" }}
      onMouseEnter={e => { if (avail) { e.currentTarget.style.borderColor = store.color; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = !avail ? "#141414" : isTop ? store.color + "70" : "#1C1C1C"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: !avail ? "#111" : rank < 3 ? store.color + "22" : "#111", border: `1px solid ${!avail ? "#222" : rank < 3 ? store.color + "50" : "#222"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: !avail ? "#333" : rank < 3 ? store.color : "#333", flexShrink: 0 }}>{rank + 1}</div>
      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: store.color + "15", border: `1px solid ${store.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{store.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "15px", color: !avail ? "#444" : "#fff" }}>{store.name}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: store.color, background: store.color + "15", padding: "1px 6px", borderRadius: "3px" }}>{store.badge}</span>
          {isTop && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FFD700", background: "#FFD70015", padding: "1px 6px", borderRadius: "3px" }}>⭐ TOP IN {c.flag}</span>}
          {!avail && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF4444", background: "#FF444415", padding: "1px 6px", borderRadius: "3px", border: "1px solid #FF444425" }}>🚫 NOT IN {c.flag} {c.name}</span>}
        </div>
        <div style={{ height: "3px", background: "#1A1A1A", borderRadius: "2px", maxWidth: "80px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${store.trust}%`, background: store.color }} />
        </div>
      </div>
      {avail && (
        <>
          <div style={{ textAlign: "center", minWidth: "80px" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444" }}>SHIPPING</div>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "12px", color: ship.toLowerCase().includes("free") ? "#00E5A0" : "#888", lineHeight: 1.3 }}>{ship}</div>
          </div>
          <div style={{ background: store.color, borderRadius: "7px", padding: "8px 14px", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "12px", color: store.name === "Shein" ? "#fff" : "#000" }}>SHOP ↗</span>
          </div>
        </>
      )}
      {!avail && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#2A2A2A" }}>Unavailable</div>}
    </div>
  );
}

// ── AI ASSISTANT ──────────────────────────────────────────────────────────────
function AIAssistant({ query, country, cheapestItem }) {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const c = COUNTRIES[country] || COUNTRIES.US;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      const greeting = cheapestItem
        ? `Hi! 👋 Best deal found: **${cheapestItem.title?.slice(0, 50)}...** at **${cheapestItem.price}** from ${cheapestItem.source}. Ask me anything!`
        : query
        ? `Hi! 👋 You searched **"${query}"** in ${c.flag} ${c.name}. Ask me about deals, alternatives, or best time to buy!`
        : `Hi! 👋 I'm your AI Shopping Assistant for ${c.flag} ${c.name}. Search a product and I'll help!`;
      setMsgs([{ role: "assistant", text: greeting }]);
    }
  }, [open]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    const ctx = cheapestItem
      ? `Cheapest result: "${cheapestItem.title}" at ${cheapestItem.price} from ${cheapestItem.source}. Delivery: ${cheapestItem.delivery || "unknown"}.`
      : query ? `User searched: "${query}".` : "";
    const sys = `You are a smart shopping assistant for PriceAlert.live. User is in ${c.name} (${c.currency}). ${ctx} Give short helpful advice: deals, alternatives, whether to buy now, shipping tips. Max 80 words. 1-2 emojis.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: newMsgs.map(m => ({ role: m.role, content: m.text })) }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", text: data.content?.[0]?.text || "Try again." }]);
    } catch { setMsgs(p => [...p, { role: "assistant", text: "Connection error." }]); }
    setLoading(false);
  };

  const quickQ = cheapestItem
    ? ["Good deal?", "Better alternative?", "Best time to buy?", "Reliable seller?"]
    : ["Best deals today", "Cheap electronics", "Top rated phones", "Budget pick"];

  return (
    <>
      <button onClick={() => setOpen(p => !p)}
        style={{ position: "fixed", bottom: "24px", right: "24px", width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#FF9900,#e68900)", border: "none", fontSize: "22px", cursor: "pointer", zIndex: 300, boxShadow: "0 4px 20px rgba(255,153,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {open ? "✕" : "🤖"}
      </button>
      {open && (
        <div style={{ position: "fixed", bottom: "86px", right: "24px", width: "310px", maxHeight: "450px", background: "#0A0A0A", border: "1px solid #222", borderRadius: "16px", display: "flex", flexDirection: "column", zIndex: 300, boxShadow: "0 20px 60px rgba(0,0,0,0.9)", overflow: "hidden" }}>
          <div style={{ padding: "12px 15px", borderBottom: "1px solid #1A1A1A", background: "#0D0D0D", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF990020", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: "#FF9900", letterSpacing: "1px" }}>AI SHOPPING ASSISTANT</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444" }}>Claude AI · {c.flag} {c.name}</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "8px 12px", borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: m.role === "user" ? "#FF9900" : "#141414", fontFamily: "'Space Mono',monospace", fontSize: "10px", color: m.role === "user" ? "#000" : "#ccc", lineHeight: 1.6 }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", gap: "4px", padding: "8px" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FF9900", animation: `bounce 0.8s ${i * 0.15}s infinite alternate` }} />)}</div>}
            <div ref={endRef} />
          </div>
          <div style={{ padding: "6px 10px", display: "flex", gap: "5px", overflowX: "auto", borderTop: "1px solid #141414" }}>
            {quickQ.map(q => (
              <button key={q} onMouseDown={() => send(q)}
                style={{ padding: "3px 9px", borderRadius: "20px", border: "1px solid #2A2A2A", background: "transparent", color: "#555", fontFamily: "'Space Mono',monospace", fontSize: "8px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF9900"; e.currentTarget.style.color = "#FF9900"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#555"; }}>
                {q}
              </button>
            ))}
          </div>
          <div style={{ padding: "9px 11px", borderTop: "1px solid #141414", display: "flex", gap: "6px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask anything..."
              style={{ flex: 1, background: "#141414", border: "1px solid #222", borderRadius: "7px", padding: "8px 11px", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "10px", outline: "none" }} />
            <button onClick={() => send(input)} style={{ background: "#FF9900", border: "none", borderRadius: "7px", padding: "8px 12px", fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: "#000", cursor: "pointer" }}>→</button>
          </div>
        </div>
      )}
      <style>{`@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-5px)}}`}</style>
    </>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const [tab, setTab]     = useState("ads");
  const [adId, setAdId]   = useState(CONFIG.ADSENSE_ID || "");
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050505", zIndex: 500, overflowY: "auto" }}>
      <div style={{ borderBottom: "1px solid #1A1A1A", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px", background: "#080808", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "18px", color: "#FF9900", letterSpacing: "2px" }}>⚙️ ADMIN DASHBOARD</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "7px", color: "#222", background: "#111", padding: "2px 7px", borderRadius: "4px" }}>PRIVATE</span>
        </div>
        <button onClick={onClose} style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#666", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer" }}>✕</button>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: "10px", marginBottom: "24px" }}>
          {[{ l: "STORES", v: STORES.length, c: "#FF9900" }, { l: "COUNTRIES", v: Object.keys(COUNTRIES).length, c: "#6C63FF" }, { l: "AD SLOTS", v: "4", c: "#00E5A0" }, { l: "EST/MONTH", v: "$300+", c: "#FFD700" }].map(s => (
            <div key={s.l} style={{ background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "22px", color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#2A2A2A", letterSpacing: "2px" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #141414", marginBottom: "22px" }}>
          {[["ads", "📢 Google Ads"], ["affiliate", "💰 Affiliate"], ["stores", "🏪 Stores"], ["setup", "🔧 Setup"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === v ? "#FF9900" : "transparent"}`, padding: "9px 16px", fontFamily: "'Space Mono',monospace", fontSize: "9px", color: tab === v ? "#FF9900" : "#444", cursor: "pointer", letterSpacing: "1px" }}>{l}</button>
          ))}
        </div>

        {tab === "ads" && (
          <>
            <div style={{ background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF9900", letterSpacing: "3px", marginBottom: "10px" }}>GOOGLE ADSENSE PUBLISHER ID</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input value={adId} onChange={e => setAdId(e.target.value)} placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  style={{ flex: 1, minWidth: "200px", background: "#141414", border: "1px solid #2A2A2A", borderRadius: "7px", padding: "10px 13px", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "11px", outline: "none" }} />
                <button onClick={() => setSaved(true)} style={{ padding: "10px 18px", background: "#FF9900", border: "none", borderRadius: "7px", fontFamily: "'Bebas Neue',cursive", fontSize: "14px", color: "#000", cursor: "pointer" }}>
                  {saved ? "✅ SAVED" : "SAVE"}
                </button>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#333", marginTop: "8px" }}>
                After saving, add to .env: VITE_ADSENSE_ID=ca-pub-XXXXX · Also add to index.html script tag
              </div>
            </div>
            {/* Ad Slot Instructions */}
            {[
              { slot: "1234567890", label: "Homepage Top Banner",  size: "728×90",  pos: "Above search box" },
              { slot: "2345678901", label: "Search Results Top",   size: "970×90",  pos: "Above results" },
              { slot: "3456789012", label: "Between Results",      size: "320×100", pos: "Mid results" },
              { slot: "4567890123", label: "Footer Banner",        size: "970×90",  pos: "Bottom of page" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "18px" }}>📢</span>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "14px", color: "#fff" }}>{s.label}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444" }}>{s.size} · {s.pos} · Replace slot ID: {s.slot}</div>
                  </div>
                </div>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", padding: "4px 10px", borderRadius: "4px", color: CONFIG.ADSENSE_ID ? "#00E5A0" : "#444", background: CONFIG.ADSENSE_ID ? "#00E5A010" : "#111", border: `1px solid ${CONFIG.ADSENSE_ID ? "#00E5A030" : "#1A1A1A"}` }}>
                  {CONFIG.ADSENSE_ID ? "✅ ACTIVE" : "⏳ NEEDS ID"}
                </span>
              </div>
            ))}
          </>
        )}

        {tab === "affiliate" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "10px" }}>
            {[
              { name: "Amazon Associates", pct: "Up to 10%", color: "#FF9900", link: "https://affiliate-program.amazon.com/" },
              { name: "eBay Partner",       pct: "Up to 4%",  color: "#0064D2", link: "https://partnernetwork.ebay.com/" },
              { name: "AliExpress",         pct: "Up to 9%",  color: "#FF4747", link: "https://portals.aliexpress.com/" },
              { name: "Walmart",            pct: "Up to 4%",  color: "#0071CE", link: "https://affiliates.walmart.com/" },
              { name: "Temu",               pct: "Up to 20%", color: "#FF6200", link: "https://www.temu.com/affiliate.html" },
              { name: "Shein",              pct: "Up to 20%", color: "#555",    link: "https://affiliate.shein.com/" },
              { name: "Flipkart",           pct: "Up to 12%", color: "#2874F0", link: "https://affiliate.flipkart.com/" },
              { name: "Daraz",              pct: "Up to 7%",  color: "#F85606", link: "https://affiliate.daraz.pk/" },
            ].map(p => (
              <a key={p.name} href={p.link} target="_blank" rel="noopener noreferrer"
                style={{ background: "#0A0A0A", border: `1px solid ${p.color}22`, borderRadius: "10px", padding: "16px", textDecoration: "none", display: "block" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = p.color + "22"}>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "14px", color: "#fff", marginBottom: "4px" }}>{p.name}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "10px", color: p.color, marginBottom: "6px" }}>{p.pct} commission</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#333" }}>Apply ↗</div>
              </a>
            ))}
          </div>
        )}

        {tab === "stores" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {STORES.map(s => (
              <div key={s.name} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "18px" }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "14px", color: "#fff" }}>{s.name}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444" }}>Trust {s.trust}% · {s.badge}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {Object.keys(COUNTRIES).map(code => {
                    const avail = isAvail(s, code);
                    return (
                      <span key={code} style={{ fontFamily: "'Space Mono',monospace", fontSize: "7px", padding: "2px 6px", borderRadius: "3px", background: avail ? "#00E5A010" : "#FF444410", color: avail ? "#00E5A0" : "#FF4444", border: `1px solid ${avail ? "#00E5A025" : "#FF444425"}` }}>
                        {COUNTRIES[code].flag} {code} {avail ? "✅" : "🚫"}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "setup" && (
          <div style={{ background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: "12px", padding: "22px" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF9900", letterSpacing: "3px", marginBottom: "14px" }}>DEPLOYMENT GUIDE</div>
            {[
              ["1. Install dependencies", "npm install"],
              ["2. Add your keys to .env", "VITE_SERP_API_KEY=your_serpapi_key\nVITE_ADSENSE_ID=ca-pub-xxxxx\nVITE_ADMIN_PASS=yourpassword"],
              ["3. Run locally", "npm run dev"],
              ["4. Build for production", "npm run build"],
              ["5. Deploy to Vercel (free)", "vercel deploy  (install: npm i -g vercel)"],
              ["6. Add env vars on Vercel", "Vercel Dashboard → Project → Settings → Environment Variables"],
            ].map(([title, code], i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#FF9900", marginBottom: "6px" }}>{title}</div>
                <div style={{ background: "#111", border: "1px solid #1A1A1A", borderRadius: "6px", padding: "10px 14px", fontFamily: "'Space Mono',monospace", fontSize: "10px", color: "#00E5A0", whiteSpace: "pre-wrap" }}>{code}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery]         = useState("");
  const [searched, setSearched]   = useState("");
  const [country, setCountry]     = useState("US");
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [suggestions, setSugg]    = useState([]);
  const [showSugg, setShowSugg]   = useState(false);
  const [sortedStores, setSorted] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminErr, setAdminErr]   = useState("");
  const debRef = useRef(null);
  const c = COUNTRIES[country] || COUNTRIES.US;

  // Auto suggestions
  useEffect(() => {
    clearTimeout(debRef.current);
    if (query.length < 2) { setSugg([]); return; }
    debRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      const m = TRENDING.filter(t => t.toLowerCase().includes(q));
      const e = ["Pro", "Max", "Ultra", "Plus", "4K", "Wireless", "Gaming"].map(s => `${query} ${s}`);
      setSugg([...m, ...e].slice(0, 7));
      setShowSugg(true);
    }, 200);
  }, [query]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true); setError(""); setResults([]); setShowSugg(false);
    setSearched(q); setQuery(q);

    // Sort stores for this country
    const avail  = STORES.filter(s => isAvail(s, country));
    const banned = STORES.filter(s => !isAvail(s, country));
    const sorted = [...avail].sort((a, b) => {
      const aFree = getShip(a, country).toLowerCase().includes("free") ? 0 : 1;
      const bFree = getShip(b, country).toLowerCase().includes("free") ? 0 : 1;
      if (aFree !== bFree) return aFree - bFree;
      return b.trust - a.trust;
    });
    setSorted([...sorted, ...banned]);

    // SerpAPI — Google Shopping real prices
    if (!CONFIG.SERP_API_KEY) {
      setError("Add VITE_SERP_API_KEY in .env to see real prices.");
      setLoading(false);
      return;
    }

    try {
      const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&gl=${c.gl}&hl=${c.hl}&api_key=${CONFIG.SERP_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.shopping_results?.length) {
        // Sort by price ascending (cheapest first)
        const sorted = [...data.shopping_results].sort((a, b) => {
          const pa = parseFloat(a.extracted_price || a.price?.replace(/[^0-9.]/g, "") || 9999);
          const pb = parseFloat(b.extracted_price || b.price?.replace(/[^0-9.]/g, "") || 9999);
          return pa - pb;
        });
        setResults(sorted.slice(0, 15));
      } else {
        setError("No results found. Try a different search term.");
      }
    } catch (err) {
      setError("Search failed. Check your SerpAPI key in .env file.");
    }
    setLoading(false);
  }, [country, c]);

  const handleAdminLogin = () => {
    if (adminInput === CONFIG.ADMIN_PASS) { setShowAdmin(true); setShowLogin(false); setAdminInput(""); setAdminErr(""); }
    else setAdminErr("Wrong password!");
  };

  const cheapest = results[0] || null;

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        *{ box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{ width:4px; } ::-webkit-scrollbar-thumb{ background:#222; border-radius:2px; }
        input::placeholder{ color:#333; }
        @keyframes spin{ to{ transform:rotate(360deg); }}
        @keyframes fadeUp{ from{ opacity:0; transform:translateY(8px);} to{ opacity:1; transform:translateY(0);}}
        .fadein{ animation:fadeUp 0.3s ease forwards; }
      `}</style>

      <Ticker country={country} />

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "54px", background: "#060606", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#FF9900", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🔔</div>
          <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "18px", letterSpacing: "2px" }}>PRICE<span style={{ color: "#FF9900" }}>ALERT</span><span style={{ color: "#2A2A2A", fontSize: "12px" }}>.LIVE</span></span>
        </div>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: "6px", padding: "6px 10px", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "9px", outline: "none", cursor: "pointer" }}>
          {Object.entries(COUNTRIES).map(([code, d]) => (
            <option key={code} value={code}>{d.flag} {d.name} ({d.symbol})</option>
          ))}
        </select>
      </nav>

      {/* HERO */}
      <div style={{ padding: "44px 20px 28px", textAlign: "center", background: "radial-gradient(ellipse 70% 35% at 50% 0%,#FF990010,transparent)", borderBottom: "1px solid #111" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#FF9900", letterSpacing: "4px", marginBottom: "10px" }}>
          {c.flag} {c.name} · {STORES.filter(s => isAvail(s, country)).length} STORES · {c.symbol} {c.currency}
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "clamp(28px,6vw,62px)", color: "#fff", letterSpacing: "3px", lineHeight: 1, marginBottom: "6px" }}>
          REAL PRICES · <span style={{ color: "#FF9900" }}>CHEAPEST FIRST</span>
        </h1>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#444", marginBottom: "28px" }}>
          Google Shopping · {STORES.length} stores · {c.symbol} {c.currency} · Shipping shown · Banned marked
        </p>

        {/* SEARCH */}
        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", background: "#0D0D0D", border: "2px solid #1C1C1C", borderRadius: "12px", overflow: "hidden" }}>
            <span style={{ padding: "0 14px", fontSize: "18px", display: "flex", alignItems: "center", color: "#333" }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doSearch(query)}
              onFocus={() => query.length > 1 && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 160)}
              placeholder={`Search in ${c.name}... e.g. iPhone 16 Pro`}
              style={{ flex: 1, background: "transparent", border: "none", padding: "14px 8px", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "12px", outline: "none" }} />
            <button onClick={() => doSearch(query)}
              style={{ background: "#FF9900", border: "none", padding: "0 20px", fontFamily: "'Bebas Neue',cursive", fontSize: "16px", color: "#000", cursor: "pointer", letterSpacing: "1px", flexShrink: 0 }}>
              SEARCH
            </button>
          </div>
          {showSugg && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100%+4px)", left: 0, right: 0, background: "#0D0D0D", border: "1px solid #1C1C1C", borderRadius: "10px", overflow: "hidden", zIndex: 50, boxShadow: "0 16px 40px rgba(0,0,0,0.8)", marginTop: "4px" }}>
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => doSearch(s)}
                  style={{ padding: "10px 16px", fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "#777", cursor: "pointer", borderBottom: "1px solid #141414", display: "flex", gap: "8px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#141414"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ color: "#FF9900" }}>↗</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trending */}
        <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
          {TRENDING.slice(0, 8).map(t => (
            <button key={t} onClick={() => doSearch(t)}
              style={{ padding: "4px 12px", borderRadius: "20px", border: "1px solid #1C1C1C", background: "transparent", color: "#444", fontFamily: "'Space Mono',monospace", fontSize: "9px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF9900"; e.currentTarget.style.color = "#FF9900"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C1C1C"; e.currentTarget.style.color = "#444"; }}>
              {t}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.label} onClick={() => doSearch(cat.q)}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 13px", borderRadius: "8px", border: "1px solid #1C1C1C", background: "#0A0A0A", color: "#555", fontFamily: "'Space Mono',monospace", fontSize: "9px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF9900"; e.currentTarget.style.color = "#FF9900"; e.currentTarget.style.background = "#FF990010"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C1C1C"; e.currentTarget.style.color = "#555"; e.currentTarget.style.background = "#0A0A0A"; }}>
              <span style={{ fontSize: "13px" }}>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px" }}>

        {/* AD SLOT 1 — Homepage Banner */}
        <GoogleAd slot="1234567890" />

        {/* Homepage store grid */}
        {!searched && !loading && (
          <>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#333", letterSpacing: "3px", marginBottom: "12px" }}>
              {STORES.filter(s => isAvail(s, country)).length} STORES IN {c.flag} {c.name} · {STORES.filter(s => !isAvail(s, country)).length} UNAVAILABLE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "9px", marginBottom: "28px" }}>
              {STORES.map(s => {
                const avail = isAvail(s, country);
                return (
                  <button key={s.name}
                    onClick={() => avail && window.open(s.url("deals", country), "_blank", "noopener,noreferrer")}
                    style={{ padding: "14px 8px", background: "#0A0A0A", border: `1px solid ${avail ? s.color + "25" : "#141414"}`, borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: avail ? "pointer" : "default", opacity: avail ? 1 : 0.3, transition: "all 0.2s" }}
                    onMouseEnter={e => { if (avail) { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = s.color + "10"; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = avail ? s.color + "25" : "#141414"; e.currentTarget.style.background = "#0A0A0A"; }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "11px", color: avail ? s.color : "#333" }}>{s.name}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "7px", color: avail ? "#00E5A0" : "#FF4444" }}>{avail ? `✅ ${c.flag}` : `🚫 ${c.flag}`}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid #1A1A1A", borderTop: "3px solid #FF9900", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "16px", color: "#444", letterSpacing: "2px" }}>FETCHING REAL PRICES FOR {c.flag} {c.name}...</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#333", marginTop: "6px" }}>Google Shopping · Sorted cheapest first · {c.symbol} {c.currency}</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ background: "#FF444410", border: "1px solid #FF444430", borderRadius: "10px", padding: "16px 20px", fontFamily: "'Space Mono',monospace", fontSize: "11px", color: "#FF6666", textAlign: "center", marginBottom: "16px" }}>
            ⚠ {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="fadein">
            {/* Result header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444", letterSpacing: "2px", marginBottom: "3px" }}>
                  {results.length} RESULTS · {c.flag} {c.name} · {c.symbol} {c.currency} · SORTED CHEAPEST FIRST
                </div>
                <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "20px", color: "#fff", letterSpacing: "1px" }}>"{searched}"</div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {cheapest && (
                  <div style={{ background: "#FF990015", border: "1px solid #FF990040", borderRadius: "8px", padding: "8px 14px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "16px" }}>⭐</span>
                    <div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF9900" }}>CHEAPEST</div>
                      <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "18px", color: "#FF9900", lineHeight: 1 }}>
                        {fmtPrice(parseFloat(cheapest.extracted_price || cheapest.price?.replace(/[^0-9.]/g, "") || 0), country)}
                      </div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#555" }}>{cheapest.source}</div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => sortedStores.filter(s => isAvail(s, country)).forEach((s, i) => setTimeout(() => window.open(s.url(searched, country), "_blank", "noopener,noreferrer"), i * 150))}
                  style={{ background: "#FF9900", border: "none", borderRadius: "7px", padding: "8px 14px", fontFamily: "'Bebas Neue',cursive", fontSize: "13px", color: "#000", cursor: "pointer" }}>
                  🚀 OPEN ALL STORES
                </button>
              </div>
            </div>

            {/* AD SLOT 2 — Search Results Top */}
            <GoogleAd slot="2345678901" />

            {/* Real price results from SerpAPI */}
            {results.length > 0 && (
              <>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444", letterSpacing: "2px", marginBottom: "10px", marginTop: "6px" }}>
                  🛒 REAL PRICES FROM GOOGLE SHOPPING — CLICK TO BUY
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {results.map((item, i) => (
                    <ProductCard key={i} item={item} country={country} isTop={i === 0} />
                  ))}
                </div>
                {/* AD SLOT 3 — Between results */}
                <GoogleAd slot="3456789012" />
              </>
            )}

            {/* Store redirect section */}
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#444", letterSpacing: "2px", marginBottom: "10px", marginTop: "20px" }}>
              🏪 ALSO SEARCH ON THESE STORES — {sortedStores.filter(s => isAvail(s, country)).length} AVAILABLE · {sortedStores.filter(s => !isAvail(s, country)).length} BANNED IN {c.flag}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
              {sortedStores.map((s, i) => (
                <StoreRow key={s.name} store={s} country={country} query={searched} rank={i} />
              ))}
            </div>

            {/* AD SLOT 4 — Footer */}
            <GoogleAd slot="4567890123" />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #111", padding: "24px", textAlign: "center", marginTop: "40px" }}>
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "16px", color: "#FF9900", letterSpacing: "3px", marginBottom: "8px" }}>PRICEALERT.LIVE</div>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          {["Privacy", "Terms", "Affiliate Disclosure", "Contact"].map(l => (
            <span key={l} style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#1C1C1C", cursor: "pointer" }}>{l}</span>
          ))}
          {/* Hidden admin access — tiny invisible dot */}
          <span onClick={() => setShowLogin(true)} style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#080808", cursor: "pointer", userSelect: "none" }}>·</span>
        </div>
      </div>

      {/* Admin login modal */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.93)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && setShowLogin(false)}>
          <div style={{ background: "#0A0A0A", border: "1px solid #222", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "320px" }}>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "20px", color: "#FF9900", letterSpacing: "2px", marginBottom: "14px" }}>🔐 ADMIN ACCESS</div>
            <input type="password" value={adminInput} onChange={e => setAdminInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              placeholder="Password..."
              style={{ width: "100%", background: "#141414", border: `1px solid ${adminErr ? "#FF4444" : "#2A2A2A"}`, borderRadius: "7px", padding: "10px 13px", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: "12px", outline: "none", marginBottom: "8px", boxSizing: "border-box" }} />
            {adminErr && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "8px", color: "#FF4444", marginBottom: "8px" }}>{adminErr}</div>}
            <button onClick={handleAdminLogin}
              style={{ width: "100%", padding: "11px", background: "#FF9900", border: "none", borderRadius: "7px", fontFamily: "'Bebas Neue',cursive", fontSize: "15px", color: "#000", cursor: "pointer" }}>
              ENTER
            </button>
          </div>
        </div>
      )}

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      <AIAssistant query={searched} country={country} cheapestItem={cheapest} />
    </div>
  );
}
