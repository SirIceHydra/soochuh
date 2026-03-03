import { useState, useEffect, useCallback } from 'react';
import { useProducts } from './useProducts';

interface UseLazyProductsOptions {
  batchSize?: number;
  category?: number;
  brand?: string;
  search?: string;
  onSale?: boolean;
  orderBy?: 'date' | 'price' | 'name' | 'popularity';
  order?: 'asc' | 'desc';
}

interface UseLazyProductsReturn {
  products: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  isLoadingMore: boolean;
}

export function useLazyProducts(options: UseLazyProductsOptions = {}): UseLazyProductsReturn {
  const { 
    batchSize = 6, 
    category, 
    brand, 
    search, 
    onSale, 
    orderBy, 
    order 
  } = options;
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterKey, setFilterKey] = useState(0);
  
  const { products, loading, error, fetchProducts } = useProducts({
    perPage: batchSize,
    page: 1,
    category,
    brand,
    search,
    onSale,
    orderBy,
    order
  });

  // Reset when filters change
  const reset = useCallback(() => {
    setAllProducts([]);
    setCurrentBatch(0);
    setHasMore(true);
    setFilterKey(prev => prev + 1);
  }, []);

  // Load initial batch or accumulate new products
  useEffect(() => {
    if (!loading && products.length > 0) {
      if (currentBatch === 0) {
        // Initial load or after reset - replace products
        setAllProducts(products);
        setCurrentBatch(1);
        setHasMore(products.length === batchSize);
      } else {
        // Load more - accumulate products (only when not a filter change)
        setAllProducts(prev => {
          // Check if this is actually new data or a duplicate fetch
          const lastProduct = prev[prev.length - 1];
          const firstNewProduct = products[0];
          
          // If the first "new" product is already in our list, don't add duplicates
          if (lastProduct && firstNewProduct && prev.some(p => p.id === firstNewProduct.id)) {
            return prev;
          }
          
          return [...prev, ...products];
        });
        setHasMore(products.length === batchSize);
      }
    }
  }, [products, loading, batchSize, currentBatch]);

  // Load more products
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextBatch = currentBatch + 1;
      await fetchProducts({
        perPage: batchSize,
        page: nextBatch,
        category,
        brand,
        search,
        onSale,
        orderBy,
        order
      });
      
      // The products will be updated via the useEffect above
      setCurrentBatch(nextBatch);
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentBatch, batchSize, fetchProducts, category, brand, search, onSale, orderBy, order]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts({
      perPage: batchSize,
      page: 1,
      category,
      brand,
      search,
      onSale,
      orderBy,
      order
    });
  }, [filterKey]); // Only re-fetch when filterKey changes (which happens on reset)

  // Reset when filter options change
  useEffect(() => {
    reset();
  }, [category, brand, search, onSale, orderBy, order, reset]);

  return {
    products: allProducts,
    loading: loading && currentBatch === 0,
    error,
    hasMore,
    loadMore,
    reset,
    isLoadingMore
  };
}
