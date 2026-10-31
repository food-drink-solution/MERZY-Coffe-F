# Data Processor Documentation

Guide to transforming raw scraped data into MERZY Angular application format.

## Overview

The data processor pipeline:

1. **Load** raw scraped JSON from `scraped-data/raw/`
2. **Transform** to MERZY data models (MerzySocialPost, MenuItem, etc.)
3. **Download** images and cache locally
4. **Deduplicate** posts across platforms
5. **Merge** with existing mock data
6. **Generate** TypeScript data files for frontend
7. **Validate** all outputs before writing

## Data Flow Architecture

```
Raw Data Scrapers
├── instagram-posts.json
├── instagram-highlights.json
├── facebook-posts.json
├── facebook-reviews.json
├── talabat-menu.json
└── talabat-reviews.json
        ↓
    Processor
├── Transform to MERZY formats
├── Download & cache images
├── Deduplicate posts
├── Merge with mock data
└── Generate TypeScript
        ↓
Frontend Data Files
├── src/app/core/data/merzy-social.ts
├── src/app/core/data/menu.ts
├── src/app/core/data/talabat-reviews.ts
└── src/app/core/data/comments.ts
```

## File Structure

```
scripts/data-processor/
├── processor.ts          # Main orchestrator
├── image-cache.ts        # Image downloading
├── deduplicator.ts       # Post deduplication
├── transformers.ts       # Data format converters
└── validators.ts         # Output validation
```

## Processor Entry Point

### `processor.ts`

Main orchestration class:

```typescript
// scripts/data-processor/processor.ts
import { ImageCache } from './image-cache';
import { Deduplicator } from './deduplicator';
import { transformInstagramData, transformFacebookData, transformTalabatData } from './transformers';

export class DataProcessor {
  private imageCache: ImageCache;
  private deduplicator: Deduplicator;
  
  constructor(outputDir: string = './scraped-data') {
    this.imageCache = new ImageCache(outputDir);
    this.deduplicator = new Deduplicator();
  }
  
  async processAll(): Promise<void> {
    console.log('Starting data processing pipeline...\n');
    
    // Load raw data
    const instagramRaw = this.loadJson('scraped-data/raw/instagram-posts.json');
    const facebookRaw = this.loadJson('scraped-data/raw/facebook-posts.json');
    const talabatRaw = this.loadJson('scraped-data/raw/talabat-menu.json');
    
    // Transform data
    console.log('Transforming Instagram data...');
    const merzyPosts = transformInstagramData(instagramRaw.posts);
    const merzyProfile = instagramRaw.profile;
    const merzyHighlights = instagramRaw.highlights;
    
    console.log('Transforming Facebook data...');
    const facebookPosts = transformFacebookData(facebookRaw.posts);
    
    console.log('Transforming Talabat data...');
    const menuItems = transformTalabatData(talabatRaw.menu);
    const reviews = transformTalabatData(talabatRaw.reviews);
    
    // Deduplicate posts
    console.log('Deduplicating posts across platforms...');
    const allPosts = [...merzyPosts, ...facebookPosts];
    const dedupedPosts = this.deduplicator.deduplicatePosts(allPosts);
    
    // Download images
    console.log('Downloading and caching images...');
    await this.imageCache.downloadAllImages(dedupedPosts, menuItems);
    
    // Merge with existing mock data
    console.log('Merging with existing mock data...');
    const mergedPosts = this.mergeWithMockData(dedupedPosts);
    const mergedMenu = this.mergeMenuWithMocks(menuItems);
    
    // Validate all data
    console.log('Validating processed data...');
    this.validateAllData(mergedPosts, mergedMenu, merzyProfile);
    
    // Generate TypeScript files
    console.log('Generating TypeScript data files...');
    await this.generateTypeScriptFiles(
      mergedPosts,
      merzyProfile,
      merzyHighlights,
      mergedMenu,
      reviews
    );
    
    console.log('\n✅ Data processing complete!');
    console.log(`Generated files:`);
    console.log('  - src/app/core/data/merzy-social.ts');
    console.log('  - src/app/core/data/menu.ts');
    console.log('  - src/app/core/data/talabat-reviews.ts');
  }
  
  private loadJson(filepath: string): any {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  }
  
  private mergeWithMockData(scrapedPosts: MerzySocialPost[]): MerzySocialPost[] {
    // Implementation in section below
  }
  
  private mergeMenuWithMocks(scrapedMenu: MenuItem[]): MenuItem[] {
    // Implementation in section below
  }
  
  private validateAllData(posts: any, menu: any, profile: any): void {
    // Implementation in validators.ts
  }
  
  private async generateTypeScriptFiles(...): Promise<void> {
    // Implementation in section below
  }
}

// Usage
const processor = new DataProcessor('./scraped-data');
await processor.processAll();
```

## Data Transformation

### `transformers.ts`

Convert raw scraped data to MERZY formats:

```typescript
// scripts/data-processor/transformers.ts

export function transformInstagramData(rawPosts: any[]): MerzySocialPost[] {
  return rawPosts.map(post => ({
    code: post.code || generateCode(),
    type: post.type || 'photo',
    date: formatDate(post.timestamp || post.date),
    image: `/scraped/instagram/${post.code}.jpg`,  // Will be updated by image cache
    caption: post.caption?.trim() || '',
    likesText: `${post.likes || 0} likes`,
    location: post.location,
    collabWith: extractCollaborator(post.caption),
    audio: post.audio,
    textOnImage: post.textOnImage,
    url: post.url || `https://www.instagram.com/p/${post.code}/`
  }));
}

export function transformFacebookData(rawPosts: any[]): MerzySocialPost[] {
  return rawPosts
    .filter(post => post.message || post.story)  // Only posts with content
    .map(post => ({
      code: post.postId.split('_')[1],
      type: determineFacebookType(post),
      date: formatDate(post.createdAt),
      image: `/scraped/facebook/${post.postId}.jpg`,
      caption: (post.message || post.story)?.trim() || '',
      likesText: `${post.engagement?.likes || 0} likes`,
      url: post.url || `https://www.facebook.com/posts/${post.postId}`
    }));
}

export function transformTalabatData(rawMenu: any[]): MenuItem[] {
  return rawMenu.map(item => ({
    id: item.itemId,
    name: item.name,
    category: mapTalabatCategory(item.category),
    description: item.description,
    price: item.price,
    image: `/scraped/talabat/${item.itemId}.jpg`,
    available: item.available !== false,
    rating: item.rating
  }));
}

function extractCollaborator(caption: string): string | undefined {
  const match = caption?.match(/@([\w.]+)/);
  return match?.[1];
}

function determineFacebookType(post: any): 'photo' | 'reel' | 'carousel' {
  if (post.type === 'video') return 'reel';
  if (post.type === 'link') return 'carousel';
  return 'photo';
}

function formatDate(timestamp: string | number): string {
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp) 
    : new Date(timestamp);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function mapTalabatCategory(talabatCat: string): string {
  const mapping: Record<string, string> = {
    'Coffee': 'coffee',
    'Bakery': 'bakery',
    'Desserts': 'bakery',
    'Pastries': 'bakery',
    'Beverages': 'coffee'
  };
  return mapping[talabatCat] || 'coffee';
}
```

## Image Caching

### `image-cache.ts`

Download and cache images locally:

```typescript
// scripts/data-processor/image-cache.ts
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class ImageCache {
  private readonly outputDir: string;
  private readonly maxRetries = 3;
  private readonly timeout = 30000;
  
  constructor(outputDir: string = './scraped-data') {
    this.outputDir = outputDir;
    this.ensureDirectories();
  }
  
  private ensureDirectories(): void {
    const dirs = [
      path.join(this.outputDir, 'images/instagram'),
      path.join(this.outputDir, 'images/facebook'),
      path.join(this.outputDir, 'images/talabat')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  async downloadAllImages(
    posts: MerzySocialPost[],
    menu: MenuItem[]
  ): Promise<void> {
    const imageUrls = new Set<string>();
    
    // Collect unique image URLs
    posts.forEach(post => {
      if (post.image && isExternalUrl(post.image)) {
        imageUrls.add(post.image);
      }
    });
    
    menu.forEach(item => {
      if (item.image && isExternalUrl(item.image)) {
        imageUrls.add(item.image);
      }
    });
    
    console.log(`Downloading ${imageUrls.size} images...`);
    
    let downloaded = 0;
    for (const url of imageUrls) {
      try {
        const localPath = await this.downloadImage(url);
        downloaded++;
        
        // Update references in posts/menu
        this.updateImageReferences(posts, menu, url, localPath);
        
        console.log(`  [${downloaded}/${imageUrls.size}] Downloaded`);
      } catch (error) {
        console.warn(`  ✗ Failed to download: ${url}`, error.message);
      }
    }
  }
  
  private async downloadImage(url: string): Promise<string> {
    const filename = this.generateFilename(url);
    const source = this.determineSource(url);
    const filepath = path.join(this.outputDir, `images/${source}/${filename}`);
    
    // Skip if already cached
    if (fs.existsSync(filepath)) {
      return `/scraped/${source}/${filename}`;
    }
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          responseType: 'stream',
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0...'
          }
        });
        
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        
        return new Promise((resolve, reject) => {
          writer.on('finish', () => resolve(`/scraped/${source}/${filename}`));
          writer.on('error', reject);
        });
      } catch (error) {
        if (attempt === this.maxRetries - 1) throw error;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    
    throw new Error(`Failed to download after ${this.maxRetries} attempts`);
  }
  
  private generateFilename(url: string): string {
    const hash = require('crypto')
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .substring(0, 12);
    
    return `${hash}.jpg`;
  }
  
  private determineSource(url: string): 'instagram' | 'facebook' | 'talabat' {
    if (url.includes('instagram')) return 'instagram';
    if (url.includes('facebook')) return 'facebook';
    return 'talabat';
  }
  
  private updateImageReferences(
    posts: MerzySocialPost[],
    menu: MenuItem[],
    originalUrl: string,
    localPath: string
  ): void {
    posts.forEach(post => {
      if (post.image === originalUrl) {
        post.image = localPath;
      }
    });
    
    menu.forEach(item => {
      if (item.image === originalUrl) {
        item.image = localPath;
      }
    });
  }
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
```

## Post Deduplication

### `deduplicator.ts`

Remove duplicate posts across platforms:

```typescript
// scripts/data-processor/deduplicator.ts

export class Deduplicator {
  deduplicatePosts(posts: MerzySocialPost[]): MerzySocialPost[] {
    const seen = new Map<string, MerzySocialPost>();
    
    posts.forEach(post => {
      const signature = this.generateSignature(post);
      
      if (!seen.has(signature)) {
        seen.set(signature, post);
      } else {
        // Keep the one with better data (more engagement, higher quality image)
        const existing = seen.get(signature)!;
        if (this.isHigherQuality(post, existing)) {
          seen.set(signature, post);
        }
      }
    });
    
    return Array.from(seen.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  private generateSignature(post: MerzySocialPost): string {
    // Create unique identifier from caption + date
    const caption = (post.caption || '').substring(0, 100);
    const date = post.date;
    
    return `${caption}|${date}`;
  }
  
  private isHigherQuality(
    post: MerzySocialPost,
    existing: MerzySocialPost
  ): boolean {
    // Parse engagement numbers
    const postLikes = parseInt(post.likesText?.match(/\d+/)?.[0] || '0');
    const existingLikes = parseInt(existing.likesText?.match(/\d+/)?.[0] || '0');
    
    // Prefer post with more engagement
    if (postLikes > existingLikes) return true;
    
    // Prefer posts with location tags
    if (post.location && !existing.location) return true;
    
    // Prefer original source (Instagram over Facebook)
    if (post.url?.includes('instagram') && !existing.url?.includes('instagram')) {
      return true;
    }
    
    return false;
  }
}
```

## Merging with Mock Data

### Existing Mock Data Strategy

Keep mock data as foundation, merge scraped data on top:

```typescript
// scripts/data-processor/processor.ts

private mergeWithMockData(scrapedPosts: MerzySocialPost[]): MerzySocialPost[] {
  // Import existing mock data
  const { MERZY_POSTS } = require('../../src/app/core/data/merzy-social');
  
  // Create map of existing posts by URL
  const existingMap = new Map(
    MERZY_POSTS.map(p => [p.url, p])
  );
  
  // Merge: scraped posts override mocks, but keep mocks for unique content
  const merged: MerzySocialPost[] = [];
  const seenUrls = new Set<string>();
  
  // Add all scraped posts (newer data)
  scrapedPosts.forEach(post => {
    merged.push(post);
    if (post.url) seenUrls.add(post.url);
  });
  
  // Add mock posts not in scraped data (keep old favorites)
  MERZY_POSTS.forEach(post => {
    if (!seenUrls.has(post.url)) {
      merged.push(post);
      seenUrls.add(post.url);
    }
  });
  
  // Sort by date descending
  return merged.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

private mergeMenuWithMocks(scrapedMenu: MenuItem[]): MenuItem[] {
  const { MENU_ITEMS } = require('../../src/app/core/data/menu');
  
  // Create map of mock items by ID
  const mockMap = new Map(
    MENU_ITEMS.map(m => [m.id, m])
  );
  
  // Update mocks with scraped prices/availability
  scrapedMenu.forEach(item => {
    const existing = mockMap.get(item.id);
    if (existing) {
      // Update only specific fields
      existing.price = item.price;
      existing.available = item.available;
      if (item.image && item.image.startsWith('/')) {
        existing.image = item.image;
      }
    } else {
      // Add new items from Talabat
      mockMap.set(item.id, item);
    }
  });
  
  return Array.from(mockMap.values());
}
```

## Validation

### `validators.ts`

Ensure all processed data is valid:

```typescript
// scripts/data-processor/validators.ts

export class DataValidator {
  static validatePost(post: MerzySocialPost): string[] {
    const errors: string[] = [];
    
    if (!post.code) errors.push('Missing code');
    if (!post.date) errors.push('Missing date');
    if (!post.caption && !post.image) errors.push('Missing both caption and image');
    if (!post.url) errors.push('Missing URL');
    
    // Validate date format
    const dateObj = new Date(post.date);
    if (isNaN(dateObj.getTime())) {
      errors.push(`Invalid date format: ${post.date}`);
    }
    
    // Validate image path exists
    if (post.image && !fs.existsSync(post.image)) {
      if (!post.image.startsWith('/')) {
        errors.push(`Image file missing: ${post.image}`);
      }
    }
    
    return errors;
  }
  
  static validateMenuItem(item: MenuItem): string[] {
    const errors: string[] = [];
    
    if (!item.name) errors.push('Missing name');
    if (!item.category) errors.push('Missing category');
    if (item.price < 0) errors.push('Invalid price (negative)');
    if (item.price > 10000) errors.push('Price seems invalid (> 10000)');
    
    return errors;
  }
  
  static validateAllData(posts: MerzySocialPost[], menu: MenuItem[]): boolean {
    let hasErrors = false;
    
    posts.forEach((post, idx) => {
      const errors = this.validatePost(post);
      if (errors.length > 0) {
        console.error(`Post ${idx} (${post.code}):`, errors);
        hasErrors = true;
      }
    });
    
    menu.forEach((item, idx) => {
      const errors = this.validateMenuItem(item);
      if (errors.length > 0) {
        console.error(`Menu item ${idx} (${item.name}):`, errors);
        hasErrors = true;
      }
    });
    
    if (!hasErrors) {
      console.log('✅ All data validation passed');
    }
    
    return !hasErrors;
  }
}
```

## TypeScript File Generation

### Generate Frontend Data Files

```typescript
// scripts/data-processor/processor.ts

private async generateTypeScriptFiles(
  posts: MerzySocialPost[],
  profile: MerzySocialProfile,
  highlights: MerzyHighlight[],
  menu: MenuItem[],
  reviews: Review[]
): Promise<void> {
  // Generate merzy-social.ts
  const socialContent = `
// Auto-generated by data processor
// Do not edit manually - changes will be overwritten

${this.generatePostsExport(posts, profile, highlights)}
`;
  
  fs.writeFileSync('src/app/core/data/merzy-social.ts', socialContent);
  
  // Generate menu.ts
  const menuContent = `
// Auto-generated by data processor
// Do not edit manually - changes will be overwritten

${this.generateMenuExport(menu)}
`;
  
  fs.writeFileSync('src/app/core/data/menu.ts', menuContent);
  
  // Generate comments from posts
  const commentsContent = `
// Auto-generated by data processor

${this.generateCommentsExport(posts)}
`;
  
  fs.writeFileSync('src/app/core/data/comments.ts', commentsContent);
  
  console.log('✅ TypeScript files generated');
}

private generatePostsExport(
  posts: MerzySocialPost[],
  profile: MerzySocialProfile,
  highlights: MerzyHighlight[]
): string {
  return `
export const MERZY_PROFILE: MerzySocialProfile = ${JSON.stringify(profile, null, 2)};

export const MERZY_HIGHLIGHTS: MerzyHighlight[] = ${JSON.stringify(highlights, null, 2)};

export const MERZY_POSTS: MerzySocialPost[] = ${JSON.stringify(posts, null, 2)};
`;
}

private generateMenuExport(menu: MenuItem[]): string {
  return `
export const MENU_ITEMS: MenuItem[] = ${JSON.stringify(menu, null, 2)};
`;
}
```

## Running the Processor

### Command Line

```bash
# Process all data
npm run process:data

# Process with validation only (no writes)
npm run process:data -- --validate-only

# Process with verbose output
DEBUG_PROCESSOR=true npm run process:data

# Force re-download all images
npm run process:data -- --force-images
```

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "process:data": "ts-node scripts/data-processor/processor.ts",
    "process:data:test": "ts-node scripts/data-processor/processor.ts -- --test",
    "scrape:full": "npm run scrape:all && npm run process:data"
  }
}
```

## Error Recovery

### Partial Failures

If one source fails, continue with others:

```typescript
async processAll(): Promise<void> {
  const results = {
    instagram: { success: false, posts: [] },
    facebook: { success: false, posts: [] },
    talabat: { success: false, items: [] }
  };
  
  try {
    results.instagram = this.loadJson('scraped-data/raw/instagram-posts.json');
  } catch (error) {
    console.warn('Failed to load Instagram data:', error.message);
  }
  
  try {
    results.facebook = this.loadJson('scraped-data/raw/facebook-posts.json');
  } catch (error) {
    console.warn('Failed to load Facebook data:', error.message);
  }
  
  // Continue processing with available data...
}
```

### Image Download Failures

Skip failed images but continue:

```typescript
async downloadAllImages(posts: MerzySocialPost[]): Promise<void> {
  for (const post of posts) {
    try {
      await this.downloadImage(post.image);
    } catch (error) {
      console.warn(`Skipping image for ${post.code}:`, error.message);
      // Keep original URL or fallback
      // post.image = '/assets/placeholder.jpg';
    }
  }
}
```

## Performance Optimization

### Parallel Image Downloads

```typescript
async downloadAllImages(posts: MerzySocialPost[]): Promise<void> {
  const imageUrls = new Set(posts.map(p => p.image).filter(Boolean));
  
  // Parallel downloads (with concurrency limit)
  const concurrency = 5;
  const chunks = Array.from(imageUrls);
  
  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);
    await Promise.all(batch.map(url => this.downloadImage(url)));
  }
}
```

### Cache Existing Images

```typescript
private shouldRedownload(filepath: string): boolean {
  if (!fs.existsSync(filepath)) return true;
  
  const stats = fs.statSync(filepath);
  const ageMs = Date.now() - stats.mtimeMs;
  const ageWeeks = ageMs / (1000 * 60 * 60 * 24 * 7);
  
  return ageWeeks > 4;  // Re-download if > 4 weeks old
}
```

## See Also

- [README.md](./README.md) - Scraper system overview
- [INSTAGRAM.md](./INSTAGRAM.md) - Instagram scraper
- [FACEBOOK.md](./FACEBOOK.md) - Facebook scraper
- [TALABAT.md](./TALABAT.md) - Talabat scraper
- [CONFIGURATION.md](./CONFIGURATION.md) - Environment setup
