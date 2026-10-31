# Changelog

All notable changes to the MERZY project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-31

### Added

#### Frontend
- Angular 18 application with Tailwind CSS
- Interactive menu with coffee and bakery items
- Shopping cart with add/remove functionality
- Order tracking system (Received → Preparing → Ready)
- Responsive design (mobile, tablet, desktop)
- Centralized design system with MERZY brand colors and typography
- Real Instagram imagery from MERZY's profile
- Order status updates
- Cart drawer with quantity controls

#### Backend
- ASP.NET Core 8 Clean Architecture API with EF Core and SQL Server
- Health check endpoint (`/api/health`)
- Menu endpoint (`/api/menu`)
- Order endpoints (`/api/orders`)
- Order status tracking endpoints
- CORS configuration
- Error handling middleware

#### Data Integration
- Instagram scraper (@merzy.eg) with 350+ lines
- Facebook scraper (MERZY Coffee page) with 300+ lines
- Talabat scraper (restaurant listing) with 350+ lines
- Image downloading and local caching system
- Post deduplication across platforms
- Data validation and error recovery
- Automatic TypeScript data generation

#### Documentation
- Complete system architecture documentation
- Setup and installation guides
- Quick start guides
- Design system documentation
- Contributing guidelines
- API documentation
- Scraper system documentation (9 detailed files)
- Troubleshooting guides

#### Development Infrastructure
- GitHub workflows for CI/CD
- Issue and PR templates
- Git configuration
- Docker Compose setup for local development
- npm scripts for common tasks

### Changed
- N/A (Initial Release)

### Deprecated
- N/A (Initial Release)

### Removed
- N/A (Initial Release)

### Fixed
- N/A (Initial Release)

### Security
- No sensitive data should be committed; any previously exposed credentials must be rotated
- Environment variables for configuration
- Proper error handling without exposing internals
- HTTPS recommended for production

## Unreleased

### Planned for Phase 2 (Q1 2027)
- Frontend/API integration
- Staff authentication and authorization
- Payment gateway integration
- Email notifications
- Advanced order management

### Planned for Phase 3 (Q2 2027)
- User accounts and login
- Order history
- Favorites/wishlist
- Real-time notifications
- Enhanced search and filtering

### Planned for Phase 4 (Q3 2027)
- Admin dashboard
- Analytics
- Loyalty program
- Promotional campaigns

### Planned for Phase 5 (Q4 2027+)
- Mobile app (React Native)
- iOS distribution
- Android distribution
- Offline support

## Version History

### 1.0.0
- **Release Date**: October 31, 2026
- **Status**: Production Ready
- **Features**: MVP with complete scraper system
- **Code Statistics**:
  - 2500+ lines of implementation
  - 600+ lines of utilities
  - 100+ pages of documentation
  - 30+ TypeScript interfaces
  - 116 files total

---

## How to Upgrade

### From 0.9.x → 1.0.0
No upgrade path (initial release)

### Staying Current
To stay updated with the latest changes:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Install dependencies**
   ```bash
   cd merzy-coffee && npm ci
   cd ../api-server && dotnet restore MERZY.Backend.sln
   ```

3. **Review breaking changes** (if any)
   See "Breaking Changes" section below

4. **Update environment** as needed

### Breaking Changes

**Version 1.0.0**
- None (Initial Release)

Future versions will document breaking changes here.

---

## Release Schedule

| Version | Release Date | Support Ends | Status |
|---------|--------------|--------------|--------|
| 1.0.0 | 2026-10-31 | 2027-10-31 | Current |
| 1.1.0 | 2026-12-15 | 2027-12-15 | Planned |
| 2.0.0 | 2027-06-30 | 2028-06-30 | Planned |

## Contributing

Found a bug or want to contribute?
- See [CONTRIBUTING.md](./CONTRIBUTING.md)
- Report issues on GitHub
- Submit pull requests with improvements

## Support

- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues
- **Questions**: GitHub Discussions
- **Contact**: See CONTRIBUTING.md

---

**Last Updated**: October 31, 2026  
**Maintained by**: MERZY Development Team

For detailed commits, see [git log](https://github.com/food-drink-solution/MERZY-Coffe-F/commits/main)
