# Configuration Guide

Complete setup and configuration for MERZY scraper system.

## Environment Variables

Create `.env.scraper` in project root:

```bash
# Instagram Configuration
INSTAGRAM_USER=@merzy.eg
INSTAGRAM_SESSION_ID=             # Optional: for authenticated scraping

# Facebook Configuration  
FACEBOOK_PAGE_ID=61583371166412
FACEBOOK_PAGE_ACCESS_TOKEN=       # Required for full access
FACEBOOK_APP_ID=                  # Optional: for token refresh
FACEBOOK_APP_SECRET=              # Optional: for token refresh

# Talabat Configuration
TALABAT_RESTAURANT_ID=1102357

# Scraper Behavior
OUTPUT_DIR=./scraped-data
CACHE_IMAGES=true
SCRAPE_TIMEOUT=30000
MAX_RETRIES=3
DEBUG_SCRAPER=false               # Set to 'true' for verbose logging
DEBUG_PROCESSOR=false             # Set to 'true' for processor debugging
```

## npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "scrape:instagram": "ts-node scripts/scrapers/instagram.scraper.ts",
    "scrape:facebook": "ts-node scripts/scrapers/facebook.scraper.ts",
    "scrape:talabat": "ts-node scripts/scrapers/talabat.scraper.ts",
    "scrape:all": "ts-node scripts/orchestrator.ts --scrapers-only",
    "scrape:full": "ts-node scripts/orchestrator.ts",
    "process:data": "ts-node scripts/data-processor/processor.ts",
    "scrape:test": "ts-node scripts/orchestrator.ts --test",
    "scrape:debug": "DEBUG_SCRAPER=true ts-node scripts/orchestrator.ts"
  }
}
```

## Installation

### 1. Install Dependencies

```bash
npm install axios cheerio dotenv
npm install --save-dev @types/cheerio @types/node ts-node typescript
```

### 2. Create Environment File

```bash
cp .env.example .env.scraper
# Edit .env.scraper with your configuration
```

### 3. (Optional) Get Facebook Access Token

For full Facebook scraping:

1. Go to https://developers.facebook.com
2. Create a new app (Business type)
3. Add "Facebook Login" product
4. Create a page access token:
   - Go to Tools → Graph Explorer
   - Select your app
   - Select MERZY page
   - Generate token
5. Add to `.env.scraper`:
   ```
   FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
   ```

### 4. (Optional) Get Instagram Session

For authenticated Instagram scraping:

1. Get your Instagram session ID:
   - Log in to Instagram
   - Open DevTools (F12)
   - Go to Storage → Cookies
   - Copy `sessionid` value
2. Add to `.env.scraper`:
   ```
   INSTAGRAM_SESSION_ID=your_session_id
   ```

## Directory Structure

Created by scrapers:

```
scraped-data/
├── raw/                          # Raw scraper output
│   ├── instagram-posts.json
│   ├── facebook-posts.json
│   └── talabat-menu.json
├── processed/                    # Processed data (optional)
│   ├── merzy-social.json
│   └── merzy-menu.json
├── images/                       # Downloaded images
│   ├── instagram/
│   ├── facebook/
│   ├── talabat/
│   └── cache-index.json         # Image cache metadata
└── logs/                         # Optional: scraper logs
```

## Running Scrapers

### Run All Scrapers + Process Data

```bash
npm run scrape:full
```

Full pipeline:
1. Scrapes Instagram, Facebook, Talabat
2. Transforms data to MERZY format
3. Downloads & caches images
4. Deduplicates posts
5. Generates TypeScript files
6. App auto-reloads with new data

### Run Scrapers Only

```bash
npm run scrape:all
```

Scrapes all sources, saves raw JSON to `scraped-data/raw/`.

### Run Specific Scraper

```bash
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat
```

### Process Existing Raw Data

```bash
npm run process:data
```

If you have existing raw JSON files in `scraped-data/raw/`, this processes them without re-scraping.

### Debug Mode

Enable verbose logging:

```bash
npm run scrape:debug
DEBUG_PROCESSOR=true npm run process:data
```

## Test Mode

Test without network requests:

```bash
npm run scrape:test
```

Uses mock data, validates structure, no external requests.

## Rate Limiting & Ethics

### Scrapers Implement

- 2-3 second delays between requests
- Exponential backoff on 429 errors
- Timeout handling (30 seconds)
- Retry logic with jitter
- User-Agent rotation
- Respects `robots.txt`

### Best Practices

- Run scrapers during off-peak hours
- Don't run multiple instances simultaneously
- Cache results to avoid re-scraping
- Respect platform ToS
- Don't scrape private accounts
- Use official APIs when available

### Rate Limit Recovery

If you hit rate limits:

1. **Instagram**: Wait 24 hours or use different IP
2. **Facebook**: Token may expire, refresh in Graph Explorer
3. **Talabat**: Increase delays between requests

## Troubleshooting

### "Cannot find module cheerio"

Install dependencies:
```bash
npm install cheerio
npm install --save-dev @types/cheerio
```

### "Invalid Facebook access token"

1. Check token hasn't expired
2. Refresh in Graph Explorer (Tools → Graph Explorer)
3. Verify page permissions
4. Ensure using Page Access Token (not User Token)

### "Instagram: 429 Too Many Requests"

Rate limited. Solutions:
- Increase `SCRAPE_TIMEOUT` in `.env.scraper`
- Decrease max posts to scrape
- Wait 24 hours
- Use different IP/VPN

### "No images downloading"

Check:
1. `CACHE_IMAGES=true` in `.env.scraper`
2. `scraped-data/images/` directory exists and is writable
3. Network connectivity for image downloads
4. Image URLs are still valid (CDN links may expire)

### "TypeScript files not generating"

Check:
1. Raw JSON files exist in `scraped-data/raw/`
2. File paths are correct
3. `src/app/core/data/` directory exists
4. No TypeScript syntax errors

## Scheduling

### Development

Run manually as needed:
```bash
npm run scrape:full
```

### Production (GitHub Actions)

Create `.github/workflows/scrape-weekly.yml`:

```yaml
name: Weekly Scrape

on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run scrape:full
        env:
          FACEBOOK_PAGE_ACCESS_TOKEN: ${{ secrets.FACEBOOK_PAGE_ACCESS_TOKEN }}
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git commit -m "chore: update scraped data" || true
          git push
```

### Cron Job (Linux/Mac)

Add to crontab:

```bash
# Run scraper every Sunday at 2 AM
0 2 * * 0 cd /home/user/merzy && npm run scrape:full
```

## Security

### Protect Sensitive Data

- ✅ `.env.scraper` in `.gitignore`
- ✅ Don't commit API tokens
- ✅ Rotate tokens monthly
- ✅ Use GitHub Secrets for CI/CD
- ✅ Only request minimum permissions

### Safe Scraping

- ✅ Respect `robots.txt`
- ✅ Don't overload servers
- ✅ Follow platform ToS
- ✅ Don't store PII unnecessarily
- ✅ Use HTTPS for all requests

## Performance Optimization

### Parallel Requests

By default, requests are sequential with delays. To enable parallel (with rate limiting):

Edit `scripts/scrapers/utils.ts`:

```typescript
async downloadAllImages(urls: string[]): Promise<void> {
  const concurrency = 5; // Parallel limit
  
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    await Promise.all(batch.map(url => this.downloadImage(url)));
  }
}
```

### Caching

Results are cached in `scraped-data/`. To force re-scrape:

```bash
rm -rf scraped-data/raw/*
npm run scrape:full
```

### Image Caching

Images are cached and re-downloaded only if older than 4 weeks.

Edit `scripts/data-processor/image-cache.ts`:

```typescript
private shouldRedownload(filepath: string): boolean {
  const stats = fs.statSync(filepath);
  const ageWeeks = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24 * 7);
  return ageWeeks > 4;  // Change to 2, 1, 0.25, etc.
}
```

## Maintenance

### Monthly Tasks

- Review scraper output for errors
- Check for broken image URLs
- Verify data freshness
- Update dependencies: `npm update`

### When Sites Change

If scrapers stop working:

1. Inspect the target website (DevTools)
2. Find new CSS selectors
3. Update selectors in scraper files
4. Test with `--test` flag
5. Commit changes

Example: Update Instagram selectors in `scripts/scrapers/instagram.scraper.ts`

### Monitoring

Check logs for issues:

```bash
DEBUG_SCRAPER=true npm run scrape:full 2>&1 | tee scraper.log
```

## See Also

- [README.md](./README.md) - Scraper system overview
- [INSTAGRAM.md](./INSTAGRAM.md) - Instagram scraper details
- [FACEBOOK.md](./FACEBOOK.md) - Facebook scraper details
- [TALABAT.md](./TALABAT.md) - Talabat scraper details
