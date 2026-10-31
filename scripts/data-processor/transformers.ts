/**
 * Data Transformers
 * Converts raw scraper output to MERZY frontend format
 */

import { Logger, DateUtils, StringUtils } from '../scrapers/utils';
import {
  InstagramPost,
  FacebookPost,
  TalabatMenuItem,
  MerzySocialPost,
  MenuItem
} from '../scrapers/types';

export class DataTransformers {
  /**
   * Transform Instagram posts to MERZY format
   */
  static transformInstagramPosts(posts: InstagramPost[]): MerzySocialPost[] {
    return posts.map(post => {
      const primaryImage = post.imageUrls?.[0] || '';

      return {
        code: post.code,
        type: post.type as any,
        date: DateUtils.formatDate(post.timestamp),
        image: primaryImage,
        caption: StringUtils.sanitize(post.caption),
        likesText: `${post.likes || 0} likes`,
        location: post.location,
        collabWith: post.collabWith,
        audio: post.audio,
        textOnImage: post.textOnImage,
        url: post.url
      };
    });
  }

  /**
   * Transform Facebook posts to MERZY format
   */
  static transformFacebookPosts(posts: FacebookPost[]): MerzySocialPost[] {
    return posts
      .filter(post => post.content && post.content.length > 0) // Only posts with content
      .map(post => {
        // Extract engagement
        const likesCount = post.engagement?.likes || 0;

        return {
          code: this.extractPostId(post.postId),
          type: this.mapFacebookType(post.type),
          date: DateUtils.formatDate(post.createdAt),
          image: post.image || '',
          caption: StringUtils.sanitize(post.content),
          likesText: `${likesCount} likes`,
          url: post.url
        };
      });
  }

  /**
   * Transform Talabat menu items to MenuItem format
   */
  static transformTalabatMenu(items: TalabatMenuItem[]): MenuItem[] {
    const categoryMap: Record<string, 'coffee' | 'bakery'> = {
      Coffee: 'coffee',
      Bakery: 'bakery',
      Pastries: 'bakery',
      Desserts: 'bakery',
      Beverages: 'coffee'
    };

    return items.map(item => ({
      id: item.itemId,
      name: item.name,
      category: categoryMap[item.category] || 'coffee',
      description: StringUtils.sanitize(item.description),
      price: item.price,
      image: item.image,
      available: item.available !== false,
      rating: item.rating
    }));
  }

  /**
   * Extract post ID from Facebook post ID
   */
  private static extractPostId(postId: string): string {
    const parts = postId.split('_');
    return parts[parts.length - 1];
  }

  /**
   * Map Facebook post type to MERZY format
   */
  private static mapFacebookType(
    facebookType: 'photo' | 'link' | 'video' | 'text' | 'event'
  ): 'photo' | 'reel' | 'carousel' {
    switch (facebookType) {
      case 'video':
        return 'reel';
      case 'link':
        return 'carousel';
      default:
        return 'photo';
    }
  }
}
