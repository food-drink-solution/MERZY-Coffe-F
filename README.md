# MERZY — Specialty Coffee & Bakery (Alexandria, Egypt)

MERZY is an Angular 18 marketing + storefront site for the MERZY specialty coffee
and bakery beside the Bibliotheca Alexandrina, designed around the real MERZY
brand: **true black ink, electric violet accents, Sora + Outfit typography**.

## Repository structure

```
.
├── .github/                  # CI workflows, issue/PR templates
├── api-server/               # Node.js API server (Express) — ready for backend work
│   ├── src/index.js          #   server entry (health, menu, orders endpoints)
│   ├── package.json
│   └── README.md
├── docs/                     # Project documentation markdown
│   ├── INDEX.md              # Start here for all docs
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── QUICK_START.md
│   ├── scraped-data.md       # Public data collected from Instagram/Facebook/Talabat
│   └── scrapers/             # Documentation for data collection scripts
├── frontend/
│   └── MERZY-Coffe/          # The Angular 18 application (all frontend code)
│       ├── public/           # Static assets + real scraped Instagram photos
│       ├── src/              # Angular app with centralized design tokens
│       └── package.json
├── scripts/                  # Data collection / processing utilities
├── AGENTS.md                 # Repository guide for coding agents
└── README.md                 # This file
```

## Quick start — frontend

```bash
cd frontend/MERZY-Coffe
npm install
npm start          # dev server on http://localhost:4200
```

Windows PowerShell note: use `npx.cmd` / `npm.cmd` (`npm.ps1` is blocked by
execution policy). A convenient local port: `npx.cmd ng serve --port 4321`.

Production build:

```bash
npx.cmd ng build   # output in frontend/MERZY-Coffe/dist/merzy
```

## Quick start — api-server

```bash
cd api-server
npm install
npm run dev        # http://localhost:4000/api/health
```

See `api-server/README.md` for the planned endpoints and how to connect the
Angular frontend through a dev proxy.

## Documentation

All docs live in [`docs/`](./docs) — start with [`docs/INDEX.md`](./docs/INDEX.md).
Key documents:

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — layers, models, services
- [`docs/SETUP.md`](./docs/SETUP.md) — environment setup
- [`docs/scraped-data.md`](./docs/scraped-data.md) — real MERZY data + imagery sources

## Design system

The frontend uses a single centralized token schema in
`frontend/MERZY-Coffe/src/styles.css`:

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
locally in `frontend/MERZY-Coffe/public/scraped/instagram/`.
The color palette and typography were extracted from the real brand assets.
