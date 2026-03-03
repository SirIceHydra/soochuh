import { ShopDataProvider, ProductQuery } from '../../core/ports';
import { getProducts, getProduct, getCategories as wcGetCategories, createOrder, getBrands as wcGetBrands, getLinkedProducts as wcGetLinkedProducts } from '../../../services/woocommerce';

export const WooCommerceDataProvider: ShopDataProvider = {
  async getProducts(query?: ProductQuery) {
    
    let orderby = query?.orderBy;
    let perPage = query?.perPage;
    
    if (orderby === 'popularity') {
      orderby = 'date';
      perPage = Math.max(perPage || 12, 20);
    }
    
    const params: any = {};
    if (query?.page !== undefined) params.page = query.page;
    if (perPage !== undefined) params.per_page = perPage;
    
    if (query?.categoryId !== undefined) {
      params.category = query.categoryId.toString();
    }
    
    if (query?.search !== undefined && query.search !== '') params.search = query.search;
    if (orderby !== undefined) params.orderby = orderby;
    if (query?.order !== undefined) params.order = query.order;
    if (query?.featured !== undefined) params.featured = query.featured === true ? 'true' : query.featured;
    if (query?.brand !== undefined && query.brand !== '') params.brand = query.brand;
    if (query?.onSale === true) params.onSale = 'true';
    if (query?.tag !== undefined && query.tag !== '') params.tag = query.tag;
    
    const resp = await getProducts(params);
    
    if (query?.orderBy === 'popularity') {
      resp.data.sort((a, b) => {
        if (a.onSale && !b.onSale) return -1;
        if (!a.onSale && b.onSale) return 1;
        return a.price - b.price;
      });
      
      if (query?.perPage && resp.data.length > query.perPage) {
        resp.data = resp.data.slice(0, query.perPage);
      }
    }
    
    if (query?.orderBy === 'price') {
      resp.data.sort((a, b) => {
        const priceA = parseFloat(a.price.toString());
        const priceB = parseFloat(b.price.toString());
        
        if (query?.order === 'asc') {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
      
      if (query?.perPage && resp.data.length > query.perPage) {
        resp.data = resp.data.slice(0, query.perPage);
      }
    }
    
    if (query?.orderBy !== 'price' && (query?.order === 'asc' || query?.order === 'desc') && resp.data.length > 0) {
      resp.data.sort((a, b) => {
        const priceA = parseFloat(a.price.toString());
        const priceB = parseFloat(b.price.toString());
        
        if (query?.order === 'asc') {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
    }
    
    return resp;
  },
  async getProduct(id: number) {
    return getProduct(id, { include_variations: true });
  },
  async getCategories() {
    try {
      const cats = await wcGetCategories({ hide_empty: false, per_page: 200 });
      // Handle WordPress backend response format (from functions.php)
      // functions.php returns: {success: true, data: [...], total: N}
      let categoriesArray = [];
      if (Array.isArray(cats)) {
        categoriesArray = cats;
      } else if (cats && typeof cats === 'object' && cats.success && Array.isArray(cats.data)) {
        categoriesArray = cats.data;
      } else if (cats && typeof cats === 'object' && Array.isArray(cats.data)) {
        categoriesArray = cats.data;
      }
      return categoriesArray.map((c: any) => ({ id: c.id, name: c.name, parent: c.parent, slug: c.slug }));
    } catch (error) {
      console.error('WooCommerceDataProvider.getCategories error:', error);
      return [];
    }
  },
  async createOrder(payload: any) {
    return createOrder(payload);
  },
  async getBrands() {
    const brands = await wcGetBrands({ per_page: 200, hide_empty: false });
    return brands.map((b: any) => ({ id: b.slug || String(b.id), name: b.name }));
  },
  async getLinkedProducts(productId: number) {
    return wcGetLinkedProducts(productId);
  },
};

export {};
