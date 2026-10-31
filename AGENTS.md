# MERZY — Repository Guide

## Overview
MERZY is a specialty coffee & bakery site (Alexandria, Egypt) split into a pure
frontend app and an ASP.NET Core 8 + EF Core + SQL Server API backend
(Clean Architecture). All frontend data is mocked in
`merzy-coffee/src/app/core/services/`; no secrets required.

## Structure
```
.github/workflows/    CI: frontend lint/test/build + backend dotnet build/test/smoke;
                      CD: Release publish artifact + GHCR image
api-server/           ASP.NET Core 8 backend (Clean Architecture:
                      Domain / Application / Infrastructure / Api + unit tests)
docs/                 Project documentation markdown (see docs/BACKEND.md)
merzy-coffee/         Angular 18 app (all frontend code + public/ assets)
scripts/              Data collection / processing utilities
```

## Running the frontend
```powershell
cd merzy-coffee
npm install            # already installed locally
npx.cmd ng serve --port 4321 --host 0.0.0.0
```
- `npm.ps1` is blocked by execution policy on this machine — always use
  `npm.cmd` / `npx.cmd`, never bare `npm`/`npx`.
- Live reload is enabled; edits to `merzy-coffee/src/` appear automatically.
- Verification: `curl -sf http://localhost:4321/` returns 200 with the app HTML.

## Building
```powershell
cd merzy-coffee
npx.cmd ng build       # output: merzy-coffee/dist/merzy
```

## Running the api-server
```powershell
cd api-server
dotnet run --project src/MERZY.Api      # http://localhost:4000 (Swagger at /swagger)
```
- Build/test: `dotnet build MERZY.Backend.sln` / `dotnet test tests/MERZY.UnitTests`
- Migrations: `dotnet ef migrations add <Name> -p src/MERZY.Infrastructure -s src/MERZY.Api`
  (target server via `ConnectionStrings__DefaultConnection` env var)
Endpoints: `/healthz`, `/api/health`, `/api/menu`, `/api/orders` (POST),
`/api/orders/:id`, `/api/orders/:id/status` (PATCH). Statuses are forward-only:
Received → Preparing → Ready → Completed (+ Cancelled from Received/Preparing).

## Features
- Interactive menu with coffee & bakery items (add-to-cart)
- Slide-out floating rounded cart drawer (responsive)
- Order placement and status tracking (Received → Preparing → Ready)
- Real scraped Instagram photos in `merzy-coffee/public/scraped/instagram/`

## Design system
Centralized tokens in `merzy-coffee/src/styles.css` (`:root` block):
black ink `#0B0812`, violet accent `#5C0AB2` / bright `#8E4BF0` / soft
`#C9B8FA`, canvas `#F7F6FB`. Fonts: Sora (display) + Outfit (body).
Do not reintroduce browns/creams or per-component hardcoded colors — always use
tokens or the Tailwind ramp (`primary.*`, `dark.*`).

## Verification
- `curl -sf http://localhost:4321/` returns 200 with the app's HTML.
- Dev server log shows "Local/Network URLs" and "Watch mode enabled".
