# MERZY Backend Guide

## Stack and architecture

MERZY's backend is ASP.NET Core 8 with EF Core 8 and SQL Server, organized into Clean Architecture layers:

- `MERZY.Domain`: entities and domain enums
- `MERZY.Application`: use cases, DTOs, interfaces
- `MERZY.Infrastructure`: EF Core persistence, repositories and migrations
- `MERZY.Api`: HTTP endpoints, Swagger, CORS and health probes

The Angular app currently has local/mock menu and order services. It is not yet an end-to-end API-backed checkout.

## Local development

From the repository root:

```bash
cd api-server
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet run --project src/MERZY.Api
```

Set `ConnectionStrings__DefaultConnection` in the shell or local secret store before using database endpoints. No production connection string is tracked in configuration. Health endpoints can remain available when the database is unavailable, but menu/order endpoints require SQL Server.

## HTTP endpoints

| Method | Route | Notes |
|---|---|---|
| GET | `/healthz` | Liveness probe |
| GET | `/api/health` | Health response |
| GET | `/api/menu` | Database-backed menu |
| POST | `/api/orders` | Validates item IDs and quantities; calculates totals server-side |
| GET | `/api/orders/{id}` | Reads persisted order |
| PATCH | `/api/orders/{id}/status` | Disabled with HTTP 501 until staff authentication/authorization is implemented |

Order creation has a 32 KiB request limit and a per-process fixed-window rate limit. Configure the CORS allowlist with `MERZY_CORS_ORIGINS` (comma-separated exact origins). These safeguards do not replace authentication, monitoring, or a full production threat model.

## Production configuration

Set these in the target hosting provider's environment/secret store:

- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `MERZY_CORS_ORIGINS`: exact trusted frontend origins, comma-separated

Rotate any database password that has ever been committed. Removing it from the current source does not revoke the credential or erase Git history.

## CI/CD boundary

GitHub Actions validates frontend lint/tests/build and backend build/unit tests/smoke tests. The release workflow uploads the frontend build, uploads a .NET publish artifact, and publishes the backend container to GHCR. It does not itself deploy to Vercel or runasp.net/IIS. A production release is complete only after the hosting provider reports success and live HTTP checks pass.
