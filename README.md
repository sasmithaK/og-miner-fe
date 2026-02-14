# OpenGraph Miner 🌐⛏

Welcome to documentation for **OG Miner: The OpenGraph Miner**.
OG Miner is a production-ready API for extracting structured metadata and screenshots from any public URL.

## 🚀 Features

-   **High Performance**: Powered by FastAPI and Redis caching for sub-millisecond response times.
-   **Headless Browser Support**: Built-in Playwright support to render JavaScript-heavy sites (SPAs).
-   **Enterprise Ready**: Includes SSRF protection, rate limiting, and User-Agent rotation.
-   **Rich Data Extraction**: Extracts OpenGraph, Twitter Cards, JSON-LD schemas, Favicons, and Author data.

## 🛠️ Tech Stack

-   **Language**: Python 3.10+
-   **Framework**: FastAPI
-   **Browser**: Playwright (Chromium)
-   **Cache**: Redis
-   **Task Runner**: Uvicorn

## 📚 API Reference

**Base URL:** `https://og-miner.p.rapidapi.com/`

### `POST /v1/extract`

Main endpoint to scrape and parse a URL.

#### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | string | - | **Required.** The target URL to scrape. |
| `force_refresh` | bool | `false` | Skip the cache and fetch fresh data. |
| `enable_javascript` | bool | `false` | Use a headless browser (Playwright) to render the page. Useful for SPAs. |

#### Example Request

```bash
curl -X POST "https://og-miner.p.rapidapi.com/v1/extract" \
     -H "Content-Type: application/json" \
     -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
     -H "X-RapidAPI-Host: og-miner.p.rapidapi.com" \
     -d '{
           "url": "https://www.github.com",
           "enable_javascript": false
         }'
```

#### Response Structure

```json
{
  "meta": {
    "url": "https://github.com",
    "domain": "github.com",
    "latency_ms": 245.5
  },
  "data": {
    "title": "GitHub: Let's build from here",
    "description": "...",
    "image": "https://github.githubassets.com/...",
    "favicon": "https://github.com/favicon.ico",
    "site_name": "GitHub",
    "oembed": { ... },
    "json_ld": [ ... ]
  }
}
```

## 📖 Guides & Use Cases

### 1. Building a Link Preview Card
Use the API to generate social media style cards for your chat app or forum.

### 2. Handling Single Page Apps (SPAs)
Standard scrapers fail on sites like Instagram or dynamic React apps. Use `enable_javascript: true` to handle these.
*Note: Headless requests take longer (2-5s).*

### 3. Error Codes
-   **200**: Success.
-   **400**: Invalid URL.
-   **429**: Rate limit exceeded.
-   **504**: Timeout.

## 🤝 Contact & Support

Need a custom enterprise plan or found a bug?

-   **GitHub**: [Report Issues](https://github.com/sasmithaK/og-miner-fe/issues)
-   **LinkedIn**: [Connect with Creator](https://www.linkedin.com/in/sasmithakg/)

---

&copy; 2026 OG Miner. Documentation Version 1.0. Built with 🧡 by [sasmithaK](https://github.com/sasmithaK).
