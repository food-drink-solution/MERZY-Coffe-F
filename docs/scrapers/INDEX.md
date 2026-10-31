# MERZY Scraper System - Complete Index

## 📚 Documentation Files

### Quick Start
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** ⭐ **START HERE**
  - 5-minute setup guide
  - Basic commands
  - Common issues
  - File locations

### System Overview
- **[README.md](./README.md)**
  - System architecture
  - Features overview
  - Quick start
  - Data flow
  - Scheduling

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**
  - High-level design
  - Component details
  - Data flow diagrams
  - Type system
  - Performance characteristics
  - Extensibility points

### Setup & Configuration
- **[CONFIGURATION.md](./CONFIGURATION.md)**
  - Environment variables
  - npm scripts setup
  - Installation steps
  - Directory structure
  - Running scrapers
  - Troubleshooting
  - Scheduling (cron, GitHub Actions)
  - Security guidelines

### Individual Scrapers

#### Instagram (@merzy.eg)
- **[INSTAGRAM.md](./INSTAGRAM.md)**
  - Data extraction details
  - HTML selectors
  - Rate limiting
  - Comment parsing
  - Highlight extraction
  - Image handling
  - Testing & debugging

#### Facebook (MERZY Coffee Page)
- **[FACEBOOK.md](./FACEBOOK.md)**
  - Graph API setup
  - Required permissions
  - Endpoint reference
  - Engagement metrics
  - Review extraction
  - Error handling
  - Token management

#### Talabat (MERZY Restaurant)
- **[TALABAT.md](./TALABAT.md)**
  - Menu item extraction
  - Price parsing
  - Review scraping
  - Pagination handling
  - Rate limiting
  - Image downloading
  - Validation

### Data Processing
- **[DATA-PROCESSOR.md](./DATA-PROCESSOR.md)**
  - Transformation logic
  - Image caching
  - Deduplication
  - Data validation
  - TypeScript generation
  - Error recovery
  - Performance optimization

---

## 💻 Implementation Files

### Shared Utilities
```
scripts/scrapers/
├── utils.ts           # HTTP client, logging, file system, date/string utils
├── types.ts           # All TypeScript interfaces and data structures
├── instagram.scraper.ts
├── facebook.scraper.ts
├── talabat.scraper.ts
```

### Data Processor
```
scripts/data-processor/
├── processor.ts       # Main orchestrator
├── transformers.ts    # Data format conversion
├── deduplicator.ts    # Remove duplicate posts
├── image-cache.ts     # Download and cache images
└── validators.ts      # Data validation
```

### Entry Points
```
scripts/
├── orchestrator.ts    # Main CLI - runs scrapers + processor
└── (individual scrapers can be run separately)
```

---

## 🚀 Quick Commands

### Install
```bash
npm install axios cheerio
```

### Configure
```bash
# Create .env.scraper with your settings
```

### Run Full Pipeline
```bash
npm run scrape:full
```

### Run Individual Scrapers
```bash
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat
```

### Process Existing Data
```bash
npm run process:data
```

### Debug Mode
```bash
DEBUG_SCRAPER=true npm run scrape:full
DEBUG_PROCESSOR=true npm run process:data
```

---

## 📊 Data Structure

### Input Data (Raw)
- `scraped-data/raw/instagram-posts.json`
- `scraped-data/raw/facebook-posts.json`
- `scraped-data/raw/talabat-menu.json`

### Output Data (Frontend)
- `src/app/core/data/merzy-social.ts`
- `src/app/core/data/menu.ts`

### Cached Images
- `scraped-data/images/instagram/`
- `scraped-data/images/facebook/`
- `scraped-data/images/talabat/`

---

## 🏗️ Architecture Summary

```
Instagram, Facebook, Talabat
          ↓
    Scrapers Layer
    (extract data)
          ↓
    Raw JSON Output
          ↓
    Processor Layer
    (transform, cache, deduplicate)
          ↓
    TypeScript Files
    (frontend data)
```

**Key Components:**
1. **Scrapers** - Extract from external sources
2. **Transformers** - Convert to MERZY format
3. **Image Cache** - Download and store images
4. **Deduplicator** - Remove duplicate posts
5. **Validators** - Ensure data quality
6. **Generator** - Create TypeScript files

---

## 🎯 Use Cases

### First-Time Setup
1. Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Follow setup steps
3. Run `npm run scrape:full`

### Understanding System
1. Read [README.md](./README.md) for overview
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for deep dive
3. Check individual scraper docs for details

### Troubleshooting Issues
1. Check [CONFIGURATION.md](./CONFIGURATION.md) troubleshooting section
2. Run with `DEBUG_SCRAPER=true` for verbose output
3. Check individual scraper docs for scraper-specific issues

### Customizing Scrapers
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Extensibility Points
2. Read specific scraper doc (INSTAGRAM/FACEBOOK/TALABAT.md)
3. Edit `scripts/scrapers/[source].scraper.ts`
4. Test with `--test` flag

### Scheduling Regular Runs
1. See [CONFIGURATION.md](./CONFIGURATION.md) - Scheduling section
2. Set up cron job or GitHub Action
3. Optionally add git commit for tracking

---

## 📋 Feature Checklist

### Scrapers
- ✅ Instagram scraper (posts, highlights, comments, profile)
- ✅ Facebook scraper (posts, reviews, engagement, comments)
- ✅ Talabat scraper (menu, prices, reviews, restaurant info)

### Processing
- ✅ Data transformation to MERZY formats
- ✅ Image downloading & caching
- ✅ Post deduplication across platforms
- ✅ Data validation with error reporting
- ✅ Merging with existing mock data

### Features
- ✅ Automatic retry with exponential backoff
- ✅ Rate limit handling
- ✅ Timeout management
- ✅ Error logging & reporting
- ✅ Verbose debug mode
- ✅ Test mode (no network)
- ✅ TypeScript file generation

### Documentation
- ✅ System overview
- ✅ Architecture & design
- ✅ Setup & configuration guide
- ✅ Individual scraper documentation
- ✅ Data processor documentation
- ✅ Quick start guide
- ✅ This index

---

## 📈 Performance

| Phase | Duration | Notes |
|-------|----------|-------|
| Instagram scraping | 30-60s | Depends on # posts |
| Facebook scraping | 20-40s | Slower with API |
| Talabat scraping | 15-30s | Menu + reviews |
| Image downloads | 1-5 min | 50-100 images |
| Data processing | 1-2 min | Validation, generation |
| **Total** | **3-10 min** | First run |
| **Subsequent** | **2-5 min** | Images cached |

---

## 🔒 Security

- ✅ No hardcoded tokens
- ✅ Environment variables for secrets
- ✅ HTTPS only
- ✅ Public data only (no PII)
- ✅ Rate limit respecting
- ✅ User-Agent rotation
- ✅ Timeout protection

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG_SCRAPER=true npm run scrape:full
DEBUG_PROCESSOR=true npm run process:data
```

### Test Mode (No Network)
```bash
ts-node scripts/orchestrator.ts --test
```

### Dry Run (Parse Only)
```bash
ts-node scripts/orchestrator.ts --validate-only
```

### View Logs
```bash
# Check console output for detailed error messages
# Raw data saved in scraped-data/raw/ for inspection
```

---

## 📞 Support

### For Issues
1. Check relevant documentation file
2. See troubleshooting section in CONFIGURATION.md
3. Run with DEBUG flags for verbose output
4. Check scraped-data/raw/ for raw output inspection

### For Customization
1. Read ARCHITECTURE.md - Extensibility Points
2. Modify relevant script file
3. Test with `--test` flag
4. Verify output before committing

### For Contributions
1. Understand architecture (ARCHITECTURE.md)
2. Follow existing code patterns
3. Add documentation for changes
4. Test thoroughly

---

## 📦 Deliverables

### Documentation (8 files)
- ✅ README.md - System overview
- ✅ GETTING_STARTED.md - Quick start
- ✅ CONFIGURATION.md - Setup guide
- ✅ ARCHITECTURE.md - System design
- ✅ INSTAGRAM.md - Instagram details
- ✅ FACEBOOK.md - Facebook details
- ✅ TALABAT.md - Talabat details
- ✅ DATA-PROCESSOR.md - Processing details

### Implementation (10 files)

**Scrapers (5 files):**
- ✅ instagram.scraper.ts
- ✅ facebook.scraper.ts
- ✅ talabat.scraper.ts
- ✅ types.ts (shared types)
- ✅ utils.ts (shared utilities)

**Processor (5 files):**
- ✅ processor.ts
- ✅ transformers.ts
- ✅ deduplicator.ts
- ✅ image-cache.ts
- ✅ validators.ts

**Orchestrator (1 file):**
- ✅ orchestrator.ts

**Total: 19 files**

---

## 🎓 Learning Path

### Beginner
1. Start → [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Setup environment
3. Run `npm run scrape:full`
4. Verify output files

### Intermediate
1. Read [README.md](./README.md)
2. Explore code in `scripts/`
3. Customize individual scraper
4. Understand data formats

### Advanced
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Study all source files
3. Add new data source
4. Customize processor pipeline

---

## ✨ Next Steps

- 👉 Go to [GETTING_STARTED.md](./GETTING_STARTED.md) to begin setup
- 📖 Read [README.md](./README.md) for full context
- ⚙️ Check [CONFIGURATION.md](./CONFIGURATION.md) for advanced setup
- 🚀 Run `npm run scrape:full` to see it in action!

---

**Last Updated:** October 31, 2026  
**Status:** Complete & Ready for Use ✅
