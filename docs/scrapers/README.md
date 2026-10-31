# MERZY Scraper System

Complete data scraping toolkit for MERZY Coffee & Bakery marketing site. Fetches real data from Instagram, Facebook, and Talabat, normalizes it, and integrates with the Angular frontend.

## Overview

- **Instagram Scraper**: Fetches posts, captions, images, stories, highlights, and engagement metrics from @merzy.eg
- **Facebook Scraper**: Fetches page posts, reviews, ratings, and reactions from MERZY Coffee page
- **Talabat Scraper**: Fetches menu items, prices, photos, ratings, and availability
- **Data Processor**: Transforms raw data, downloads images, deduplicates, and merges with existing mock data
- **Orchestrator**: Runs all scrapers and processors in sequence

## Directory Structure

```
scripts/
├── scrapers/
│   ├── instagram.scraper.ts        # Instagram @merzy.eg data extraction
│   ├── facebook.scraper.ts         # Facebook page data extraction
│   ├── talabat.scraper.ts          # Talabat menu & reviews extraction
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── utils.ts                    # Shared utilities (HTTP, parsing, logging)
├── data-processor/
│   ├── processor.ts                # Main data normalization & merging
│   ├── image-cache.ts              # Image downloading & caching
│   └── deduplicator.ts             # Post deduplication logic
└── orchestrator.ts                 # Main entry point - runs all scrapers

docs/scrapers/
├── README.md                       # This file
├── INSTAGRAM.md                    # Instagram scraper documentation
├── FACEBOOK.md                     # Facebook scraper documentation
├── TALABAT.md                      # Talabat scraper documentation
├── DATA-PROCESSOR.md               # Data processor documentation
├── CONFIGURATION.md                # Environment & config setup
└── ARCHITECTURE.md                 # System design & data flow
```

## Quick Start

### 1. Install Dependencies

```bash
npm install axios cheerio dotenv puppeteer
npm install --save-dev @types/cheerio @types/node
```

### 2. Configure Environment

Create `.env.scraper`:
```
INSTAGRAM_USER=@merzy.eg
INSTAGRAM_SESSION_ID=your_session_id  # Optional: for authenticated scraping
FACEBOOK_PAGE_ID=61583371166412
TALABAT_RESTAURANT_ID=1102357

# Scraping behavior
CACHE_IMAGES=true
SCRAPE_TIMEOUT=30000
MAX_RETRIES=3
OUTPUT_DIR=./scraped-data
```

### 3. Run Scrapers

```bash
# Run all scrapers
npm run scrape:all

# Run individual scrapers
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat

# Process scraped data
npm run process:data

# Full pipeline
npm run scrape:full
```

## Data Output

Raw scraper output is saved to `scraped-data/raw/`:
```
scraped-data/
├── raw/
│   ├── instagram-posts.json
│   ├── instagram-highlights.json
│   ├── facebook-posts.json
│   ├── facebook-reviews.json
│   ├── talabat-menu.json
│   └── talabat-reviews.json
├── processed/
│   ├── merzy-social.json
│   ├── merzy-menu.json
│   └── merzy-comments.json
└── images/
    ├── instagram/
    ├── facebook/
    └── talabat/
```

## Data Flow

```
Instagram API/HTML → instagram.scraper.ts → raw/instagram-*.json
                                          ↓
Facebook API/HTML → facebook.scraper.ts → raw/facebook-*.json
                                        ↓
Talabat HTML → talabat.scraper.ts → raw/talabat-*.json
                                  ↓
                        processor.ts (normalize & merge)
                                  ↓
                      Download images → image-cache.ts
                                  ↓
                      Deduplicate posts → deduplicator.ts
                                  ↓
                    src/app/core/data/merzy-social.ts
                    src/app/core/data/menu.ts
                    src/app/core/data/comments.ts
```

## Key Features

### Instagram Scraper
- ✅ Fetches posts, captions, engagement (likes, comments)
- ✅ Extracts images, videos, reels
- ✅ Gets stories & highlights
- ✅ Parses location, collaborator tags
- ✅ Handles rate limiting & retries

### Facebook Scraper
- ✅ Fetches page posts & reactions
- ✅ Extracts reviews & ratings
- ✅ Gets post comments & engagement
- ✅ Parses event information
- ✅ Handles API authentication

### Talabat Scraper
- ✅ Fetches menu items & categories
- ✅ Extracts prices, descriptions, photos
- ✅ Gets restaurant ratings & reviews
- ✅ Parses delivery info & opening hours
- ✅ Handles pagination

### Data Processor
- ✅ Normalizes all data to MERZY formats
- ✅ Downloads & caches images locally
- ✅ Deduplicates posts across platforms
- ✅ Merges with existing mock data
- ✅ Generates TypeScript data files

## Scraping Methods

### Public HTML Scraping (No Auth)
- Uses `cheerio` for HTML parsing
- Uses `axios` for HTTP requests
- Works with public profiles/pages
- No API keys required
- Respects robots.txt & rate limits

### API-Based (Optional)
- Instagram Graph API (requires Meta Developer account)
- Facebook Graph API (requires App ID & Token)
- Talabat Public API (if available)

## Rate Limiting & Ethics

- Delays between requests (1-3 seconds)
- User-Agent rotation
- Caches results to avoid re-scraping
- Respects `robots.txt`
- Does not scrape private accounts
- Does not store PII or private messages

## Error Handling

Each scraper includes:
- Automatic retries with exponential backoff
- Timeout handling
- Connection error recovery
- Invalid data validation
- Detailed error logging

## Updating Frontend Data

After scraping completes, the processor generates:

```typescript
// src/app/core/data/merzy-social.ts
export const MERZY_POSTS: MerzySocialPost[] = [...]
export const MERZY_PROFILE: MerzySocialProfile = {...}
export const MERZY_HIGHLIGHTS: MerzyHighlight[] = [...]
export const MERZY_COMMENTS: MerzyComment[] = [...]

// src/app/core/data/menu.ts
export const MENU_ITEMS: MenuItem[] = [...]

// src/app/core/data/talabat-reviews.ts
export const RESTAURANT_REVIEWS: Review[] = [...]
```

These files automatically reload in the dev server (live reload enabled).

## Scheduling

### Development
Run manually as needed:
```bash
npm run scrape:full
```

### Production
Schedule via GitHub Actions (recommended):
```yaml
# .github/workflows/scrape-weekly.yml
schedule:
  - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC
```

Or use a cron job:
```bash
0 2 * * 0 cd /app && npm run scrape:full
```

## Troubleshooting

### Instagram: 429 Too Many Requests
- Increase delay between requests
- Check IP for temporary bans
- Use VPN or proxy rotation

### Facebook: Invalid Graph API Token
- Verify App ID and Access Token in .env
- Check token expiration
- Ensure permissions are granted

### Talabat: Empty Results
- Verify restaurant ID is correct
- Check if site structure has changed
- May need HTML selector updates

### Images Not Downloading
- Check network connectivity
- Verify download directory permissions
- Check image URLs are still valid

## Contributing

When updating scrapers:
1. Test with new data first (use `--test` flag)
2. Update error handling if site structure changes
3. Add new data fields to types.ts
4. Document changes in respective .md file
5. Test data processor with new fields

## See Also

- [INSTAGRAM.md](./INSTAGRAM.md) - Instagram scraper details
- [FACEBOOK.md](./FACEBOOK.md) - Facebook scraper details
- [TALABAT.md](./TALABAT.md) - Talabat scraper details
- [DATA-PROCESSOR.md](./DATA-PROCESSOR.md) - Data processing details
- [CONFIGURATION.md](./CONFIGURATION.md) - Setup & configuration
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & data flow

## License

Part of MERZY Coffee & Bakery project. Uses publicly available data only.
