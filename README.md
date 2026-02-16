# OG Miner 🌐⛏

**The Ultimate OpenGraph & Metadata Extraction API.**

OG Miner is a high-performance API designed for developers building link previews, social media integrations, and content aggregation tools. Extract rich metadata, screenshots, and visual assets from any URL with a single request.

[**Learn More**](https://og-miner-fe.vercel.app/)

[**Checkout on RapidAPI**](https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api)

[**Swagger Doc**](https://opengraph-api-216d0279de39.herokuapp.com/docs)

## ⚡ Why OG Miner?

-   **Unmatched Speed**: Powered by Redis caching for sub-millisecond response times.
-   **Visual Intelligence**: Capture full-page screenshots and resize images on the fly.
-   **Smart Extraction**: Handles Single Page Applications (React, Vue) via headless Chrome.
-   **Anti-Blocking**: Built-in proxy rotation and geo-targeting. [Beta]

## 🚀 Deep Dive: Capabilities

### 1. Rich Metadata Extraction
The core of OG Miner. It doesn't just parse HTML; it intelligently aggregates data from multiple sources to give you the most complete picture of a URL.

*   **Multi-Source Parsing**: Prioritizes OpenGraph (`og:` tags), falls back to Twitter Cards (`twitter:`), and finally parses standard HTML `<meta>` tags.
*   **Schema.org & JSON-LD**: Extracts structured data (Product, Article, Recipe) embedded in JSON-LD scripts, crucial for E-commerce and SEO tools.
*   **oEmbed Discovery**: Automatically discovers and fetches oEmbed data (e.g., YouTube provider details) for rich media embedding.

**Request:**
```bash
curl -X POST "https://og-miner-api.herokuapp.com/v1/extract" \
     -H "Content-Type: application/json" \
     -H "X-RapidAPI-Proxy-Secret: YOUR_SECRET_KEY" \
     -d '{"url": "https://github.com"}'
```

---

### 2. Smart Screenshots
Capture pixel-perfect representations of any webpage.

*   **Full Page Capture**: Automatically scrolls and stitches the entire page, perfect for archiving or auditing.
*   **Viewport Control**: Simulate mobile devices or specific desktop resolutions (e.g., 1920x1080).
*   **Dark Mode Simulation**: Forces `prefers-color-scheme: dark` to capture the dark theme of supported websites.
*   **Lazy Loading Handling**: Waits for network idle state to ensure images and dynamic content are fully loaded before capturing.

**Request:**
```json
// POST /v1/screenshot
{
  "url": "https://stripe.com",
  "full_page": true,
  "dark_mode": true
}
```

---

### 3. Headless Rendering (SPA Support)
Standard HTTP requests fail on modern React/Vue/Angular apps (SPAs) because the HTML is empty until JavaScript runs.

*   **Real Browser**: Launches a headless Chromium instance via Playwright to execute the page's JavaScript.
*   **DOM Hydration**: Waits for the "hydration" phase to complete, ensuring the metadata you extract reflects the *actual* content the user sees.
*   **Resource Blocking**: Intelligently blocks ads, trackers, and media to speed up rendering and reduce bandwidth.

**Request:**
```json
// POST /v1/extract
{
  "url": "https://www.instagram.com/p/...",
  "enable_javascript": true
}
```

---

### 4. Image Proxy & Optimization
Securely delivery external images to your users without exposing their IP or dealing with mixed-content warnings.

*   **Anonymity**: The API fetches the image, not the user's browser, preventing tracking pixels from third parties.
*   **Intelligent Resizing**: Define a `width` (e.g., 300px), and the API calculates the height to preserve aspect ratio using high-quality LANCZOS resampling.
*   **Format Conversion**: Automatically converts heavy PNGs/JPEGs to **WebP**, reducing file size by 30-50% for faster page loads.

**Request:**
```
GET /v1/image?url=https://example.com/huge.png&width=600
```

---

### 5. Batch Processing
High-throughput analysis for bulk operations.

*   **Parallel Execution**: Processes up to 50 URLs concurrently using async/await non-blocking I/O.
*   **Resiliency**: Individual failures (e.g., one 404 URL) do not fail the entire batch.
*   **Unified Response**: Returns a dictionary keyed by URL, making it easy to map results back to your source data.

**Request:**
```json
// POST /v1/batch/extract
{
  "urls": ["https://google.com", "https://apple.com"]
}
```

---

## 🌍 Global Infrastructure (Beta)

### Geo-Targeting
Preview content as it appears in specific regions. Useful for testing localization or bypassing geo-blocks.
*   **Param**: `country: "US"`, `country: "EU"`.

### BYOP (Bring Your Own Proxy)
Enterprise-grade flexibility.
*   **Corporate Firewalls**: Access internal tools or staging environments by tunnelling through your own proxy.
*   **Residential IPs**: Use your premium residential proxy providers (BrightData, Oxylabs) for high-stealth scraping.

## 🎮 Try it Live

Test the API directly in your browser:
[**Launch Live Demo**](https://opengraph-api-216d0279de39.herokuapp.com/docs)

[**Checkout on RapidAPI**](https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api)

---

&copy; 2026 OG Miner. API service built by [sasmithaK](https://github.com/sasmithaK). UI built by [isaraSE](https://github.com/isaraSE).

