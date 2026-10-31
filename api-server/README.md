# MERZY API — ASP.NET Core 8

The API uses ASP.NET Core 8, EF Core 8, SQL Server, and Clean Architecture.

## Project structure

- `src/MERZY.Domain/`: entities and enums
- `src/MERZY.Application/`: use cases, DTOs, and repository abstractions
- `src/MERZY.Infrastructure/`: EF Core SQL Server configuration, repositories, migrations
- `src/MERZY.Api/`: controllers, middleware, Swagger and health endpoints
- `tests/MERZY.UnitTests/`: unit tests

## Run locally

From `api-server/`:

```bash
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet run --project src/MERZY.Api
```

Configure a development SQL Server connection before calling data endpoints. The connection string must be supplied through the environment variable `ConnectionStrings__DefaultConnection`; never put real credentials in tracked JSON.

PowerShell example:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=MerzyDev;Trusted_Connection=True;TrustServerCertificate=True"
dotnet run --project src/MERZY.Api
```

Bash example:

```bash
export ConnectionStrings__DefaultConnection='Server=localhost;Database=MerzyDev;User Id=<local-user>;Password=<local-password>;Encrypt=True;TrustServerCertificate=True'
dotnet run --project src/MERZY.Api
```

The API is configured to log a warning if startup migrations cannot connect to SQL Server so liveness checks can still start. Menu and order endpoints require a functioning database.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/healthz` | Liveness probe |
| GET | `/api/health` | Health payload |
| GET | `/api/menu?category=` | Query menu items |
| POST | `/api/orders` | Place an order using known menu item IDs |
| GET | `/api/orders/{id}` | Retrieve an order by GUID |
| PATCH | `/api/orders/{id}/status` | Disabled with HTTP 501 until staff authorization exists |

The application calculates order prices from database menu records; client-submitted prices/totals are not authoritative. Order creation is bounded by request-size and rate limits. CORS uses the exact origins in `MERZY_CORS_ORIGINS`, a comma-separated environment setting.

## Database migrations

Migrations are in Infrastructure. To apply them intentionally against a configured database:

```bash
dotnet ef database update -p src/MERZY.Infrastructure -s src/MERZY.Api
```

Use a controlled migration/release process for production and ensure the target host has a least-privilege database account. Do not copy production credentials into local files or issue comments.

## Build and release

The GitHub workflow builds/tests the frontend and backend, uploads the .NET publish artifact, and pushes a container image to GHCR. It does not directly deploy the frontend to Vercel or upload the API to a hosting provider. Verify actual hosting deployments separately using the deployed health endpoints and the exact release commit SHA.
