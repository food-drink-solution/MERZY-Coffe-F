# MERZY — Documentation Index

Welcome to the MERZY documentation. Everything below lives either at the
repository root (standard project files) or here in `docs/`.

## Root files

| File | Purpose |
|---|---|
| [`README.md`](../README.md) | Project overview, structure tree, quick start |
| [`CHANGELOG.md`](../CHANGELOG.md) | Release and change history |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | How to contribute (workflow, PRs) |
| [`SECURITY.md`](../SECURITY.md) | Security policy and reporting |
| [`LICENSE.md`](../LICENSE.md) | Licensing |
| [`AGENTS.md`](../AGENTS.md) | Repository guide for coding agents |

## Docs in this folder

| File | Purpose |
|---|---|
| [`INSTALLATION.md`](./INSTALLATION.md) | Full setup: Node, deps, environment, image cache |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | App layers, models, services, components |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Color tokens, typography, Tailwind ramp |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Production builds and deployment (Vercel, Firebase, AWS) |
| [`ROADMAP.md`](./ROADMAP.md) | Planned work |
| [`scraped-data.md`](./scraped-data.md) | Public MERZY data + imagery collected from social sources |

## Scraper documentation (`docs/scrapers/`)

Complete docs for the data collection toolkit in `scripts/`:

- [`GETTING_STARTED.md`](./scrapers/GETTING_STARTED.md) — 5-minute scraper setup
- [`README.md`](./scrapers/README.md) — system overview, architecture, data flow
- [`ARCHITECTURE.md`](./scrapers/ARCHITECTURE.md) — deep dive into scraper internals
- [`CONFIGURATION.md`](./scrapers/CONFIGURATION.md) — all configuration options
- [`INSTAGRAM.md`](./scrapers/INSTAGRAM.md) — Instagram @merzy.eg scraper
- [`FACEBOOK.md`](./scrapers/FACEBOOK.md) — Facebook page scraper
- [`TALABAT.md`](./scrapers/TALABAT.md) — Talabat listing scraper
- [`DATA-PROCESSOR.md`](./scrapers/DATA-PROCESSOR.md) — normalization + image caching

## Where to look

- **New to the repo?** → [`../README.md`](../README.md)
- **Setting up a machine?** → [`INSTALLATION.md`](./INSTALLATION.md)
- **Changing colors or fonts?** → [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) and
  `merzy-coffee/src/styles.css` (single `:root` token schema)
- **Collecting fresh MERZY data?** → [`scrapers/GETTING_STARTED.md`](./scrapers/GETTING_STARTED.md)
- **Deploying?** → [`DEPLOYMENT.md`](./DEPLOYMENT.md)
