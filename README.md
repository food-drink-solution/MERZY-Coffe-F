# MERZY — Specialty Coffee & Bakery

MERZY is an Angular 18 storefront and marketing site for a specialty coffee and bakery brand in Alexandria, Egypt.

## Repository structure

- `merzy-coffee/`: Angular 18 frontend
- `api-server/`: ASP.NET Core 8 Clean Architecture API (EF Core + SQL Server)
- `docs/`: setup, architecture, deployment, and scraper documentation
- `.github/workflows/`: frontend/backend CI and release artifact publishing

## Frontend quick start

```bash
cd merzy-coffee
npm ci
npm start
```

The app runs on the Angular development server (normally `http://localhost:4200`). For validation:

```bash
npm run lint
npm test -- --watch=false
npm run build -- --configuration production
```

On Windows PowerShell, if script execution policy blocks npm wrappers, use `npm.cmd` / `npx.cmd`.

## Backend quick start

Install the .NET 8 SDK, then run from the repository root:

```bash
cd api-server
dotnet restore MERZY.Backend.sln
dotnet build MERZY.Backend.sln -c Release
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
dotnet run --project src/MERZY.Api
```

Configure SQL Server through `ConnectionStrings__DefaultConnection` in the local shell or secret store before using database-backed endpoints. **Never commit real connection strings or passwords.** CORS origins are configured through `MERZY_CORS_ORIGINS` as a comma-separated list.

## Important current limitations

- The Angular menu/cart/order services still use local mock state; frontend checkout is not yet integrated end to end with the API.
- The API's order-status mutation endpoint returns HTTP 501 until staff authentication and authorization are implemented.
- The GitHub release workflow validates/builds the apps, uploads a frontend artifact and .NET publish artifact, and publishes a container image to GHCR. It does not directly deploy to Vercel or the API host.
- Database credentials previously committed in history must be rotated with the provider; deleting a secret from the current tree does not invalidate it.

See [docs/INDEX.md](docs/INDEX.md), [docs/INSTALLATION.md](docs/INSTALLATION.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/BACKEND.md](docs/BACKEND.md), and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for verified instructions.
