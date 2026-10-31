# Documentation Map

Complete guide to all documentation files in the MERZY project.

## Root Documentation Files (9 files)

### Essential Project Docs

1. **README.md**
   - Project overview
   - Quick start guide
   - Repository structure
   - Technology stack
   - Design system overview
   - Start here!

2. **CONTRIBUTING.md**
   - Development workflow
   - Code standards
   - Git branching strategy
   - Pull request process
   - Testing requirements
   - Issue reporting

3. **INSTALLATION.md**
   - Step-by-step setup
   - Prerequisites
   - Frontend setup
   - Backend setup
   - Scripts setup
   - Environment configuration
   - Verification steps
   - Troubleshooting

### Specifications & Standards

4. **DESIGN_SYSTEM.md**
   - Color palette (6 brand colors)
   - Typography (Sora + Outfit fonts)
   - Spacing scale
   - Component specifications
   - Responsive breakpoints
   - Accessibility standards
   - Motion & animation
   - Brand guidelines

5. **DEPLOYMENT.md**
   - Pre-deployment checklist
   - Frontend deployment options
   - Backend deployment options
   - Database setup
   - Environment variables
   - SSL/TLS configuration
   - Monitoring & logging
   - Rollback procedures
   - Post-deployment verification

6. **SECURITY.md**
   - Vulnerability reporting
   - Security best practices
   - Data protection
   - Authentication & authorization
   - API security
   - Frontend security
   - Infrastructure security
   - Incident response procedures
   - Compliance (GDPR, CCPA, PCI DSS)

### Project Information

7. **CHANGELOG.md**
   - Version 1.0.0 (Current)
   - Features implemented
   - Technology stack
   - Code statistics
   - Release schedule
   - Roadmap for future phases
   - Upgrade instructions

8. **ROADMAP.md**
   - 5-phase development plan
   - Current status (Phase 1 MVP)
   - Phase 2-5 features
   - Quarterly goals
   - Success metrics
   - Resource requirements
   - Budget estimation
   - How to request changes

9. **LICENSE.md**
   - Copyright information
   - Code license terms
   - Data & content rights
   - Third-party libraries
   - Contributor agreement
   - Disclaimer & liability
   - Governing law

## Internal Documentation (/docs folder)

### Navigation & Guides

- **INDEX.md** - Documentation index (start here for detailed docs)
- **QUICK_START.md** - 5-minute quick start
- **SETUP.md** - Detailed environment setup
- **ARCHITECTURE.md** - Project structure & architecture

### Reference Docs

- **BEST_PRACTICES.md** - Development best practices
- **PROJECT_SUMMARY.md** - Complete project overview
- **scraped-data.md** - Data sources & format

### Scraper Documentation (/docs/scrapers)

- **README.md** - Scraper system overview
- **INSTAGRAM_SCRAPER.md** - Instagram @merzy.eg scraper
- **FACEBOOK_SCRAPER.md** - Facebook page scraper
- **TALABAT_SCRAPER.md** - Talabat restaurant scraper
- **IMAGE_CACHE_SYSTEM.md** - Image downloading & caching
- **DATA_PROCESSOR.md** - Data processing pipeline
- **DATA_DEDUPLICATOR.md** - Duplicate removal system
- **VALIDATORS.md** - Data validation
- **ORCHESTRATOR.md** - Main data orchestration

## Feature-Specific Documentation

### Frontend Documentation

**File**: `frontend/README.md`
- Quick start
- Project structure
- Features
- Technology stack
- Development workflow
- Design system usage
- Components overview
- Services reference
- Styling guidelines
- Performance optimization
- Testing
- Accessibility
- Deployment
- Troubleshooting

### Backend Documentation

**File**: `api-server/README.md`
- Project overview
- Setup instructions
- Environment configuration
- API endpoints
- Error handling
- Testing
- Deployment options

### Scripts Documentation

**File**: `scripts/README.md`
- Directory structure
- Scraper descriptions
- Data processor details
- Running scripts
- Configuration options
- Data output format
- API reference
- Error handling
- Logging
- Performance tips
- Troubleshooting

## Documentation Organization

### By Purpose

| Purpose | Primary Doc | Secondary Docs |
|---------|-------------|----------------|
| Getting Started | INSTALLATION.md | README.md, QUICK_START.md |
| Development | CONTRIBUTING.md | DESIGN_SYSTEM.md, Architecture |
| Deployment | DEPLOYMENT.md | SECURITY.md, Configuration |
| Reference | DESIGN_SYSTEM.md | Component specs in docs/ |
| Compliance | SECURITY.md, LICENSE.md | CONTRIBUTING.md |
| Project Info | CHANGELOG.md, ROADMAP.md | PROJECT_SUMMARY.md |

### By Audience

#### Project Managers
1. README.md - Overview
2. ROADMAP.md - Timeline & features
3. CHANGELOG.md - What's done/planned

#### New Developers
1. INSTALLATION.md - Setup
2. QUICK_START.md - First 5 minutes
3. ARCHITECTURE.md - How it's organized
4. Feature-specific READMEs

#### Experienced Developers
1. CONTRIBUTING.md - Workflow
2. DESIGN_SYSTEM.md - Standards
3. Feature docs in /docs
4. Code comments

#### DevOps/SRE
1. DEPLOYMENT.md - Deployment options
2. SECURITY.md - Security requirements
3. Configuration guides
4. Troubleshooting

#### Security/Compliance
1. SECURITY.md - Security practices
2. LICENSE.md - Legal terms
3. Data handling in docs
4. API documentation

## Quick Navigation Guide

### "I want to..."

**Get started**
→ Start with [INSTALLATION.md](./INSTALLATION.md)

**Understand the project**
→ Read [README.md](./README.md) then [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

**Set up development**
→ Follow [INSTALLATION.md](./INSTALLATION.md)

**Learn best practices**
→ Review [CONTRIBUTING.md](./CONTRIBUTING.md) and [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

**Deploy to production**
→ Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

**Ensure security**
→ Review [SECURITY.md](./SECURITY.md)

**Work on frontend**
→ Read [frontend/README.md](./frontend/README.md)

**Work on backend**
→ Read [api-server/README.md](./api-server/README.md)

**Work on scrapers**
→ Read [scripts/README.md](./scripts/README.md)

**Understand data flow**
→ Review [docs/scraped-data.md](./docs/scraped-data.md)

**Report a bug**
→ See [CONTRIBUTING.md](./CONTRIBUTING.md#reporting-issues)

**Contribute code**
→ Follow [CONTRIBUTING.md](./CONTRIBUTING.md)

## Documentation Statistics

### File Counts
- **Root markdown files**: 9
- **docs/ folder files**: 14+
- **Feature READMEs**: 3 (frontend, backend, scripts)
- **Total documentation**: 26+ files
- **Total words**: 100,000+

### Coverage
- ✅ Project overview
- ✅ Installation & setup
- ✅ Development workflow
- ✅ API documentation
- ✅ Design system
- ✅ Deployment guide
- ✅ Security practices
- ✅ Contributing guidelines
- ✅ Scraper systems
- ✅ Troubleshooting guides

## Keeping Documentation Current

### When to Update
- After merging PR to main
- When changing architecture
- When adding new features
- When updating dependencies
- When changing deployment process

### What to Update
1. CHANGELOG.md - Add version entry
2. Relevant feature docs
3. README if major changes
4. CONTRIBUTING.md if workflow changes
5. API docs if endpoints change

### Documentation Checklist
- [ ] Changes documented
- [ ] Examples updated
- [ ] Links still valid
- [ ] Code samples tested
- [ ] Spelling/grammar checked
- [ ] Version numbers current

## Documentation Formats

All documentation uses:
- **Format**: Markdown (.md)
- **Encoding**: UTF-8
- **Line endings**: LF
- **Structure**: Hierarchical headings
- **Code blocks**: Syntax highlighted

## Related Resources

### External Documentation
- [Angular Docs](https://angular.io/)
- [Node.js Docs](https://nodejs.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Git Docs](https://git-scm.com/doc)

### Tools Used
- Markdown for documentation
- GitHub for version control
- Git for collaboration
- npm for package management

## Version Information

| Item | Version |
|------|---------|
| Documentation | 1.0.0 |
| Angular | 18.2.21 |
| Node.js | 18+ |
| TypeScript | 5.0+ |
| Last Updated | October 31, 2026 |

## Questions?

1. **First check**: Search relevant documentation
2. **Not found**: Check GitHub issues
3. **Still unsure**: Open GitHub discussion
4. **Bug report**: See CONTRIBUTING.md

---

**Start here**: [README.md](./README.md)  
**Quick start**: [INSTALLATION.md](./INSTALLATION.md)  
**All docs**: [docs/INDEX.md](./docs/INDEX.md)

**Last Updated**: October 31, 2026  
**Maintained by**: MERZY Documentation Team
