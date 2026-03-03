export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  type?: 'simple' | 'variable' | 'grouped' | 'external';
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  images: string[];
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  categories: string[];
  brand?: string;
  slug: string;
  permalink: string;
  hasVariations?: boolean;
  soldIndividually?: boolean;
  variations?: any[];
  variationAttributes?: any;
  variationAttributeSwatches?: Record<string, { type: 'color' | 'image' | 'select'; swatches: Record<string, string> }>;
  productAddons?: any[];
  customisationProfile?: { id: number | string; name: string };
  defaultAttributes?: any;
  price_range?: { min: number; max: number };
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  categoryId?: number;
  search?: string;
  orderBy?: 'date' | 'price' | 'name' | 'popularity';
  order?: 'asc' | 'desc';
  featured?: boolean;
  brand?: string;
  onSale?: boolean;
  tag?: string;
}

export interface ShopDataProvider {
  getProducts(query?: ProductQuery): Promise<{ data: Product[]; total: number; totalPages: number; currentPage: number } >;
  getProduct(id: number): Promise<Product>;
  getCategories(params?: { hideEmpty?: boolean }): Promise<Array<{ id: number; name: string; parent?: number; slug?: string }>>;
  createOrder(payload: any): Promise<{ success: boolean; orderId?: number; orderNumber?: string; error?: string }>;
  getBrands?(): Promise<Array<{ id: string; name: string }>>;
  getLinkedProducts?(productId: number): Promise<{ upsells: Product[]; crossSells: Product[]; totalUpsells: number; totalCrossSells: number }>;
}

export interface PaymentStartRequest {
  orderId: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  itemName: string;
  itemDescription?: string;
}

export interface PaymentStartResult {
  method: 'form-post' | 'redirect-url';
  url: string;
  fields?: Record<string, string>;
}

export interface PaymentProvider {
  startPayment(req: PaymentStartRequest): Promise<PaymentStartResult>;
}
