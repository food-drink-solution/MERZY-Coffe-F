# Scripts Directory

Data collection, processing, and automation utilities for MERZY.

## Overview

The `scripts/` directory contains TypeScript utilities for scraping social media and review platforms, processing scraped data, and syncing with the application.

## Directory Structure

```
scripts/
├── README.md                    # This file
├── orchestrator.ts              # Main orchestrator for data pipeline
├── git-sync.sh                  # Git synchronization utility
├── scrapers/                    # Data collection scripts
│   ├── instagram.scraper.ts    # Instagram @merzy.eg scraper
│   ├── facebook.scraper.ts     # Facebook page scraper
│   ├── talabat.scraper.ts      # Talabat restaurant scraper
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Shared utilities
└── data-processor/              # Data transformation pipeline
    ├── processor.ts             # Main processor
    ├── transformers.ts          # Data transformation logic
    ├── deduplicator.ts          # Remove duplicate posts
    ├── validators.ts            # Data validation
    └── image-cache.ts           # Image download & cache
```

## Scrapers (`scripts/scrapers/`)

### Instagram Scraper
**File**: `instagram.scraper.ts`

Fetches public data from MERZY's Instagram profile (@merzy.eg):
- Posts and captions
- Images and videos
- Engagement metrics (likes, comments)
- Hashtags and mentions
- Story content
- Upload dates

**Usage**:
```typescript
import { scrapeInstagram } from './instagram.scraper';

const data = await scrapeInstagram('@merzy.eg');
console.log(data.posts);
```

### Facebook Scraper
**File**: `facebook.scraper.ts`

Fetches public data from MERZY's Facebook page:
- Page posts
- Reviews and ratings
- Reactions (likes, loves, etc.)
- Comments
- Share count
- Post metadata

**Usage**:
```typescript
import { scrapeFacebook } from './facebook.scraper';

const data = await scrapeFacebook('merzy.coffee.page');
console.log(data.reviews);
```

### Talabat Scraper
**File**: `talabat.scraper.ts`

Fetches restaurant data from Talabat listing:
- Menu items and categories
- Prices in EGP
- Item descriptions
- Food photos
- Restaurant ratings
- Delivery time & fees
- Customer reviews

**Usage**:
```typescript
import { scrapeTalabat } from './talabat.scraper';

const data = await scrapeTalabat(1102357);
console.log(data.menu);
```

## Data Processor (`scripts/data-processor/`)

### Main Processor
**File**: `processor.ts`

Orchestrates the data processing pipeline:
1. Fetch raw data from scrapers
2. Transform to MERZY format
3. Download and cache images
4. Deduplicate posts
5. Validate data
6. Generate TypeScript types
7. Merge with existing data

**Usage**:
```typescript
import { processAllData } from './processor';

const result = await processAllData();
console.log(result.itemsProcessed);
```

### Transformers
**File**: `transformers.ts`

Converts scraped data into MERZY application format:
- Instagram posts → Menu items/testimonials
- Facebook reviews → Customer reviews
- Talabat menu → Product catalog
- Images → Local cached versions

### Deduplicator
**File**: `deduplicator.ts`

Removes duplicate posts across platforms:
- Detects same content posted on multiple platforms
- Removes old versions keeping latest
- Preserves engagement metrics
- Maintains data integrity

### Validators
**File**: `validators.ts`

Validates scraped data quality:
- Required fields present
- Data format correctness
- URL validity
- Image accessibility
- Text content quality

### Image Cache
**File**: `image-cache.ts`

Manages image downloading and caching:
- Downloads images to `frontend/MERZY-Coffe/public/scraped/`
- Caches locally to avoid re-downloads
- Handles rate limiting
- Retry failed downloads
- Generate image metadata

## Running Scripts

### Run All Scrapers
```bash
npm run scrape
```

### Run Specific Scraper
```bash
npm run scrape:instagram
npm run scrape:facebook
npm run scrape:talabat
```

### Process Scraped Data
```bash
npm run process
```

### Run Full Pipeline
```bash
npm run scrape:all
```

### Dry Run (Preview without saving)
```bash
npm run scrape:dry-run
```

## Configuration

Create `.env` in the root directory:
```env
# Rate limiting
SCRAPER_DELAY_MS=1000
REQUESTS_PER_MINUTE=60

# Image caching
IMAGE_CACHE_DIR=frontend/MERZY-Coffe/public/scraped
MAX_IMAGE_SIZE_MB=5

# Output
OUTPUT_DIR=frontend/MERZY-Coffe/src/data
```

## Data Output

### Generated Files

After running the full pipeline:

**TypeScript Data File**
```
frontend/MERZY-Coffe/src/data/scraped-data.ts
```

Contains:
- Menu items
- Product images
- Reviews
- Testimonials
- Ratings

**Cached Images**
```
frontend/MERZY-Coffe/public/scraped/
├── instagram/
├── facebook/
└── talabat/
```

## API Reference

### Scraper Interface

```typescript
interface ScrapedData {
  source: 'instagram' | 'facebook' | 'talabat';
  items: Item[];
  reviews: Review[];
  images: Image[];
  metadata: {
    scrapedAt: Date;
    count: number;
    errors: string[];
  };
}
```

### Types (`scripts/scrapers/types.ts`)

All TypeScript interfaces and type definitions are centralized in `types.ts`:
- Post interface
- Review interface
- MenuItem interface
- Image metadata
- Error types

### Utils (`scripts/scrapers/utils.ts`)

Shared utilities across all scrapers:
- HTTP client with rate limiting
- Logging utilities
- File operations
- Error handling
- Data validation helpers

## Error Handling

All scrapers include comprehensive error handling:
- Network errors → Retry with backoff
- Rate limiting → Queue and delay
- Missing data → Log warning, skip
- Invalid format → Validate and sanitize

## Logging

Each script logs to:
- **Console**: Real-time progress
- **File**: `logs/scraper-YYYY-MM-DD.log`
- **Errors**: `logs/errors-YYYY-MM-DD.log`

Example:
```bash
npm run scrape 2>&1 | tee logs/latest-scrape.log
```

## Testing

### Test Scrapers
```bash
npm run test:scrapers
```

### Test Data Processing
```bash
npm run test:processor
```

### Test All
```bash
npm run test:scripts
```

## Performance

### Typical Execution Times
- Instagram: 30-60 seconds
- Facebook: 20-40 seconds
- Talabat: 10-20 seconds
- Image Processing: Variable (depends on image count)
- Total Pipeline: 2-5 minutes

### Optimization Tips
- Run during off-peak hours
- Use `--no-images` flag to skip image downloads
- Implement incremental updates (only new posts)
- Use caching to avoid re-processing

## Troubleshooting

### Issue: Rate Limit Errors
**Solution**: Increase `REQUESTS_PER_MINUTE` delay or reduce concurrency

### Issue: Image Download Failures
**Solution**: Check disk space, ensure write permissions, verify URLs

### Issue: Duplicate Detection Not Working
**Solution**: Ensure previous data was processed and cached

### Issue: Memory Issues with Large Datasets
**Solution**: Process in batches using `--batch-size` flag

## Best Practices

1. **Always run tests before committing**
   ```bash
   npm run test:scripts
   ```

2. **Check logs for warnings**
   ```bash
   tail -f logs/latest-scrape.log
   ```

3. **Validate output manually**
   - Check image files exist
   - Verify data format
   - Spot-check content

4. **Keep rate limits reasonable**
   - Don't overwhelm source servers
   - Respect robots.txt
   - Follow terms of service

5. **Document changes**
   - Update CHANGELOG.md
   - Comment complex logic
   - Track data schema versions

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] Scheduled scraping (cron jobs)
- [ ] Webhook notifications on data changes
- [ ] API endpoint for manual scraping
- [ ] Advanced filtering and search
- [ ] Real-time data synchronization

## Related Documentation

- [docs/scrapers/](../docs/scrapers/) - Detailed scraper documentation
- [docs/scraped-data.md](../docs/scraped-data.md) - Data format and sources
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guidelines

## Support

For issues or questions:
1. Check [docs/scrapers/](../docs/scrapers/) for detailed guides
2. Review error logs in `logs/` directory
3. Check GitHub issues
4. Contact the development team

---

**Last Updated**: October 31, 2026  
**Version**: 1.0.0  
**Maintained by**: MERZY Development Team
