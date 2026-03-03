import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { WORDPRESS_CONFIG, WORDPRESS_HEADERS, WORDPRESS_PARAMS } from '../config/wordpress';
import { WordPressPost, WordPressMedia, Post, PostsResponse, PostFilters } from '../types/post';

// Create axios instance for WordPress API
const wordpressApi: AxiosInstance = axios.create({
  baseURL: `${WORDPRESS_CONFIG.BASE_URL}/wp-json/${WORDPRESS_CONFIG.API_VERSION}`,
  timeout: WORDPRESS_CONFIG.DEFAULTS.TIMEOUT,
  headers: WORDPRESS_HEADERS,
});

// Cache storage
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < WORDPRESS_CONFIG.DEFAULTS.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

// Helper function to make API requests with retry logic
async function apiRequest<T>(
  endpoint: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= WORDPRESS_CONFIG.DEFAULTS.MAX_RETRIES; attempt++) {
    try {
      const filteredParams = params
        ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null))
        : undefined;
      const response = await wordpressApi.get(endpoint, { params: filteredParams, ...config });
      return response.data;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < WORDPRESS_CONFIG.DEFAULTS.MAX_RETRIES) {
        await new Promise(resolve => 
          setTimeout(resolve, WORDPRESS_CONFIG.DEFAULTS.RETRY_DELAY * attempt)
        );
      }
    }
  }
  
  throw new Error(lastError?.message || 'Request failed');
}

// Transform WordPress post to our Post interface
export function transformWordPressPost(wpPost: WordPressPost, media?: WordPressMedia): Post {
  let featuredImage = '';
  let featuredImageAlt = wpPost.title.rendered;
  
  if (wpPost._embedded && wpPost._embedded['wp:featuredmedia']) {
    const embeddedMedia = wpPost._embedded['wp:featuredmedia'][0];
    if (embeddedMedia && embeddedMedia.source_url) {
      featuredImage = embeddedMedia.source_url;
      featuredImageAlt = embeddedMedia.alt_text || wpPost.title.rendered;
    }
  } else if (media) {
    featuredImage = media.source_url;
    featuredImageAlt = media.alt_text || wpPost.title.rendered;
  }

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const cleanTitle = decodeHtmlEntities(wpPost.title.rendered);
  const content = wpPost.content.rendered.replace(/<[^>]*>/g, '');
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.max(
    WORDPRESS_CONFIG.READING_TIME.MIN_READING_TIME,
    Math.ceil(wordCount / WORDPRESS_CONFIG.READING_TIME.WORDS_PER_MINUTE)
  );

  let excerpt = wpPost.excerpt.rendered.replace(/<[^>]*>/g, '');
  excerpt = decodeHtmlEntities(excerpt);
  
  if (!excerpt || excerpt === content || excerpt.length < 10) {
    excerpt = content.substring(0, 150).trim();
    if (excerpt.length === 150) {
      excerpt += '...';
    }
  }

  if (excerpt.length > 160) {
    excerpt = excerpt.substring(0, 157) + '...';
  }

  let categories: string[] = [];
  if (wpPost._embedded && wpPost._embedded['wp:term']) {
    const terms = wpPost._embedded['wp:term'];
    if (Array.isArray(terms)) {
      const categoryTerms = terms.find(termGroup => 
        Array.isArray(termGroup) && termGroup.length > 0 && termGroup[0].taxonomy === 'category'
      );
      
      if (categoryTerms && Array.isArray(categoryTerms)) {
        categories = categoryTerms.map(term => term.name);
      }
    }
  }

  let tags: string[] = [];
  if (wpPost._embedded && wpPost._embedded['wp:term']) {
    const terms = wpPost._embedded['wp:term'];
    if (Array.isArray(terms)) {
      const tagTerms = terms.find(termGroup => 
        Array.isArray(termGroup) && termGroup.length > 0 && termGroup[0].taxonomy === 'post_tag'
      );
      
      if (tagTerms && Array.isArray(tagTerms)) {
        tags = tagTerms.map(term => term.name);
      }
    }
  }

  return {
    id: wpPost.id,
    title: cleanTitle,
    excerpt: excerpt,
    content: wpPost.content.rendered,
    slug: wpPost.slug,
    date: wpPost.date,
    featuredImage: featuredImage,
    featuredImageAlt: featuredImageAlt,
    author: '',
    categories: categories,
    tags: tags,
    readingTime,
    seoTitle: cleanTitle,
    seoDescription: excerpt,
    seoKeywords: [...WORDPRESS_CONFIG.SEO.DEFAULT_KEYWORDS],
  };
}

// Fetch posts from WordPress
export async function fetchPosts(filters: PostFilters = {}): Promise<PostsResponse> {
  const cacheKey = `posts_${JSON.stringify(filters)}`;
  
  const cached = getCachedData<PostsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const params = {
    [WORDPRESS_PARAMS.STATUS]: WORDPRESS_CONFIG.POST_STATUS.PUBLISH,
    [WORDPRESS_PARAMS.PER_PAGE]: filters.perPage || WORDPRESS_CONFIG.DEFAULTS.POSTS_PER_PAGE,
    [WORDPRESS_PARAMS.PAGE]: filters.page || 1,
    [WORDPRESS_PARAMS.ORDER_BY]: filters.orderBy || 'date',
    [WORDPRESS_PARAMS.ORDER]: filters.order || 'desc',
    [WORDPRESS_PARAMS.EMBED]: true,
  };

  if (filters.search) {
    params[WORDPRESS_PARAMS.SEARCH] = filters.search;
  }
  
  if (filters.category) {
    try {
      const categoryId = parseInt(filters.category);
      if (!isNaN(categoryId)) {
        params[WORDPRESS_PARAMS.CATEGORIES] = categoryId;
      } else {
        const categories = await fetchCategories();
        const category = categories.find(cat => cat.slug === filters.category);
        if (category) {
          params[WORDPRESS_PARAMS.CATEGORIES] = category.id;
        }
      }
    } catch (error) {
      console.error('Error resolving category:', error);
    }
  }
  
  if (filters.tag) {
    params[WORDPRESS_PARAMS.TAGS] = filters.tag;
  }
  if (filters.author) {
    params[WORDPRESS_PARAMS.AUTHOR] = filters.author;
  }

  try {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null));
    const response = await wordpressApi.get(WORDPRESS_CONFIG.ENDPOINTS.POSTS, { params: filteredParams });
    const wpPosts: WordPressPost[] = response.data;
    
    const posts = wpPosts.map((wpPost) => {
      return transformWordPressPost(wpPost);
    });
    const filteredPosts = posts.filter(p => !p.categories.some(c => String(c).toLowerCase() === 'slideshow'));

    const totalHeader = response.headers['x-wp-total'] || response.headers['X-WP-Total'];
    const totalPagesHeader = response.headers['x-wp-totalpages'] || response.headers['X-WP-TotalPages'];
    const result: PostsResponse = {
      posts: filteredPosts,
      total: totalHeader ? parseInt(totalHeader, 10) : filteredPosts.length,
      totalPages: totalPagesHeader ? parseInt(totalPagesHeader, 10) : Math.ceil(filteredPosts.length / (filters.perPage || WORDPRESS_CONFIG.DEFAULTS.POSTS_PER_PAGE)),
      currentPage: filters.page || 1,
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Fetch a single post by slug
export async function fetchPostBySlug(slug: string): Promise<Post> {
  const cacheKey = `post_slug_${slug}`;
  
  const cached = getCachedData<Post>(cacheKey);
  if (cached) return cached;

  try {
    const params = {
      [WORDPRESS_PARAMS.SLUG]: slug,
      [WORDPRESS_PARAMS.EMBED]: true,
    };

    const wpPosts: WordPressPost[] = await apiRequest(
      WORDPRESS_CONFIG.ENDPOINTS.POSTS,
      params
    );

    if (!wpPosts.length) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    const wpPost = wpPosts[0];
    let media: WordPressMedia | undefined;
    
    if (wpPost.featured_media) {
      try {
        media = await fetchMedia(wpPost.featured_media);
      } catch (error) {
      }
    }

    const post = transformWordPressPost(wpPost, media);
    setCachedData(cacheKey, post);
    return post;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw error;
  }
}

// Fetch media by ID
export async function fetchMedia(id: number): Promise<WordPressMedia> {
  const cacheKey = `media_${id}`;
  
  const cached = getCachedData<WordPressMedia>(cacheKey);
  if (cached) return cached;

  try {
    const media = await apiRequest<WordPressMedia>(WORDPRESS_CONFIG.ENDPOINTS.MEDIA_ITEM(id));
    setCachedData(cacheKey, media);
    return media;
  } catch (error) {
    console.error(`Error fetching media ${id}:`, error);
    throw error;
  }
}

// Fetch categories
export async function fetchCategories(): Promise<any[]> {
  const cacheKey = 'categories';
  
  const cached = getCachedData<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const categories: any[] = await apiRequest(WORDPRESS_CONFIG.ENDPOINTS.CATEGORIES);
    setCachedData(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Fetch tags
export async function fetchTags(): Promise<any[]> {
  const cacheKey = 'tags';
  
  const cached = getCachedData<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const tags: any[] = await apiRequest(WORDPRESS_CONFIG.ENDPOINTS.TAGS);
    setCachedData(cacheKey, tags);
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

// Search posts
export async function searchPosts(query: string, filters: Omit<PostFilters, 'search'> = {}): Promise<PostsResponse> {
  return fetchPosts({ ...filters, search: query });
}

// Get related posts (same category)
export async function getRelatedPosts(postId: number, limit: number = 3): Promise<Post[]> {
  try {
    const allPosts = await fetchPosts({ perPage: 100 });
    
    // Filter out the current post and get posts with similar categories
    const relatedPosts = allPosts.posts
      .filter(p => p.id !== postId)
      .slice(0, limit);
    
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
