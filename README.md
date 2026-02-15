# OG Miner 🌐⛏

**The Ultimate OpenGraph & Metadata Extraction API.**

OG Miner is a high-performance API designed for developers building link previews, social media integrations, and content aggregation tools. Extract rich metadata, screenshots, and visual assets from any URL with a single request.

## ⚡ Why OG Miner?

-   **Unmatched Speed**: Powered by Redis caching for sub-millisecond response times.
-   **Visual Intelligence**: Capture full-page screenshots and resize images on the fly.
-   **Smart Extraction**: Handles Single Page Applications (React, Vue) via headless Chrome.
-   **Anti-Blocking**: Built-in proxy rotation and geo-targeting. [Beta]

## 🚀 Key Capabilities

### 1. Rich Metadata
Instantly retrieve OpenGraph, Twitter Cards, JSON-LD, oEmbed, and Favicons.
```bash
curl -X POST "https://og-miner-api.herokuapp.com/v1/extract" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://github.com"}'
```

**Response:**
```json
{
  "meta": {
    "url": "https://github.com",
    "domain": "github.com",
    "latency_ms": 245
  },
  "data": {
    "title": "GitHub: Let's build from here",
    "description": "GitHub is where over 100 million developers shape the future of software...",
    "image": "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
    "favicon": "https://github.com/favicon.ico",
    "site_name": "GitHub",
    "oembed": { ... }
  }
}
```

### 2. Smart Screenshots
Capture pixel-perfect screenshots of any webpage. customize viewport, full-page mode, and dark/light themes.
```json
// POST /v1/screenshot
{
  "url": "https://stripe.com",
  "full_page": true,
  "dark_mode": true
}
```

**Response:**
```json
{
  "screenshot": "iVBORw0KGgoAAAANSUhEUgAABAAAAAMgCAYAAAC...", // Base64 encoded PNG
  "meta": {
    "width": 1280,
    "height": 4500,
    "size_kb": 1240
  }
}
```

### 3. Headless Rendering
Scrape JavaScript-heavy sites (Instagram, TikTok) that standard scrapers miss.
```json
// POST /v1/extract
{
  "url": "https://www.instagram.com/p/...",
  "enable_javascript": true
}
```

### 4. Image Resizing & Proxying
Securely proxy and resize external images to WebP format to reduce bandwidth and improve loading speed.
```
GET /v1/image?url=https://example.com/huge.png&width=600
```

### 5. Batch Processing
Analyze up to 50 URLs in parallel with a single API call.

```json
// POST /v1/batch/extract
{
  "urls": ["https://google.com", "https://apple.com"]
}
```

**Response:**
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": {
    "https://google.com": { "status": "success", "data": { "title": "Google", ... } },
    "https://apple.com": { "status": "success", "data": { "title": "Apple", ... } }
  }
}
```

## 🌍 Global Infrastructure (Beta)

-   **Geo-Targeting**: Simulate requests from US, EU, or Asia to see localized content.
-   **BYOP (Bring Your Own Proxy)**: Integrate your own premium residential proxies for sensitive targets.

## 🎮 Try it Live

Test the API directly in your browser:
[**Launch Live Demo**](https://sasmithak.github.io/og-miner-fe/)

---

&copy; 2026 OG Miner . Built with 🧡 by [sasmithaK](https://github.com/sasmithaK)
