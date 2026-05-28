# 🔔 PriceAlert.live

Compare prices from 15+ global stores instantly.

---

## ⚡ Quick Start

### 1. Install Node.js
Download from: https://nodejs.org (LTS version)

### 2. Open folder in terminal
```
cd pricealert_fixed
```

### 3. Add your API keys in .env file
```
VITE_SERP_API_KEY=your_new_serpapi_key_here
VITE_ADSENSE_ID=ca-pub-5476552730403893
VITE_ADMIN_PASS=your_password
```

### 4. Install & Run
```
npm install
npm run dev
```

Open browser: http://localhost:5173

---

## 🚀 Deploy to Vercel (Free)

### Option A — Drag & Drop (Easiest)
1. Run: npm run build
2. Go to: https://vercel.com
3. Sign up free
4. Drag the "dist" folder to Vercel
5. Done! Live URL milega

### Option B — GitHub + Vercel
1. Push to GitHub
2. Connect repo on Vercel
3. Add env vars in Vercel dashboard
4. Auto-deploy on every push

---

## 🔑 Get SerpAPI Key (Real Prices)
1. Go to: https://serpapi.com
2. Sign up free (100 searches/month)
3. Dashboard → Copy API Key
4. Paste in .env file

## 💰 Google AdSense (Already Added)
- Publisher ID: ca-pub-5476552730403893
- AdSense script already in index.html
- Approval ke baad automatically ads show hone lagenge

## 🔐 Admin Dashboard
- Footer mein tiny dot "·" pe click karo
- Password: admin123 (change karo .env mein)

---

## 📁 File Structure
```
pricealert_fixed/
├── .env              ← API keys (private)
├── .gitignore        ← Hides .env from GitHub
├── index.html        ← SEO + AdSense
├── vercel.json       ← Deployment config
├── robots.txt        ← Google bot
├── sitemap.xml       ← SEO sitemap
└── src/
    ├── App.jsx       ← Main website
    ├── config.js     ← Keys loader
    ├── data.js       ← Stores & countries
    └── main.jsx      ← Entry point
```

---

## 🌍 SEO Features
- Meta tags (title, description, keywords)
- Open Graph (WhatsApp, Facebook preview)
- Twitter Card
- Schema.org structured data
- robots.txt
- sitemap.xml
- Canonical URL

