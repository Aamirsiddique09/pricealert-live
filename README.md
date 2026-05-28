# 🔔 PriceAlert.live — Secure Version

## ⚡ Quick Start

### 1. Install & Run
```
npm install
npm run dev
```

### 2. .env file mein keys daalo:
```
SERP_API_KEY=tumhari_serpapi_key      ← Server-side only (SAFE)
VITE_ADSENSE_ID=ca-pub-5476552730403893
VITE_ADMIN_PASS=tumhara_password
```

## 🚀 Vercel Deploy

### Environment Variables (Vercel Dashboard):
```
SERP_API_KEY       = tumhari_serpapi_key   ← NO VITE_ prefix!
VITE_ADSENSE_ID    = ca-pub-5476552730403893
VITE_ADMIN_PASS    = tumhara_password
```

### Steps:
1. GitHub pe push karo
2. vercel.com → New Project → Repo select
3. Env vars add karo (upar wale)
4. Deploy!

## 🔐 Security
- SerpAPI key browser mein KABHI nahi jaati
- /api/search serverless function key ko hide karta hai
- Only safe public IDs browser mein hain

## 🔑 Admin Access
Footer mein tiny dot "·" → password se andar jao

