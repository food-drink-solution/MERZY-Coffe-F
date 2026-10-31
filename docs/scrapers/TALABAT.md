# Talabat Scraper Documentation

Complete guide for extracting menu, pricing, and review data from MERZY's Talabat listing.

## Overview

Scrapes public Talabat data for MERZY Coffee & Bakery:
- Menu items with categories and subcategories
- Prices in Egyptian Pounds (EGP)
- Item descriptions and photographs
- Restaurant ratings and reviews
- Delivery info and opening hours
- Special offers and promotions

## Data Points Extracted

### Restaurant Info
```typescript
{
  restaurantId: "1102357",
  name: "Merzy",
  rating: 4.8,
  reviewCount: 320,
  deliveryRating: 4.9,
  foodRating: 4.8,
  serviceRating: 4.7,
  address: "Shatby, Alexandria",
  isOpen: true,
  deliveryTime: "20-30 min",
  deliveryCost: 15,
  minimumOrder: 50,
  cuisineTypes: ["Coffee", "Bakery", "Cafe"],
  acceptsDelivery: true,
  acceptsPickup: true,
  acceptsDineIn: true
}
```

### Menu Items
```typescript
{
  itemId: "item-123456",
  name: "Dirty Espresso",
  category: "Coffee",
  subcategory: "Espresso Drinks",
  description: "Cold milk under a double shot of espresso",
  price: 60,  // EGP
  currency: "EGP",
  image: "/scraped/talabat/item-dirty-espresso.jpg",
  available: true,
  popular: true,
  addOns?: [
    { name: "Extra Shot", price: 10, required: false },
    { name: "Oat Milk", price: 15, required: false }
  ],
  rating?: 4.9,
  reviewCount?: 45
}
```

### Reviews
```typescript
{
  reviewId: "review-123",
  reviewer: "Ahmed K.",
  rating: 5,
  date: "2026-10-15",
  text: "Best coffee in Alexandria! Highly recommended.",
  foodRating: 5,
  deliveryRating: 5,
  isVerifiedBuyer: true,
  helpful: 12,
  images?: ["image1.jpg", "image2.jpg"]
}
```

### Promotions
```typescript
{
  promotionId: "promo-123",
  title: "20% off orders over 150 EGP",
  description: "Valid until end of month",
  discountType: "percentage" | "fixed_amount",
  discountValue: 20,
  minOrderValue: 150,
  maxDiscount?: 100,
  validUntil: "2026-10-31"
}
```

## Scraping Methods

### Method 1: HTML Scraping (Recommended)

Parse Talabat's public restaurant pages using `cheerio`.

**Advantages:**
- No authentication required
- Works immediately
- No API keys needed
- Access to full menu

**Disadvantages:**
- Site structure changes may break parsing
- Slower than API
- Limited to publicly rendered data

**Implementation:**
```typescript
// scripts/scrapers/talabat.scraper.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export class TalabatScraper {
  private readonly restaurantId = '1102357';
  private readonly baseUrl = 'https://www.talabat.com/egypt/restaurant';
  
  async scrapeRestaurant(): Promise<TalabatRestaurant> {
    const url = `${this.baseUrl}/${this.restaurantId}/merzy`;
    const html = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0...' }
    });
    
    const $ = cheerio.load(html.data);
    // Parse restaurant info...
  }
  
  async scrapeMenu(): Promise<TalabatMenuItem[]> {
    // Extract menu items...
  }
  
  async scrapeReviews(): Promise<TalabatReview[]> {
    // Extract reviews...
  }
}
```

### Method 2: Talabat API (If Available)

Some endpoints may have public or semi-public API access.

**Note:** Talabat's API is not officially documented for third-party scraping. HTML scraping is recommended.

## Target URLs

### Restaurant Page
- `https://www.talabat.com/egypt/restaurant/1102357/merzy-shatby?aid=8323`

### Menu Section
- Restaurant page with scrollable menu

### Reviews Section
- Reviews tab on restaurant page

### Ratings & Info
- Header section of restaurant page

## HTML Structure & Selectors

### Restaurant Header
```html
<div class="restaurant-header">
  <img class="restaurant-logo" src="..." />
  <h1 class="restaurant-name">Merzy</h1>
  <div class="rating">
    <span class="stars">4.8</span>
    <span class="review-count">(320 reviews)</span>
  </div>
  <div class="info">
    <span class="delivery-time">20-30 min</span>
    <span class="delivery-cost">15 EGP</span>
  </div>
</div>
```

### Menu Categories
```html
<div class="menu-categories">
  <div class="category" data-category="coffee">
    <h3>Coffee</h3>
    <div class="items">
      <div class="menu-item" data-item-id="item-123">
        <h4>Dirty Espresso</h4>
        <p class="description">Cold milk under double shot...</p>
        <span class="price">60 EGP</span>
        <img src="..." />
      </div>
    </div>
  </div>
</div>
```

### Reviews Section
```html
<div class="reviews">
  <div class="review" data-review-id="review-123">
    <div class="reviewer-info">
      <span class="name">Ahmed K.</span>
      <span class="rating">★★★★★</span>
    </div>
    <div class="review-text">Best coffee in Alexandria!</div>
    <div class="review-date">October 15, 2026</div>
  </div>
</div>
```

### Key Selectors
```typescript
const selectors = {
  restaurantName: '.restaurant-name',
  rating: '.rating .stars',
  reviewCount: '.review-count',
  deliveryTime: '.delivery-time',
  deliveryCost: '.delivery-cost',
  categories: '.menu-categories .category',
  menuItems: '.menu-item',
  itemName: '.menu-item h4',
  itemPrice: '.menu-item .price',
  itemImage: '.menu-item img',
  reviews: '.review',
  reviewerName: '.review .reviewer-info .name',
  reviewRating: '.review .rating',
  reviewText: '.review .review-text'
};
```

## Implementation

### Parse Restaurant Info

```typescript
async scrapeRestaurantInfo(): Promise<TalabatRestaurant> {
  const url = `https://www.talabat.com/egypt/restaurant/1102357/merzy`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  
  const $ = cheerio.load(response.data);
  
  const restaurant = {
    restaurantId: '1102357',
    name: $('[data-testid="restaurant-header-name"]').text().trim(),
    rating: parseFloat($('.restaurant-rating').first().text()),
    reviewCount: parseInt($('.review-count').text().match(/\d+/)[0]),
    address: $('[data-testid="restaurant-address"]').text().trim(),
    deliveryTime: $('[data-testid="delivery-time"]').text(),
    deliveryCost: parsePrice($('[data-testid="delivery-cost"]').text()),
    cuisineTypes: $('[data-testid="cuisine-tag"]').map((_, el) => 
      $(el).text()
    ).get()
  };
  
  return restaurant;
}
```

### Parse Menu Items

```typescript
async scrapeMenuItems(): Promise<TalabatMenuItem[]> {
  const url = `https://www.talabat.com/egypt/restaurant/1102357/merzy`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const items: TalabatMenuItem[] = [];
  
  $('[data-testid="menu-section"]').each((_, section) => {
    const category = $(section).find('[data-testid="category-name"]').text();
    
    $(section).find('[data-testid="menu-item"]').each((_, item) => {
      const $item = $(item);
      
      items.push({
        itemId: $item.data('item-id'),
        name: $item.find('[data-testid="item-name"]').text().trim(),
        category: category,
        description: $item.find('[data-testid="item-description"]').text().trim(),
        price: parsePrice($item.find('[data-testid="item-price"]').text()),
        image: $item.find('img').attr('src'),
        available: !$item.hasClass('unavailable'),
        popular: $item.hasClass('popular-item')
      });
    });
  });
  
  return items;
}
```

### Parse Reviews

```typescript
async scrapeReviews(): Promise<TalabatReview[]> {
  const url = `https://www.talabat.com/egypt/restaurant/1102357/merzy/reviews`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const reviews: TalabatReview[] = [];
  
  $('[data-testid="review-card"]').each((_, review) => {
    const $review = $(review);
    const ratingText = $review.find('[data-testid="review-rating"]').text();
    const stars = (ratingText.match(/★/g) || []).length;
    
    reviews.push({
      reviewId: $review.data('review-id'),
      reviewer: $review.find('[data-testid="reviewer-name"]').text().trim(),
      rating: stars,
      date: parseDate($review.find('[data-testid="review-date"]').text()),
      text: $review.find('[data-testid="review-text"]').text().trim(),
      isVerifiedBuyer: $review.hasClass('verified'),
      helpful: parseInt($review.find('[data-testid="helpful-count"]').text() || '0')
    });
  });
  
  return reviews;
}
```

## Price Parsing

Talabat uses Egyptian Pounds (EGP) format:

```typescript
function parsePrice(priceText: string): number {
  // Input: "60 EGP" or "60.50 ج.م"
  const match = priceText.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Usage
const price = parsePrice("60 EGP");  // Returns: 60
```

## Date Parsing

Talabat uses relative and absolute date formats:

```typescript
function parseDate(dateText: string): string {
  // Input: "2 days ago" or "October 15, 2026"
  
  if (dateText.includes('ago')) {
    const days = parseInt(dateText.match(/\d+/)[0]);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
  
  // Parse absolute date
  return new Date(dateText).toISOString().split('T')[0];
}
```

## Image Handling

### Menu Item Images
```typescript
async downloadMenuImages(items: TalabatMenuItem[]): Promise<void> {
  for (const item of items) {
    if (!item.image) continue;
    
    const filename = item.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const filepath = `./scraped/talabat/menu/${filename}.jpg`;
    
    try {
      await this.downloadImage(item.image, filepath);
      item.image = `/scraped/talabat/menu/${filename}.jpg`;
    } catch (error) {
      console.warn(`Failed to download image for ${item.name}:`, error.message);
    }
  }
}

private async downloadImage(url: string, filepath: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

## Pagination

### Review Pagination

Talabat uses "Load More" buttons or infinite scroll:

```typescript
async scrapeAllReviews(): Promise<TalabatReview[]> {
  let allReviews: TalabatReview[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore && page <= 10) {
    const url = `https://www.talabat.com/egypt/restaurant/1102357/merzy/reviews?page=${page}`;
    const reviews = await this.scrapeReviews(url);
    
    if (reviews.length === 0) {
      hasMore = false;
    } else {
      allReviews = allReviews.concat(reviews);
      page++;
      
      // Rate limiting
      await this.delay(2000);
    }
  }
  
  return allReviews;
}
```

## Rate Limiting

Talabat's rate limiting:

- **Requests per minute**: ~30-50
- **Burst requests**: May trigger 429
- **Cooldown**: 1 hour after repeated 429s

**Implementation:**
```typescript
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async requestWithRetry(url: string, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0...' }
      });
    } catch (error) {
      if (error.response?.status === 429) {
        const waitTime = Math.pow(2, i) * 5000;
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await this.delay(waitTime);
      } else if (i === maxRetries - 1) {
        throw error;
      } else {
        await this.delay(1000);
      }
    }
  }
}
```

## Data Validation

### Menu Item Validation
```typescript
function validateMenuItem(item: TalabatMenuItem): boolean {
  return (
    item.name && item.name.length > 0 &&
    item.category && item.category.length > 0 &&
    item.price >= 0 &&
    item.price <= 10000  // Sanity check: no item > 10,000 EGP
  );
}
```

### Review Validation
```typescript
function validateReview(review: TalabatReview): boolean {
  return (
    review.reviewer && review.reviewer.length > 0 &&
    review.rating >= 1 && review.rating <= 5 &&
    review.text && review.text.length > 10 &&
    review.date && !isNaN(new Date(review.date).getTime())
  );
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 429 Too Many Requests | Rate limit exceeded | Increase delays, reduce requests |
| 404 Not Found | Restaurant ID wrong | Verify restaurant ID |
| Connection timeout | Network issue | Retry with backoff |
| Invalid selector | Site structure changed | Update selectors in code |
| Missing images | Image URL expired | Re-scrape or use fallback |

### Retry Strategy
```typescript
async scrapeWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const delay = Math.pow(2, attempt) * 1000;
      
      console.error(
        `Attempt ${attempt + 1}/${maxRetries} failed:`,
        error.message
      );
      
      if (isLastAttempt) throw error;
      
      console.log(`Retrying in ${delay}ms...`);
      await this.delay(delay);
    }
  }
}
```

## Output Format

Raw output saved to `scraped-data/raw/talabat-*.json`:

```json
{
  "restaurant": {
    "restaurantId": "1102357",
    "name": "Merzy",
    "rating": 4.8,
    ...
  },
  "menu": [
    {
      "itemId": "item-123456",
      "name": "Dirty Espresso",
      ...
    }
  ],
  "reviews": [
    {
      "reviewId": "review-123",
      "reviewer": "Ahmed K.",
      ...
    }
  ],
  "scrapedAt": "2026-10-31T18:30:00Z",
  "success": true
}
```

## Testing

### Test Connection
```bash
npm run scrape:talabat -- --test-connection
```

### Dry Run (Parse Only)
```bash
npm run scrape:talabat -- --test
```

### Full Scrape
```bash
npm run scrape:talabat
```

### Verbose Output
```bash
DEBUG_SCRAPER=true npm run scrape:talabat
```

## Debugging

Enable detailed logging:
```typescript
const DEBUG = process.env.DEBUG_SCRAPER === 'true';

if (DEBUG) {
  console.log('Fetching URL:', url);
  console.log('Response status:', response.status);
  console.log('Parsed items:', items.length);
  console.log('Sample item:', items[0]);
}
```

## Maintenance

### When Talabat Changes Site Structure
1. Inspect the page with DevTools
2. Find new selectors for changed elements
3. Update selector constants in scraper
4. Test with `--test` flag
5. Verify output structure unchanged

### Monthly Tasks
- Check for broken image URLs
- Review error logs for selector issues
- Test pagination works correctly
- Verify pricing is current

## See Also

- [README.md](./README.md) - Scraper system overview
- [DATA-PROCESSOR.md](./DATA-PROCESSOR.md) - How data is processed
- [CONFIGURATION.md](./CONFIGURATION.md) - Environment setup
