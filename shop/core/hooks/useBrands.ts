import { useCallback, useState } from 'react';
import { getProductAttributes, getProductAttributeTerms, getRawProducts } from '../../../services/woocommerce';
import { WooCommerceDataProvider } from '../../adapters/catalog/woocommerce';

export function useBrands() {
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try dedicated brands endpoint first
      try {
        const directBrands = await WooCommerceDataProvider.getBrands();
        if (Array.isArray(directBrands) && directBrands.length > 0) {
          setBrands(directBrands);
          return;
        }
      } catch (_) {
        // ignore and fallback
      }

      // Try attribute-based brand retrieval next
      let list: Array<{ id: string; name: string }> = [];
      try {
        const attributes = await getProductAttributes({ per_page: 100 });
        const brandAttr = attributes.find((a: any) => {
          const slug = String(a?.slug || '').toLowerCase();
          const name = String(a?.name || '').toLowerCase();
          return slug === 'brand' || slug === 'pa_brand' || name === 'brand';
        });
        if (brandAttr) {
          const attrId = brandAttr?.id ?? brandAttr?.attribute_id ?? brandAttr?.term_id;
          const terms = await getProductAttributeTerms(attrId, { per_page: 100 });
          list = (Array.isArray(terms) ? terms : []).map((t: any) => ({ id: String(t.slug || t.id || t.name).toLowerCase(), name: t.name || t.slug }));
        }
      } catch (_) {
        // ignore and fallback
      }

      // Fallback: derive from products if no attribute found or empty
      if (list.length === 0) {
        const resp = await getRawProducts({ per_page: 100 });
        const brandSet = new Map<string, string>();
        for (const p of resp.data) {
          let brand: any = null;
          if (Array.isArray((p as any).brands) && (p as any).brands.length > 0) {
            brand = (p as any).brands[0].name;
          }
          if (!brand && Array.isArray((p as any).meta_data)) {
            const meta = (p as any).meta_data.find((m: any) => {
              const key = String(m?.key || '').toLowerCase();
              return key === 'brand' || key === '_brand' || key.includes('product_brand') || key.includes('pwb') || key.includes('brand');
            });
            if (meta && meta.value) brand = meta.value?.name || meta.value?.value || meta.value?.slug || meta.value;
          }
          if (!brand && Array.isArray((p as any).attributes)) {
            const attr = (p as any).attributes.find((a: any) => {
              const name = String(a?.name || '').toLowerCase();
              const slug = String(a?.slug || '').toLowerCase();
              return name === 'brand' || slug === 'brand' || slug === 'pa_brand';
            });
            if (attr) brand = (Array.isArray(attr.options) ? attr.options[0] : attr.option);
          }
          if (brand) brandSet.set(String(brand).toLowerCase(), String(brand));
        }
        list = Array.from(brandSet.entries()).map(([key, value]) => ({ id: key, name: value }));
      }

      setBrands(list);
    } catch (e: any) {
      setError(e?.message || 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, []);

  return { brands, loading, error, refetch };
}
