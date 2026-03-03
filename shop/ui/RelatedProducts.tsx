import React, { useState, useEffect } from 'react';
import { Product } from '../core/ports';
import { useCart } from '../core/cart/CartContext';
import { WooCommerceDataProvider } from '../adapters/catalog/woocommerce';

interface RelatedProductsProps {
  upsellIds: number[];
  relatedIds: number[];
  currentProductId: number;
  title?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  upsellIds,
  relatedIds,
  currentProductId,
  title
}) => {
  const { addToCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Determine which products to show and the title
  const productIds = upsellIds.length > 0 ? upsellIds : relatedIds;
  const displayTitle = title || (upsellIds.length > 0 ? 'You May Also Like' : 'Related Products');

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const products = await Promise.all(
          productIds
            .filter(id => id !== currentProductId) // Exclude current product
            .slice(0, 8) // Limit to 8 products
            .map(id => WooCommerceDataProvider.getProduct(id))
        );

        // Filter out failed fetches and ensure products are in stock
        const validProducts = products.filter(
          (product): product is Product => 
            product !== null && 
            product.stockStatus === 'instock'
        );

        setRelatedProducts(validProducts);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productIds, currentProductId]);

  const handleAddToCart = async (product: Product) => {
    try {
      // Convert Product to the format expected by CartContext
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images, // Already string[] in ports.ts
        stockQuantity: product.stockQuantity,
        stockStatus: product.stockStatus
      };
      addToCart(cartProduct, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, Math.ceil(relatedProducts.length / 4) - 1);
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  if (loading) {
    return (
      <section className="related-products">
        <div className="container">
          <h2 className="section-title">{displayTitle}</h2>
          <div className="loading">Loading related products...</div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't show section if no products
  }

  const maxSlide = Math.max(0, Math.ceil(relatedProducts.length / 4) - 1);
  const showNavigation = relatedProducts.length > 4;

  return (
    <section className="related-products">
      <div className="container">
        <h2 className="section-title">{displayTitle}</h2>
        
        <div className="related-products-wrapper">
          {showNavigation && (
            <button 
              className="carousel-nav prev"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous products"
            >
              ‹
            </button>
          )}

          <div className="related-products-grid">
            <div 
              className="products-container"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {relatedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.images[0] || '/images/placeholder.jpg'} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.onSale && (
                      <span className="sale-badge">Sale</span>
                    )}
                    {product.stockStatus === 'outofstock' && (
                      <div className="out-of-stock-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name" title={product.name}>
                      {product.name}
                    </h3>
                    
                    <div className="product-price">
                      {product.onSale ? (
                        <>
                          <span className="sale-price">R{product.price}</span>
                          <span className="regular-price">R{product.regularPrice}</span>
                        </>
                      ) : (
                        <span className="price">R{product.price}</span>
                      )}
                    </div>
                    
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockStatus === 'outofstock'}
                    >
                      {product.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showNavigation && (
            <button 
              className="carousel-nav next"
              onClick={nextSlide}
              disabled={currentSlide === maxSlide}
              aria-label="Next products"
            >
              ›
            </button>
          )}
        </div>

        {showNavigation && (
          <div className="carousel-dots">
            {Array.from({ length: maxSlide + 1 }, (_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
};
