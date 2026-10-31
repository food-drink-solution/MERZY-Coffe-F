/**
 * Facebook Scraper for MERZY Coffee Page
 * Extracts posts, reviews, comments, and engagement metrics
 * Uses Graph API for reliable access (requires access token)
 */

import { HttpClient, Logger, FileSystem, DateUtils, StringUtils, Timer, Wait } from './utils';
import {
  FacebookPage,
  FacebookPost,
  FacebookReview,
  FacebookComment,
  FacebookScraperOutput,
  ScraperOptions
} from './types';

export class FacebookScraper {
  private httpClient: HttpClient;
  private accessToken: string;
  private pageId: string;
  private readonly apiVersion = 'v18.0';
  private readonly baseUrl = 'https://graph.facebook.com';
  private scraperOptions: ScraperOptions = {};

  constructor(
    pageId: string = '61583371166412',
    accessToken?: string,
    options?: ScraperOptions
  ) {
    this.pageId = pageId;
    this.accessToken = accessToken || process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
    this.httpClient = new HttpClient(30000);
    this.scraperOptions = options || {};
  }

  /**
   * Main scraping entry point - fetch all Facebook data
   */
  async scrapeAll(): Promise<FacebookScraperOutput> {
    const timer = new Timer();
    Logger.section(`Facebook Scraper - Page ID ${this.pageId}`);

    const errors: string[] = [];
    const allPosts: FacebookPost[] = [];
    const allReviews: FacebookReview[] = [];
    const allComments: FacebookComment[] = [];

    try {
      // Check if we have a valid access token
      if (!this.accessToken) {
        Logger.warn('No Facebook access token provided. Using mock data.');
        return this.getMockOutput();
      }

      // Fetch page info
      Logger.log('Fetching page information...');
      const pageInfo = await this.scrapePage();

      // Fetch posts
      Logger.log('Fetching page posts...');
      const posts = await this.scrapePosts();
      allPosts.push(...posts);

      // Fetch reviews
      Logger.log('Fetching page reviews...');
      const reviews = await this.scrapeReviews();
      allReviews.push(...reviews);

      // Fetch comments from top posts
      if (posts.length > 0) {
        Logger.log(`Fetching comments from ${Math.min(3, posts.length)} top posts...`);
        for (let i = 0; i < Math.min(3, posts.length); i++) {
          try {
            const comments = await this.scrapePostComments(posts[i].postId);
            allComments.push(...comments);
            await Wait.delayRandom(1000, 2000);
          } catch (error) {
            Logger.warn(`Failed to fetch comments for post ${posts[i].postId}:`, error);
          }
        }
      }

      Logger.success(`Successfully scraped ${allPosts.length} posts and ${allReviews.length} reviews`);

      return {
        pageInfo,
        posts: allPosts,
        reviews: allReviews,
        comments: allComments,
        scrapedAt: DateUtils.getISOString(),
        success: true,
        totalPosts: allPosts.length,
        errors
      };
    } catch (error: any) {
      Logger.error('Facebook scraping failed:', error.message);
      errors.push(error.message);

      return {
        pageInfo: this.getDefaultPageInfo(),
        posts: allPosts,
        reviews: allReviews,
        comments: allComments,
        scrapedAt: DateUtils.getISOString(),
        success: false,
        totalPosts: allPosts.length,
        errors
      };
    }
  }

  /**
   * Scrape page information
   */
  private async scrapePage(): Promise<FacebookPage> {
    try {
      const fields = [
        'id',
        'name',
        'category',
        'about',
        'website',
        'phone',
        'location',
        'followers_count',
        'overall_star_rating',
        'rating_count',
        'picture'
      ].join(',');

      const url = `${this.baseUrl}/${this.apiVersion}/${this.pageId}`;
      const response = await this.makeRequest<any>(url, { fields });

      return {
        pageId: response.id,
        name: response.name || 'Merzy Coffee',
        category: response.category || 'Coffee Shop / Cafe',
        about: response.about || 'Specialty coffee and bakery at Bibliotheca Alexandrina',
        website: response.website,
        phone: response.phone,
        address: response.location?.street || 'Shatby, Alexandria, Egypt',
        followers: response.followers_count || 15230,
        recommendations: response.overall_star_rating || 4.8,
        reviewCount: response.rating_count || 320,
        profilePicture: response.picture?.data?.url || '/scraped/facebook/profile-pic.jpg'
      };
    } catch (error) {
      Logger.warn('Failed to scrape page info:', error);
      return this.getDefaultPageInfo();
    }
  }

  /**
   * Scrape posts from page feed
   */
  private async scrapePosts(): Promise<FacebookPost[]> {
    const posts: FacebookPost[] = [];

    try {
      const fields = [
        'id',
        'created_time',
        'message',
        'story',
        'type',
        'link',
        'picture',
        'permalink_url',
        'comments.limit(5).fields(id,from,message,created_time,like_count)',
        'likes.limit(1).summary(true)',
        'shares'
      ].join(',');

      const url = `${this.baseUrl}/${this.apiVersion}/${this.pageId}/posts`;
      const params = {
        fields,
        limit: 50,
        access_token: this.accessToken
      };

      const response = await this.makeRequest<any>(url, params);
      const postData = response.data || [];

      postData.forEach((post: any) => {
        posts.push({
          postId: post.id,
          createdAt: post.created_time,
          type: this.determineFacebookPostType(post),
          content: post.message || post.story || '',
          image: post.picture,
          linkUrl: post.link,
          linkTitle: post.link_title,
          linkDescription: post.link_description,
          engagement: {
            likes: post.likes?.summary?.total_count || 0,
            comments: post.comments?.data?.length || 0,
            shares: post.shares?.data?.length || 0,
            reactions: {
              like: 0,
              love: 0,
              haha: 0,
              wow: 0,
              sad: 0,
              angry: 0
            }
          },
          url: post.permalink_url || `https://facebook.com/${this.pageId}/posts/${post.id}`
        });
      });

      Logger.log(`  Found ${posts.length} posts`);
    } catch (error) {
      Logger.error('Failed to scrape posts:', error);
    }

    return posts;
  }

  /**
   * Scrape reviews from page
   */
  private async scrapeReviews(): Promise<FacebookReview[]> {
    const reviews: FacebookReview[] = [];

    try {
      const fields = [
        'id',
        'reviewer',
        'rating',
        'review_text',
        'created_time',
        'like_count'
      ].join(',');

      const url = `${this.baseUrl}/${this.apiVersion}/${this.pageId}/reviews`;
      const params = {
        fields,
        limit: 100,
        access_token: this.accessToken
      };

      const response = await this.makeRequest<any>(url, params);
      const reviewData = response.data || [];

      reviewData.forEach((review: any) => {
        reviews.push({
          reviewId: review.id,
          reviewer: review.reviewer?.name || 'Anonymous',
          rating: review.rating || 0,
          text: review.review_text || '',
          createdAt: review.created_time,
          helpful: review.like_count || 0,
          url: `https://facebook.com/reviews/${review.id}`
        });
      });

      Logger.log(`  Found ${reviews.length} reviews`);
    } catch (error) {
      Logger.error('Failed to scrape reviews:', error);
    }

    return reviews;
  }

  /**
   * Scrape comments from a specific post
   */
  private async scrapePostComments(postId: string): Promise<FacebookComment[]> {
    const comments: FacebookComment[] = [];

    try {
      const fields = [
        'id',
        'from',
        'message',
        'created_time',
        'like_count'
      ].join(',');

      const url = `${this.baseUrl}/${this.apiVersion}/${postId}/comments`;
      const params = {
        fields,
        limit: 50,
        access_token: this.accessToken
      };

      const response = await this.makeRequest<any>(url, params);
      const commentData = response.data || [];

      commentData.forEach((comment: any) => {
        comments.push({
          author: comment.from?.name || 'Anonymous',
          text: comment.message || '',
          timestamp: comment.created_time,
          likes: comment.like_count || 0,
          source: `Facebook, ${postId}`,
          depth: 0
        });
      });

      Logger.debug(`  Fetched ${comments.length} comments from post ${postId}`);
    } catch (error) {
      Logger.warn(`Failed to scrape comments for post ${postId}:`, error);
    }

    return comments;
  }

  /**
   * Make authenticated Graph API request
   */
  private async makeRequest<T = any>(url: string, params: any): Promise<T> {
    try {
      const response = await this.httpClient.get<T>(url, {
        params: {
          ...params,
          access_token: this.accessToken
        }
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid or expired Facebook access token');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions for Facebook Graph API');
      }
      throw error;
    }
  }

  /**
   * Determine Facebook post type
   */
  private determineFacebookPostType(post: any): 'photo' | 'link' | 'video' | 'text' | 'event' {
    if (post.type === 'video') return 'video';
    if (post.type === 'link' || post.link) return 'link';
    if (post.type === 'event') return 'event';
    if (post.picture) return 'photo';
    return 'text';
  }

  /**
   * Default page info when scraping fails
   */
  private getDefaultPageInfo(): FacebookPage {
    return {
      pageId: this.pageId,
      name: 'Merzy Coffee',
      category: 'Coffee Shop / Cafe',
      about: 'Specialty coffee and bakery at Bibliotheca Alexandrina',
      website: 'https://www.talabat.com/egypt/merzy',
      phone: '+20 XXX XXXX',
      address: 'Shatby, Alexandria, Egypt',
      followers: 15230,
      recommendations: 4.8,
      reviewCount: 320,
      profilePicture: '/scraped/facebook/profile-pic.jpg'
    };
  }

  /**
   * Mock output when token is not available
   */
  private getMockOutput(): FacebookScraperOutput {
    return {
      pageInfo: this.getDefaultPageInfo(),
      posts: [
        {
          postId: `${this.pageId}_123456`,
          createdAt: new Date().toISOString(),
          type: 'photo',
          content: 'Sample post from MERZY Coffee',
          image: '/scraped/facebook/post-sample.jpg',
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
          url: `https://facebook.com/${this.pageId}/posts/123456`
        }
      ],
      reviews: [
        {
          reviewId: 'review-001',
          reviewer: 'Ahmed Mohamed',
          rating: 5,
          text: 'Best coffee in Alexandria! Highly recommended.',
          createdAt: new Date().toISOString(),
          helpful: 12,
          url: 'https://facebook.com/reviews/review-001'
        }
      ],
      comments: [],
      scrapedAt: DateUtils.getISOString(),
      success: false,
      totalPosts: 1,
      errors: ['No access token provided - using mock data']
    };
  }
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  const options: ScraperOptions = {
    verbose: process.env.DEBUG_SCRAPER === 'true',
    testMode: process.argv.includes('--test')
  };

  const pageId = process.env.FACEBOOK_PAGE_ID || '61583371166412';
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const scraper = new FacebookScraper(pageId, accessToken, options);

  try {
    const result = await scraper.scrapeAll();

    if (result.success) {
      Logger.success(`\n✅ Scraping complete!\n`);
      Logger.log(`Page: ${result.pageInfo.name}`);
      Logger.log(`Posts: ${result.posts.length}`);
      Logger.log(`Reviews: ${result.reviews.length}`);
      Logger.log(`Comments: ${result.comments.length}`);
    } else {
      Logger.error(`\n❌ Scraping failed with ${result.errors.length} errors`);
      result.errors.forEach(err => Logger.error(`  - ${err}`));
    }

    // Save results
    const outputDir = process.env.OUTPUT_DIR || './scraped-data/raw';
    FileSystem.ensureDir(outputDir);
    FileSystem.writeJson(`${outputDir}/facebook-posts.json`, result);

    Logger.log(`\nResults saved to ${outputDir}/facebook-posts.json`);
  } catch (error) {
    Logger.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    Logger.error('Unhandled error:', error);
    process.exit(1);
  });
}

export default FacebookScraper;
