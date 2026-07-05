# ARCHITECTURE

A simple URL shortener — paste a long URL, get a short one back, and redirect visitors who follow it.

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| UI | React (client components) + Tailwind CSS | 19 / 4 |
| Components | Shadcn UI (`components/ui/`) | — |
| Forms | react-hook-form | 7 |
| DB | MongoDB via Mongoose | 9 |
| ID gen | nanoid | 5 |

## System Flow

### 1. Shortening a URL

```
User → Home page (/) → submits form → POST /api/shorten_url → generates code → stores in MongoDB → redirects to /result?c={code}
```

1. User visits `/` ([app/page.tsx](app/page.tsx)) and enters a URL.
2. On submit, the form POSTs `{ url }` to `/api/shorten_url` ([app/api/shorten_url/route.ts](app/api/shorten_url/route.ts)).
3. The API validates the URL (must be non-empty, must parse as `new URL()`).
4. A 7-character nanoid is generated ([lib/shortener.ts](lib/shortener.ts)).
5. A document `{ originalUrl, code, clicks: 0 }` is inserted into MongoDB.
6. The API returns `{ code }` and the client redirects to `/result?c={code}`.
7. The result page ([app/result/page.tsx](app/result/page.tsx)) displays the full short URL with copy-to-clipboard.

### 2. Redirecting

```
Visitor → /{code} → GET [code]/route.ts → MongoDB lookup → 301 redirect → original URL
```

1. Anyone visits `/{code}` (e.g., `https://short.example/abc1234`).
2. The route handler ([app/[code]/route.ts](app/[code]/route.ts)) extracts `code` from the URL.
3. It queries MongoDB for a document matching that code.
4. **Found:** increments the `clicks` counter and returns a **301 permanent redirect** to `originalUrl`.
5. **Not found:** returns a plain 404.

## Project Structure

```
├── app/
│   ├── [code]/route.ts      # GET — lookup + redirect (server)
│   ├── api/shorten_url/
│   │   └── route.ts          # POST — create short URL (server)
│   ├── result/page.tsx       # Result page with copy-to-clipboard (client)
│   ├── page.tsx              # Home page with URL form (client)
│   ├── layout.tsx            # Root layout (server)
│   └── globals.css           # Tailwind + theme
├── components/ui/            # Shadcn primitives (button, card, input, etc.)
├── lib/
│   ├── db.ts                 # MongoDB connection (cached singleton)
│   ├── shortener.ts          # nanoid-7 wrapper
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── model/
│   ├── schema.ts             # Mongoose schema + IUrl type
│   └── model.ts              # Mongoose model (singleton)
├── package.json
├── next.config.ts
└── tsconfig.json
```

## Data Model

**Collection:** `urls` (Mongoose maps model name `Url` → `urls`)

| Field        | Type     | Constraints          |
|--------------|----------|----------------------|
| `originalUrl`| String   | required             |
| `code`       | String   | required, **unique** |
| `clicks`     | Number   | default: 0           |
| `createdAt`  | Date     | auto (timestamps)    |
| `updatedAt`  | Date     | auto (timestamps)    |

Code uniqueness is enforced at the DB level, but collisions are not handled in application code.

## API Endpoints

### `POST /api/shorten_url`

| Item       | Detail |
|------------|--------|
| Body       | `{ url: string }` |
| Success    | `200 { code: string }` |
| Errors     | `400 { error: "URL is required" }` / `400 { error: "Invalid URL" }` |

### `GET /[code]`

| Item       | Detail |
|------------|--------|
| Success    | `301` redirect to `originalUrl` |
| Error      | `404 Not Found` (plain text) |

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |

No `.env.example` is included — add one if onboarding new developers.

## Considerations for Future Developers

- **Code collisions are not handled.** nanoid(7) provides ~2.8 billion IDs at ~1% collision probability after ~7,500 entries. For production, either increase the length or add retry-on-duplicate-key logic in `registerUrl()`.

- **No authentication or rate limiting.** Anyone can call `POST /api/shorten_url` as many times as they want. Adding a CAPTCHA, API key, or IP-based rate limiter is recommended before public deployment.

- **No URL normalization.** `https://example.com` and `http://example.com` (or even `example.com`) are stored as-is and get different short codes. Consider normalizing URLs before storage (strip trailing slashes, force lowercase hostname, etc.).

- **301 permanent redirect.** Browsers cache 301s aggressively — once a visitor follows a short link, their browser may skip the server entirely on subsequent visits. This makes click counts inaccurate for repeat visitors. Consider `302` (temporary) if accurate analytics matter more than SEO.

- **Clicks are tracked but not exposed.** The model has a `clicks` field and the redirect handler increments it, but there's no dashboard or stats page. Building one would be a natural next step.

- **No custom slugs.** Every URL gets a random 7-char code. Supporting user-chosen slugs (e.g., `/my-team-page`) would require a separate field and conflict-resolution logic.

- **No `.env.example`.** The only env var (`MONGODB_URI`) is undocumented outside this file. Create a `.env.example` for quicker onboarding.

- **MongoDB connection is cached on `globalThis`.** The pattern in [lib/db.ts](lib/db.ts) avoids creating a new connection on every hot-reload in development. If you move to a serverless platform (Vercel, Lambda), note that `globalThis` may not persist between invocations — consider connection pooling or an edge-compatible driver.
