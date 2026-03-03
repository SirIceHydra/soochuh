import { useState, useEffect, useCallback, useMemo } from 'react';
import { Post, PostsResponse, PostFilters } from '../types/post';
import { fetchPosts, fetchPostBySlug, searchPosts } from '../services/wordpress-api';

interface UsePostsOptions {
  initialFilters?: PostFilters;
  autoFetch?: boolean;
}

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  searchPosts: (query: string, filters?: Omit<PostFilters, 'search'>) => Promise<void>;
  clearError: () => void;
}

interface UsePostReturn {
  post: Post | null;
  loading: boolean;
  error: string | null;
  fetchPostBySlug: (slug: string) => Promise<void>;
  clearError: () => void;
}

// Hook for fetching multiple posts
export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { initialFilters = {} } = options;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPostsData = useCallback(async (filters: PostFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PostsResponse = await fetchPosts(filters);
      
      setPosts(response.posts);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPostsData = useCallback(async (query: string, filters: Omit<PostFilters, 'search'> = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PostsResponse = await searchPosts(query, filters);
      setPosts(response.posts);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const memoizedInitialFilters = useMemo(() => initialFilters, [initialFilters]);

  useEffect(() => {
    fetchPostsData(memoizedInitialFilters);
  }, [memoizedInitialFilters, fetchPostsData]);

  return {
    posts,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    fetchPosts: fetchPostsData,
    searchPosts: searchPostsData,
    clearError,
  };
}

// Hook for fetching a single post
export function usePost(): UsePostReturn {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostBySlugData = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const postData = await fetchPostBySlug(slug);
      setPost(postData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
      console.error('Error in usePost by slug:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    post,
    loading,
    error,
    fetchPostBySlug: fetchPostBySlugData,
    clearError,
  };
}

// Hook for managing posts with pagination
export function usePostsWithPagination(initialFilters: PostFilters = {}) {
  const [filters, setFilters] = useState<PostFilters>(initialFilters);
  const postsHook = usePosts({ initialFilters: filters, autoFetch: false });

  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const setPerPage = useCallback((perPage: number) => {
    setFilters(prev => ({ ...prev, perPage, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  }, []);

  const setTag = useCallback((tag: string) => {
    setFilters(prev => ({ ...prev, tag, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const setOrderBy = useCallback((orderBy: 'date' | 'title' | 'modified') => {
    setFilters(prev => ({ ...prev, orderBy }));
  }, []);

  const setOrder = useCallback((order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, order }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    postsHook.fetchPosts(filters);
  }, [filters, postsHook]);

  return {
    ...postsHook,
    filters,
    goToPage,
    setPerPage,
    setCategory,
    setTag,
    setSearch,
    setOrderBy,
    setOrder,
    clearFilters,
  };
}
