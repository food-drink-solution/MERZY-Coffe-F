# MERZY API — ASP.NET Core 8 (Clean Architecture)

Backend for the MERZY site: **ASP.NET Core 8 + EF Core 8 + SQL Server**, layered
with Clean Architecture and scaled for a large backend codebase.

```
api-server/
├── src/
│   ├── MERZY.Domain/            # Entities, enums — zero dependencies
│   ├── MERZY.Application/       # Use cases (services), DTOs, repository interfaces
│   ├── MERZY.Infrastructure/    # EF Core (SQL Server), repositories, migrations
│   └── MERZY.Api/               # Controllers, Program.cs, appsettings
├── tests/
│   └── MERZY.UnitTests/         # xUnit + in-memory fakes (no DB required)
├── MERZY.Backend.sln
├── Directory.Build.props        # net8.0, ImplicitUsings, Nullable for all layers
├── Dockerfile                   # multi-stage SDK 8.0 → aspnet:8.0
└── docker-compose.yml           # SQL Server 2022 + API stack for local dev
```

## Run locally

```bash
dotnet restore MERZY.Backend.sln
dotnet run --project src/MERZY.Api      # http://localhost:4000 (launch profile)
```

- Development defaults connect to **SQL Server LocalDB**
  (`(localdb)\MSSQLLocalDB`). For a full local stack: `docker compose up -d`
  (SQL Server 2022 + API, migrations applied automatically at startup).
- If SQL Server is unreachable, startup logs a warning and the health probes
  still respond — the app reports degraded only when data endpoints are used.

## Endpoints

| Method | Path                          | Description                                                              |
|--------|-------------------------------|--------------------------------------------------------------------------|
| GET    | `/healthz`                    | K8s-style liveness probe                                                 |
| GET    | `/api/health`                 | Service health payload (`{ ok, service, time }`)                          |
| GET    | `/api/menu?category=`         | Menu items, optional category filter                                     |
| POST   | `/api/orders`                 | Place an order (`{ items: [{ itemId, quantity }], notes }`) → `201` + DTO |
| GET    | `/api/orders/{id}`            | Fetch an order by id                                                     |
| PATCH  | `/api/orders/{id}/status`     | Update status — forward-only state machine                               |

Order status lifecycle (enforced in `Application/Services/OrderService.cs`):

```
Received → Preparing → Ready → Completed
   └───────→ Preparing → Cancelled
```

`Received/Preparing → Cancelled` is allowed; terminal states are final. Illegal
transitions return `400`, unknown ids return `404`.

## Database & migrations

- Provider: **SQL Server** with `EnableRetryOnFailure` (3 retries) for
  transient faults.
- The API applies pending migrations at startup (`db.Database.MigrateAsync()`),
  wrapped so a missing server never blocks boot.
- **Production database** (databaseasp.net hosted SQL Server) is configured in
  `appsettings.Production.json`. The same result can be achieved without the
  file via environment variable (highest precedence):

  ```bash
  ConnectionStrings__DefaultConnection="Server=...;Database=...;User Id=...;Password=...;Encrypt=True;TrustServerCertificate=True"
  ```

- To apply migrations against an external server without booting the app:

  ```bash
  dotnet ef database update \
    -p src/MERZY.Infrastructure \
    -s src/MERZY.Api
  # override the target with ConnectionStrings__DefaultConnection
  ```
- To add a migration after editing entities/configurations:

```bash
dotnet ef migrations add <MigrationName> \
  -p src/MERZY.Infrastructure \
  -s src/MERZY.Api
```

- Seed data (4 menu items with deterministic GUIDs) is declared in
  `src/MERZY.Infrastructure/Persistence/Configurations/MenuItemConfiguration.cs`
  and lands with the `InitialCreate` migration.
- Configuration override precedence (highest wins):
  1. Environment variable: `ConnectionStrings__DefaultConnection`
  2. `appsettings.{Environment}.json`
  3. `appsettings.json` (`localhost,1433` / sa — for containers & compose)

## Tests

```bash
dotnet test tests/MERZY.UnitTests
```

17 unit tests cover menu mapping/filtering, order placement (price snapshots,
subtotals, validation) and the forward-only status state machine. They use
hand-written in-memory fakes — no SQL Server, no EF — so they run anywhere.

## Docker

```bash
docker build -t merzy-api .
docker run -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Server=<host>;Database=MerzyDb;User Id=sa;Password=<pw>;TrustServerCertificate=True" \
  merzy-api
```

CI publishes `ghcr.io/food-drink-solution/MERZY-Coffe-F/api-server` on every
merge to `main` (see `.github/workflows/deploy.yml`).

## Production deployment (runasp.net)

- **Deploy artifact**: `api-publish-{sha}` from the *Deploy to Production*
  workflow — a Release publish ready to upload through the hosting panel
  (entry point `MERZY.Api.exe` / app root `MERZY.Api.dll`).
- **Connection string**: set in `appsettings.Production.json` (committed) or
  override with the `ConnectionStrings__DefaultConnection` env var in the panel.
- **Startup**: migrations run automatically on first boot; verify via
  `/healthz` → `Healthy` and `/api/menu` → 4 items.
- **Swagger**: live in production at `/swagger` (deployments there have no
  separate gateway, so the docs are the verification cockpit).
- **CORS**: restricted to `https://merzy-coffe.vercel.app` (+ `localhost:4321`
  for dev). Other origins get no CORS headers and are blocked by browsers.
- ⚠️ Call the API over its **HTTPS** host; `https://merzy-coffe.vercel.app`
  calling the API over plain `http://` is blocked by browsers as mixed content.

## Status vocabulary

API responses serialize the enum as strings (`"Received"`, `"Preparing"`, …)
and the PATCH endpoint accepts them case-insensitively. Statuses intentionally
mirror the frontend's order flow.

## Connecting the frontend

The Angular app (`../merzy-coffee`) still reads mock services. To consume this
API: add `proxy.conf.json` targeting `http://localhost:4000` and swap the mock
calls for `HttpClient`. The endpoint shapes here were designed to match the
frontend's current service contracts.
