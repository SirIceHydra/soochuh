import React, { useState, useEffect } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import type { Product } from '../core/ports';
import { useCart } from '../core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText, isProductFullyOutOfStock } from '../../services/helpers';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onViewDetails, className = '' }: ProductCardProps) {
  const { addToCart, isInCart, getCartItemQuantity, error: cartError, clearError } = useCart();
  const [imageLoading, setImageLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showError, setShowError] = useState(false);
  const cartQuantity = getCartItemQuantity(product.id);
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  const isInStock = isProductInStock(product.stockStatus, remainingStock);
  const isFullyOutOfStock = isProductFullyOutOfStock(product);
  const isInCartState = isInCart(product.id);

  const handleAddToCart = () => {
    if (!isInStock) return;
    setAddingToCart(true);
    setShowError(false);
    clearError();
    try { 
      addToCart(product, 1); 
      setAddingToCart(false);
    } catch (err) {
      setShowError(true);
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    if (cartError && cartError.includes(product.name)) {
      setShowError(true);
    } else if (!cartError) {
      setShowError(false);
    }
  }, [cartError, product.name]);

  return (
    <div className={`group cursor-pointer flex flex-col gap-4 ${className}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm">
        <button 
          onClick={() => onViewDetails?.(product)} 
          className="absolute inset-0 w-full h-full"
          aria-label="View details"
        >
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </button>
        
        {product.onSale && (
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg animate-pulse">
              Sale
            </span>
          </div>
        )}
        {isFullyOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
            <span className="bg-zinc-900 text-white text-xs font-black px-4 py-2 uppercase tracking-widest">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-black text-base leading-tight font-display uppercase tracking-tight group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex flex-col items-end">
            {product.onSale && product.salePrice ? (
              <>
                <span className="font-bold text-red-600 text-sm">R{product.salePrice.toFixed(2)}</span>
                <span className="font-medium text-gray-400 text-xs line-through">R{product.regularPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold text-black text-sm bg-gray-100 px-2 py-0.5 rounded-sm">R{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">
          {product.categories?.[0] || 'Product'}
        </p>
      </div>

      <div className="mt-auto">
        {product.type === 'variable' || product.hasVariations ? (
          <button 
            className="w-full bg-black text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-purple-600 transition-colors"
            onClick={() => onViewDetails?.(product)}
          >
            See options
          </button>
        ) : (
          <button 
            className="w-full bg-black text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleAddToCart} 
            disabled={!isInStock || addingToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {addingToCart ? 'Adding…' : (isInStock ? (isInCartState ? `In Cart (${cartQuantity})` : 'Add to cart') : 'Out of stock')}
            </span>
          </button>
        )}
      </div>
      
      {showError && cartError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-xs">{cartError}</p>
            <button 
              onClick={() => { setShowError(false); clearError(); }} 
              className="text-red-600 hover:text-red-800 text-xs ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompactProductCard({ product, onAddToCart, className = '' }: { product: Product; onAddToCart?: (p: Product) => void; className?: string; }) {
  const { addToCart, getCartItemQuantity, error: cartError, clearError } = useCart();
  const cartQuantity = getCartItemQuantity(product.id);
  const remainingStock = product.stockQuantity !== undefined ? product.stockQuantity - cartQuantity : undefined;
  const isInStock = isProductInStock(product.stockStatus, remainingStock);
  const isFullyOutOfStock = isProductFullyOutOfStock(product);
  const [imageLoading, setImageLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = () => {
    if (!isInStock) return;
    setAddingToCart(true);
    setShowError(false);
    clearError();
    try {
      addToCart(product, 1);
      if (onAddToCart) onAddToCart(product);
      setAddingToCart(false);
    } catch (err) {
      setShowError(true);
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    if (cartError && cartError.includes(product.name)) {
      setShowError(true);
    } else if (!cartError) {
      setShowError(false);
    }
  }, [cartError, product.name]);

  return (
    <div className={`group bg-white shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col h-full ${className}`}>
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={product.images[0] || '/placeholder-product.jpg'} 
          alt={product.name} 
          className={`w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
          onLoad={() => setImageLoading(false)} 
          onError={() => setImageLoading(false)} 
        />
        {product.onSale && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        {isFullyOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
            <span className="bg-zinc-900 text-white text-xs font-black px-3 py-1.5 uppercase tracking-widest">
              Out of stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {product.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0,2).map((c,i) => (
              <span key={i} className="text-xs bg-black text-white px-2 py-1 font-medium">
                {c}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-medium text-black text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-lg font-bold text-black">
                R{product.salePrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                R{product.regularPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-black">
              R{product.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex-1"></div>
        {product.type === 'variable' || product.hasVariations ? (
          <button 
            onClick={() => onAddToCart ? onAddToCart(product) : undefined}
            className="w-full py-3 px-4 font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-purple-600 transition-colors"
          >
            See options
          </button>
        ) : (
          <button 
            onClick={handleAddToCart} 
            disabled={!isInStock || addingToCart} 
            className={`w-full py-3 px-4 font-bold text-xs uppercase tracking-widest transition-colors ${
              isInStock 
                ? 'bg-black text-white hover:bg-purple-600' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {addingToCart ? 'Adding...' : (isInStock ? 'Add to Cart' : 'Out of Stock')}
            </div>
          </button>
        )}
      </div>
      
      {showError && cartError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
          <div className="flex items-center justify-between">
            <p className="text-red-600 text-xs">{cartError}</p>
            <button 
              onClick={() => { setShowError(false); clearError(); }} 
              className="text-red-600 hover:text-red-800 text-xs ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductListItem({ product, onViewDetails, onAddToCart, className = '' }: { product: Product; onViewDetails?: (p: Product) => void; onAddToCart?: (p: Product) => void; className?: string; }) {
  const isInStock = isProductInStock(product.stockStatus, product.stockQuantity);
  const isFullyOutOfStock = isProductFullyOutOfStock(product);
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <div className={`group bg-white shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out ${className}`}>
      <div className="flex gap-6">
        <div className="relative w-32 h-32 bg-gray-100 overflow-hidden flex-shrink-0">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={product.images[0] || '/placeholder-product.jpg'} 
            alt={product.name} 
            className={`w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
            onLoad={() => setImageLoading(false)} 
            onError={() => setImageLoading(false)} 
          />
          {isFullyOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
              <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                Out of stock
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.categories.slice(0,3).map((c,i) => (
                <span key={i} className="text-xs bg-black text-white px-2 py-1 font-medium">
                  {c}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-semibold text-black mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center gap-3 mb-3">
            {product.onSale && product.salePrice ? (
              <>
                <span className="text-xl font-bold text-black">
                  R{product.salePrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  R{product.regularPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-black">
                R{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex-1"></div>
          <div className="flex gap-3">
            <button 
              onClick={() => onViewDetails?.(product)} 
              className="text-sm text-black font-bold uppercase tracking-widest px-4 py-2 border border-black hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-colors"
            >
              View Details
            </button>
            {(product.type === 'variable' || product.hasVariations) ? (
              <button 
                onClick={() => onViewDetails?.(product)} 
                className="text-sm font-bold uppercase tracking-widest px-6 py-2 bg-black text-white hover:bg-purple-600 transition-colors"
              >
                See options
              </button>
            ) : (
              <button 
                onClick={() => isInStock && onAddToCart?.(product)} 
                disabled={!isInStock} 
                className={`text-sm font-bold uppercase tracking-widest px-6 py-2 transition-colors ${
                  isInStock 
                    ? 'bg-black text-white hover:bg-purple-600' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
