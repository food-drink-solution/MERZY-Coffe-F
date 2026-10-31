# BACKEND.md — MERZY API architecture reference

Backend: **ASP.NET Core 8 + EF Core 8 + SQL Server**, organized with Clean
Architecture. No Node.js remains in the repo; the previous Express server was
fully removed.

## Layer map

```
MERZY.Domain            → entities, enums, base types        (zero packages)
MERZY.Application       → services/use cases, DTOs, repo     (Microsoft.Extensions.
                          interfaces                           DependencyInjection.Abstractions 8.0.2)
MERZY.Infrastructure    → EF Core SqlServer 8.0.11,          (+ EF Tools 8.0.11, private)
                          configurations, repositories,
                          Migrations/
MERZY.Api               → controllers, Program.cs, Swagger   (Swashbuckle 6.6.2,
                                                               EF Design 8.0.11 for
                                                               `dotnet ef` commands)
MERZY.UnitTests         → xUnit 2.9.2, in-memory fakes       (no EF, no SQL needed)
```

Dependency rule: `Api → Application ← Infrastructure`, `Application → Domain`.
Domain knows nothing about EF or ASP.NET; migrations live in Infrastructure
(`MigrationsAssembly` is explicitly set in `AddInfrastructure`).

## Key files

| Concern | File |
|---|---|
| Composition root | `src/MERZY.Api/Program.cs` (CORS `MerzyWeb`, Swagger all envs, MigrateAsync) |
| EF context | `src/MERZY.Infrastructure/Persistence/MerzyDbContext.cs` |
| Entity configs + seed | `.../Persistence/Configurations/*.cs` (4 deterministic menu GUIDs) |
| Order state machine | `src/MERZY.Application/Services/OrderService.cs` |
| 404 typing | `.../Services/OrderNotFoundException.cs` → controller maps to 404 |
| Solutions/props | `MERZY.Backend.sln`, `Directory.Build.props` (net8.0, Nullable, ImplicitUsings) |

## Production settings (as deployed)

| Setting | Value |
|---|---|
| Host | `http://merzy-coffee-api.runasp.net` (databaseasp.net SQL behind it) |
| DB config | `appsettings.Production.json` (or `ConnectionStrings__DefaultConnection` env var — precedence higher) |
| CORS | `https://merzy-coffe.vercel.app` + `localhost:4321` only |
| Swagger | `/swagger` live in production (deployment verification cockpit) |
| Migrations | applied automatically at startup (`db.Database.MigrateAsync()` try/catch) |

## Migration workflow

```bash
# after entity/config changes
dotnet ef migrations add <Name> -p src/MERZY.Infrastructure -s src/MERZY.Api

# apply to a specific server from anywhere
$env:ConnectionStrings__DefaultConnection="<target>"
dotnet ef database update -p src/MERZY.Infrastructure -s src/MERZY.Api
```

InitialCreate applied to the hosted server: tables `MenuItems`, `Orders`,
`OrderItems` + `__EFMigrationsHistory`, seeded with 4 items (Dirty Espresso 60,
Flat White 55, London Cake 50, Club Sandwich 70 EGP).

## Pipeline wiring

- `backend.yml` — restore/build/test on .NET 8 + live smoke (healthz, /api/health)
- `deploy.yml` — Release publish artifact `api-publish-{sha}` for runasp.net
  upload + GHCR image `ghcr.io/food-drink-solution/MERZY-Coffe-F/api-server`

## Security note

The current DB password is committed in `appsettings.Production.json` (repo is
public). Plan: rotate it on databaseasp.net and move to the env-var override in
the hosting panel; scrub the file before making the repo public-facing
documentation-only.
