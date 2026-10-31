# Deployment Guide

## Current delivery model

The repository has an Angular 18 frontend in `merzy-coffee/` and an ASP.NET Core 8 API in `api-server/`.

The GitHub Actions workflow `.github/workflows/deploy.yml` builds the frontend, uploads a frontend artifact, publishes the API, uploads the .NET publish artifact, and pushes a container image to GitHub Container Registry (GHCR). **It does not itself deploy the frontend to Vercel or the API to runasp.net/IIS.** Do not describe a successful workflow run as a live production deployment.

## Required secrets and configuration

Never commit database passwords, API keys, or publish credentials. The database credential previously present in tracked configuration must be rotated with the database provider; deleting it from the current files does not invalidate it or erase historical commits.

Configure these values in the hosting platform's secret/environment settings:

| Setting | Purpose |
|---|---|
| `ConnectionStrings__DefaultConnection` | SQL Server connection string for the API |
| `MERZY_CORS_ORIGINS` | Comma-separated exact frontend origins allowed by API CORS |

Do not print secrets in logs or include them in deployment issue comments. Ensure publish-profile user files remain ignored and untracked.

## Frontend — Vercel

The Angular application root is `merzy-coffee/`. For each Vercel project, verify the configured **Root Directory** and build settings independently; do not assume two Vercel projects share the same root or output configuration.

Suggested project settings when the project root is `merzy-coffee`:

- Framework preset: Angular (or the equivalent configured build)
- Install command: `npm ci`
- Build command: `npm run build -- --configuration production`
- Angular browser output: `dist/merzy/browser` (verify against the actual build output)

If a project root is configured as the repository root instead, its install/build/output paths must be adjusted accordingly. Avoid a root-level `vercel.json` that blindly runs `cd merzy-coffee` when the Vercel project's Root Directory already points at that folder.

For a failed deployment, capture the first build error from the Vercel deployment logs before changing paths. A GitHub build passing does not establish that Vercel deployed successfully.

## Backend — ASP.NET Core 8

Build and test from the repository root:

```bash
cd api-server
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet publish src/MERZY.Api/MERZY.Api.csproj -c Release -o ./publish
```

The release workflow uploads a `api-publish-{sha}` artifact and pushes a container image to GHCR. These are deployable artifacts, not evidence that the hosting provider is running them.

Set `ConnectionStrings__DefaultConnection` and `MERZY_CORS_ORIGINS` in the target host. Use HTTPS and a least-privilege database account. Run database migrations as a controlled release step; automatic startup migration should be reviewed against the target hosting and rollback strategy.

## Post-deployment verification

After deploying through the hosting provider, verify each route against the actual deployed host:

1. `GET /healthz` returns success.
2. `GET /api/health` returns the expected health payload.
3. `GET /swagger` loads if Swagger is intentionally enabled for that environment.
4. `GET /api/menu` returns menu data when SQL Server is available.
5. Order creation rejects malformed/unknown items and calculates totals on the server.
6. `PATCH /api/orders/{id}/status` returns HTTP 501 until staff authentication/authorization is implemented.
7. The frontend root and deep links load successfully, and browser console/network logs contain no failed API calls or CORS errors.

Record the deployment URL, commit SHA, test results, and sanitized HTTP status evidence in the release PR. Never paste credentials, access tokens, or full connection strings into evidence.
