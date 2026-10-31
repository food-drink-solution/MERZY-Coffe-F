# Facebook Scraper Documentation

Complete guide for extracting data from MERZY's Facebook page.

## Overview

Scrapes public Facebook data from MERZY Coffee page:
- Page posts, captions, engagement metrics
- Comments and reactions (likes, love, haha, wow, sad, angry)
- Reviews, ratings, recommendations
- Business hours, contact information
- Page info (followers, about section)

## Data Points Extracted

### Page Info
```typescript
{
  pageId: "61583371166412",
  name: "Merzy Coffee",
  category: "Coffee Shop / Cafe",
  about: "Specialty coffee and bakery at Bibliotheca Alexandrina",
  website: "https://www.talabat.com/egypt/merzy",
  phone: "+20 XXX XXXX",
  address: "Shatby, Alexandria, Egypt",
  followers: 15230,
  recommendations: 4.8,
  reviewCount: 320
}
```

### Posts Data
```typescript
{
  postId: "61583371166412_xxxxx",
  createdAt: "2026-09-08T14:32:00Z",
  type: "photo" | "link" | "video" | "text" | "event",
  content: "It's all in the details...",
  image?: "/scraped/facebook/post-sep08.jpg",
  linkUrl?: "https://...",
  linkTitle?: "Check out...",
  linkDescription?: "...",
  engagement: {
    likes: 45,
    comments: 8,
    shares: 3,
    reactions: {
      like: 40,
      love: 5,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0
    }
  },
  url: "https://www.facebook.com/61583371166412/posts/xxxxx/"
}
```

### Reviews Data
```typescript
{
  reviewId: "xxxxx",
  reviewer: "Ahmed Mohamed",
  rating: 5,
  text: "Best coffee in Alexandria! Highly recommended.",
  createdAt: "2026-09-15T10:20:00Z",
  helpful: 12,
  url: "https://www.facebook.com/reviews/..."
}
```

### Comments Data
```typescript
{
  author: "Sarah Ahmed",
  text: "Love this place!",
  timestamp: "2026-09-08T15:10:00Z",
  likes: 3,
  source: "Facebook, Sep 8 post",
  depth: 0  // 0 = top-level, 1+ = reply to another comment
}
```

## Scraping Methods

### Method 1: Public HTML Scraping (No Auth)

Parse Facebook's public HTML for publicly visible information.

**Advantages:**
- No authentication required
- Works with public pages
- No API rate limits as strict

**Disadvantages:**
- Limited by what HTML renders
- Requires User-Agent spoofing
- Site structure fragile

### Method 2: Facebook Graph API (Recommended)

Official API for reliable, authenticated access.

**Required Setup:**
1. Create Facebook Developer account at https://developers.facebook.com
2. Create Facebook App
3. Get Page Access Token
4. Configure permissions

**Required Permissions:**
- `page_events`
- `pages_read_engagement`
- `pages_read_user_content`

**Get Access Token:**
```bash
# 1. Create app at developers.facebook.com
# 2. Go to Tools → Graph Explorer
# 3. Select your app
# 4. Get Page Access Token for MERZY page
# 5. Store in .env.scraper
```

## Target URLs

### Main Page
- `https://www.facebook.com/p/Merzy-Coffee-61583371166412/`

### Reviews Tab
- `https://www.facebook.com/61583371166412/reviews/`

### Posts Feed
- `https://www.facebook.com/61583371166412/posts/`

## Graph API Endpoints

### Get Page Info
```
GET /61583371166412?
  fields=id,name,about,website,category,phone,followers_count,overall_star_rating,rating_count,picture
  &access_token=TOKEN
```

### Get Page Posts
```
GET /61583371166412/posts?
  fields=id,created_time,message,story,type,link,picture,permalink_url,
    comments.limit(10),likes.limit(1),shares
  &access_token=TOKEN
  &limit=25
```

### Get Page Reviews
```
GET /61583371166412/reviews?
  fields=id,reviewer,rating,review_text,created_time,like_count
  &access_token=TOKEN
  &limit=100
```

### Get Post Comments
```
GET /POST_ID/comments?
  fields=id,from,message,created_time,like_count,comments
  &access_token=TOKEN
  &summary=true
```

## HTML Scraping Selectors

For public profile without API:

```html
<!-- Page Info -->
<div class="_xoa">
  <img src="..." />  <!-- Profile pic -->
  <h1>Merzy Coffee</h1>
  <span>Coffee Shop</span>
</div>

<!-- About Section -->
<div id="bio">
  <span>Specialty coffee...</span>
</div>

<!-- Post Container -->
<div class="x8hlje7">  <!-- Post wrapper -->
  <div class="xwib8y2">  <!-- User info -->
  <div class="x1ey2m1c">  <!-- Post content -->
    <span>It's all in the details...</span>
  </div>
  <div class="xzn7g7e">  <!-- Reactions -->
</div>
```

## Implementation

### Using Graph API (Recommended)

```typescript
// scripts/scrapers/facebook.scraper.ts
import axios from 'axios';

export class FacebookScraper {
  private readonly accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  private readonly pageId = process.env.FACEBOOK_PAGE_ID || '61583371166412';
  private readonly apiVersion = 'v18.0';
  private readonly baseUrl = 'https://graph.instagram.com';

  async scrapePageInfo() {
    const response = await axios.get(
      `${this.baseUrl}/${this.pageId}`,
      {
        params: {
          fields: 'id,name,about,website,category,phone,' +
                  'followers_count,overall_star_rating,rating_count,picture',
          access_token: this.accessToken
        }
      }
    );
    return response.data;
  }

  async scrapePosts() {
    const response = await axios.get(
      `${this.baseUrl}/${this.pageId}/posts`,
      {
        params: {
          fields: 'id,created_time,message,story,type,link,' +
                  'picture,permalink_url,comments,likes,shares',
          limit: 50,
          access_token: this.accessToken
        }
      }
    );
    return response.data.data || [];
  }

  async scrapeReviews() {
    const response = await axios.get(
      `${this.baseUrl}/${this.pageId}/reviews`,
      {
        params: {
          fields: 'id,reviewer,rating,review_text,created_time,like_count',
          limit: 100,
          access_token: this.accessToken
        }
      }
    );
    return response.data.data || [];
  }
}
```

## Engagement Metrics

### Reactions
Facebook supports multiple reaction types:
```typescript
reactions: {
  like: 40,    // 👍
  love: 5,     // ❤️
  haha: 0,     // 😂
  wow: 0,      // 😮
  sad: 0,      // 😢
  angry: 0     // 😠
}
```

### Comments Aggregation
- Count top-level comments
- Include nested replies
- Sort by likes / recency
- Extract author information

## Image Handling

### Post Images
- Extract from `picture` field (Graph API)
- Download to `/scraped/facebook/post-[date]-[id].jpg`
- Update reference to local path

### Profile Picture
- Extract from `picture` field
- Save to `/scraped/facebook/profile-pic.jpg`

### Link Previews
- Extract preview images from shared links
- Download if available
- Map to post object

## Rate Limiting

Facebook Graph API rate limits:

- **Standard tier**: 10 requests/second
- **Burst limit**: 600 requests/10 minutes
- **Daily limit**: Depends on app review status

**Implementation:**
```typescript
async requestWithRateLimit(endpoint: string, params: any) {
  const requestTime = Date.now();
  
  try {
    const response = await axios.get(endpoint, { params });
    
    // Check rate limit headers
    const remaining = response.headers['x-app-usage-remaining'];
    const resetTime = response.headers['x-app-usage-reset'];
    
    if (remaining && remaining < 10) {
      const waitTime = parseInt(resetTime) * 1000 - Date.now();
      console.log(`Rate limit low. Waiting ${waitTime}ms...`);
      await this.delay(waitTime);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('Rate limited. Waiting 60 seconds...');
      await this.delay(60000);
      return this.requestWithRateLimit(endpoint, params);
    }
    throw error;
  }
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 Invalid Request | Bad parameters | Check field names, access token |
| 401 Unauthorized | Invalid token | Refresh access token |
| 403 Forbidden | Insufficient permissions | Request required permissions |
| 429 Rate Limited | Too many requests | Wait & retry later |
| 500 Server Error | Facebook issue | Retry with backoff |

### Token Expiration

Access tokens expire. Handle renewal:

```typescript
async ensureValidToken(): Promise<string> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  // Try to refresh token
  try {
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token`,
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          access_token: token,
          grant_type: 'fb_exchange_token'
        }
      }
    );
    
    const newToken = response.data.access_token;
    // Update .env.scraper
    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    throw error;
  }
}
```

## Pagination

### Posts Pagination
```typescript
// After cursor handling
const pageInfo = response.data.paging;
const nextUrl = pageInfo.cursors?.after;

if (nextUrl) {
  // Fetch next page
  const nextResponse = await axios.get(endpoint, {
    params: { ...params, after: nextUrl }
  });
}
```

## Data Validation

### Post Validation
- Must have `id`, `created_time`, `message` or `story`
- Content length > 0
- Timestamp within reasonable range

### Review Validation
- Must have `rating` (1-5)
- Must have `review_text` or reviewer name
- Rating should match review sentiment (optional check)

### Engagement Validation
- Like/reaction counts >= 0
- Comment count >= 0
- Total reactions = sum of all reaction types

## Comment Processing

### Filtering
- Remove bot/spam comments
- Filter low-quality comments (emojis only)
- Keep substantive user feedback

### Deduplication
- Check for duplicate comments (exact match)
- Flag near-duplicates for review

### Author Extraction
```typescript
comment: {
  author: response.from.name,
  authorId: response.from.id,
  text: response.message,
  timestamp: response.created_time,
  likes: response.like_count || 0
}
```

## Output Format

Raw output saved to `scraped-data/raw/facebook-*.json`:

```json
{
  "pageInfo": {
    "pageId": "61583371166412",
    "name": "Merzy Coffee",
    ...
  },
  "posts": [
    {
      "postId": "61583371166412_xxxxx",
      "createdAt": "2026-09-08T14:32:00Z",
      ...
    }
  ],
  "reviews": [
    {
      "reviewId": "xxxxx",
      "reviewer": "Ahmed Mohamed",
      ...
    }
  ],
  "scrapedAt": "2026-10-31T18:30:00Z",
  "success": true
}
```

## Testing

### Test API Connection
```bash
npm run scrape:facebook -- --test-connection
```

### Test Token Validity
```bash
npm run scrape:facebook -- --test-token
```

### Dry Run (No Writes)
```bash
npm run scrape:facebook -- --test
```

### Full Scrape
```bash
npm run scrape:facebook
```

## Debugging

Enable verbose output:
```typescript
const DEBUG = process.env.DEBUG_SCRAPER === 'true';

if (DEBUG) {
  console.log('Fetching endpoint:', endpoint);
  console.log('Rate limit remaining:', remaining);
  console.log('Parsed posts:', posts.length);
}
```

Run with debugging:
```bash
DEBUG_SCRAPER=true npm run scrape:facebook
```

## Security

- ✅ Access token stored in `.env.scraper` (not in code)
- ✅ Only requests public data
- ✅ No user passwords/PII
- ✅ Token not logged or exposed
- ✅ HTTPS only

## Getting Started

1. **Create app at Facebook Developer**: https://developers.facebook.com
2. **Create app** → Select "Business" type
3. **Add product** → "Facebook Login"
4. **Get Page Access Token**:
   - Go to Tools → Graph Explorer
   - Select your app
   - Select MERZY page
   - Generate token
5. **Update .env.scraper**:
   ```
   FACEBOOK_PAGE_ID=61583371166412
   FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   ```
6. **Test connection**: `npm run scrape:facebook -- --test-token`
7. **Run scraper**: `npm run scrape:facebook`

## See Also

- [README.md](./README.md) - Scraper system overview
- [DATA-PROCESSOR.md](./DATA-PROCESSOR.md) - How data is processed
- [CONFIGURATION.md](./CONFIGURATION.md) - Environment setup
- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
