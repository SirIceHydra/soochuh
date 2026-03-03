// Shop module exports
export { ShopProvider, useShopConfig } from './core/ShopProvider';
export { CartProvider, useCart } from './core/cart/CartContext';
export { WooCommerceDataProvider } from './adapters/catalog/woocommerce';
export { useProducts } from './core/hooks/useProducts';
export { useCategories } from './core/hooks/useCategories';
export { useBrands } from './core/hooks/useBrands';
export type { Product, ProductQuery, ShopDataProvider } from './core/ports';
