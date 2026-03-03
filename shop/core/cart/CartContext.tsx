import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, calculateCartTotal, calculateCartItemCount, generateUniqueId } from '../../../services/helpers';
import { DEFAULTS, ERROR_MESSAGES } from '../../../services/constants';

/** Addon values keyed by addon label (e.g. "Embroidery Line 1", "Logo (PNG)"). Values are text or uploaded image URL. */
export type ProductAddons = Record<string, string>;

type CartItem = {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  variationId?: number;
  variationName?: string;
  variationAttributes?: any;
  bundleSelections?: any[];
  soldIndividually?: boolean;
  embroideryName?: string;
  productAddons?: ProductAddons;
};

type Cart = { items: CartItem[]; total: number; itemCount: number };

type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
  stockQuantity?: number;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  type?: string;
  variations?: any[];
  soldIndividually?: boolean;
};

interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number, variationId?: number, variationName?: string, bundleSelections?: any[], variationAttributes?: any, customOptions?: { embroideryName?: string; productAddons?: ProductAddons; addonFee?: number }) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  updateCartItemById: (itemId: string, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  removeCartItemById: (itemId: string) => void;
  clearCart: () => void;
  getCartItem: (productId: number) => CartItem | undefined;
  isInCart: (productId: number) => boolean;
  getCartItemQuantity: (productId: number) => number;
  clearError: () => void;
  // Global popup state
  popupOpen: boolean;
  popupMessage: string;
  showPopup: (message: string) => void;
  hidePopup: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = storage.get(DEFAULTS.CART_STORAGE_KEY);
    if (savedCart && savedCart.items) {
      // Recalculate totals in case cart structure changed
      return {
        items: savedCart.items,
        total: calculateCartTotal(savedCart.items),
        itemCount: calculateCartItemCount(savedCart.items)
      };
    }
    return { items: [], total: 0, itemCount: 0 };
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  useEffect(() => {
    storage.set(DEFAULTS.CART_STORAGE_KEY, cart);
  }, [cart]);

  const showPopup = useCallback((message: string) => {
    setPopupMessage(message);
    setPopupOpen(true);
  }, []);
  
  const hidePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1, variationId?: number, variationName?: string, bundleSelections?: any[], variationAttributes?: any, customOptions?: { embroideryName?: string; productAddons?: ProductAddons; addonFee?: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      // For variable products with variations, use the variation data
      let effectivePrice = product.price;
      let effectiveStockStatus = product.stockStatus;
      let effectiveStockQuantity = product.stockQuantity;
      let effectiveImage = product.images[0] || '';
      let effectiveName = product.name;
      let effectiveSoldIndividually = product.soldIndividually;
      
      // If this is a variation, find the variation details
      if (variationId && product.type === 'variable' && product.variations) {
        const variation = product.variations.find(v => v.id === variationId);
        if (variation) {
          effectivePrice = variation.price;
          effectiveStockStatus = variation.stockStatus;
          effectiveStockQuantity = variation.stockQuantity;
          effectiveImage = variation.image || product.images[0] || '';
          effectiveName = `${product.name} - ${variationName || variation.displayName}`;
          effectiveSoldIndividually = variation.soldIndividually;
        }
      }
      
      // Addon fee (Scrub Customisation: line_1, line_2, logo)
      if (customOptions?.addonFee) {
        effectivePrice = (Number(effectivePrice) || 0) + (customOptions.addonFee || 0);
      } else if (customOptions?.embroideryName) {
        effectivePrice = (Number(effectivePrice) || 0) + 100;
      }
      
      // VALIDATE using LIVE product data (not stale cart data)
      if (effectiveStockStatus === 'outofstock') {
        setError(ERROR_MESSAGES.PRODUCT_OUT_OF_STOCK);
        setLoading(false);
        return;
      }
      
      if (effectiveStockQuantity !== undefined && quantity > effectiveStockQuantity) {
        setError(`Only ${effectiveStockQuantity} items available in stock.`);
        setLoading(false);
        return;
      }
      
      // Check if item already in cart and validate new total quantity
      setCart(prevCart => {
        const addonKey = customOptions?.productAddons ? JSON.stringify(customOptions.productAddons) : '';
        const existingItem = prevCart.items.find(item => {
          if (variationId) {
            if (item.productId !== product.id || item.variationId !== variationId) return false;
          } else {
            if (item.productId !== product.id || item.variationId) return false;
          }
          const itemAddonKey = item.productAddons ? JSON.stringify(item.productAddons) : '';
          return addonKey === itemAddonKey;
        });
        
        // Check sold individually restriction
        if (effectiveSoldIndividually) {
          if (existingItem && existingItem.quantity >= 1) {
            setError('This item can only be purchased once per order.');
            setLoading(false);
            return prevCart; // Return unchanged cart
          }
          // Also check if trying to add more than 1 of a sold individually item
          if (quantity > 1) {
            setError('This item can only be purchased once per order.');
            setLoading(false);
            return prevCart; // Return unchanged cart
          }
        }
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (effectiveStockQuantity !== undefined && newQuantity > effectiveStockQuantity) {
            setError(`Cannot add ${quantity} more. Only ${effectiveStockQuantity - existingItem.quantity} more available.`);
            setLoading(false);
            return prevCart; // Return unchanged cart
          }
        }
        
        // Safe to update cart now
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          const updatedItems = prevCart.items.map(item => {
            const itemAddonKey = item.productAddons ? JSON.stringify(item.productAddons) : '';
            const match = (variationId ? (item.productId === product.id && item.variationId === variationId) : (item.productId === product.id && !item.variationId)) && addonKey === itemAddonKey;
            return match ? { ...item, quantity: newQuantity } : item;
          });
          // Show popup for quantity update
          showPopup(effectiveName);
          return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
        } else {
          const newItem: CartItem = {
            id: generateUniqueId(),
            productId: product.id,
            name: effectiveName,
            price: effectivePrice,
            quantity,
            image: effectiveImage,
            stockQuantity: effectiveStockQuantity,
            stockStatus: effectiveStockStatus,
            variationId,
            variationName,
            variationAttributes,
            bundleSelections,
            soldIndividually: effectiveSoldIndividually,
            embroideryName: customOptions?.embroideryName,
            productAddons: customOptions?.productAddons,
          };
          const newItems = [...prevCart.items, newItem];
          // Show popup for new item
          showPopup(effectiveName);
          return { items: newItems, total: calculateCartTotal(newItems), itemCount: calculateCartItemCount(newItems) };
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showPopup]);

  const removeFromCart = useCallback((productId: number) => {
    setLoading(true);
    setError(null);
    try {
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(i => i.productId !== productId);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback((productId: number, quantity: number) => {
    setLoading(true);
    setError(null);
    
    try {
      if (quantity <= 0) { 
        removeFromCart(productId); 
        return; 
      }
      
      setCart(prevCart => {
        const item = prevCart.items.find(i => i.productId === productId);
        if (!item) {
          setError('Item not found in cart');
          setLoading(false);
          return prevCart;
        }
        
        // Check sold individually restriction
        if (item.soldIndividually && quantity > 1) {
          setError('This item can only be purchased once per order.');
          setLoading(false);
          return prevCart;
        }
        
        if (item.stockQuantity !== undefined && quantity > item.stockQuantity) {
          setError(`Only ${item.stockQuantity} items available in stock`);
          setLoading(false);
          return prevCart;
        }
        
        const updatedItems = prevCart.items.map(i => i.productId === productId ? { ...i, quantity } : i);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [removeFromCart]);

  const removeCartItemById = useCallback((itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(i => i.id !== itemId);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItemById = useCallback((itemId: string, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      if (quantity <= 0) {
        removeCartItemById(itemId);
        return;
      }
      setCart(prevCart => {
        const item = prevCart.items.find(i => i.id === itemId);
        if (!item) {
          setError('Item not found in cart');
          setLoading(false);
          return prevCart;
        }
        if (item.soldIndividually && quantity > 1) {
          setError('This item can only be purchased once per order.');
          setLoading(false);
          return prevCart;
        }
        if (item.stockQuantity !== undefined && quantity > item.stockQuantity) {
          setError(`Only ${item.stockQuantity} items available in stock`);
          setLoading(false);
          return prevCart;
        }
        const updatedItems = prevCart.items.map(i => i.id === itemId ? { ...i, quantity } : i);
        return { items: updatedItems, total: calculateCartTotal(updatedItems), itemCount: calculateCartItemCount(updatedItems) };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [removeCartItemById]);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0, itemCount: 0 });
  }, []);

  const getCartItem = useCallback((productId: number): CartItem | undefined => cart.items.find(i => i.productId === productId), [cart.items]);
  const isInCart = useCallback((productId: number): boolean => cart.items.some(i => i.productId === productId), [cart.items]);
  const getCartItemQuantity = useCallback((productId: number): number => (cart.items.find(i => i.productId === productId)?.quantity ?? 0), [cart.items]);
  const clearError = useCallback(() => setError(null), []);

  const value: CartContextType = { 
    cart, 
    loading, 
    error, 
    addToCart, 
    updateCartItem, 
    updateCartItemById,
    removeFromCart,
    removeCartItemById, 
    clearCart, 
    getCartItem, 
    isInCart, 
    getCartItemQuantity, 
    clearError,
    popupOpen,
    popupMessage,
    showPopup,
    hidePopup
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
