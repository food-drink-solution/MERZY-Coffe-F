/**
 * Shared utilities for all MERZY scrapers
 * HTTP requests, parsing, logging, file operations
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// HTTP CLIENT
// ============================================================================

export class HttpClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // milliseconds

  constructor(
    private timeout: number = 30000,
    private userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  ) {
    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent
      }
    });
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(async () => {
      const response = await this.client.get<T>(url, config);
      return response.data;
    });
  }

  async getStream(url: string, config?: AxiosRequestConfig) {
    return this.requestWithRetry(async () => {
      const response = await this.client.get(url, {
        ...config,
        responseType: 'stream'
      });
      return response.data;
    });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(async () => {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    });
  }

  private async requestWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        if (attempt === this.maxRetries - 1) {
          throw error;
        }

        const statusCode = error.response?.status;
        if (statusCode === 429) {
          // Rate limited - wait longer
          const waitTime = Math.pow(2, attempt) * 5000;
          Logger.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
          await this.delay(waitTime);
        } else if (statusCode >= 500) {
          // Server error - retry
          const waitTime = Math.pow(2, attempt) * 1000;
          Logger.warn(`Server error (${statusCode}). Retrying in ${waitTime}ms...`);
          await this.delay(waitTime);
        } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          // Timeout - retry
          const waitTime = Math.pow(2, attempt) * 1000;
          Logger.warn(`Connection timeout. Retrying in ${waitTime}ms...`);
          await this.delay(waitTime);
        } else {
          throw error;
        }
      }
    }

    throw new Error('Max retries exceeded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  rotateUserAgent(): void {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    ];

    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    this.client.defaults.headers['User-Agent'] = randomAgent;
  }
}

// ============================================================================
// FILE SYSTEM
// ============================================================================

export class FileSystem {
  static ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static ensureDirs(dirPaths: string[]): void {
    dirPaths.forEach(dirPath => this.ensureDir(dirPath));
  }

  static readJson<T = any>(filePath: string): T {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  static writeJson<T = any>(filePath: string, data: T, pretty = true): void {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  static appendJson<T = any>(filePath: string, data: T[]): void {
    let existing: T[] = [];

    if (fs.existsSync(filePath)) {
      try {
        existing = this.readJson<T[]>(filePath);
      } catch (error) {
        Logger.warn(`Failed to read existing JSON file: ${filePath}`);
      }
    }

    const merged = [...existing, ...data];
    this.writeJson(filePath, merged);
  }

  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(`Failed to delete file: ${filePath}`, error);
      return false;
    }
  }

  static getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  static listFiles(dirPath: string, extension?: string): string[] {
    try {
      const files = fs.readdirSync(dirPath);
      if (extension) {
        return files.filter(f => f.endsWith(extension));
      }
      return files;
    } catch (error) {
      return [];
    }
  }
}

// ============================================================================
// LOGGING
// ============================================================================

export class Logger {
  private static verbose = false;

  static setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  static log(...args: any[]): void {
    console.log('[INFO]', ...args);
  }

  static debug(...args: any[]): void {
    if (this.verbose) {
      console.log('[DEBUG]', ...args);
    }
  }

  static warn(...args: any[]): void {
    console.warn('[WARN]', ...args);
  }

  static error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }

  static success(...args: any[]): void {
    console.log('[✓]', ...args);
  }

  static section(title: string): void {
    console.log('\n' + '='.repeat(60));
    console.log(`  ${title}`);
    console.log('='.repeat(60) + '\n');
  }

  static progress(current: number, total: number, label: string): void {
    const percentage = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    if (this.verbose) {
      process.stdout.write(`\r[${bar}] ${percentage}% - ${label}`);
      if (current === total) {
        console.log();
      }
    }
  }
}

// ============================================================================
// DATE & TIME
// ============================================================================

export class DateUtils {
  static formatDate(date: Date | string | number): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatDateTime(date: Date | string | number): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static parseDate(dateString: string): Date | null {
    // Handle relative dates like "2 days ago"
    const relativeMatch = dateString.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
    if (relativeMatch) {
      const [, value, unit] = relativeMatch;
      const date = new Date();
      const amount = -parseInt(value);

      switch (unit.toLowerCase()) {
        case 'day':
          date.setDate(date.getDate() + amount);
          break;
        case 'week':
          date.setDate(date.getDate() + amount * 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() + amount);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() + amount);
          break;
      }

      return date;
    }

    // Try to parse absolute date
    const parsed = new Date(dateString);
    return !isNaN(parsed.getTime()) ? parsed : null;
  }

  static getTimestamp(): number {
    return Date.now();
  }

  static getISOString(): string {
    return new Date().toISOString();
  }
}

// ============================================================================
// STRING & TEXT UTILITIES
// ============================================================================

export class StringUtils {
  static sanitize(text: string): string {
    return text
      .trim()
      .replace(/\n\n+/g, '\n')
      .replace(/\s+/g, ' ');
  }

  static extractHashtags(text: string): string[] {
    const matches = text.match(/#[\w]+/g) || [];
    return matches.map(tag => tag.substring(1));
  }

  static extractMentions(text: string): string[] {
    const matches = text.match(/@[\w.]+/g) || [];
    return matches.map(mention => mention.substring(1));
  }

  static extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  static truncate(text: string, length: number, suffix: string = '...'): string {
    if (text.length <= length) return text;
    return text.substring(0, length - suffix.length) + suffix;
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static parsePrice(priceText: string): number {
    const match = priceText.match(/[\d,.]+/);
    if (!match) return 0;

    const numStr = match[0].replace(/,/g, '');
    return parseFloat(numStr);
  }

  static formatPrice(price: number, currency: string = 'EGP'): string {
    return `${price.toFixed(2)} ${currency}`;
  }
}

// ============================================================================
// HASH & CRYPTO
// ============================================================================

export class CryptoUtils {
  static generateHash(text: string, length: number = 12): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(text).digest('hex').substring(0, length);
  }

  static generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const id = `${timestamp}${random}`;
    return prefix ? `${prefix}-${id}` : id;
  }
}

// ============================================================================
// PERFORMANCE & TIMING
// ============================================================================

export class Timer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  elapsed(): number {
    return Date.now() - this.startTime;
  }

  elapsedSeconds(): number {
    return Math.round(this.elapsed() / 1000);
  }

  format(): string {
    const ms = this.elapsed();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}m`;
  }

  static async measure<T>(fn: () => Promise<T>, label?: string): Promise<[T, string]> {
    const timer = new Timer();
    const result = await fn();
    const duration = timer.format();
    if (label) {
      Logger.log(`${label} completed in ${duration}`);
    }
    return [result, duration];
  }
}

// ============================================================================
// DELAY & WAIT
// ============================================================================

export class Wait {
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async delayRandom(minMs: number, maxMs: number): Promise<void> {
    const ms = minMs + Math.random() * (maxMs - minMs);
    return this.delay(ms);
  }

  static async until(condition: () => boolean, timeoutMs: number = 30000, intervalMs: number = 100): Promise<boolean> {
    const startTime = Date.now();

    while (true) {
      if (condition()) return true;

      if (Date.now() - startTime > timeoutMs) {
        return false;
      }

      await this.delay(intervalMs);
    }
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

export class Validator {
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static isValidDate(date: string | Date): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(d.getTime());
  }

  static isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  static isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  static isPositive(value: number): boolean {
    return this.isNumber(value) && value > 0;
  }

  static isBetween(value: number, min: number, max: number): boolean {
    return this.isNumber(value) && value >= min && value <= max;
  }
}

// ============================================================================
// COLLECTION UTILITIES
// ============================================================================

export class CollectionUtils {
  static unique<T>(items: T[], keyFn?: (item: T) => any): T[] {
    const seen = new Set();
    return items.filter(item => {
      const key = keyFn ? keyFn(item) : item;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  static groupBy<T, K extends string | number | symbol>(
    items: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> {
    const groups: Record<K, T[]> = {} as any;

    items.forEach(item => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }

  static sortBy<T>(items: T[], keyFn: (item: T) => any, ascending = true): T[] {
    return [...items].sort((a, b) => {
      const aVal = keyFn(a);
      const bVal = keyFn(b);

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  static take<T>(items: T[], count: number): T[] {
    return items.slice(0, count);
  }

  static chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  }
}
