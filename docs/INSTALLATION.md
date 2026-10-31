# Installation Guide

This repository contains two independently built applications:

- Angular 18 frontend: `merzy-coffee/` (Node.js 22 and npm)
- ASP.NET Core 8 API: `api-server/` (.NET 8 SDK, EF Core, SQL Server)

The scraper documentation under `docs/scrapers/` is separate; there is no root-level npm application.

## Prerequisites

- Git
- Node.js 22.x and npm
- .NET 8 SDK
- SQL Server only if you need database-backed menu/order endpoints

Verify installations:

```bash
git --version
node --version
npm --version
dotnet --version
```

## Clone the repository

```bash
git clone https://github.com/food-drink-solution/MERZY-Coffe-F.git
cd MERZY-Coffe-F
```

## Frontend

```bash
cd merzy-coffee
npm ci
npm start
```

The Angular development server normally starts at `http://localhost:4200`. For the production build and available checks:

```bash
npm run lint
npm test -- --watch=false
npm run build -- --configuration production
```

Run these commands from `merzy-coffee/`, not from the repository root. CI uses a headless Chrome launcher for tests.

## Backend

Open a new terminal at the repository root:

```bash
cd api-server
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet run --project src/MERZY.Api
```

The API launch profile is configured for local development. Swagger is available at `/swagger`, and the liveness endpoint is `/healthz`.

### Database configuration

**Connection strings and passwords must not be committed.** Configure the connection string in your local shell or hosting secret store using the .NET configuration key `ConnectionStrings__DefaultConnection`.

PowerShell example (use a local/development SQL Server connection string, not production credentials):

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=MerzyDev;Trusted_Connection=True;TrustServerCertificate=True"
dotnet run --project src/MERZY.Api
```

Bash example:

```bash
export ConnectionStrings__DefaultConnection='Server=localhost;Database=MerzyDev;User Id=<local-user>;Password=<local-password>;Encrypt=True;TrustServerCertificate=True'
dotnet run --project src/MERZY.Api
```

If SQL Server is unavailable, startup logs a migration warning and health probes may still respond. Database-backed endpoints require a reachable database and valid configuration. Do not use a production connection string on a developer workstation.

## Relevant repository paths

- `.github/workflows/frontend.yml`: frontend lint, tests and build
- `.github/workflows/backend.yml`: .NET build, unit tests and health smoke test
- `.github/workflows/deploy.yml`: release artifact and container-image publishing (not a complete Vercel or IIS deployment)
- `docs/DEPLOYMENT.md`: hosting configuration and verification checklist
- `docs/ARCHITECTURE.md`: frontend/backend architecture

## Troubleshooting

- **Missing npm script:** check `merzy-coffee/package.json`; do not run frontend npm commands at repository root.
- **Database connection failure:** check `ConnectionStrings__DefaultConnection` in the current shell/hosting settings. Never paste credentials into issues or logs.
- **CORS failure:** configure `MERZY_CORS_ORIGINS` as a comma-separated list of exact trusted origins.
- **Order status update returns 501:** this is intentional until staff authentication and authorization are implemented.
