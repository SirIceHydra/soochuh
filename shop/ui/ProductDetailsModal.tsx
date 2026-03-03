import React, { useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../core/ports';
import { useCart } from '../core/cart/CartContext';
import { formatPrice, isProductInStock, getStockStatusText } from '../../utils/helpers';
import { Loading } from '../../components/ui/Loading';
import AddItemPopup from '../../components/AddItemPopup';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);

  if (!isOpen || !product) return null;

  const inStock = isProductInStock(product.stockStatus, product.stockQuantity);
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleAdd = async () => {
    if (!inStock) return;
    setAdding(true);
    try {
      await addToCart(product, 1);
      setPopupOpen(true);
    } finally {
      setAdding(false);
    }
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      setImageLoading(true);
    }
  };

  const previousImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      setImageLoading(true);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="flex min-h-full items-start justify-center p-2 sm:p-4 pt-20">
        <div className="relative bg-primary shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-tertiary/60" style={{ color: 'var(--white)' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-tertiary/60 bg-primary sticky top-0 z-10">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--tertiary)' }}>PRODUCT DETAILS</h2>
            <button
              onClick={onClose}
              className="transition-colors p-2"
              style={{ color: 'var(--white)' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(95vh-80px)] overflow-y-auto">
            {/* Left Side - Image Gallery */}
            <div className="lg:w-1/2 p-4 sm:p-6">
              <div className="relative w-full h-64 sm:h-96 bg-primary overflow-hidden">
                {/* Main Image */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loading size="lg" />
                  </div>
                )}
                
                <img 
                  src={product.images[currentImageIndex] || '/assets/placeholder-product.jpg'} 
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`} 
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-tertiary/20 hover:bg-tertiary/30 text-tertiary shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-tertiary/20 hover:bg-tertiary/30 text-tertiary shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Next Image"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {hasMultipleImages && (
                <div className="mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => selectImage(index)}
                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'border-tertiary shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Product Information */}
            <div className="lg:w-1/2 p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: 'var(--tertiary)' }}>{product.name}</h1>
              
              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-bold text-tertiary">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-base sm:text-lg text-tertiary/70 line-through">
                      {formatPrice(product.regularPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-tertiary">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Availability */}
              <div className="text-sm mb-6" style={{ color: 'var(--platinum)' }}>
                <span className="font-medium" style={{ color: 'var(--white)' }}>Availability:</span> {getStockStatusText(product.stockStatus, product.stockQuantity)}
              </div>

              {/* Add to Cart under Availability */}
              <div className="mb-6">
                <button
                  onClick={handleAdd}
                  disabled={!inStock || adding}
                  className={`w-full py-3 px-4 sm:px-6 font-semibold transition-all ${
                    inStock ? 'bg-tertiary text-primary hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {/* Quick Overview */}
              {product.shortDescription && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tertiary)' }}>Quick Overview</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--platinum)' }}>{product.shortDescription}</p>
                </div>
              )}

              {/* Product Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--tertiary)' }}>Product Description</h3>
                  {/* Force high-contrast colors inside WP content */}
                  <style>{`
                    [data-modal-desc] h1,
                    [data-modal-desc] h2,
                    [data-modal-desc] h3,
                    [data-modal-desc] h4,
                    [data-modal-desc] h5,
                    [data-modal-desc] h6 { color: var(--tertiary) !important; }
                    [data-modal-desc] p,
                    [data-modal-desc] li,
                    [data-modal-desc] span { color: var(--platinum) !important; }
                    [data-modal-desc] a { color: var(--tertiary) !important; text-decoration: underline; }
                  `}</style>
                  <div
                    data-modal-desc
                    className="leading-relaxed max-w-none"
                    style={{ color: 'var(--platinum)' }}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {/* Action area removed; button moved under price */}
            </div>
          </div>
        </div>
      </div>
      {/* Slide-in confirmation popup */}
      <AddItemPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} message={product.name} />
    </div>
  );
}

