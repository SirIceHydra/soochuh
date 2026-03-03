import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { WooCommerceDataProvider } from '../adapters/catalog/woocommerce';
import { useCart } from '../core/cart/CartContext';
import { formatPrice, isProductInStock } from '../../services/helpers';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { VariationSelector } from '../ui/VariationSelector';
import { ProductCustomisationFields, calculateAddonFee, type AddonValues } from '../ui/ScrubCustomisationFields';
import { uploadScrubLogo } from '../../services/logoUpload';
import type { Product } from '../core/ports';

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getCartItemQuantity, cart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<{
    id: number;
    price: number;
    regularPrice?: number;
    salePrice?: number;
    onSale?: boolean;
    stockStatus: string;
    stockQuantity?: number;
    attributes: Record<string, string>;
    image?: string;
    displayName?: string;
  } | null>(null);
  const [addonValues, setAddonValues] = useState<AddonValues>({});
  const [hasAnyVariationSelection, setHasAnyVariationSelection] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSelectedVariation(null);
        setHasAnyVariationSelection(false);
        setAddonValues({});
        const productData = await WooCommerceDataProvider.getProduct(Number(id));
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.productAddons && product.productAddons.length > 0) {
      console.log('[DetailsPage] Product addons loaded:', {
        productId: product.id,
        productName: product.name,
        customisationProfile: product.customisationProfile,
        productAddons: product.productAddons,
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
          if (v === 'collection') navigate('/shop');
          else if (typeof v === 'string') navigate(`/${v}`);
        }} />
        <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 flex justify-center items-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
          if (v === 'collection') navigate('/shop');
          else if (typeof v === 'string') navigate(`/${v}`);
        }} />
        <div className="pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 text-center">
            <h1 className="text-4xl font-black font-display mb-4">Product Not Found</h1>
            <p className="text-zinc-500 mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Link 
              to="/shop" 
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasVariable = Boolean(product.hasVariations && product.variations && product.variations.length > 0);
  const variationAttributes: Record<string, string[]> = (() => {
    const va = product.variationAttributes || {};
    let out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(va)) {
      out[k] = Array.isArray(v) ? v.map(String) : (typeof v === 'string' ? (v.includes('|') ? v.split('|').map(s => s.trim()) : [v]) : []);
    }
    if (Object.keys(out).length === 0 && product.variations?.length) {
      const derived: Record<string, Set<string>> = {};
      for (const v of product.variations) {
        const attrs = v.attributes || {};
        for (const [key, val] of Object.entries(attrs)) {
          const k = String(key).replace(/^attribute_/, '');
          if (val != null && val !== '') {
            const s = String(val).trim();
            if (!s) continue;
            if (!derived[k]) derived[k] = new Set();
            derived[k].add(s);
          }
        }
      }
      out = Object.fromEntries(Object.entries(derived).map(([k, set]) => [k, Array.from(set)]));
    }
    return out;
  })();
  const variationAttributeSwatches = product.variationAttributeSwatches;

  const basePrice = hasVariable && selectedVariation
    ? (selectedVariation.onSale && selectedVariation.salePrice != null ? selectedVariation.salePrice : selectedVariation.price)
    : (product.onSale && product.salePrice != null ? product.salePrice : product.price);
  const baseRegularPrice = hasVariable && selectedVariation
    ? (selectedVariation.regularPrice ?? selectedVariation.price)
    : product.regularPrice;
  const addonFee = product.productAddons?.length
    ? calculateAddonFee(product.productAddons as any[], addonValues)
    : 0;
  const effectivePrice = (Number(basePrice) || 0) + addonFee;
  const effectiveRegularPrice = (Number(baseRegularPrice) || 0) + addonFee;
  const effectiveOnSale = hasVariable && selectedVariation
    ? Boolean(selectedVariation.onSale)
    : product.onSale;
  const effectiveStockStatus = hasVariable && selectedVariation
    ? selectedVariation.stockStatus
    : product.stockStatus;
  const effectiveStockQty = hasVariable && selectedVariation
    ? selectedVariation.stockQuantity
    : product.stockQuantity;
  const cartQtyForProduct = getCartItemQuantity(product.id);
  const remainingStock = effectiveStockQty !== undefined ? effectiveStockQty - cartQtyForProduct : undefined;
  const inStock = isProductInStock(effectiveStockStatus, remainingStock);
  const canAddToCart = hasVariable ? Boolean(selectedVariation && inStock) : inStock;

  const hasMultipleImages = !(hasVariable && selectedVariation?.image) && Boolean(product.images && product.images.length > 1);
  const mainImageSrc = (hasVariable && selectedVariation?.image)
    ? selectedVariation.image
    : (product.images[currentImageIndex] || product.images[0] || '/placeholder-product.jpg');

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    setAdding(true);
    try {
      const productAddons: Record<string, string> = {};
      if (product.productAddons?.length) {
        for (const addon of product.productAddons) {
          const raw = addonValues[addon.id];
          if (raw == null) continue;
          if (typeof raw === 'string') {
            const trimmed = raw.trim();
            if (trimmed) productAddons[addon.label] = trimmed;
          } else if (raw instanceof File) {
            const url = await uploadScrubLogo(raw);
            productAddons[addon.label] = url;
          }
        }
      }
      const customOptions = product.productAddons?.length
        ? { productAddons, addonFee }
        : undefined;
      if (hasVariable && selectedVariation) {
        addToCart(product, quantity, selectedVariation.id, selectedVariation.displayName, undefined, selectedVariation.attributes, customOptions);
      } else {
        addToCart(product, quantity, undefined, undefined, undefined, undefined, customOptions);
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{product.name} | Soochuh</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-[1600px] mx-auto px-0 sm:px-6 md:px-10">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-600 mb-6 sm:mb-8 font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors px-4 sm:px-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6 sm:gap-10 xl:gap-12">
            {/* Image Gallery - full-bleed on mobile */}
            <div className="min-w-0 px-0 sm:px-0 -mx-4 sm:mx-0">
              <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3 sm:mb-4 sm:rounded-sm">
                <img
                  src={mainImageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 sm:p-2 rounded-full hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 sm:p-2 rounded-full hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {product.onSale && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1 uppercase tracking-widest shadow-lg">
                      Sale
                    </span>
                  </div>
                )}
              </div>
              {hasMultipleImages && (
                <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto sm:overflow-visible px-4 sm:px-0 pb-1 -mx-4 sm:mx-0 snap-x snap-mandatory">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-auto sm:h-auto aspect-square rounded-sm overflow-hidden border-2 snap-center ${
                        currentImageIndex === idx ? 'border-purple-600 ring-2 ring-purple-600 ring-offset-1' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info — order: Name, Variations, Customisation, Overview, Details, Price+Button */}
            <div className="min-w-0 px-4 sm:px-0 flex flex-col">
              {/* 1. Name */}
              <div className="mb-4 sm:mb-6 order-1">
                {product.categories?.length > 0 && (
                  <p className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-2">
                    {product.categories[0]}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display uppercase tracking-tighter leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* 2. Variation options */}
              {hasVariable && (
                <div className="mb-4 sm:mb-6 order-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <h3 className="text-base font-bold uppercase tracking-widest text-zinc-900">Colour &amp; Size</h3>
                    {hasAnyVariationSelection && (
                      <button
                        type="button"
                        onClick={() => setSelectedVariation(null)}
                        disabled={adding}
                        className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded transition-colors"
                      >
                        Clear selections
                      </button>
                    )}
                  </div>
                  <VariationSelector
                    variations={product.variations || []}
                    variationAttributes={variationAttributes}
                    variationAttributeSwatches={variationAttributeSwatches}
                    onVariationSelect={setSelectedVariation}
                    onSelectionChange={setHasAnyVariationSelection}
                    selectedVariation={selectedVariation || undefined}
                    disabled={adding}
                  />
                </div>
              )}

              {/* 3. Customisation options */}
              {product.productAddons && product.productAddons.length > 0 && (
                <div className="order-3 mb-4 sm:mb-6">
                <ProductCustomisationFields
                  addons={product.productAddons as any[]}
                  profileName={product.customisationProfile?.name}
                  values={addonValues}
                  onChange={setAddonValues}
                  disabled={adding}
                />
                </div>
              )}

              {/* 4. Overview (short description) */}
              {product.shortDescription ? (
                <div className="order-4 mb-4 sm:mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">Overview</h3>
                  <p className="text-zinc-600 leading-relaxed">{product.shortDescription}</p>
                </div>
              ) : null}

              {/* 5. Details (long description) — shown here on mobile, full-width below on desktop */}
              <div className="order-5 mb-4 sm:mb-6 lg:hidden">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">Details</h3>
                <div 
                  className="text-zinc-600 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* 6. Price, stock, quantity, button */}
              <div className="order-6">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
                {hasVariable && !selectedVariation && product.price_range ? (
                  <span className="text-2xl sm:text-3xl font-black">
                    R{product.price_range.min.toFixed(2)} – R{product.price_range.max.toFixed(2)}
                  </span>
                ) : effectiveOnSale && product.salePrice != null ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-black text-red-600">
                      R{effectivePrice.toFixed(2)}
                    </span>
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      R{effectiveRegularPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black">
                    R{effectivePrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 mb-4 sm:mb-6">
                {inStock
                  ? (remainingStock !== undefined ? `${remainingStock} in stock` : 'In stock')
                  : 'Out of stock'}
              </p>

              {/* Quantity Selector — only when can add (simple or variation selected) */}
              {(!hasVariable || selectedVariation) && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <label className="font-bold uppercase tracking-widest text-sm">Quantity:</label>
                  <div className="flex items-center border border-zinc-200">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-3 sm:p-2 hover:bg-zinc-100 transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 sm:px-4 py-2 font-bold min-w-[2rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="p-3 sm:p-2 hover:bg-zinc-100 transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation"
                      disabled={remainingStock !== undefined && quantity >= remainingStock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart || adding}
                className={`w-full py-4 font-bold uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation ${
                  canAddToCart
                    ? 'bg-black text-white hover:bg-purple-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding...' : (hasVariable && !selectedVariation) ? 'Select options' : (canAddToCart ? 'Add to Cart' : 'Out of Stock')}
              </button>
              </div>
            </div>
          </div>

          {/* Details (long description) — full width below on desktop */}
          <div 
            className="hidden lg:block mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-12 border-t border-zinc-200 text-zinc-600 leading-relaxed text-sm sm:text-base px-4 sm:px-0"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
