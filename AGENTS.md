# MERZY — Repository Guide

## Overview
MERZY is a specialty coffee & bakery site (Alexandria, Egypt) split into a pure
frontend app and a Node.js API server. All frontend data is mocked in
`frontend/MERZY-Coffe/src/app/core/services/`; no secrets required.

## Structure
```
.github/workflows/    CI (frontend build + api-server syntax check)
api-server/           Node.js (Express) backend, ready for development
docs/                 Project documentation markdown
frontend/MERZY-Coffe/ Angular 18 app (all frontend code + public/ assets)
scripts/              Data collection / processing utilities
```

## Running the frontend
```powershell
cd frontend/MERZY-Coffe
npm install            # already installed locally
npx.cmd ng serve --port 4321 --host 0.0.0.0
```
- `npm.ps1` is blocked by execution policy on this machine — always use
  `npm.cmd` / `npx.cmd`, never bare `npm`/`npx`.
- Live reload is enabled; edits to `frontend/MERZY-Coffe/src/` appear automatically.
- Verification: `curl -sf http://localhost:4321/` returns 200 with the app HTML.

## Building
```powershell
cd frontend/MERZY-Coffe
npx.cmd ng build       # output: frontend/MERZY-Coffe/dist/merzy
```

## Running the api-server
```powershell
cd api-server
npm install
npm run dev            # http://localhost:4000/api/health
```
Endpoints: `/api/health`, `/api/menu`, `/api/orders` (POST), `/api/orders/:id`,
`/api/orders/:id/status` (PATCH). Statuses mirror the frontend flow
(Received → Preparing → Ready).

## Features
- Interactive menu with coffee & bakery items (add-to-cart)
- Slide-out floating rounded cart drawer (responsive)
- Order placement and status tracking (Received → Preparing → Ready)
- Real scraped Instagram photos in `frontend/MERZY-Coffe/public/scraped/instagram/`

## Design system
Centralized tokens in `frontend/MERZY-Coffe/src/styles.css` (`:root` block):
black ink `#0B0812`, violet accent `#5C0AB2` / bright `#8E4BF0` / soft
`#C9B8FA`, canvas `#F7F6FB`. Fonts: Sora (display) + Outfit (body).
Do not reintroduce browns/creams or per-component hardcoded colors — always use
tokens or the Tailwind ramp (`primary.*`, `dark.*`).

## Verification
- `curl -sf http://localhost:4321/` returns 200 with the app's HTML.
- Dev server log shows "Local/Network URLs" and "Watch mode enabled".
