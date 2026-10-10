# Requirements

## Frontend (frontend/)
- Plain HTML, CSS and JavaScript. No build step.
- Loaded from CDN: three.js r128 (3D), Google Fonts (Bricolage Grotesque, Noto Sans Telugu).
- Browser features: WebGL, localStorage, Web Speech API (read aloud, mic), IntersectionObserver, ResizeObserver.
- Telugu read-aloud needs a Telugu text-to-speech voice installed on the device.

## Backend (backend/)
- Node.js 18+ (uses built-in `fetch`)
- npm packages: `express`, `dotenv`
- Environment variables (`.env`):
  - `ANTHROPIC_API_KEY` – required for chat and photo check
  - `ANTHROPIC_MODEL` – optional, default `claude-sonnet-5-5`
  - `PORT` – optional, default 3000

## Data
- Crops, recipes, pests and AP/TG districts are arrays inside `frontend/js/app.js`.
- Diary data is saved in the user's browser (`localStorage`).

## Future needs
| Feature | Needs |
|---------|-------|
| Weather alerts | Weather API (IMD / OpenWeather), scheduled job |
| WhatsApp bot | WhatsApp Business API, webhook route |
| Mandi prices | Agmarknet / data.gov.in API, caching |
| Login + cloud diary | Database (PostgreSQL / MongoDB), authentication |
