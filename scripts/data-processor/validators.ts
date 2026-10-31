/**
 * Data Validators
 * Validates all processed data before writing to frontend
 */

import * as fs from 'fs';
import { Logger } from '../scrapers/utils';
import { MerzySocialPost, MenuItem } from '../scrapers/types';

export class DataValidator {
  /**
   * Validate a single post
   */
  static validatePost(post: MerzySocialPost, index: number): string[] {
    const errors: string[] = [];

    if (!post.code) errors.push('Missing code');
    if (!post.date) errors.push('Missing date');
    if (!post.caption && !post.image) errors.push('Missing both caption and image');
    if (!post.url) errors.push('Missing URL');
    if (!post.type) errors.push('Missing type');

    // Validate date format
    try {
      const dateObj = new Date(post.date);
      if (isNaN(dateObj.getTime())) {
        errors.push(`Invalid date format: ${post.date}`);
      }
    } catch (error) {
      errors.push(`Invalid date: ${post.date}`);
    }

    // Validate URL
    if (!post.url.startsWith('http')) {
      errors.push(`Invalid URL: ${post.url}`);
    }

    return errors;
  }

  /**
   * Validate a menu item
   */
  static validateMenuItem(item: MenuItem, index: number): string[] {
    const errors: string[] = [];

    if (!item.id) errors.push('Missing id');
    if (!item.name) errors.push('Missing name');
    if (!item.category) errors.push('Missing category');
    if (item.price === undefined || item.price === null) errors.push('Missing price');

    // Validate values
    if (item.price < 0) errors.push('Invalid price (negative)');
    if (item.price > 10000) errors.push('Price seems invalid (> 10000 EGP)');
    if (!['coffee', 'bakery'].includes(item.category)) {
      errors.push(`Invalid category: ${item.category}`);
    }

    return errors;
  }

  /**
   * Validate all posts and return validation report
   */
  static validateAllPosts(posts: MerzySocialPost[]): { valid: boolean; errors: Map<number, string[]> } {
    const errors = new Map<number, string[]>();

    posts.forEach((post, idx) => {
      const postErrors = this.validatePost(post, idx);
      if (postErrors.length > 0) {
        errors.set(idx, postErrors);
      }
    });

    const valid = errors.size === 0;

    if (valid) {
      Logger.success(`✅ All ${posts.length} posts validated successfully`);
    } else {
      Logger.error(`❌ ${errors.size} posts have validation errors:`);
      errors.forEach((postErrors, idx) => {
        Logger.error(`  Post ${idx} (${posts[idx].code}):`);
        postErrors.forEach(err => Logger.error(`    - ${err}`));
      });
    }

    return { valid, errors };
  }

  /**
   * Validate all menu items and return validation report
   */
  static validateAllMenuItems(
    items: MenuItem[]
  ): { valid: boolean; errors: Map<number, string[]> } {
    const errors = new Map<number, string[]>();

    items.forEach((item, idx) => {
      const itemErrors = this.validateMenuItem(item, idx);
      if (itemErrors.length > 0) {
        errors.set(idx, itemErrors);
      }
    });

    const valid = errors.size === 0;

    if (valid) {
      Logger.success(`✅ All ${items.length} menu items validated successfully`);
    } else {
      Logger.error(`❌ ${errors.size} menu items have validation errors:`);
      errors.forEach((itemErrors, idx) => {
        Logger.error(`  Item ${idx} (${items[idx].name}):`);
        itemErrors.forEach(err => Logger.error(`    - ${err}`));
      });
    }

    return { valid, errors };
  }

  /**
   * Generate validation report
   */
  static generateReport(
    posts: MerzySocialPost[],
    menu: MenuItem[]
  ): {
    postsValid: boolean;
    menuValid: boolean;
    totalErrors: number;
  } {
    const postsResult = this.validateAllPosts(posts);
    const menuResult = this.validateAllMenuItems(menu);

    const totalErrors = postsResult.errors.size + menuResult.errors.size;

    return {
      postsValid: postsResult.valid,
      menuValid: menuResult.valid,
      totalErrors
    };
  }
}
