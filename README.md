# OrganicMitra – సేంద్రీయ మిత్ర

Telugu + English organic-farming helper for small farmers in Andhra Pradesh and Telangana.
Crop advisor, day-by-day crop plan (3D), organic input recipes, pest doctor, photo check,
farm diary, savings calculator and an AI chat assistant ("Mitra").

## Project structure

```
organicmitra/
├── README.md
├── package.json            # backend dependencies and scripts
├── .env.example            # copy to .env and add your key
├── .gitignore
├── frontend/               # what the farmer sees (static files)
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js          # UI, crop data, recipes, pests, diary, 3D scenes, chat
│       └── api.js          # talks to the backend (/api/chat) and handles downloads
├── backend/                # Node.js + Express server
│   ├── server.js           # starts server, serves frontend, mounts API routes
│   └── routes/
│       ├── chat.js         # POST /api/chat  -> Anthropic API (chat + photo check)
│       └── health.js       # GET  /api/health
└── docs/
    └── REQUIREMENTS.md     # what the project needs
```

## Requirements

- Node.js 18 or newer (https://nodejs.org)
- An Anthropic API key (only for chat and photo check; the rest works without it)
- A modern browser with WebGL (Chrome, Edge, Safari)

See `docs/REQUIREMENTS.md` for the full list.

## Run it

```bash
npm install
cp .env.example .env      # on Windows: copy .env.example .env
# open .env and paste your ANTHROPIC_API_KEY
npm start
```

Open http://localhost:3000

Without an API key the site still runs. Ask Mitra falls back to the built-in recipes and
pest guide, and Photo check shows a message that AI is not available.

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Returns `{ ok: true, ai: true/false }` |
| POST | `/api/chat` | Body: `{ messages: [{role, content}], image?: {media_type, data} }`. Returns `{ text }` |

The API key lives only in `.env` on the server; the browser never sees it.

## How it works

- `app.js` calls `window.claude.use("sample")` for AI and `use("downloads")` for saving files.
- Inside Claude those already exist. On a normal website, `api.js` creates them: AI calls
  go to `/api/chat`, downloads use a normal browser download.
- The farm diary is stored in the browser's `localStorage` (per device).

## Deploy

Any Node host works (Render, Railway, a VPS). Set the environment variables from `.env.example`,
run `npm install` and `npm start`.

## Roadmap

- Weather alerts
- WhatsApp bot
- Mandi prices
- Login and cloud-synced diary (needs a database)
- More states and languages

## Limitations

- Crop scores and district lists are approximate, not official data.
- Soil animation shows typical trends, not measured values.
- AI advice is an estimate. For serious problems contact the local KVK or Kisan Call Centre 1800-180-1551.

Recipes follow traditional natural-farming practice; quantities vary by region. Test on a small plot first.
