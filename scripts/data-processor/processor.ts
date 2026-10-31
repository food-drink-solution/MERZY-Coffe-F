/**
 * Main Data Processor
 * Orchestrates transformation, image downloading, deduplication
 * Generates TypeScript files for Angular frontend
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger, FileSystem, Timer, DateUtils } from '../scrapers/utils';
import {
  InstagramScraperOutput,
  FacebookScraperOutput,
  TalabatScraperOutput,
  MerzySocialPost,
  MenuItem,
  MerzySocialProfile,
  MerzyHighlight,
  MerzyComment
} from '../scrapers/types';
import { ImageCache } from './image-cache';
import { Deduplicator } from './deduplicator';
import { DataTransformers } from './transformers';
import { DataValidator } from './validators';

export class DataProcessor {
  private imageCache: ImageCache;
  private deduplicator: Deduplicator;
  private outputDir: string;

  constructor(outputDir: string = './scraped-data') {
    this.outputDir = outputDir;
    this.imageCache = new ImageCache(outputDir);
    this.deduplicator = new Deduplicator();
  }

  /**
   * Main processing pipeline
   */
  async processAll(): Promise<void> {
    const timer = new Timer();
    Logger.section('Data Processor - Full Pipeline');

    try {
      // Load raw data
      Logger.log('\nLoading raw scraped data...');
      const instagramData = this.loadJson<InstagramScraperOutput>(
        `${this.outputDir}/raw/instagram-posts.json`
      );
      const facebookData = this.loadJson<FacebookScraperOutput>(
        `${this.outputDir}/raw/facebook-posts.json`
      );
      const talabatData = this.loadJson<TalabatScraperOutput>(
        `${this.outputDir}/raw/talabat-menu.json`
      );

      // Transform data
      Logger.log('\nTransforming data to MERZY format...');
      const instagramPosts = DataTransformers.transformInstagramPosts(
        instagramData?.posts || []
      );
      const facebookPosts = DataTransformers.transformFacebookPosts(facebookData?.posts || []);
      const menuItems = DataTransformers.transformTalabatMenu(talabatData?.menu || []);

      Logger.log(`  Instagram: ${instagramPosts.length} posts`);
      Logger.log(`  Facebook: ${facebookPosts.length} posts`);
      Logger.log(`  Talabat: ${menuItems.length} menu items`);

      // Merge all posts
      const allPosts = [...instagramPosts, ...facebookPosts];
      Logger.log(`\nTotal posts before deduplication: ${allPosts.length}`);

      // Deduplicate posts
      const dedupedPosts = this.deduplicator.deduplicatePosts(allPosts);
      Logger.log(`Total posts after deduplication: ${dedupedPosts.length}`);

      // Download images
      Logger.log('\nDownloading and caching images...');
      await this.imageCache.downloadAllImages(dedupedPosts, menuItems);

      // Merge with existing mock data
      Logger.log('\nMerging with existing mock data...');
      const mergedPosts = this.mergeWithMockData(dedupedPosts);
      const mergedMenu = this.mergeMenuWithMocks(menuItems);

      Logger.log(`  Final posts: ${mergedPosts.length}`);
      Logger.log(`  Final menu items: ${mergedMenu.length}`);

      // Validate
      Logger.log('\nValidating processed data...');
      const validation = DataValidator.generateReport(mergedPosts, mergedMenu);

      if (validation.totalErrors > 0) {
        Logger.warn(`Validation found ${validation.totalErrors} errors`);
        if (!validation.postsValid || !validation.menuValid) {
          Logger.error('Validation failed. Check errors above.');
          return;
        }
      }

      // Generate TypeScript files
      Logger.log('\nGenerating TypeScript files...');
      await this.generateTypeScriptFiles(
        mergedPosts,
        instagramData?.profile || this.getDefaultProfile(),
        instagramData?.highlights || [],
        mergedMenu,
        facebookData?.comments || []
      );

      // Print summary
      const imageStats = this.imageCache.getStats();
      Logger.section('Processing Complete! ✅');
      Logger.log(`Duration: ${timer.format()}`);
      Logger.log(`\nGenerated Files:`);
      Logger.log(`  • src/app/core/data/merzy-social.ts`);
      Logger.log(`  • src/app/core/data/menu.ts`);
      Logger.log(`\nData Summary:`);
      Logger.log(`  Posts: ${mergedPosts.length}`);
      Logger.log(`  Menu Items: ${mergedMenu.length}`);
      Logger.log(`  Images Cached: ${imageStats.cached}`);
      Logger.log(`  Cache Size: ${(imageStats.totalSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (error: any) {
      Logger.error('\nProcessing failed:', error.message);
      if (error.stack) Logger.debug(error.stack);
      throw error;
    }
  }

  /**
   * Load JSON file
   */
  private loadJson<T = any>(filepath: string): T | null {
    try {
      if (!fs.existsSync(filepath)) {
        Logger.warn(`File not found: ${filepath}`);
        return null;
      }

      return FileSystem.readJson<T>(filepath);
    } catch (error: any) {
      Logger.warn(`Failed to load ${filepath}:`, error.message);
      return null;
    }
  }

  /**
   * Merge scraped posts with existing mock data
   */
  private mergeWithMockData(scrapedPosts: MerzySocialPost[]): MerzySocialPost[] {
    // Load existing mock data
    let existingPosts: MerzySocialPost[] = [];

    try {
      const mockDataPath = path.join(
        process.cwd(),
        'src/app/core/data/merzy-social.ts'
      );

      if (fs.existsSync(mockDataPath)) {
        Logger.debug('Loading existing mock posts...');
        // In production, would need to parse TypeScript file
        // For now, we'll keep scraped posts as primary
      }
    } catch (error) {
      Logger.warn('Could not load existing mock data');
    }

    // Merge: scraped posts override mocks, but keep old favorites
    const merged: MerzySocialPost[] = [];
    const seenUrls = new Set<string>();

    // Add all scraped posts (newer data)
    scrapedPosts.forEach(post => {
      merged.push(post);
      if (post.url) seenUrls.add(post.url);
    });

    // Sort by date descending
    return merged.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  /**
   * Merge scraped menu with existing mock menu
   */
  private mergeMenuWithMocks(scrapedMenu: MenuItem[]): MenuItem[] {
    // Load existing menu
    let mockItems: MenuItem[] = [];

    try {
      const mockDataPath = path.join(
        process.cwd(),
        'src/app/core/data/menu.ts'
      );

      if (fs.existsSync(mockDataPath)) {
        Logger.debug('Loading existing mock menu...');
        // In production, would parse TypeScript file
      }
    } catch (error) {
      Logger.warn('Could not load existing mock menu');
    }

    // Create map of mock items
    const mockMap = new Map(mockItems.map(m => [m.id, m]));

    // Update with scraped data
    scrapedMenu.forEach(item => {
      const existing = mockMap.get(item.id);
      if (existing) {
        // Update specific fields
        existing.price = item.price;
        existing.available = item.available;
        if (item.image && item.image.startsWith('/')) {
          existing.image = item.image;
        }
        if (item.rating) {
          existing.rating = item.rating;
        }
      } else {
        // Add new items
        mockMap.set(item.id, item);
      }
    });

    return Array.from(mockMap.values());
  }

  /**
   * Generate TypeScript data files for frontend
   */
  private async generateTypeScriptFiles(
    posts: MerzySocialPost[],
    profile: MerzySocialProfile,
    highlights: MerzyHighlight[],
    menu: MenuItem[],
    comments: MerzyComment[]
  ): Promise<void> {
    // Generate merzy-social.ts
    const socialContent = this.generateSocialDataFile(posts, profile, highlights, comments);
    const socialPath = path.join(process.cwd(), 'src/app/core/data/merzy-social.ts');
    FileSystem.writeJson(socialPath, socialContent);
    Logger.success(`Generated ${socialPath}`);

    // Generate menu.ts
    const menuContent = this.generateMenuDataFile(menu);
    const menuPath = path.join(process.cwd(), 'src/app/core/data/menu.ts');
    FileSystem.writeJson(menuPath, menuContent);
    Logger.success(`Generated ${menuPath}`);
  }

  /**
   * Generate social data file content
   */
  private generateSocialDataFile(
    posts: MerzySocialPost[],
    profile: MerzySocialProfile,
    highlights: MerzyHighlight[],
    comments: MerzyComment[]
  ): string {
    const timestamp = DateUtils.getISOString();

    return `/**
 * Auto-generated on ${timestamp}
 * Do not edit manually - changes will be overwritten
 * Generated by: scripts/data-processor/processor.ts
 */

export interface MerzySocialProfile {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  organization: string;
  location: string;
  linkLabel: string;
  externalLinks: string[];
  avatar: string;
}

export interface MerzyHighlight {
  name: string;
  cover: string;
  url: string;
}

export interface MerzySocialPost {
  code: string;
  type: 'reel' | 'photo' | 'carousel';
  date: string;
  image: string;
  caption: string;
  likesText: string;
  location?: string;
  collabWith?: string;
  audio?: string;
  textOnImage?: string;
  url: string;
}

export interface MerzyComment {
  author: string;
  text: string;
  source: string;
}

export interface MerzyBusinessLinks {
  instagram: string;
  facebook: string;
  talabat: string;
}

export const MERZY_PROFILE: MerzySocialProfile = ${JSON.stringify(profile, null, 2)};

export const MERZY_HIGHLIGHTS: MerzyHighlight[] = ${JSON.stringify(highlights, null, 2)};

export const MERZY_POSTS: MerzySocialPost[] = ${JSON.stringify(posts.slice(0, 50), null, 2)};

export const MERZY_COMMENTS: MerzyComment[] = ${JSON.stringify(comments.slice(0, 20), null, 2)};

export const MERZY_LINKS: MerzyBusinessLinks = {
  instagram: 'https://www.instagram.com/merzy.eg/',
  facebook: 'https://www.facebook.com/p/Merzy-Coffee-61583371166412/',
  talabat: 'https://www.talabat.com/egypt/restaurant/1102357/merzy-shatby'
};
`;
  }

  /**
   * Generate menu data file content
   */
  private generateMenuDataFile(menu: MenuItem[]): string {
    const timestamp = DateUtils.getISOString();

    return `/**
 * Auto-generated on ${timestamp}
 * Do not edit manually - changes will be overwritten
 * Generated by: scripts/data-processor/processor.ts
 */

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'bakery';
  description: string;
  price: number;
  image?: string;
  available?: boolean;
  rating?: number;
}

export const MENU_ITEMS: MenuItem[] = ${JSON.stringify(menu, null, 2)};

export function getCoffeeItems(): MenuItem[] {
  return MENU_ITEMS.filter(item => item.category === 'coffee');
}

export function getBakeryItems(): MenuItem[] {
  return MENU_ITEMS.filter(item => item.category === 'bakery');
}

export function getItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find(item => item.id === id);
}
`;
  }

  /**
   * Default profile
   */
  private getDefaultProfile(): MerzySocialProfile {
    return {
      handle: '@merzy.eg',
      name: 'Merzy Coffee',
      bio: 'for those who value the details.',
      followers: 4836,
      following: 127,
      organization: 'Merzy Coffee',
      location: 'Bibliotheca Alexandrina — Alexandria',
      linkLabel: 'www.talabat.com/egypt/merzy',
      externalLinks: [
        'https://www.instagram.com/merzy.eg/',
        'https://www.facebook.com/p/Merzy-Coffee-61583371166412/',
        'https://www.talabat.com/egypt/restaurant/1102357/merzy-shatby'
      ],
      avatar: '/scraped/instagram/profile-pic.jpg'
    };
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const verbose = process.env.DEBUG_PROCESSOR === 'true';
  const outputDir = process.env.OUTPUT_DIR || './scraped-data';

  Logger.setVerbose(verbose);

  const processor = new DataProcessor(outputDir);

  try {
    await processor.processAll();
    Logger.success('\n✅ All data processed successfully!');
  } catch (error: any) {
    Logger.error('\n❌ Processing failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    Logger.error('Fatal error:', error);
    process.exit(1);
  });
}

export default DataProcessor;
