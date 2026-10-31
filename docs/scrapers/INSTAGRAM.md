# Instagram Scraper Documentation

Complete guide for extracting data from MERZY's Instagram profile (@merzy.eg).

## Overview

Scrapes public Instagram data without authentication (public profile only):
- Posts (photos, carousels, reels, videos)
- Captions, likes, comments, engagement
- Stories, highlights, cover images
- Location tags, audio tracks
- Collaborator mentions
- Profile info (bio, followers, following)

## Data Points Extracted

### Profile Data
```typescript
{
  handle: "@merzy.eg",
  name: "Merzy Coffee",
  bio: "for those who value the details.",
  followers: 4836,
  following: 127,
  organization: "Merzy Coffee",
  location: "Bibliotheca Alexandrina — Alexandria",
  avatar: "/scraped/instagram/profile-pic.jpg",
  externalLinks: ["https://www.instagram.com/merzy.eg/", ...]
}
```

### Posts Data
```typescript
{
  code: "DdDqTxbDem_",           // Instagram post ID
  type: "carousel" | "photo" | "reel" | "video",
  date: "September 8, 2026",     // Display date
  image: "/scraped/instagram/post-sep08-details.jpg",  // Local path
  caption: "It's all in the details. Designed for the moments...",
  likesText: "318 likes",
  commentsCount: 12,
  location?: "Bibliotheca Alexandrina - مكتبة الاسكندرية",
  collabWith?: "kayan.interiors",
  audio?: "Rivaro • Sun On Replay",
  textOnImage?: "SOMETHING NEW IS TAKING SHAPE",
  url: "https://www.instagram.com/p/DdDqTxbDem_/",
  timestamp: 1694116800000,  // Unix timestamp
}
```

### Highlights Data
```typescript
{
  name: "Desserts",
  cover: "/scraped/instagram/highlight-desserts.jpg",
  url: "https://www.instagram.com/stories/highlights/17937361365232810/",
  storyCount: 8,
  lastUpdated: "2026-09-15"
}
```

### Comments Data
```typescript
{
  author: "aya_samir564428",
  text: "Perfecttttttt",
  source: "Instagram, Sep 8 post",
  timestamp: "2026-09-08T14:32:00Z",
  likes: 3,
  isReply: false,
  authorFollowers?: 1240
}
```

## Scraping Methods

### Method 1: Public HTML Scraping (Recommended - No Auth)

Uses `cheerio` to parse Instagram's public HTML. Works without API credentials.

**Advantages:**
- No authentication required
- No API keys needed
- Works with rate limiting
- Respects public profile only

**Disadvantages:**
- Slower than API
- Fragile to site structure changes
- Subject to rate limiting (429 errors)

**Implementation:**
```typescript
// scripts/scrapers/instagram.scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export class InstagramScraper {
  private readonly profile = '@merzy.eg';
  private readonly delay = 2000; // 2 seconds between requests
  
  async scrapeProfile(): Promise<MerzySocialProfile> {
    const url = `https://www.instagram.com/${this.profile}/`;
    const html = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0...' }
    });
    
    const $ = cheerio.load(html.data);
    // Parse profile data...
  }
  
  async scrapePosts(): Promise<MerzySocialPost[]> {
    // Extract posts from profile...
  }
}
```

### Method 2: Instagram Graph API (Optional - Authenticated)

Uses official Meta Graph API for reliable, rate-limited access.

**Setup:**
1. Create Meta Developer account
2. Create Facebook App
3. Get Access Token
4. Request `instagram_business_account_id`

**Required Permissions:**
- `instagram_business_content_access`
- `pages_read_engagement`

**Implementation:**
```typescript
// Optional: Use environment variable
const accessToken = process.env.INSTAGRAM_GRAPH_TOKEN;
const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

// Fetch media
const response = await axios.get(
  `https://graph.instagram.com/${businessAccountId}/media`,
  { params: { access_token: accessToken } }
);
```

## Target URLs

### Main Profile
- `https://www.instagram.com/merzy.eg/`

### Specific Post
- `https://www.instagram.com/p/DdDqTxbDem_/`

### Stories/Highlights
- `https://www.instagram.com/stories/highlights/17937361365232810/`

## Selectors & Parsing

### HTML Structure (Public Profile)

```html
<!-- Profile Info Container -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Merzy Coffee",
    "url": "https://www.instagram.com/merzy.eg/",
    "image": "..."
  }
</script>

<!-- Post Grid -->
<article>
  <div class="x1iyjqo2">  <!-- Post container -->
    <a href="/p/DdDqTxbDem_/">
      <img alt="post caption text" src="..." />
    </a>
  </div>
</article>
```

### Key Selectors
- Profile name: `h1` > `span`
- Bio: `.-mx3:not(.x112z3l0)` text content
- Followers: `li:nth-child(1)` > `span` > `span`
- Following: `li:nth-child(2)` > `span` > `span`
- Posts grid: `article > div > div > a`

## Rate Limiting & Delays

Instagram enforces rate limiting on public scrapers:

- **Default delay**: 2-3 seconds between requests
- **After 429 error**: Exponential backoff (2s, 5s, 10s, 30s, 60s)
- **Cooldown period**: 1 hour after repeated 429s
- **Max requests/hour**: ~600-800 (varies by IP)

**Implementation:**
```typescript
async delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async requestWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios.get(url, {
        headers: { 'User-Agent': randomUserAgent() }
      });
    } catch (error) {
      if (error.status === 429) {
        const waitTime = Math.pow(2, i) * 5000; // 5s, 10s, 20s...
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await this.delay(waitTime);
      } else throw error;
    }
  }
}
```

## Image Extraction & Caching

### Post Images
- Extract `src` from `<img>` tags
- Save to `/scraped/instagram/post-[date]-[title].jpg`
- Update reference in data to local path

### Story/Highlight Covers
- Extract cover image URL
- Save to `/scraped/instagram/highlight-[name].jpg`
- Update reference in data

### Profile Avatar
- Extract from profile header
- Save to `/scraped/instagram/profile-pic.jpg`

**Download Implementation:**
```typescript
async downloadImage(url: string, filepath: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

## Video/Reel Handling

### Reels (Short Videos)
- Detect `type: "reel"`
- Extract thumbnail image (first frame)
- Store URL to Instagram post
- Download & cache thumbnail

### Carousel Posts
- Multiple images in single post
- Extract primary image
- Store URLs to all images in post object

## Comment Extraction

### Visible Comments
- Parse comments visible in post preview
- Extract author, text, timestamp
- Get like count

### Limitations
- Only public comments visible
- Limited to first ~5 comments per post
- No nested reply threads

## Highlights Extraction

### Story Highlights
- Access highlight list from profile
- Extract highlight name & cover image
- Get list of stories within highlight
- Map to `MerzyHighlight[]` data

## Collaboration Tags

### Partner Mentions
```
"Merzy Coffee × kayan.interiors"
→ collabWith: "kayan.interiors"
```

Extract from:
- Caption text (@ mentions)
- Tagged users
- Location metadata

## Timestamp Handling

Instagram provides:
- Display date: "September 8, 2026"
- Post URL with date code
- Actual upload timestamp via GraphQL

**Parse to both formats:**
```typescript
date: "September 8, 2026",           // Display format
timestamp: 1694116800000,            // Unix milliseconds
originalUrl: "https://www.instagram.com/p/DdDqTxbDem_/"
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 429 Too Many Requests | Rate limit | Increase delay, use proxy |
| 404 Not Found | Post deleted | Skip & log |
| 403 Forbidden | IP blocked | Wait 24h or use proxy |
| Connection timeout | Network issue | Retry with exponential backoff |
| Invalid selector | Site structure changed | Update selectors |

### Retry Strategy
```typescript
// Exponential backoff with jitter
const baseDelay = 1000;
const maxRetries = 5;

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    return await scrapeUrl(url);
  } catch (error) {
    if (attempt === maxRetries - 1) throw error;
    
    const delay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * delay;
    await this.delay(delay + jitter);
  }
}
```

## Validation & Sanitization

### Data Validation
- Check post has required fields (code, date, caption, image)
- Validate URLs are HTTPS
- Check image files exist after download
- Validate timestamp is recent (within 2 years)

### Text Sanitization
- Remove HTML entities
- Escape special characters
- Trim whitespace
- Handle emoji preservation

## Output Format

Raw output saved to `scraped-data/raw/instagram-posts.json`:

```json
{
  "profile": {
    "handle": "@merzy.eg",
    "name": "Merzy Coffee",
    ...
  },
  "posts": [
    {
      "code": "DdDqTxbDem_",
      "type": "carousel",
      ...
    }
  ],
  "highlights": [
    {
      "name": "Desserts",
      ...
    }
  ],
  "comments": [
    {
      "author": "aya_samir564428",
      ...
    }
  ],
  "scrapedAt": "2026-10-31T18:30:00Z",
  "success": true
}
```

## Testing

### Dry Run (No Network)
```bash
npm run scrape:instagram -- --test --mock
```

### Test with Real Network
```bash
npm run scrape:instagram -- --test --verbose
```

### Full Run
```bash
npm run scrape:instagram
```

## Debugging

Enable verbose logging:
```typescript
// scripts/scrapers/instagram.scraper.ts
const DEBUG = process.env.DEBUG_SCRAPER === 'true';

if (DEBUG) {
  console.log('Fetching profile...', url);
  console.log('Response status:', response.status);
  console.log('Parsed posts:', posts.length);
}
```

Run with debugging:
```bash
DEBUG_SCRAPER=true npm run scrape:instagram
```

## Security & Privacy

- ✅ Only scrapes public data
- ✅ No passwords or private data
- ✅ No PII beyond public profile
- ✅ Respects rate limits
- ✅ Does not impersonate users
- ✅ Follows Instagram ToS for public data access

## Maintenance

### When Site Structure Changes
1. Check if selectors still valid
2. Update selectors in scraper code
3. Test with `--test` flag
4. Verify output in `scraped-data/raw/`
5. Re-run data processor

### Monthly Tasks
- Check for broken image URLs
- Verify API access token validity (if using Graph API)
- Monitor error logs
- Update dependencies (`npm update`)

## See Also

- [README.md](./README.md) - Scraper system overview
- [DATA-PROCESSOR.md](./DATA-PROCESSOR.md) - How data is processed
- [CONFIGURATION.md](./CONFIGURATION.md) - Environment setup
