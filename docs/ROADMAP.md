# MERZY Product Roadmap

Strategic roadmap for MERZY Coffee & Bakery platform development.

## Current Status

**Phase**: MVP + Data Integration  
**Last Updated**: October 31, 2026  
**Version**: 1.0.0

## Phases Overview

### Phase 1: MVP (Current) ✅

**Frontend** (Angular 18)
- ✅ Interactive menu (coffee & bakery)
- ✅ Shopping cart functionality
- ✅ Order tracking system
- ✅ Real brand design system
- ✅ Responsive layout
- ✅ Real Instagram imagery

**Data Integration**
- ✅ Instagram scraper (@merzy.eg)
- ✅ Facebook scraper (page data)
- ✅ Talabat scraper (menu, reviews)
- ✅ Image caching system
- ✅ Post deduplication
- ✅ Data validation

**Backend Foundation**
- ✅ ASP.NET Core 8 API (Clean Architecture: Domain / Application / Infrastructure / Api)
- ✅ EF Core 8 + SQL Server, startup migrations, hosted production database
- ✅ Unit tests (xUnit, 17 passing) and .NET CI pipeline
- ✅ Order tracking

### Phase 2: Backend Integration (Q1 2027)

**Planned Features**
- [x] Order persistence (EF Core + SQL Server)
- [ ] Real staff order management (status mutation is disabled pending authorization)
- [ ] Kitchen display system
- [ ] Order notifications
- [ ] Real-time status updates
- [ ] Payment integration prep

**Database**
- [x] SQL Server setup and order/menu schema
- [ ] User/staff identity schema (as required by authentication)

**API Enhancements**
- [ ] Authentication
- [ ] Validation middleware
- [ ] Error handling
- [x] Basic order-create rate limiting
- [x] Structured application logging configuration
- [ ] Authentication/authorization and security review

### Phase 3: User Experience (Q2 2027)

**Features**
- [ ] User accounts
- [ ] Order history
- [ ] Favorites/wishlist
- [ ] Delivery tracking
- [ ] Push notifications
- [ ] Email receipts

**Enhancements**
- [ ] Search functionality
- [ ] Filter/sort menu
- [ ] Dietary info display
- [ ] Allergen warnings
- [ ] Customization options

### Phase 4: Business Features (Q3 2027)

**Admin Dashboard**
- [ ] Order management
- [ ] Menu management
- [ ] Analytics dashboard
- [ ] Reporting tools
- [ ] Staff management

**Marketing**
- [ ] Email campaigns
- [ ] SMS notifications
- [ ] Loyalty program
- [ ] Referral system
- [ ] Promotional codes

### Phase 5: Mobile App (Q4 2027+)

**Development**
- [ ] React Native app
- [ ] iOS deployment
- [ ] Android deployment
- [ ] Offline support
- [ ] Native notifications

## Current Quarter Goals (Q4 2026)

### Must Have
- [x] Complete scraper system
- [x] Clean project structure
- [x] Documentation
- [ ] User acceptance testing
- [ ] Bug fixes

### Should Have
- [ ] Payment gateway research
- [ ] Database design
- [ ] Architecture review
- [ ] Team training

### Nice to Have
- [ ] Advanced analytics
- [ ] Recommendations engine
- [ ] Social integration

## Technical Debt & Improvements

### Documentation
- [x] Create comprehensive docs
- [x] Design system documentation
- [ ] API documentation (OpenAPI)
- [ ] Architecture diagrams
- [ ] Deployment guides

### Testing
- [ ] Broader frontend unit-test coverage
- [ ] API integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Load testing

### DevOps
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Docker containerization
- [ ] Kubernetes setup (optional)
- [ ] Monitoring & logging

### Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Caching strategy
- [ ] Database indexing

## Key Milestones

| Date | Milestone |
|------|-----------|
| Oct 31, 2026 | MVP + Scraper System Complete |
| Dec 15, 2026 | User Testing Phase |
| Jan 15, 2027 | Phase 2 Start (Backend) |
| Mar 31, 2027 | Phase 2 Complete |
| Apr 1, 2027 | Phase 3 Start (UX) |
| Jun 30, 2027 | Phase 3 Complete |
| Jul 1, 2027 | Phase 4 Start (Business) |
| Sep 30, 2027 | Phase 4 Complete |
| Oct 1, 2027 | Phase 5 Start (Mobile) |

## Dependencies & Blockers

### Current Blockers
- Production credential rotation and removal from Git history must be completed
- Vercel deployment failure needs actual build logs
- Angular checkout still uses mock data and is not integrated with the API

### Upcoming Dependencies
- Database selection (Q1 2027)
- Payment provider decision (Q1 2027)
- Mobile platform decision (Q4 2027)

## Success Metrics

### Phase 1 (Current)
- [x] MVP functional
- [x] All scrapers working
- [x] Documentation complete
- [ ] Team trained on system

### Phase 2
- [ ] < 100ms API response time
- [ ] 99.5% uptime
- [ ] < 1% error rate
- [ ] All unit tests passing

### Phase 3
- [ ] 50+ daily active users
- [ ] 90% user satisfaction
- [ ] < 2sec page load time
- [ ] Mobile-ready design

### Phase 4
- [ ] Profitable operation
- [ ] 50% repeat order rate
- [ ] < 30min avg fulfillment
- [ ] 95%+ customer satisfaction

## Resource Requirements

### Development Team
- **Frontend**: 1-2 engineers
- **Backend**: 1-2 engineers
- **DevOps**: 1 engineer (shared)
- **QA**: 1 engineer (part-time)

### Infrastructure
- **Hosting**: Cloud provider (AWS/GCP/Azure)
- **Database**: SQL Server (EF Core)
- **Storage**: Image CDN
- **Monitoring**: APM tool

## Budget Estimation

| Phase | Est. Cost | Timeline |
|-------|-----------|----------|
| Phase 1 | $0 (MVP) | Complete |
| Phase 2 | $5K-10K | 3 months |
| Phase 3 | $10K-15K | 3 months |
| Phase 4 | $15K-20K | 3 months |
| Phase 5 | $20K-30K | 4+ months |

## How to Request Changes

1. **Feature Request**: Open GitHub issue with:
   - Clear description
   - Business value
   - User impact
   - Priority assessment

2. **Bug Report**: Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

3. **Priority Changes**: Contact product team with:
   - Rationale
   - Business impact
   - Timeline impact

## Questions?

- Check `docs/` for detailed information
- Review closed issues for similar topics
- Contact the product team
- Open a discussion in GitHub

---

**Version**: 1.0.0  
**Last Updated**: October 31, 2026  
**Next Review**: December 31, 2026
