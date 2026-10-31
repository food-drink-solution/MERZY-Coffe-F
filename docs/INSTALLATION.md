# Installation Guide

Complete step-by-step installation guide for MERZY development environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone Repository](#clone-repository)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Scripts Setup](#scripts-setup)
6. [Environment Configuration](#environment-configuration)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

#### Node.js
- **Version**: 18.0.0 or higher
- **Download**: https://nodejs.org/
- **Verify**:
  ```bash
  node --version
  npm --version
  ```

#### Git
- **Download**: https://git-scm.com/
- **Verify**:
  ```bash
  git --version
  ```

#### Code Editor (Optional)
- Visual Studio Code (recommended)
- WebStorm
- Sublime Text 3
- Any text editor

### System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| RAM | 4 GB | 8 GB |
| Disk Space | 2 GB | 5 GB |
| OS | Windows/Mac/Linux | Windows 10+/Mac/Ubuntu |

### Windows-Specific Requirements

**Important**: PowerShell execution policy may block npm scripts.

Option 1: Use `npm.cmd` or `npx.cmd` explicitly
```bash
npx.cmd ng serve
```

Option 2: Change execution policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Clone Repository

### Using HTTPS
```bash
git clone https://github.com/food-drink-solution/MERZY-Coffe-F.git
cd MERZY-Coffe-F
```

### Using SSH
```bash
git clone git@github.com:food-drink-solution/MERZY-Coffe-F.git
cd MERZY-Coffe-F
```

### Verify Clone
```bash
git log --oneline -5
```

## Frontend Setup

### Navigate to Frontend Directory
```bash
cd merzy-coffee
```

### Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- Angular 18
- Tailwind CSS 3
- PrimeNG 18
- TypeScript 5
- Other utilities

**First-time installation may take 1-5 minutes.**

### Verify Installation

```bash
npm list | head -20
```

Should show Angular 18.x and related packages.

### Start Development Server

```bash
npm start
```

Or explicitly:
```bash
npx.cmd ng serve
```

Output should show:
```
✔ Compiled successfully.
Local:   http://localhost:4200/
External: http://192.168.x.x:4200/
```

### Verify Frontend

Open browser to `http://localhost:4200/`

Should see:
- MERZY header with violet branding
- Interactive menu
- Shopping cart functionality
- Responsive design

## Backend Setup

### Navigate to Backend Directory

From root:
```bash
cd api-server
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Copy example environment:
```bash
copy .env.example .env
```

Or manually create `.env`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://localhost:5432/merzy
JWT_SECRET=your-secret-key-for-development-only
```

### Start Development Server

```bash
npm run dev
```

Should show:
```
Server running on http://localhost:4000
```

### Verify API

In another terminal:
```bash
curl http://localhost:4000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-10-31T10:00:00Z"
}
```

## Scripts Setup

### Navigate to Scripts Directory

From root:
```bash
cd scripts
```

### Install Dependencies (if needed)

```bash
npm install
```

Most packages are already in root `node_modules`.

### Create Environment File

From root directory:
```bash
copy .env.example .env
```

Configure scraper settings:
```env
SCRAPER_DELAY_MS=1000
REQUESTS_PER_MINUTE=60
IMAGE_CACHE_DIR=merzy-coffee/public/scraped
```

## Environment Configuration

### Root Level Configuration

**File**: `.env` (in project root)

Required variables:
```env
# Node
NODE_ENV=development

# Frontend
ANGULAR_APP_API_URL=http://localhost:4000/api

# Backend
PORT=4000
DATABASE_URL=postgresql://localhost:5432/merzy
JWT_SECRET=development-secret-key-only

# Scrapers
SCRAPER_DELAY_MS=1000
REQUESTS_PER_MINUTE=60
IMAGE_CACHE_DIR=merzy-coffee/public/scraped
```

### Frontend Configuration

**File**: `merzy-coffee/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000/api'
};
```

### Backend Configuration

**File**: `api-server/.env`

See Backend Setup section above.

### Scripts Configuration

Edit `.env` in root directory with scraper settings.

## Verification

### Check All Components

Run the verification script:
```bash
npm run verify
```

Or manually verify:

#### 1. Frontend Running
```bash
curl -s http://localhost:4200/ | grep -o "<title>.*</title>"
```

Should show Angular app title.

#### 2. Backend Running
```bash
curl -s http://localhost:4000/api/health | grep -o "ok"
```

Should return "ok".

#### 3. Database Connected (if set up)
```bash
npm run db:check
```

### Verify File Structure

Check root directory:
```bash
ls -la
```

Should contain:
- `.github/` - GitHub workflows
- `api-server/` - Backend
- `docs/` - Documentation
- `frontend/` - Frontend app
- `scripts/` - Data scrapers
- `.gitignore`
- `*.md` files (README, CHANGELOG, etc.)

### Verify Dependencies

Check npm packages:
```bash
npm list --depth=0
npm list --depth=1 -g
```

## Troubleshooting

### Issue: `command not found: ng`

**Solution**: Use `npx`:
```bash
npx ng serve
```

Or install globally:
```bash
npm install -g @angular/cli
```

### Issue: Port Already in Use

**For frontend (4200)**:
```bash
npx ng serve --port 4321
```

**For backend (4000)**:
Edit `.env`:
```env
PORT=4001
```

### Issue: Module Not Found

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors

**Solution**: Ensure backend is running:
```bash
cd api-server
npm run dev
```

### Issue: Images Not Loading

**Solution**: Check scraped images exist:
```bash
ls merzy-coffee/public/scraped/
```

If empty, run scrapers:
```bash
npm run scrape:all
```

### Issue: Styles Not Applied

**Solution**: Clear Tailwind cache:
```bash
rm -rf node_modules/.cache
npm run build
```

### Issue: Database Connection Error

**Solution**: Check database configuration:
```bash
# Verify PostgreSQL is running
psql -V

# Test connection string
psql "$DATABASE_URL"
```

### Issue: Hot Reload Not Working

**Solution**: Restart dev server:
```bash
# Stop: Ctrl+C
npm start
```

### Issue: TypeScript Errors

**Solution**: Check TypeScript version:
```bash
tsc --version
```

Should be 5.0.0 or higher.

### Issue: npm audit warnings

**Solution**: Fix automatically:
```bash
npm audit fix
```

If unsafe, manually review:
```bash
npm audit
```

## Development Workflow

### Start Complete Development Environment

#### Terminal 1: Frontend
```bash
cd merzy-coffee
npm start
```

#### Terminal 2: Backend
```bash
cd api-server
npm run dev
```

#### Terminal 3: Scripts (Optional)
```bash
npm run scrape
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:4200 | Main application |
| Backend | http://localhost:4000 | API endpoints |
| API Health | http://localhost:4000/api/health | Status check |

## Next Steps

After successful installation:

1. **Read Project Documentation**
   ```bash
   cat README.md
   cat docs/INDEX.md
   ```

2. **Explore the Code**
   - Frontend: `merzy-coffee/src/app/`
   - Backend: `api-server/src/`
   - Scripts: `scripts/`

3. **Try Common Tasks**
   ```bash
   # Run tests
   npm test

   # Build for production
   npm run build

   # Format code
   npm run lint
   ```

4. **Start Development**
   - Create feature branch
   - Make changes
   - Test locally
   - Commit and push

## Getting Help

### Documentation
- `README.md` - Project overview
- `docs/INDEX.md` - Documentation index
- `docs/ARCHITECTURE.md` - System architecture
- `docs/INDEX.md` - Full documentation map
- `docs/ARCHITECTURE.md` - Project structure
- `CONTRIBUTING.md` - Development guidelines

### Troubleshooting
- Check logs in `logs/` directory
- Review error messages carefully
- Search GitHub issues
- Check official documentation

### Resources
- [Angular Documentation](https://angular.io/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Git Documentation](https://git-scm.com/doc)

## System Information

**Installation Tested On**:
- Windows 10/11
- macOS 12+
- Ubuntu 20.04+

**Supported Versions**:
- Node.js: 18.0.0+
- npm: 9.0.0+
- Git: 2.30.0+

---

**Last Updated**: October 31, 2026  
**Version**: 1.0.0  
**Status**: Ready for Development
