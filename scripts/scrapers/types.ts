/**
 * Shared TypeScript interfaces for MERZY scrapers
 * Defines data structures for Instagram, Facebook, Talabat data
 */

// ============================================================================
// INSTAGRAM TYPES
// ============================================================================

export interface InstagramProfile {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  avatar: string;
  isVerified: boolean;
  externalUrl?: string;
}

export interface InstagramPost {
  code: string;
  type: 'photo' | 'carousel' | 'reel' | 'video';
  caption: string;
  timestamp: number;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  imageUrls: string[];
  videoUrl?: string;
  location?: string;
  collabWith?: string;
  audio?: string;
  textOnImage?: string;
  url: string;
}

export interface InstagramHighlight {
  id: string;
  name: string;
  cover: string;
  storyCount: number;
  lastUpdated: string;
  url: string;
}

export interface InstagramComment {
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  isReply: boolean;
  authorFollowers?: number;
}

export interface InstagramScraperOutput {
  profile: InstagramProfile;
  posts: InstagramPost[];
  highlights: InstagramHighlight[];
  comments: InstagramComment[];
  scrapedAt: string;
  success: boolean;
  totalItems: number;
  errors: string[];
}

// ============================================================================
// FACEBOOK TYPES
// ============================================================================

export interface FacebookPage {
  pageId: string;
  name: string;
  category: string;
  about: string;
  website?: string;
  phone?: string;
  address?: string;
  followers: number;
  recommendations: number;
  reviewCount: number;
  profilePicture: string;
}

export interface FacebookPost {
  postId: string;
  createdAt: string;
  type: 'photo' | 'link' | 'video' | 'text' | 'event';
  content: string;
  image?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reactions: {
      like: number;
      love: number;
      haha: number;
      wow: number;
      sad: number;
      angry: number;
    };
  };
  url: string;
}

export interface FacebookReview {
  reviewId: string;
  reviewer: string;
  rating: number;
  text: string;
  createdAt: string;
  helpful: number;
  url: string;
}

export interface FacebookComment {
  author: string;
  text: string;
  timestamp: string;
  likes: number;
  source: string;
  depth: number;
}

export interface FacebookScraperOutput {
  pageInfo: FacebookPage;
  posts: FacebookPost[];
  reviews: FacebookReview[];
  comments: FacebookComment[];
  scrapedAt: string;
  success: boolean;
  totalPosts: number;
  errors: string[];
}

// ============================================================================
// TALABAT TYPES
// ============================================================================

export interface TalabatRestaurant {
  restaurantId: string;
  name: string;
  rating: number;
  reviewCount: number;
  deliveryRating: number;
  foodRating: number;
  serviceRating: number;
  address: string;
  isOpen: boolean;
  deliveryTime: string;
  deliveryCost: number;
  minimumOrder: number;
  cuisineTypes: string[];
  acceptsDelivery: boolean;
  acceptsPickup: boolean;
  acceptsDineIn: boolean;
  profilePicture: string;
}

export interface TalabatMenuItem {
  itemId: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  available: boolean;
  popular: boolean;
  addOns?: Array<{
    name: string;
    price: number;
    required: boolean;
  }>;
  rating?: number;
  reviewCount?: number;
}

export interface TalabatReview {
  reviewId: string;
  reviewer: string;
  rating: number;
  date: string;
  text: string;
  foodRating?: number;
  deliveryRating?: number;
  isVerifiedBuyer: boolean;
  helpful: number;
  images?: string[];
}

export interface TalabatPromotion {
  promotionId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: string;
}

export interface TalabatScraperOutput {
  restaurant: TalabatRestaurant;
  menu: TalabatMenuItem[];
  reviews: TalabatReview[];
  promotions: TalabatPromotion[];
  scrapedAt: string;
  success: boolean;
  totalMenuItems: number;
  errors: string[];
}

// ============================================================================
// MERZY FRONTEND TYPES
// ============================================================================

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

export interface MerzyHighlight {
  name: string;
  cover: string;
  url: string;
}

export interface MerzyComment {
  author: string;
  text: string;
  source: string;
}

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

export interface MerzyBusinessLinks {
  instagram: string;
  facebook: string;
  talabat: string;
}

// ============================================================================
// CONFIG TYPES
// ============================================================================

export interface ScraperConfig {
  instagram: {
    username: string;
    sessionId?: string;
    maxPosts: number;
    downloadImages: boolean;
  };
  facebook: {
    pageId: string;
    accessToken?: string;
    appId?: string;
    appSecret?: string;
    maxPosts: number;
  };
  talabat: {
    restaurantId: string;
    maxMenuItems: number;
    maxReviews: number;
  };
  general: {
    timeout: number;
    retries: number;
    delay: number;
    cacheImages: boolean;
    outputDir: string;
    verbose: boolean;
  };
}

export interface ScraperOptions {
  testMode?: boolean;
  validateOnly?: boolean;
  verbose?: boolean;
  forceRedownload?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ScraperResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  duration: number;
}

export interface ImageCacheEntry {
  url: string;
  localPath: string;
  downloadedAt: string;
  size: number;
}

export interface ProcessingReport {
  timestamp: string;
  instagram: {
    postsProcessed: number;
    imagesDownloaded: number;
    errors: string[];
  };
  facebook: {
    postsProcessed: number;
    imagesDownloaded: number;
    errors: string[];
  };
  talabat: {
    itemsProcessed: number;
    imagesDownloaded: number;
    errors: string[];
  };
  total: {
    duration: number;
    success: boolean;
  };
}
