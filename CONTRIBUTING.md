# Contributing to MERZY

Thank you for your interest in contributing to MERZY! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and professional in all interactions. We're building a welcoming community.

## Getting Started

### Prerequisites

- Node.js 22.x and npm (frontend)
- .NET 8 SDK (API)
- Git
- Windows: PowerShell (use `npm.cmd`/`npx.cmd` due to execution policy)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/food-drink-solution/MERZY-Coffe-F.git
   cd MERZY-Coffe-F
   ```

2. **Set up frontend**
   ```bash
   cd merzy-coffee
   npm install
   npx.cmd ng serve --port 4321
   ```

3. **Set up API server** (separate terminal)
   ```bash
   cd api-server
   dotnet restore MERZY.Backend.sln
   dotnet run --project src/MERZY.Api
   ```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

### Making Changes

1. **Frontend changes**
   - Edit files in `merzy-coffee/src/`
   - Follow Angular best practices
   - Use centralized design tokens (see DESIGN_SYSTEM.md)
   - Test in dev server (`npm start`)

2. **API changes**
   - Edit files in `api-server/src/`
   - Follow ASP.NET Core and Clean Architecture conventions
   - Add/update xUnit tests and run `dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release`
   - Update documentation

3. **Data/Scraper changes**
   - Edit files in `scripts/scrapers/` and `scripts/data-processor/`
   - Follow TypeScript best practices
   - Update documentation in `docs/scrapers/`

### Committing Code

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add shopping cart functionality

- Implement cart state management
- Add cart component with item management
- Display cart total and item count"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance

### Pushing and Creating a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Detailed description of what changed and why
- Reference any related issues (#123)
- Screenshots if UI changes

## Coding Standards

### Frontend (Angular)

- Use TypeScript strict mode
- Follow Angular style guide
- Use centralized design tokens (no hardcoded colors)
- Keep components focused and testable
- Use proper types (avoid `any`)

### Backend (ASP.NET Core 8)

- Keep Domain independent of HTTP and persistence concerns
- Put use cases and abstractions in Application
- Keep EF Core/repository implementations in Infrastructure
- Validate untrusted input and never trust client-supplied prices
- Do not enable order-status mutation without staff authentication/authorization
- Never commit connection strings or credentials

### Scripts (TypeScript)

- Use strict TypeScript
- Include comprehensive error handling
- Add proper logging
- Document complex logic
- Include unit tests

## Testing

### Frontend Tests

```bash
cd merzy-coffee
ng test
```

### API Tests

```bash
cd api-server
dotnet test tests/MERZY.UnitTests/MERZY.UnitTests.csproj -c Release
```

### Scraper Tests

```bash
npm run scrape:test
```

## Documentation

- Update relevant markdown files in `docs/`
- Keep README.md current
- Document new features
- Update API docs for endpoint changes
- Include code examples where helpful

## Pull Request Process

1. **Before submitting:**
   - Run tests locally
   - Check code formatting
   - Update documentation
   - Test in multiple browsers (if UI changes)

2. **PR Review:**
   - Respond to feedback promptly
   - Request re-review after changes
   - Be open to suggestions

3. **Merging:**
   - PRs must pass all checks
   - At least one approval required
   - Squash and merge for clean history

## Reporting Issues

Found a bug? Please create an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment info (OS, Node version, etc.)
- Screenshots if applicable

## Feature Requests

Have an idea? Open an issue with:
- Clear description of feature
- Use case and benefit
- Any related issues or PRs
- Examples from other projects if applicable

## Questions?

- Check existing documentation in `docs/`
- Review closed issues/PRs for similar questions
- Ask in a new GitHub discussion

Thank you for contributing! 🙏
