/**
 * Deduplicator
 * Removes duplicate posts across platforms
 * Keeps highest quality versions
 */

import { Logger } from '../scrapers/utils';
import { MerzySocialPost } from '../scrapers/types';

export class Deduplicator {
  /**
   * Deduplicate posts from multiple sources
   */
  deduplicatePosts(posts: MerzySocialPost[]): MerzySocialPost[] {
    Logger.log('Deduplicating posts...');

    const seen = new Map<string, MerzySocialPost>();
    const duplicates: string[] = [];

    posts.forEach(post => {
      const signature = this.generateSignature(post);

      if (!seen.has(signature)) {
        seen.set(signature, post);
      } else {
        // Keep the one with better quality
        const existing = seen.get(signature)!;
        if (this.isHigherQuality(post, existing)) {
          seen.set(signature, post);
          duplicates.push(existing.code);
        } else {
          duplicates.push(post.code);
        }
      }
    });

    const result = Array.from(seen.values())
      .sort((a, b) => this.parseDate(b.date).getTime() - this.parseDate(a.date).getTime());

    if (duplicates.length > 0) {
      Logger.log(`  Removed ${duplicates.length} duplicate posts`);
      Logger.debug(`  Duplicates: ${duplicates.join(', ')}`);
    }

    return result;
  }

  /**
   * Generate unique signature for post
   */
  private generateSignature(post: MerzySocialPost): string {
    // Create unique identifier from caption + approximate date
    const caption = (post.caption || '').substring(0, 100).toLowerCase();
    const dateStr = new Date(post.date).toDateString();

    // Simple similarity hashing
    let hash = 0;
    for (let i = 0; i < caption.length; i++) {
      const char = caption.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return `${Math.abs(hash)}_${dateStr}`;
  }

  /**
   * Determine if post A is higher quality than post B
   */
  private isHigherQuality(postA: MerzySocialPost, postB: MerzySocialPost): boolean {
    // Parse engagement numbers
    const likesA = this.parseLikes(postA.likesText);
    const likesB = this.parseLikes(postB.likesText);

    // Prefer post with more engagement
    if (likesA > likesB) return true;
    if (likesA < likesB) return false;

    // Prefer posts with location tags
    if (postA.location && !postB.location) return true;
    if (!postA.location && postB.location) return false;

    // Prefer posts with captions
    if (postA.caption.length > postB.caption.length) return true;

    // Prefer Instagram over Facebook (better formatted)
    const isInstagramA = postA.url?.includes('instagram');
    const isInstagramB = postB.url?.includes('instagram');

    if (isInstagramA && !isInstagramB) return true;
    if (!isInstagramA && isInstagramB) return false;

    return false;
  }

  /**
   * Parse likes from "X likes" text
   */
  private parseLikes(likesText: string): number {
    const match = likesText?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Parse date string
   */
  private parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }
}
