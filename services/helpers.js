// Helper functions for Soochuh e-commerce

export function formatPrice(value) {
  try {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value || 0);
  } catch {
    return `R ${Number(value || 0).toFixed(2)}`;
  }
}

export const storage = {
  get(key) { 
    try { 
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : null; 
    } catch { 
      return null; 
    } 
  },
  set(key, val) { 
    try { 
      localStorage.setItem(key, JSON.stringify(val)); 
    } catch {} 
  },
  remove(key) { 
    try { 
      localStorage.removeItem(key); 
    } catch {} 
  },
};

/**
 * Stock: WP has "Manage stock" (stock_quantity) or "Simple" (instock/outofstock only).
 * - Simple: no stockQuantity → use only stockStatus; outofstock = false, else true.
 * - Manage: has stockQuantity → outofstock or qty <= 0 = false, else true.
 */
export function isProductInStock(stockStatus, stockQuantity) {
  const s = String(stockStatus || '').toLowerCase().replace(/\s+/g, '');
  if (s === 'outofstock') return false;
  if (stockQuantity === undefined || stockQuantity === null) return true;
  return Number(stockQuantity) > 0;
}

export function getStockStatusText(stockStatus, stockQuantity) {
  switch (stockStatus) {
    case 'instock': return stockQuantity ? `${stockQuantity} in stock` : 'In stock';
    case 'outofstock': return 'Out of stock';
    case 'onbackorder': return 'On backorder';
    default: return 'Stock status unknown';
  }
}

/**
 * Returns true if the product has no stock available.
 * - Simple: out of stock or stockQuantity <= 0
 * - Variable: ALL variations are out of stock
 */
export function isProductFullyOutOfStock(product) {
  if (!product) return false;
  const hasVariations = product.type === 'variable' || product.hasVariations;
  const variations = product.variations;

  if (hasVariations && Array.isArray(variations) && variations.length > 0) {
    const anyInStock = variations.some((v) =>
      isProductInStock(v.stockStatus, v.stockQuantity)
    );
    return !anyInStock;
  }

  return !isProductInStock(product.stockStatus, product.stockQuantity);
}

// Cart helpers
export function calculateCartTotal(items) {
  try { 
    return (items || []).reduce((sum, i) => sum + (Number(i.price || 0) * Number(i.quantity || 0)), 0); 
  } catch { 
    return 0; 
  }
}

export function calculateCartItemCount(items) {
  try { 
    return (items || []).reduce((sum, i) => sum + Number(i.quantity || 0), 0); 
  } catch { 
    return 0; 
  }
}

export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Checkout validation
export function validateCheckoutForm(formData, deliveryMethod = 'shipping') {
  const errors = {};
  if (!formData?.firstName?.trim()) errors.firstName = 'First name is required';
  if (!formData?.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!formData?.email?.trim()) errors.email = 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData?.email && !emailRegex.test(formData.email)) errors.email = 'Valid email is required';
  if (!formData?.phone?.trim()) errors.phone = 'Phone number is required';
  
  // Only validate address fields if shipping is selected
  if (deliveryMethod === 'shipping') {
    if (!formData?.address?.trim()) errors.address = 'Address is required';
    if (!formData?.city?.trim()) errors.city = 'City is required';
    if (!formData?.postalCode?.trim()) errors.postalCode = 'Postal code is required';
    if (!formData?.country?.trim()) errors.country = 'Country is required';
    if (!formData?.province?.trim()) errors.province = 'Province is required';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}

// WooCommerce -> App product transforms
export function transformWooCommerceProduct(woo) {
  if (!woo) return null;
  // attempt to derive brand from brands array or attributes if present
  let brand = woo.brand; // prefer server-provided brand from WordPress endpoint
  if (Array.isArray(woo.brands) && woo.brands.length > 0) {
    brand = woo.brands[0].name;
  } else if (Array.isArray(woo.attributes)) {
    const attr = woo.attributes.find(a => {
      const name = (a?.name || '').toLowerCase();
      const slug = (a?.slug || '').toLowerCase();
      return name === 'brand' || slug === 'brand' || slug === 'pa_brand';
    });
    if (attr) {
      if (Array.isArray(attr.options) && attr.options.length > 0) {
        brand = attr.options[0];
      } else if (typeof attr.option === 'string' && attr.option) {
        brand = attr.option;
      }
    }
  }
  const price = parseFloat(woo.price || woo.regular_price || '0') || 0;
  const regularPrice = parseFloat(woo.regular_price || woo.price || '0') || 0;
  const salePrice = woo.sale_price ? parseFloat(woo.sale_price) : undefined;
  // Transform variations if present from WP backend
  // Normalize attributes so both 'pa_xxx' and 'attribute_pa_xxx' keys work with variationAttributes
  let variations = undefined;
  if (Array.isArray(woo.variations)) {
    variations = woo.variations.map(v => {
      const raw = v.attributes || {};
      const attrs = { ...raw };
      Object.keys(raw).forEach(k => {
        if (k.startsWith('attribute_')) attrs[k.replace(/^attribute_/, '')] = raw[k];
      });
      const s = String(v.stock_status || 'instock').toLowerCase().replace(/\s+/g, '');
      const stockStatus = s === 'outofstock' ? 'outofstock' : (s === 'onbackorder' ? 'onbackorder' : 'instock');
      const q = v.stock_quantity;
      const stockQuantity = (q != null && q !== '' && !isNaN(Number(q))) ? Number(q) : undefined;
      return {
        id: v.id,
        sku: v.sku,
        price: parseFloat(v.price || v.regular_price || '0') || 0,
        regularPrice: parseFloat(v.regular_price || v.price || '0') || 0,
        salePrice: v.sale_price ? parseFloat(v.sale_price) : undefined,
        onSale: Boolean(v.on_sale),
        stockStatus,
        stockQuantity,
        attributes: attrs,
        image: v?.image?.src || (v?.image && typeof v.image === 'string' ? v.image : undefined),
        displayName: Object.values(raw).filter(Boolean).join(' / ') || undefined
      };
    });
  }

  // Variation attributes: ALWAYS derive from variations when present (source of truth).
  // get_variation_attributes() is unreliable with multiple attributes (colour + size).
  let variationAttributes = woo.variation_attributes || woo.variationAttributes || undefined;
  if (Array.isArray(woo.variations) && woo.variations.length > 0) {
    const derived = {};
    for (const v of woo.variations) {
      const raw = v.attributes || {};
      for (const key of Object.keys(raw)) {
        const k = key.replace(/^attribute_/, '');
        const val = raw[key];
        if (val != null && val !== '') {
          const s = String(val).trim();
          if (!s) continue;
          if (!derived[k]) derived[k] = new Set();
          derived[k].add(s);
        }
      }
    }
    const fromVariations = Object.fromEntries(
      Object.entries(derived).map(([k, set]) => [k, Array.from(set)])
    );
    if (Object.keys(fromVariations).length > 0) {
      variationAttributes = fromVariations;
    }
  }
  const defaultAttributes = woo.default_attributes || woo.defaultAttributes || undefined;
  const variationAttributeSwatches = woo.variation_attribute_swatches || woo.variationAttributeSwatches || undefined;
  const productAddons = woo.product_addons || undefined;
  const customisationProfile = woo.customisation_profile || undefined;

  return {
    id: woo.id,
    name: woo.name,
    description: woo.description || '',
    shortDescription: (woo.short_description || '').replace(/<[^>]*>/g, ''),
    type: woo.type || undefined,
    price,
    regularPrice,
    salePrice,
    onSale: Boolean(woo.on_sale),
    images: Array.isArray(woo.images) ? woo.images.map(i => i.src) : [],
    stockStatus: woo.stock_status || 'instock',
    stockQuantity: typeof woo.stock_quantity === 'number' ? woo.stock_quantity : undefined,
    categories: Array.isArray(woo.categories) ? woo.categories.map(c => c.name) : [],
    brand,
    slug: woo.slug,
    permalink: woo.permalink,
    hasVariations: woo.has_variations || woo.type === 'variable' || false,
    variations,
    variationAttributes,
    variationAttributeSwatches,
    productAddons,
    customisationProfile,
    defaultAttributes,
    soldIndividually: Boolean(woo.sold_individually),
    price_range: woo.price_range && typeof woo.price_range.min === 'number' && typeof woo.price_range.max === 'number'
      ? { min: woo.price_range.min, max: woo.price_range.max }
      : undefined,
  };
}

export function transformWooCommerceProducts(list) {
  return Array.isArray(list) ? list.map(transformWooCommerceProduct) : [];
}



