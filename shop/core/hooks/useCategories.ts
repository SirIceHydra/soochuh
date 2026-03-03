import { useCallback, useState } from 'react';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';

export function useCategories() {
  const [categories, setCategories] = useState<Array<{ id: number; name: string; parent?: number; slug?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (opts?: { forceRefresh?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const list = await WooCommerceDataProvider.getCategories({ hideEmpty: false, ...(opts?.forceRefresh ? { force_refresh: true } : {}) } as any);
      
      // Ensure list is an array before mapping
      if (!Array.isArray(list)) {
        console.error('getCategories returned non-array:', list);
        setCategories([]);
        setError('Invalid categories response format');
        return;
      }
      
      const mappedList = list.map(c => ({ id: c.id, name: c.name, slug: c.slug }));
      setCategories(mappedList);
    } catch (e: any) {
      console.error('Error fetching categories:', e);
      setError(e?.message || 'Failed to fetch categories');
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, error, fetchCategories };
}
