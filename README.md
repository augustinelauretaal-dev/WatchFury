# 🎬 WatchFury — K-Drama Streaming Platform

A full-featured K-drama streaming platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, inspired by KissKH. Powered by the TMDB API for metadata and multiple free embed providers for streaming.

> ⚠️ **Disclaimer:** This project is built **for personal and educational purposes only**. It does not host or distribute any video content. All streams are sourced from third-party public embed providers. Please respect copyright laws in your country.

---

## ✨ Features

- 🎭 **K-Drama, C-Drama, Hollywood, Anime** — all in one place
- 🔍 **Live Search** — real-time results with debounced input
- 📺 **Multi-Server Player** — 10 embed providers with auto-fallback UI
- 🗂️ **Season & Episode Selector** — full season/episode navigation
- 🌟 **Hero Banner Carousel** — auto-advancing featured titles
- 📱 **Fully Responsive** — mobile, tablet, and desktop layouts
- 🌙 **Dark Theme** — Netflix-inspired dark UI throughout
- ⚡ **ISR Caching** — TMDB responses cached at the edge (1hr TTL)
- 🔗 **REST Streaming API** — `/api/stream` returns all embed sources as JSON

---

## 🗂️ Project Structure

```
kdrama/
├── app/
│   ├── page.tsx                        # Home page (Server Component)
│   ├── layout.tsx                      # Root layout (Navbar + Footer)
│   ├── loading.tsx                     # Global loading skeleton
│   ├── not-found.tsx                   # 404 page
│   ├── explore/page.tsx                # Browse/filter page
│   ├── search/page.tsx                 # Search results page
│   ├── drama/[id]/
│   │   ├── page.tsx                    # Drama detail page
│   │   └── watch/page.tsx              # Streaming / watch page
│   └── api/
│       ├── search/route.ts             # GET /api/search?q=
│       ├── stream/route.ts             # GET /api/stream?id=&s=&ep=
│       ├── drama/[id]/route.ts         # GET /api/drama/:id
│       └── drama/[id]/season/[season]/ # GET /api/drama/:id/season/:season
│           └── route.ts
├── components/
│   ├── Navbar.tsx                      # Top navigation bar
│   ├── Footer.tsx                      # Site footer
│   ├── HeroBanner.tsx                  # Auto-carousel hero section
│   ├── DramaCard.tsx                   # Individual drama thumbnail card
│   ├── DramaRow.tsx                    # Horizontal scrollable category row
│   ├── VideoPlayer.tsx                 # Multi-server iframe player
│   ├── EpisodeList.tsx                 # Season/episode selector sidebar
│   └── SearchModal.tsx                 # Full-screen search overlay
├── lib/
│   ├── tmdb.ts                         # TMDB API helper functions
│   ├── streaming.ts                    # Streaming provider registry (10 sources)
│   └── types.ts                        # TypeScript interfaces
├── .env.example                        # Environment variable template
├── tailwind.config.ts                  # Custom dark theme colours
└── next.config.mjs                     # Next.js config (image domains)
```

---

## 🚀 Getting Started

### 1. Clone or download the project

```bash
git clone <your-repo-url>
cd kdrama
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free TMDB API key

1. Create a free account at [https://www.themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API**
3. Copy the **"API Read Access Token (v4 auth)"** — it's a long JWT string starting with `eyJ...`

> Do **not** use the short v3 API key — use the long Read Access Token.

### 4. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your token:

```env
TMDB_ACCESS_TOKEN=eyJhbGciOiJSUzI1NiJ9...your_token_here
NEXT_PUBLIC_SITE_NAME=WatchFury
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EMBED_BASE_URL=https://vidsrc.to/embed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Streaming API

WatchFury includes a built-in REST API at `/api/stream` that returns all available embed sources for any TMDB title.

### `GET /api/stream`

Returns a list of streaming embed URLs for a TV episode or movie.

#### Query Parameters

| Parameter | Type   | Default | Description                       |
|-----------|--------|---------|-----------------------------------|
| `id`      | number | —       | **Required.** TMDB show/movie ID  |
| `type`    | string | `tv`    | `tv` or `movie`                   |
| `s`       | number | `1`     | Season number (TV only)           |
| `ep`      | number | `1`     | Episode number (TV only)          |

#### Example Request

```
GET /api/stream?id=131631&s=1&ep=1
```

#### Example Response

```json
{
  "tmdbId": 131631,
  "type": "tv",
  "season": 1,
  "episode": 1,
  "total": 10,
  "providers": [
    { "id": "vidsrc-to", "name": "VidSrc",     "badge": "HD",  "hasSubs": true  },
    { "id": "vidsrc-me", "name": "VidSrc.me",  "badge": "HD",  "hasSubs": true  },
    { "id": "vidsrc2",   "name": "VidSrc2",    "badge": "HD",  "hasSubs": true  },
    { "id": "2embed",    "name": "2Embed",      "badge": "SUB", "hasSubs": true  },
    { "id": "embedsu",   "name": "EmbedSu",    "badge": "SUB", "hasSubs": true  },
    { "id": "multiembed","name": "MultiEmbed", "badge": null,  "hasSubs": false },
    { "id": "smashy",    "name": "SmashyStream","badge": "HD", "hasSubs": false },
    { "id": "autoembed", "name": "AutoEmbed",  "badge": null,  "hasSubs": true  },
    { "id": "filmku",    "name": "FilmKu",     "badge": "SUB", "hasSubs": true  },
    { "id": "rive",      "name": "Rive",        "badge": "4K", "hasSubs": true  }
  ],
  "sources": [
    {
      "id": "vidsrc-to",
      "name": "VidSrc",
      "url": "https://vidsrc.to/embed/tv/131631/1/1",
      "type": "embed",
      "badge": "HD",
      "badgeColor": "blue",
      "hasSubs": true
    },
    ...
  ]
}
```

#### `POST /api/stream`

Same as `GET` but accepts a JSON body — useful when you don't want IDs visible in the URL.

```json
{
  "id": 131631,
  "type": "tv",
  "season": 1,
  "episode": 1
}
```

---

### Other API Endpoints

| Route                                | Method | Description                              |
|--------------------------------------|--------|------------------------------------------|
| `/api/search?q=Crash+Landing`        | GET    | Search TV shows via TMDB                 |
| `/api/drama/:id`                     | GET    | Full drama details (credits, videos, etc)|
| `/api/drama/:id/season/:season`      | GET    | All episodes for a specific season       |

---

## 📺 Streaming Providers

All providers accept TMDB IDs — no separate scraping or API keys required.

| # | Provider      | TV Support | Movie Support | Quality | Built-in Subs |
|---|---------------|-----------|---------------|---------|---------------|
| 1 | **VidSrc**    | ✅         | ✅             | HD      | ✅             |
| 2 | **VidSrc.me** | ✅         | ✅             | HD      | ✅             |
| 3 | **VidSrc2**   | ✅         | ✅             | HD      | ✅             |
| 4 | **2Embed**    | ✅         | ✅             | SD–HD   | ✅             |
| 5 | **EmbedSu**   | ✅         | ✅             | HD      | ✅             |
| 6 | **MultiEmbed**| ✅         | ✅             | SD–HD   | ❌             |
| 7 | **SmashyStream**| ✅       | ✅             | HD      | ❌             |
| 8 | **AutoEmbed** | ✅         | ✅             | HD      | ✅             |
| 9 | **FilmKu**    | ✅         | ✅             | HD      | ✅             |
|10 | **Rive**      | ✅         | ✅             | 4K      | ✅             |

> **Tip:** If a server shows a black screen or an error, click the next numbered server button in the player. All 10 servers are tried in order.

---

## 🎮 Player Keyboard Shortcuts

| Key         | Action                        |
|-------------|-------------------------------|
| `←`         | Switch to previous server     |
| `→`         | Switch to next server         |
| `R`         | Refresh / reload current server|

---

## 🛠️ Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint
npm run lint
```

---

## 🔧 Customisation

### Adding a new streaming provider

Open `lib/streaming.ts` and add a new entry to the `PROVIDERS` array:

```typescript
{
  id: 'my-provider',
  name: 'MyProvider',
  badge: 'HD',
  badgeColor: 'blue',      // 'blue' | 'green' | 'purple' | 'pink'
  hasSubs: true,
  tv: (id, s, ep) => `https://myprovider.com/embed/tv/${id}/${s}/${ep}`,
  movie: (id)     => `https://myprovider.com/embed/movie/${id}`,
},
```

That's it — the VideoPlayer and `/api/stream` endpoint will automatically include it.

### Disabling a provider temporarily

Set `disabled: true` on any provider config:

```typescript
{
  id: 'multiembed',
  name: 'MultiEmbed',
  disabled: true,   // ← hides from UI and API
  ...
}
```

### Changing the theme accent colour

In `tailwind.config.ts`, update the `primary` colour:

```typescript
colors: {
  primary: "#ff2d55",      // hot pink (default)
  // primary: "#e50914",   // Netflix red
  // primary: "#0ea5e9",   // sky blue
}
```

Then update the matching `--primary` CSS variable in `app/globals.css`.

---

## 🗺️ Pages Reference

| Page                      | URL                           | Description                          |
|---------------------------|-------------------------------|--------------------------------------|
| Home                      | `/`                           | Hero banner + category rows           |
| Explore / Browse          | `/explore`                    | Filter by country, genre, sort order  |
| Search Results            | `/search?q=query`             | Full-page search results grid         |
| Drama Detail              | `/drama/:tmdbId`              | Poster, cast, seasons, similar titles |
| Watch Episode             | `/drama/:tmdbId/watch?s=1&ep=1`| Video player + episode list sidebar  |

---

## 🔒 Environment Variables Reference

| Variable                    | Required | Description                                      |
|-----------------------------|----------|--------------------------------------------------|
| `TMDB_ACCESS_TOKEN`         | ✅ Yes    | TMDB v4 Read Access Token (JWT)                  |
| `TMDB_API_KEY`              | ❌ No     | TMDB v3 API key (optional fallback)              |
| `NEXT_PUBLIC_SITE_NAME`     | ❌ No     | Site display name (default: `WatchFury`)           |
| `NEXT_PUBLIC_SITE_URL`      | ❌ No     | Canonical URL (used for Open Graph metadata)     |
| `NEXT_PUBLIC_EMBED_BASE_URL`| ❌ No     | Override default embed base URL                  |

---

## 🧰 Tech Stack

| Technology        | Version  | Purpose                          |
|-------------------|----------|----------------------------------|
| Next.js           | 14.2.5   | React framework (App Router)     |
| TypeScript        | ^5       | Type safety                      |
| Tailwind CSS      | ^3.4     | Utility-first styling            |
| lucide-react      | ^0.395   | Icon library                     |
| clsx              | ^2.1     | Conditional className utility    |
| TMDB API v3       | —        | Drama metadata, posters, cast    |

---

## 📄 License

This project is provided **for educational and personal use only**.

- No video content is hosted by this project.
- All stream embeds are sourced from third-party public providers.
- TMDB data is used under the [TMDB API Terms of Use](https://www.themoviedb.org/api-terms-of-use).
- Poster/backdrop images belong to their respective copyright holders.

Use responsibly.

---

<p align="center">Built with ❤️ for K-Drama fans · Powered by TMDB</p>
```

Now let me create the README properly via the editor and then do a final `npm run dev` check: