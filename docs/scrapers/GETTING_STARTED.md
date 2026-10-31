# Getting Started

Quick start guide to run MERZY scrapers immediately.

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install axios cheerio
```

### 2. Create Configuration
Create `.env.scraper` in project root:
```bash
# Required
INSTAGRAM_USER=@merzy.eg
FACEBOOK_PAGE_ID=61583371166412
TALABAT_RESTAURANT_ID=1102357

# Optional but recommended
FACEBOOK_PAGE_ACCESS_TOKEN=   # Get from https://developers.facebook.com
OUTPUT_DIR=./scraped-data
DEBUG_SCRAPER=false
```

### 3. Update package.json

Add scripts:
```json
{
  "scripts": {
    "scrape:full": "ts-node scripts/orchestrator.ts",
    "scrape:instagram": "ts-node scripts/scrapers/instagram.scraper.ts",
    "scrape:facebook": "ts-node scripts/scrapers/facebook.scraper.ts",
    "scrape:talabat": "ts-node scripts/scrapers/talabat.scraper.ts",
    "process:data": "ts-node scripts/data-processor/processor.ts"
  }
}
```

### 4. Run Pipeline

```bash
# Run everything (scrapers + process)
npm run scrape:full

# Or run individually
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat
npm run process:data
```

## What Happens

1. **Scrapers run** (2-5 minutes)
   - Fetches data from Instagram, Facebook, Talabat
   - Saves raw JSON to `scraped-data/raw/`
   - Downloads images locally

2. **Processor runs** (1-2 minutes)
   - Transforms data to MERZY formats
   - Deduplicates posts
   - Validates everything
   - Generates TypeScript files

3. **App reloads** (automatic)
   - Angular dev server detects changes
   - Frontend auto-refreshes with new data
   - Posts, menu, reviews all updated

## Output Files

Created automatically:
- ✅ `src/app/core/data/merzy-social.ts` - Posts, profile, highlights
- ✅ `src/app/core/data/menu.ts` - Menu items with prices
- ✅ `scraped-data/images/` - Downloaded images
- ✅ `scraped-data/raw/` - Raw JSON outputs

## Verify It Worked

Check console for:
```
✓ Instagram completed
✓ Facebook completed
✓ Talabat completed
✓ Processing Complete! ✅
```

Check files exist:
```bash
ls src/app/core/data/merzy-social.ts
ls src/app/core/data/menu.ts
ls -la scraped-data/images/
```

## Next Steps

### See More Details
- [Full README](./README.md)
- [Configuration Guide](./CONFIGURATION.md)
- [System Architecture](./ARCHITECTURE.md)

### Get Facebook Access Token
For fuller data access:
1. Go to https://developers.facebook.com
2. Create app → "Business" type
3. Add "Facebook Login" product
4. Tools → Graph Explorer
5. Select MERZY page
6. Generate page access token
7. Add to `.env.scraper`:
   ```
   FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
   ```

### Schedule Regular Scrapes
Run weekly using cron or GitHub Actions:
```bash
# Weekly Sunday at 2 AM
0 2 * * 0 cd /path/to/merzy && npm run scrape:full
```

### Troubleshooting

**"Cannot find module..."**
```bash
npm install axios cheerio @types/cheerio ts-node
```

**"Instagram 429 error"**
- Too many requests. Wait 1 hour or use different IP.

**"Facebook token invalid"**
- Refresh token in Graph Explorer.

**"No data generated"**
- Check `scraped-data/raw/` folder exists
- Verify `.env.scraper` configured
- Run with `DEBUG_SCRAPER=true npm run scrape:full`

## File Locations

```
scripts/
├── scrapers/
│   ├── instagram.scraper.ts
│   ├── facebook.scraper.ts
│   ├── talabat.scraper.ts
│   ├── types.ts
│   └── utils.ts
├── data-processor/
│   ├── processor.ts
│   ├── transformers.ts
│   ├── deduplicator.ts
│   ├── image-cache.ts
│   └── validators.ts
└── orchestrator.ts ← Run this!

docs/scrapers/
├── README.md
├── INSTAGRAM.md
├── FACEBOOK.md
├── TALABAT.md
├── DATA-PROCESSOR.md
├── CONFIGURATION.md
├── ARCHITECTURE.md
└── GETTING_STARTED.md ← You are here
```

## Command Reference

```bash
# Full pipeline (scrapers + processor)
npm run scrape:full

# Run scrapers only
ts-node scripts/orchestrator.ts --scrapers-only

# Process existing raw data
npm run process:data

# Individual scrapers
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat

# Debug mode (verbose output)
DEBUG_SCRAPER=true npm run scrape:full

# Test mode (no network requests)
ts-node scripts/orchestrator.ts --test
```

## What Gets Scraped

### Instagram (@merzy.eg)
- Recent posts with captions
- Images and reels
- Highlights and stories
- Engagement (likes, comments)
- Location tags

### Facebook (MERZY Coffee page)
- Page posts
- Reviews and ratings
- Comments
- Engagement metrics
- *(Requires access token)*

### Talabat (MERZY restaurant)
- Menu items
- Prices
- Photos
- Restaurant info
- Reviews and ratings

## Data Structure

Posts have:
```typescript
{
  code: "DdDqTxbDem_",
  type: "photo" | "carousel" | "reel",
  date: "September 8, 2026",
  image: "/scraped/instagram/...jpg",
  caption: "It's all in the details...",
  likesText: "318 likes",
  location?: "Bibliotheca Alexandrina",
  url: "https://instagram.com/p/DdDqTxbDem_/"
}
```

Menu items have:
```typescript
{
  id: "dirty-espresso",
  name: "Dirty Espresso",
  category: "coffee",
  description: "Cold milk under double shot...",
  price: 60,
  image: "/scraped/talabat/...jpg",
  available: true,
  rating: 4.8
}
```

## Performance Expectations

- **First run**: 3-10 minutes
  - Scraping: 2-5 minutes
  - Processing: 1-5 minutes

- **Subsequent runs**: 2-5 minutes
  - Images cached, so faster downloads
  - Data already structured

- **Data updates**: Check for new posts
  - Instagram: Latest 50 posts
  - Facebook: Latest posts
  - Talabat: Current menu

## Common Issues

| Problem | Solution |
|---------|----------|
| No modules error | Run `npm install axios cheerio` |
| 429 Rate limited | Wait 1 hour, try again |
| Token expired | Refresh in Graph Explorer |
| Images not downloaded | Check `scraped-data/images/` exists |
| Files not generated | Check `scraped-data/raw/` has JSON files |
| Localhost 3000 not connecting | Ensure `docker compose -f docker-compose.base44.yml up` running |

## Need Help?

Check documentation:
- 📖 [Full README](./README.md) - Complete system overview
- ⚙️ [Configuration](./CONFIGURATION.md) - Setup details  
- 🏗️ [Architecture](./ARCHITECTURE.md) - How it all works
- 📸 [Instagram Scraper](./INSTAGRAM.md) - Instagram details
- 👥 [Facebook Scraper](./FACEBOOK.md) - Facebook details
- 🍽️ [Talabat Scraper](./TALABAT.md) - Talabat details
- 📊 [Data Processor](./DATA-PROCESSOR.md) - Processing details

## Next Steps

1. ✅ Install & configure (this page)
2. → Run `npm run scrape:full`
3. → Verify files in `src/app/core/data/`
4. → Check Angular app loads new data
5. → (Optional) Set up scheduled runs
6. → (Optional) Customize scrapers

You're ready to go! 🚀
