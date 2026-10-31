# MERZY — Specialty Coffee & Bakery (Alexandria, Egypt)

MERZY is an Angular 18 marketing + storefront site for the MERZY specialty coffee
and bakery beside the Bibliotheca Alexandrina, designed around the real MERZY
brand: **true black ink, electric violet accents, Sora + Outfit typography**.

## Repository structure

```
.
├── .github/                  # CI/CD workflows (frontend lint/test/build, backend dotnet, deploy)
├── api-server/               # ASP.NET Core 8 backend — Clean Architecture (EF Core + SQL Server)
│   ├── src/MERZY.Domain/     #   entities + enums (no dependencies)
│   ├── src/MERZY.Application/#   use cases, DTOs, repository interfaces
│   ├── src/MERZY.Infrastructure/ # EF Core SqlServer, repositories, migrations
│   ├── src/MERZY.Api/        #   controllers, Program.cs, Swagger (all envs)
│   ├── tests/MERZY.UnitTests/#   xUnit tests with in-memory fakes
│   └── README.md
├── docs/                     # Project documentation markdown
│   ├── INDEX.md              # Start here for all docs
│   ├── BACKEND.md            # Backend architecture reference
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── DEPLOYMENT.md
│   ├── INSTALLATION.md
│   ├── ROADMAP.md
│   ├── scraped-data.md       # Public data collected from Instagram/Facebook/Talabat
│   └── scrapers/             # Documentation for data collection scripts
├── merzy-coffee/            # The Angular 18 application (all frontend code)
│   ├── public/              # Static assets + real scraped Instagram photos
│   ├── src/                 # Angular app with centralized design tokens
│   └── package.json
├── scripts/                  # Data collection / processing utilities
├── AGENTS.md                 # Repository guide for coding agents
└── README.md                 # This file
```

## Quick start — frontend

```bash
cd merzy-coffee
npm install
npm start          # dev server on http://localhost:4200
```

Windows PowerShell note: use `npx.cmd` / `npm.cmd` (`npm.ps1` is blocked by
execution policy). A convenient local port: `npx.cmd ng serve --port 4321`.

Production build:

```bash
npx.cmd ng build   # output in merzy-coffee/dist/merzy
```

## Quick start — api-server

```bash
cd api-server
dotnet run --project src/MERZY.Api        # http://localhost:4000 (Swagger at /swagger)
dotnet test tests/MERZY.UnitTests         # 17 unit tests, no SQL needed
```

Deployment (production): SQL Server on databaseasp.net + the API at
`http://merzy-coffee-api.runasp.net`, serving the frontend at
`https://merzy-coffe.vercel.app` (CORS allow-listed). See
`api-server/README.md` and `docs/BACKEND.md` for endpoints, migrations and the
deploy artifact.

## Documentation

All docs live in [`docs/`](./docs) — start with [`docs/INDEX.md`](./docs/INDEX.md).
Key documents:

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — layers, models, services
- [`docs/BACKEND.md`](./docs/BACKEND.md) — ASP.NET backend architecture + production settings
- [`docs/INSTALLATION.md`](./docs/INSTALLATION.md) — environment setup
- [`docs/scraped-data.md`](./docs/scraped-data.md) — real MERZY data + imagery sources

## Design system

The frontend uses a single centralized token schema in
`merzy-coffee/src/styles.css`:

| Token | Value | Meaning |
|---|---|---|
| `--merzy-ink` | `#0B0812` | True black canvas / text |
| `--merzy-panel` | `#151021` | Dark raised surfaces |
| `--merzy-accent` | `#5C0AB2` | Brand violet core (from the logo ring) |
| `--merzy-accent-bright` | `#8E4BF0` | Electric violet |
| `--merzy-accent-soft` | `#C9B8FA` | Lavender |
| `--merzy-canvas` | `#F7F6FB` | Light page canvas |

Fonts: **Sora** (display) + **Outfit** (body), from Google Fonts.

## Data provenance

All business data and imagery shown on the site come from MERZY's public
profiles (Instagram `@merzy.eg`, Facebook page, Talabat listing) and are stored
locally in `merzy-coffee/public/scraped/instagram/`.
The color palette and typography were extracted from the real brand assets.
