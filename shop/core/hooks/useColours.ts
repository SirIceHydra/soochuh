import { useCallback, useState } from 'react';
import { getColours } from '../../../services/woocommerce';

export interface ProductColour {
  id: number;
  name: string;
  slug: string;
  hex: string | null;
}

export function useColours() {
  const [colours, setColours] = useState<ProductColour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getColours();
      if (!Array.isArray(data)) {
        setColours([]);
        return;
      }
      setColours(
        data.map((c: { id: number; name: string; slug: string; hex: string | null }) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          hex: c.hex ?? null,
        }))
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to fetch colours';
      setError(message);
      setColours([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { colours, loading, error, fetchColours };
}
