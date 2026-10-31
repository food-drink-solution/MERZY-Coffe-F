/**
 * Image Cache Manager
 * Downloads images from scrapers and stores them locally
 * Updates references to use local paths
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, FileSystem, StringUtils, Timer } from '../scrapers/utils';
import { MerzySocialPost, MenuItem, ImageCacheEntry } from '../scrapers/types';

export class ImageCache {
  private readonly outputDir: string;
  private readonly maxRetries = 3;
  private readonly timeout = 30000;
  private cacheIndex: Map<string, ImageCacheEntry> = new Map();

  constructor(outputDir: string = './scraped-data') {
    this.outputDir = outputDir;
    this.ensureDirectories();
    this.loadCacheIndex();
  }

  private ensureDirectories(): void {
    const dirs = [
      path.join(this.outputDir, 'images'),
      path.join(this.outputDir, 'images/instagram'),
      path.join(this.outputDir, 'images/facebook'),
      path.join(this.outputDir, 'images/talabat')
    ];

    dirs.forEach(dir => {
      FileSystem.ensureDir(dir);
    });
  }

  private loadCacheIndex(): void {
    const indexPath = path.join(this.outputDir, 'images/cache-index.json');
    if (fs.existsSync(indexPath)) {
      try {
        const data = FileSystem.readJson<Record<string, ImageCacheEntry>>(indexPath);
        this.cacheIndex = new Map(Object.entries(data));
        Logger.log(`Loaded ${this.cacheIndex.size} cached images`);
      } catch (error) {
        Logger.warn('Failed to load cache index:', error);
      }
    }
  }

  private saveCacheIndex(): void {
    const indexPath = path.join(this.outputDir, 'images/cache-index.json');
    const data = Object.fromEntries(this.cacheIndex);
    FileSystem.writeJson(indexPath, data);
  }

  async downloadAllImages(
    posts: MerzySocialPost[],
    menu: MenuItem[]
  ): Promise<void> {
    const imageUrls = new Set<string>();

    // Collect unique image URLs
    posts.forEach(post => {
      if (post.image && this.isExternalUrl(post.image)) {
        imageUrls.add(post.image);
      }
    });

    menu.forEach(item => {
      if (item.image && this.isExternalUrl(item.image)) {
        imageUrls.add(item.image);
      }
    });

    if (imageUrls.size === 0) {
      Logger.log('No external images to download');
      return;
    }

    Logger.log(`\nDownloading ${imageUrls.size} images...`);

    let downloaded = 0;
    const failed: string[] = [];

    for (const url of imageUrls) {
      try {
        const localPath = await this.downloadImage(url);
        downloaded++;

        // Update references in posts/menu
        this.updateImageReferences(posts, menu, url, localPath);

        Logger.debug(`  [${downloaded}/${imageUrls.size}] Downloaded: ${url}`);
      } catch (error: any) {
        Logger.warn(`  ✗ Failed to download: ${StringUtils.truncate(url, 50)}`, error.message);
        failed.push(url);
      }
    }

    Logger.success(
      `Downloaded ${downloaded}/${imageUrls.size} images` +
      (failed.length > 0 ? ` (${failed.length} failed)` : '')
    );

    this.saveCacheIndex();
  }

  private async downloadImage(url: string): Promise<string> {
    // Check cache first
    if (this.cacheIndex.has(url)) {
      const cached = this.cacheIndex.get(url)!;
      if (fs.existsSync(cached.localPath)) {
        Logger.debug(`Using cached image: ${url}`);
        return cached.localPath;
      }
    }

    const filename = this.generateFilename(url);
    const source = this.determineSource(url);
    const filepath = path.join(this.outputDir, `images/${source}/${filename}`);
    const localPath = `/scraped/${source}/${filename}`;

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      this.cacheIndex.set(url, {
        url,
        localPath,
        downloadedAt: new Date().toISOString(),
        size: fs.statSync(filepath).size
      });
      return localPath;
    }

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          responseType: 'stream',
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise<string>((resolve, reject) => {
          writer.on('finish', () => {
            const size = fs.statSync(filepath).size;
            this.cacheIndex.set(url, {
              url,
              localPath,
              downloadedAt: new Date().toISOString(),
              size
            });
            resolve(localPath);
          });
          writer.on('error', reject);
          response.data.on('error', reject);
        });
      } catch (error: any) {
        if (attempt === this.maxRetries - 1) {
          throw error;
        }

        // Retry after delay
        const delay = Math.pow(2, attempt) * 1000;
        Logger.debug(`Retry in ${delay}ms... (attempt ${attempt + 1}/${this.maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    throw new Error(`Failed to download after ${this.maxRetries} attempts`);
  }

  private generateFilename(url: string): string {
    const crypto = require('crypto');
    const hash = crypto
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .substring(0, 12);

    return `${hash}.jpg`;
  }

  private determineSource(url: string): 'instagram' | 'facebook' | 'talabat' {
    if (url.includes('instagram') || url.includes('cdninstagram')) return 'instagram';
    if (url.includes('facebook') || url.includes('fbcdn')) return 'facebook';
    return 'talabat';
  }

  private isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
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

  getStats(): {
    cached: number;
    totalSize: number;
  } {
    let totalSize = 0;

    this.cacheIndex.forEach(entry => {
      totalSize += entry.size;
    });

    return {
      cached: this.cacheIndex.size,
      totalSize
    };
  }
}
