# Security Policy

## Reporting a vulnerability

Please do not publish exploit details, credentials, or sensitive production data in a public issue or pull request. Contact the repository maintainers privately using the security contact configured for this project. Include the affected component, impact, minimal reproduction steps, and a suggested mitigation when available.

## Current application security posture

MERZY consists of an Angular 18 frontend (`merzy-coffee/`) and an ASP.NET Core 8 API using EF Core and SQL Server (`api-server/`). The API is an evolving MVP and must not be described as fully production-ready until the remaining integration, authorization, deployment, and operational checks are complete.

Current safeguards include:
- Server-side menu item lookup and price calculation for order creation.
- Validation for order line count, quantity bounds, notes length, and unknown menu item IDs.
- A request-size limit and fixed-window rate limit for order creation.
- Exact-origin CORS allowlisting configured through `MERZY_CORS_ORIGINS`.
- Order-status mutation disabled with HTTP 501 until staff authentication and authorization are implemented.
- Health endpoints that can start without a database connection configured.

These controls do not replace a full threat model, authentication, authorization, monitoring, or abuse detection.

## Secrets and configuration

- Configure the API database connection through `ConnectionStrings__DefaultConnection` in the hosting provider's secret/environment configuration.
- Configure `MERZY_CORS_ORIGINS` as a comma-separated list of exact trusted origins.
- For local Docker Compose, use `api-server/.env.example` as a template and keep the actual `.env` file untracked.
- Never commit connection strings, passwords, access tokens, signing keys, publish credentials, or production exports.
- If a credential is committed, revoke/rotate it with its provider immediately. Removing it from the latest commit does not invalidate it or remove it from Git history, logs, or artifacts.
- Keep `.pubxml.user` files untracked and do not enable password persistence in tracked publish profiles.

## API security requirements

Before enabling real ordering in production:
1. Implement authenticated staff authorization for order status transitions.
2. Add controller/API tests for malformed payloads, invalid IDs, unauthorized mutations, rate limiting, and error responses.
3. Add integration tests against an isolated SQL Server test database.
4. Connect Angular menu and checkout to the API; do not treat local mock state as a persisted order.
5. Configure HTTPS, trusted CORS origins, least-privilege database credentials, log redaction, backups, and monitoring.
6. Verify the deployed release with live HTTP checks and retain sanitized evidence tied to a commit SHA.

## Dependency and code review

- Run `npm audit` from `merzy-coffee/` when changing frontend dependencies.
- Run `dotnet list api-server/MERZY.Backend.sln package --vulnerable` where supported by the installed SDK/tooling.
- Validate all external input on the server; never trust client-supplied totals or prices.
- Avoid logging request bodies, secrets, authentication tokens, or full connection strings.
- Keep error responses actionable but free of stack traces and sensitive configuration.

## Incident response

For a suspected exposure:
1. Revoke or rotate the affected credential immediately.
2. Check current source, Git history, CI logs, release artifacts, and hosting settings for copies.
3. Replace secrets with environment/secret-store configuration.
4. Review access logs and audit trails for unauthorized use.
5. Document remediation without reproducing secret values.
