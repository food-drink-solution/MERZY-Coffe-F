# MERZY Architecture Guide

## System boundaries

```
Browser
  └── Angular 18 storefront (`merzy-coffee/`)
       ├── Components and routes
       ├── Core models/services
       └── Current menu/cart/order services use local mock state

ASP.NET Core 8 API (`api-server/`)
  ├── MERZY.Api          HTTP controllers, Swagger, health, CORS, rate limiting
  ├── MERZY.Application  use cases, DTOs, service/repository abstractions
  ├── MERZY.Domain       entities and order-status rules
  └── MERZY.Infrastructure EF Core, SQL Server repositories, migrations
       └── SQL Server
```

The Angular services are **not yet wired to the API**. The API and frontend are separate applications today; do not describe checkout as a fully integrated production order flow until the client uses the API and an end-to-end test proves the journey.

## Frontend

The Angular app is in `merzy-coffee/`. Components are organized by feature and shared UI, with core services and models under `src/app/core/`. Global styling and brand tokens live under `src/styles.css`.

Run commands from `merzy-coffee/`:

```bash
npm ci
npm start
npm run lint
npm test -- --watch=false
npm run build -- --configuration production
```

Menu and order services currently keep local data/state and simulate order status changes. This is demo behavior, not server-confirmed order processing.

## Backend — Clean Architecture

```
api-server/
├── src/
│   ├── MERZY.Domain/
│   ├── MERZY.Application/
│   ├── MERZY.Infrastructure/
│   └── MERZY.Api/
├── tests/MERZY.UnitTests/
├── MERZY.Backend.sln
├── Dockerfile
└── docker-compose.yml
```

Dependencies point inward: API and Infrastructure depend on Application/Domain abstractions; Domain does not depend on persistence or HTTP concerns. EF Core SQL Server configurations and migrations are in Infrastructure. Application services calculate order totals from persisted menu prices rather than trusting a client-provided total.

Backend commands from `api-server/`:

```bash
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet run --project src/MERZY.Api
```

## API and security boundaries

- `GET /healthz`: liveness probe.
- `GET /api/health`: API health payload.
- `GET /api/menu`: reads menu items from the database.
- `POST /api/orders`: creates an order from known menu IDs; the server calculates prices and subtotal.
- `GET /api/orders/{id}`: retrieves an order by GUID.
- `PATCH /api/orders/{id}/status`: currently disabled with HTTP 501. Do not re-enable mutation until staff authentication/authorization and tests are implemented.

CORS origins are configured using `MERZY_CORS_ORIGINS`, a comma-separated allowlist. Order creation has a request-size limit and a rate limit. These controls are defense-in-depth, not a replacement for authentication, abuse monitoring, or a production threat model.

## Configuration and secrets

Use `ConnectionStrings__DefaultConnection` from environment variables or the hosting secret manager. No real connection strings or passwords belong in tracked JSON, workflow files, documentation, or issue comments. If a credential was ever committed, rotate it even after removing it from the current tree.

## Deployment status

The GitHub workflow builds the frontend, publishes the .NET API artifact, and pushes a container image to GHCR. It does **not** directly deploy the frontend to Vercel or upload the API to the hosting provider. Production readiness requires a separate hosting deployment and post-deployment HTTP verification.
