import { apiGet, apiGetWithHeaders, apiPost, apiPut } from './api';
import { transformWooCommerceProducts, transformWooCommerceProduct } from './helpers';

export async function getProducts(params = {}) {
  try {
    // Filter out undefined values to prevent 400 errors
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    // Use headers to extract pagination info
    const { data: raw, headers } = await apiGetWithHeaders('/products', filteredParams);
    
    // SECURITY UPDATE: Handle WordPress backend response format (from functions.php)
    // functions.php returns: {success: true, data: [...], total: N}
    let productsArray = raw;
    if (raw && typeof raw === 'object' && raw.success && Array.isArray(raw.data)) {
      productsArray = raw.data;
    } else if (!Array.isArray(raw)) {
      // If not the expected format, log and return empty
      console.error('getProducts: Unexpected response format', raw);
      return { data: [], total: 0, totalPages: 1, currentPage: filteredParams.page || 1 };
    }
    
    const data = transformWooCommerceProducts(productsArray);
    
    // Use WordPress response total or fallback to data length
    const total = raw && raw.total ? raw.total : (parseInt(headers['x-wp-total'] || headers['X-WP-Total'] || data.length, 10));
    const totalPages = parseInt(headers['x-wp-totalpages'] || headers['X-WP-TotalPages'] || '1', 10);
    return { data, total, totalPages, currentPage: filteredParams.page || 1 };
  } catch (error) {
    console.error('getProducts error:', error.message);
    return { data: [], total: 0, totalPages: 1, currentPage: params.page || 1 };
  }
}

// Raw products without transform (useful for metadata discovery like attributes)
export async function getRawProducts(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const { data, headers } = await apiGetWithHeaders('/products', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: [...], total: 5}
  let productsArray = data;
  if (data && typeof data === 'object' && data.success && Array.isArray(data.data)) {
    productsArray = data.data;
  }
  
  const total = data && data.total ? data.total : (parseInt(headers['x-wp-total'] || headers['X-WP-Total'] || productsArray.length, 10));
  const totalPages = parseInt(headers['x-wp-totalpages'] || headers['X-WP-TotalPages'] || '1', 10);
  return { data: productsArray, total, totalPages, currentPage: filteredParams.page || 1 };
}

export async function getProduct(id, params = {}) { 
  const r = await apiGet(`/products/${id}`, params); 
  console.log('[Product Load] API response:', { productId: id, response: r });
  
  // SECURITY UPDATE: Handle WordPress backend response format
  // WordPress returns: {success: true, data: {...}} or just the product object
  let productData = r;
  if (r && typeof r === 'object' && r.success && r.data) {
    productData = r.data;
  }
  
  return transformWooCommerceProduct(productData); 
}

export async function getBrands(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet('/products/brands', filteredParams);
  // WordPress returns: {success: true, data: [...]} or just the array
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  return r;
}

export async function getCategories(params = {}) { 
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    const r = await apiGet('/products/categories', filteredParams);
    
    // Handle WordPress backend response format (from functions.php)
    // functions.php returns: {success: true, data: [...], total: N}
    if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
      return r.data;
    }
    
    // If r is already an array, return it
    if (Array.isArray(r)) {
      return r;
    }
    
    // If r is an object with data property that's an array
    if (r && typeof r === 'object' && Array.isArray(r.data)) {
      return r.data;
    }
    
    // Fallback: return empty array if we can't parse the response
    console.warn('getCategories: Unexpected response format', r);
    return [];
  } catch (error) {
    console.error('getCategories error:', error.message);
    // Return empty array on error so the app doesn't crash
    return [];
  }
}

export async function createOrder(orderData) { 
  const r = await apiPost('/orders', orderData); 
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success) {
    return { 
      success: true, 
      orderId: r.order_id || r.id, 
      orderNumber: r.order_number || r.number 
    };
  }
  
  return { success: true, orderId: r.id, orderNumber: r.number }; 
}

export async function updateOrderStatus(orderId, status) { 
  return await apiPut(`/orders/${orderId}`, { status }); 
}

// Brand helpers using WooCommerce attributes (e.g., attribute with slug 'brand')
export async function getProductAttributes(params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet('/products/attributes', filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  
  return r;
}

export async function getProductAttributeTerms(attributeId, params = {}) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  );
  const r = await apiGet(`/products/attributes/${attributeId}/terms`, filteredParams);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
    return r.data;
  }
  
  return r;
}

// Search suggestions for navbar autocomplete
export async function getSearchSuggestions(q) {
  if (!q || String(q).trim().length < 2) {
    return { products: [], categories: [], tags: [], attributes: [] };
  }
  const empty = { products: [], categories: [], tags: [], attributes: [] };
  try {
    const r = await apiGet('/products/search-suggestions', { q: String(q).trim() });
    if (r && typeof r === 'object') {
      const data = r.data ?? r;
      if (data && typeof data === 'object') {
        return {
          products: Array.isArray(data.products) ? data.products : [],
          categories: Array.isArray(data.categories) ? data.categories : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          attributes: Array.isArray(data.attributes) ? data.attributes : [],
        };
      }
    }
    // Fallback: fetch products by search if suggestions endpoint fails
    const { data } = await getProducts({ search: String(q).trim(), perPage: 5 });
    if (data && data.length > 0) {
      return {
        products: data.map((p) => ({ id: p.id, name: p.name, image: p.images?.[0] || null, type: 'product' })),
        categories: [],
        tags: [],
        attributes: [],
      };
    }
    return empty;
  } catch (err) {
    console.warn('getSearchSuggestions error:', err?.message);
    try {
      const { data } = await getProducts({ search: String(q).trim(), perPage: 5 });
      if (data && data.length > 0) {
        return {
          products: data.map((p) => ({ id: p.id, name: p.name, image: p.images?.[0] || null, type: 'product' })),
          categories: [],
          tags: [],
          attributes: [],
        };
      }
    } catch (_) {}
    return empty;
  }
}

// Product colours (colour attribute terms with hex for frontend display)
export async function getColours() {
  try {
    const r = await apiGet('/products/colours');
    if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
      return r.data;
    }
    return [];
  } catch (err) {
    console.warn('getColours error:', err?.message);
    return [];
  }
}

// Get linked products (upsells and cross-sells)
export async function getLinkedProducts(productId) {
  const r = await apiGet(`/products/${productId}/linked`);
  
  // SECURITY UPDATE: Handle WordPress backend response format
  if (r && typeof r === 'object' && r.success) {
    const upsells = transformWooCommerceProducts(r.upsells || []);
    const crossSells = transformWooCommerceProducts(r.cross_sells || []);
    return { 
      upsells, 
      crossSells,
      totalUpsells: r.total_upsells || upsells.length,
      totalCrossSells: r.total_cross_sells || crossSells.length
    };
  }
  
  return { upsells: [], crossSells: [], totalUpsells: 0, totalCrossSells: 0 };
}

// Slideshow (Meta Slider – hero slides)
export async function getSlideshow() {
  try {
    const r = await apiGet('/slideshow');
    if (r && typeof r === 'object' && r.success && Array.isArray(r.data)) {
      return { data: r.data, total: r.total ?? r.data.length };
    }
    return { data: [], total: 0 };
  } catch (err) {
    console.warn('getSlideshow error:', err?.message);
    return { data: [], total: 0 };
  }
}
