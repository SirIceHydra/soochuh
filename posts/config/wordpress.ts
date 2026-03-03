// WordPress Posts – all from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const POSTS_API_VERSION = import.meta.env.VITE_WORDPRESS_POSTS_API_VERSION ?? '';

export const WORDPRESS_CONFIG = {
  BASE_URL: WORDPRESS_URL,
  API_VERSION: POSTS_API_VERSION,
  
  // API Endpoints
  ENDPOINTS: {
    POSTS: '/posts',
    POST: (id: number) => `/posts/${id}`,
    MEDIA: '/media',
    MEDIA_ITEM: (id: number) => `/media/${id}`,
    CATEGORIES: '/categories',
    TAGS: '/tags',
    USERS: '/users',
    USER: (id: number) => `/users/${id}`,
  },
  
  // Default Settings
  DEFAULTS: {
    POSTS_PER_PAGE: 10,
    MAX_POSTS_PER_PAGE: 100,
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
    TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
  
  // Post Status
  POST_STATUS: {
    PUBLISH: 'publish',
    DRAFT: 'draft',
    PRIVATE: 'private',
    PENDING: 'pending',
  },
  
  // Image Sizes
  IMAGE_SIZES: {
    THUMBNAIL: 'thumbnail',
    MEDIUM: 'medium',
    LARGE: 'large',
    FULL: 'full',
  },
  
  // Reading Time Calculation
  READING_TIME: {
    WORDS_PER_MINUTE: 200,
    MIN_READING_TIME: 1,
  },
  
  // SEO Settings
  SEO: {
    DEFAULT_TITLE_TEMPLATE: '%title% | Soochuh',
    DEFAULT_DESCRIPTION_LENGTH: 160,
    DEFAULT_KEYWORDS: ['medical apparel', 'scrubs', 'healthcare', 'professional wear'],
  },
} as const;

// WordPress API Headers
export const WORDPRESS_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// WordPress Query Parameters
export const WORDPRESS_PARAMS = {
  EMBED: '_embed',
  PER_PAGE: 'per_page',
  PAGE: 'page',
  ORDER_BY: 'orderby',
  ORDER: 'order',
  SEARCH: 'search',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  AUTHOR: 'author',
  STATUS: 'status',
  AFTER: 'after',
  BEFORE: 'before',
  MODIFIED_AFTER: 'modified_after',
  MODIFIED_BEFORE: 'modified_before',
  SLUG: 'slug',
  INCLUDE: 'include',
  EXCLUDE: 'exclude',
  OFFSET: 'offset',
  STICKY: 'sticky',
} as const;
