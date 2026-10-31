# System Architecture

Complete design and data flow of MERZY scraper system.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MERZY Scraper System                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Instagram   │  │   Facebook   │  │   Talabat    │
│   @merzy.eg  │  │   (Page ID)   │  │  (REST ID)   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Instagram   │  │   Facebook   │  │   Talabat    │
│   Scraper    │  │   Scraper    │  │   Scraper    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
        ┌────────────────────────────────────┐
        │  Raw Output (JSON)                 │
        │  scraped-data/raw/                 │
        │  ├─ instagram-posts.json           │
        │  ├─ facebook-posts.json            │
        │  └─ talabat-menu.json              │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   Data Transformer                 │
        │  Transform to MERZY formats        │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   Image Cache Manager              │
        │  Download & cache images locally   │
        │  Update references to local paths  │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   Deduplicator                     │
        │  Remove duplicate posts            │
        │  Keep highest quality versions     │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   Data Validator                   │
        │  Validate all processed data       │
        │  Generate validation report       │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   TypeScript Generator             │
        │  src/app/core/data/merzy-social.ts │
        │  src/app/core/data/menu.ts         │
        └────────────────────────────────────┘
```

## Component Details

### 1. Scrapers Layer

#### Instagram Scraper
- **File**: `scripts/scrapers/instagram.scraper.ts`
- **Input**: Public Instagram profile @merzy.eg
- **Output**: InstagramScraperOutput
  - Posts (photos, carousels, reels)
  - Profile info
  - Highlights
  - Comments
- **Methods**: Public HTML parsing + Graph API (optional)
- **Rate Limiting**: 2-3s delays, exponential backoff on 429

#### Facebook Scraper
- **File**: `scripts/scrapers/facebook.scraper.ts`
- **Input**: Facebook page ID 61583371166412
- **Output**: FacebookScraperOutput
  - Posts with engagement metrics
  - Page info & stats
  - Reviews & ratings
  - Comments
- **Methods**: Facebook Graph API (requires access token)
- **Auth**: Page access token in .env.scraper

#### Talabat Scraper
- **File**: `scripts/scrapers/talabat.scraper.ts`
- **Input**: Talabat restaurant ID 1102357
- **Output**: TalabatScraperOutput
  - Menu items with prices
  - Restaurant info
  - Reviews & ratings
  - Current promotions
- **Methods**: Public HTML parsing with cheerio
- **Rate Limiting**: 2-3s delays between requests

### 2. Data Processor Layer

#### Image Cache Manager
- **File**: `scripts/data-processor/image-cache.ts`
- **Responsibility**: Downloads images, stores locally, updates references
- **Features**:
  - Parallel downloads with concurrency limits
  - Local caching to avoid re-downloads
  - Cache index for metadata
  - Retry logic with exponential backoff
  - Automatic source detection (instagram/facebook/talabat)

#### Deduplicator
- **File**: `scripts/data-processor/deduplicator.ts`
- **Responsibility**: Removes duplicate posts across platforms
- **Logic**:
  - Generates unique signature from caption + date
  - Keeps highest quality version
  - Scores by: engagement, location tag, caption length, source
  - Sorts by date descending

#### Data Transformers
- **File**: `scripts/data-processor/transformers.ts`
- **Responsibility**: Converts raw data to MERZY frontend formats
- **Transforms**:
  - InstagramPost → MerzySocialPost
  - FacebookPost → MerzySocialPost
  - TalabatMenuItem → MenuItem

#### Data Validator
- **File**: `scripts/data-processor/validators.ts`
- **Responsibility**: Validates all processed data
- **Checks**:
  - Required fields present
  - Data types correct
  - Values in valid ranges
  - URLs are valid
  - Dates are parseable
  - Generates validation report

#### Main Processor
- **File**: `scripts/data-processor/processor.ts`
- **Responsibility**: Orchestrates all processor components
- **Pipeline**:
  1. Load raw JSON files
  2. Transform data to MERZY formats
  3. Download and cache images
  4. Deduplicate posts
  5. Merge with existing mock data
  6. Validate all data
  7. Generate TypeScript files

### 3. Utilities Layer

#### HTTP Client
- **File**: `scripts/scrapers/utils.ts` (HttpClient class)
- **Features**:
  - Automatic retry with exponential backoff
  - Timeout handling
  - Rate limit detection (429)
  - User-Agent rotation
  - Request/response logging

#### Logging
- **File**: `scripts/scrapers/utils.ts` (Logger class)
- **Methods**: log, debug, warn, error, success, section, progress
- **Features**: Verbose mode, progress bars, colored output

#### File System
- **File**: `scripts/scrapers/utils.ts` (FileSystem class)
- **Methods**: ensureDir, readJson, writeJson, appendJson, deleteFile

#### Date Utils
- **File**: `scripts/scrapers/utils.ts` (DateUtils class)
- **Methods**: formatDate, formatDateTime, parseDate, getTimestamp

#### String Utils
- **File**: `scripts/scrapers/utils.ts` (StringUtils class)
- **Methods**: sanitize, extractHashtags, extractMentions, truncate, slugify, parsePrice

## Data Flow Diagram

### Scraping Phase
```
Instagram API/HTML
  ↓
instagram.scraper.ts
  ├─ scrapeProfile()
  ├─ scrapePosts()
  ├─ scrapeHighlights()
  └─ scrapePostComments()
  ↓
scraped-data/raw/instagram-posts.json
{
  profile: {...},
  posts: [...],
  highlights: [...],
  comments: [...]
}

Similar for Facebook & Talabat...
```

### Processing Phase
```
scraped-data/raw/instagram-posts.json
scraped-data/raw/facebook-posts.json
scraped-data/raw/talabat-menu.json
  ↓
processor.ts
  ├─ Load raw JSON files
  │   ↓
  ├─ Transform data
  │   ├─ InstagramPost → MerzySocialPost
  │   ├─ FacebookPost → MerzySocialPost
  │   └─ TalabatMenuItem → MenuItem
  │   ↓
  ├─ Download images
  │   ├─ Collect unique URLs
  │   ├─ Download in parallel
  │   ├─ Cache locally
  │   └─ Update references
  │   ↓
  ├─ Deduplicate posts
  │   ├─ Generate signatures
  │   ├─ Compare quality
  │   └─ Keep best versions
  │   ↓
  ├─ Merge with existing data
  │   ├─ Load existing mock data
  │   ├─ Merge new data
  │   └─ Prioritize source
  │   ↓
  ├─ Validate all data
  │   ├─ Check required fields
  │   ├─ Validate types
  │   ├─ Check ranges
  │   └─ Generate report
  │   ↓
  └─ Generate TypeScript files
      ├─ src/app/core/data/merzy-social.ts
      └─ src/app/core/data/menu.ts
```

## File Structure

```
project/
├── scripts/
│   ├── scrapers/
│   │   ├── instagram.scraper.ts          # Instagram extraction
│   │   ├── facebook.scraper.ts           # Facebook extraction
│   │   ├── talabat.scraper.ts            # Talabat extraction
│   │   ├── types.ts                      # TypeScript interfaces
│   │   └── utils.ts                      # Shared utilities
│   │
│   ├── data-processor/
│   │   ├── processor.ts                  # Main orchestrator
│   │   ├── transformers.ts               # Data format converters
│   │   ├── deduplicator.ts               # Post deduplication
│   │   ├── image-cache.ts                # Image downloading
│   │   └── validators.ts                 # Data validation
│   │
│   └── orchestrator.ts                   # CLI entry point
│
├── docs/
│   └── scrapers/
│       ├── README.md                     # System overview
│       ├── INSTAGRAM.md                  # Instagram details
│       ├── FACEBOOK.md                   # Facebook details
│       ├── TALABAT.md                    # Talabat details
│       ├── DATA-PROCESSOR.md             # Processor documentation
│       ├── CONFIGURATION.md              # Setup guide
│       └── ARCHITECTURE.md               # This file
│
├── scraped-data/
│   ├── raw/
│   │   ├── instagram-posts.json
│   │   ├── facebook-posts.json
│   │   └── talabat-menu.json
│   ├── images/
│   │   ├── instagram/
│   │   ├── facebook/
│   │   └── talabat/
│   └── cache-index.json
│
└── src/app/core/data/
    ├── merzy-social.ts                  # Auto-generated
    └── menu.ts                          # Auto-generated
```

## Type System

### Input Types (Raw Data)

```typescript
// Instagram
InstagramProfile
InstagramPost
InstagramHighlight
InstagramComment
InstagramScraperOutput

// Facebook
FacebookPage
FacebookPost
FacebookReview
FacebookComment
FacebookScraperOutput

// Talabat
TalabatRestaurant
TalabatMenuItem
TalabatReview
TalabatPromotion
TalabatScraperOutput
```

### Output Types (Frontend Data)

```typescript
// Frontend models
MerzySocialProfile
MerzySocialPost
MerzyHighlight
MerzyComment
MenuItem
```

All types defined in `scripts/scrapers/types.ts`.

## Error Handling Strategy

### Scraper Errors
- Caught and logged
- Scrapers continue with empty data
- Returns error array in output
- Main processor continues with partial data

### Network Errors
- Automatic retry with exponential backoff
- Max 3 retries per request
- Timeouts after 30 seconds
- Rate limiting handled specially

### Data Processing Errors
- Validation catches bad data
- Errors logged but processing continues
- Invalid items skipped or fixed
- Report generated at end

### Image Download Errors
- Failed images skip but processing continues
- Fallback to external URL if local fails
- Cache skips corrupted files
- Re-download on next run

## Performance Characteristics

### Scraping
- **Instagram**: ~30-60 seconds (5-10 posts)
- **Facebook**: ~20-40 seconds (3-5 posts, if API available)
- **Talabat**: ~15-30 seconds (menu + reviews)
- **Total**: ~2-5 minutes depending on network

### Processing
- **Transformation**: < 1 second
- **Image Downloads**: 1-5 minutes (depends on image count & size)
- **Deduplication**: < 1 second
- **Validation**: < 1 second
- **File Generation**: < 1 second

### Storage
- **Raw Data**: ~5-20 MB (JSON)
- **Images**: ~50-100 MB (50-100 images at avg 1 MB each)
- **Total**: ~60-120 MB

## Extensibility Points

### Adding New Data Sources

1. Create new scraper: `scripts/scrapers/[source].scraper.ts`
2. Implement ScraperInterface
3. Add output interface in `types.ts`
4. Add transformer in `transformers.ts`
5. Update processor to handle new source

### Customizing Transformations

Edit `scripts/data-processor/transformers.ts` to:
- Add new fields to output
- Change field mapping logic
- Add computed fields
- Filter/sort data differently

### Modifying Validation Rules

Edit `scripts/data-processor/validators.ts` to:
- Add new validation rules
- Change validation thresholds
- Customize error messages
- Add data fixing logic

## Testing Strategy

### Unit Tests (Future)
```bash
npm run test:scrapers
npm run test:processor
```

### Integration Tests
```bash
npm run scrape:test      # Mock data only
npm run scrape:debug     # Verbose output
```

### Manual Testing
```bash
npm run scrape:instagram -- --test
npm run scrape:facebook -- --test
npm run scrape:talabat -- --test
npm run process:data -- --validate-only
```

## Monitoring & Logging

### Verbose Output
```bash
DEBUG_SCRAPER=true npm run scrape:full
DEBUG_PROCESSOR=true npm run process:data
```

### Log Files
- Stored in `./logs/` (optional setup)
- Rotation by date
- Levels: DEBUG, INFO, WARN, ERROR

## Security Model

### Data Sensitivity
- Only public data scraped
- No passwords or PII stored
- No user private data accessed
- No authentication credentials in code

### Token Management
- Tokens stored in .env.scraper (not in git)
- Auto-refresh on expiration
- Rotation recommended monthly
- Secrets in CI/CD via environment

### Network Security
- HTTPS only
- Certificate validation
- No MITM vulnerability
- Timeout on hanging connections

## See Also

- [README.md](./README.md) - System overview
- [CONFIGURATION.md](./CONFIGURATION.md) - Setup guide
- [DATA-PROCESSOR.md](./DATA-PROCESSOR.md) - Processor details
