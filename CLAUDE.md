# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server at http://localhost:3010
npm run build            # Production build
npm start                # Start production server on port 3010
npm run lint             # ESLint
npm test                 # Run all Jest tests
npm run test:watch       # Jest watch mode
npx jest __tests__/lib/storage.test.ts   # Run a single test file
```

## Architecture

Next.js 14 App Router application (TypeScript) for managing a personal reading list. All data is stored in a JSON file (`data/reading-list.json`) — no database.

### Data Flow

Frontend components call `lib/storage.ts` (a fetch-based API client) → Next.js API routes in `app/api/reading-list/route.ts` → read/write `data/reading-list.json` via `fs.promises`.

### API Routes

- `GET/POST/PUT/DELETE /api/reading-list` — standard CRUD. PUT takes `{ id, updates }`. DELETE uses query param `?id=`.
- `PUT /api/reading-list/bulk` — replaces all books at once.

### Key Directories

- `app/` — Next.js pages and API routes. `app/page.tsx` is the main page holding all filter/display state.
- `components/` — Client components (`'use client'`). All use inline CSS via `style` prop.
- `lib/` — Business logic: `storage.ts` (API client), `bookApi.ts` (Open Library + Google Books metadata fetching), `notionParser.ts` (CSV/Markdown import), `analytics.ts` (dashboard stats), `deduplication.ts`.
- `types/book.ts` — `Book` and `BookMetadata` interfaces, `ReadingStatus` and `BookFormat` types.
- `__tests__/lib/` — Unit tests for lib modules. Tests mock `fetch` globally and use a `createBook()` helper for test data.

### Patterns

- State management: React hooks in `app/page.tsx` — no Redux or Context.
- External APIs: Google Books tried first, falls back to Open Library (`lib/bookApi.ts`).
- Deployment: `deploy.sh` pulls from GitHub, runs `npm ci && npm run build`, restarts via PM2.
