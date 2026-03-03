/** Terms to try when resolving the "kits" section (sets, bundles, etc.) */
const KITS_TERMS = ['kits', 'sets', 'bundles'];

export interface CategoryLike {
  id: number;
  name: string;
  slug?: string;
}

export function findKitsCategory(
  categories: CategoryLike[]
): { id: number; name: string; slug: string } | null {
  if (!categories?.length) return null;
  for (const term of KITS_TERMS) {
    const cat = categories.find(
      (c) =>
        c.name?.toLowerCase() === term ||
        (c.slug && c.slug.toLowerCase() === term)
    );
    if (cat) {
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
      };
    }
  }
  return null;
}
