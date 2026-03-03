import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { Product, CartItem, ViewState, ColorVariant } from './types';
import { ProductCard } from './shop/ui/ProductCard';
import { useProducts } from './shop/core/hooks/useProducts';
import { useCategories } from './shop/core/hooks/useCategories';
import { useColours } from './shop/core/hooks/useColours';
import { findKitsCategory } from './shop/core/utils/kitsCategory';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import femaleScrubsImg from './assets/images/female-scrubs.jpg';
import maleScrubsImg from './assets/images/male-scrubs.jpg';
import colourImg1 from './assets/colour-section/FA-SoochuhWeb-029-copy.jpg';
import colourImg2 from './assets/colour-section/FA-SoochuhWeb-036-copy-1.jpg';
import colourImg3 from './assets/colour-section/FA-SoochuhWeb-070-copy-1.jpg';
import colourImg4 from './assets/colour-section/FA-SoochuhWeb-096-copy-1.jpg';
import colourImg5 from './assets/colour-section/FA-SoochuhWeb-138-copy (1).jpg';
import colourImg6 from './assets/colour-section/FA-SoochuhWeb-225-copy-1.jpg';

const COLOUR_SECTION_IMAGES = [colourImg1, colourImg2, colourImg3, colourImg4, colourImg5, colourImg6];

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const collectionRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const limitedRef = useRef<HTMLDivElement>(null);
  const saleRef = useRef<HTMLDivElement>(null);
  const coloursCarouselRef = useRef<HTMLDivElement>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProduct]);

  // GSAP Animations for Home View
  useEffect(() => {
    if (view === 'home') {
       const ctx = gsap.context(() => {
           // Animate Sale Items
           gsap.from(".sale-card", {
              x: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              scrollTrigger: {
                trigger: saleRef.current,
                start: "top 85%",
              }
           });

           // Animate Collection Items on Scroll
           gsap.from(".product-card", {
               y: 100,
               opacity: 0,
               duration: 0.8,
               stagger: 0.1,
               ease: "power3.out",
               scrollTrigger: {
                   trigger: collectionRef.current,
                   start: "top 85%",
               }
           });

           // Infinite Marquee Animation
           gsap.to(".marquee-content", {
               xPercent: -50,
               repeat: -1,
               duration: 20,
               ease: "linear"
           });
           
           // Kits Section Animation
           gsap.from(".kits-card", {
              y: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                  trigger: techRef.current,
                  start: "top 85%"
              }
           });

           // Limited Releases Section Animation
           gsap.from(".limited-card", {
              y: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                  trigger: limitedRef.current,
                  start: "top 85%"
              }
           });

           // Latest Arrivals on Scroll
           gsap.from(".latest-card", {
              y: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                  trigger: latestRef.current,
                  start: "top 85%",
              }
           });

       });
       return () => ctx.revert();
    }
  }, [view]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product_detail');
  };

  const handleAddToCart = (product: Product, color: ColorVariant, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor.id === color.id && 
        item.selectedSize === size
      );

      if (existing) {
        return prev.map(item => 
          item.cartId === existing.cartId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, {
        ...product,
        selectedColor: color,
        selectedSize: size,
        quantity: 1,
        cartId: `${product.id}-${color.id}-${size}-${Date.now()}`
      }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const Marquee = () => (
    <div ref={marqueeRef} className="bg-purple-600 py-4 overflow-hidden border-y border-black relative">
      <div className="marquee-content inline-block text-white font-black text-sm sm:text-lg md:text-2xl uppercase tracking-wider whitespace-nowrap">
        <span className="mx-4 sm:mx-8">Engineered for Medicine</span> • 
        <span className="mx-4 sm:mx-8">FIONx™ Technology</span> • 
        <span className="mx-4 sm:mx-8">Ridiculously Soft</span> • 
        <span className="mx-4 sm:mx-8">Modern Fit</span> • 
        <span className="mx-4 sm:mx-8">Moisture Wicking</span> • 
        <span className="mx-4 sm:mx-8">Antimicrobial</span> • 
        <span className="mx-4 sm:mx-8">Engineered for Medicine</span> • 
        <span className="mx-4 sm:mx-8">FIONx™ Technology</span> • 
        <span className="mx-4 sm:mx-8">Ridiculously Soft</span> • 
        <span className="mx-4 sm:mx-8">Modern Fit</span> • 
      </div>
    </div>
  );

  const { products: featuredProducts, loading: featuredLoading, fetchProducts } = useProducts();
  const { products: latestProducts, loading: latestLoading, fetchProducts: fetchLatest } = useProducts();
  const { products: kitsProducts, loading: kitsLoading, fetchProducts: fetchKits } = useProducts();
  const { products: limitedProducts, loading: limitedLoading, fetchProducts: fetchLimited } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const { colours, fetchColours } = useColours();

  useEffect(() => {
    fetchProducts({ featured: true, perPage: 8 });
  }, [fetchProducts]);

  useEffect(() => {
    fetchColours();
  }, [fetchColours]);

  const scrollColoursCarousel = (dir: 'left' | 'right') => {
    const el = coloursCarouselRef.current;
    if (!el) return;
    const cardWidth = 200;
    const scrollAmount = dir === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  useEffect(() => {
    fetchLatest({ tag: 'latest', perPage: 4 });
  }, [fetchLatest]);
  useEffect(() => {
    fetchCategories({ forceRefresh: true } as any);
  }, [fetchCategories]);
  const kitsCategory = findKitsCategory(categories);

  useEffect(() => {
    if (kitsCategory?.id) {
      fetchKits({ category: kitsCategory.id, perPage: 4 });
    }
  }, [kitsCategory?.id, fetchKits]);

  useEffect(() => {
    fetchLimited({ tag: 'limited', perPage: 4 });
  }, [fetchLimited]);

  return (
    <div className="bg-white min-h-screen font-sans text-black selection:bg-purple-400 selection:text-white bg-noise">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onNavigate={(v) => setView(v)}
      />

      {/* View Router */}
      {view === 'home' || view === 'collection' ? (
        <>
          {view === 'home' && <Hero />}
          
          {/* Marquee Section */}
          <Marquee />

          <main className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-24">
            
            {/* 1. TRENDING NOW SECTION */}
            <div ref={collectionRef} className="relative mb-16 sm:mb-32">
                {/* Background Blob for collection */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/80 rounded-full blur-3xl -z-10"></div>
                
                <div className="mb-12 border-b border-black/5 pb-6">
                  <h2 className="text-4xl md:text-7xl font-black font-display mb-2 uppercase tracking-tighter text-black">Trending Now</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-6 sm:gap-y-12">
                {featuredLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="product-card animate-pulse">
                      <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm" />
                      <div className="mt-4 h-4 bg-gray-100 rounded w-3/4" />
                      <div className="mt-2 h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))
                ) : featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <ProductCard
                        product={product}
                        onViewDetails={(p) => navigate(`/shop/product/${p.id}`)}
                      />
                    </div>
                  ))
                ) : null}
                </div>
            </div>

            {/* 2. WOMEN & MEN CATEGORIES SECTION */}
            {view === 'home' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-32">
                    <div className="relative h-[300px] sm:h-[400px] md:h-[600px] bg-gray-100 group overflow-hidden cursor-pointer rounded-lg shadow-xl" onClick={() => navigate('/shop?category=women')}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <img src={femaleScrubsImg} alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 z-20">
                            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white font-display uppercase mb-2 sm:mb-4 tracking-tighter drop-shadow-lg">Women</h3>
                            <button className="bg-white text-black px-4 py-2 sm:px-8 sm:py-3 font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-purple-600 hover:text-white transition-colors shadow-lg">Shop Now</button>
                        </div>
                    </div>
                    <div className="relative h-[300px] sm:h-[400px] md:h-[600px] bg-gray-100 group overflow-hidden cursor-pointer rounded-lg shadow-xl" onClick={() => navigate('/shop?category=men')}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <img src={maleScrubsImg} alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 z-20">
                            <h3 className="text-3xl sm:text-4xl md:text-6xl font-black text-white font-display uppercase mb-2 sm:mb-4 tracking-tighter drop-shadow-lg">Men</h3>
                            <button className="bg-white text-black px-4 py-2 sm:px-8 sm:py-3 font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-purple-600 hover:text-white transition-colors shadow-lg">Shop Now</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2b. LATEST ARRIVALS SECTION */}
            {view === 'home' && (latestLoading || latestProducts.length > 0) && (
            <div ref={latestRef} className="relative mb-16 sm:mb-32">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/80 rounded-full blur-3xl -z-10"></div>
              <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-6">
                <div>
                  <h2 className="text-4xl md:text-7xl font-black font-display mb-2 uppercase tracking-tighter text-black">Latest Arrivals</h2>
                </div>
                <button onClick={() => navigate('/shop?tag=latest')} className="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-black transition-colors">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-6 sm:gap-y-12">
                {latestLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="latest-card animate-pulse">
                      <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm" />
                      <div className="mt-4 h-4 bg-gray-100 rounded w-3/4" />
                      <div className="mt-2 h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))
                ) : latestProducts.length > 0 ? (
                  latestProducts.map((product) => (
                    <div key={product.id} className="latest-card">
                      <ProductCard
                        product={product}
                        onViewDetails={(p) => navigate(`/shop/product/${p.id}`)}
                      />
                    </div>
                  ))
                ) : null}
              </div>
            </div>
            )}

            {/* 3. KITS SECTION */}
            {view === 'home' && (
            <div ref={techRef} className="relative mt-20 sm:mt-40 mb-16 sm:mb-32">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/80 rounded-full blur-3xl -z-10"></div>
              <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-6">
                <div>
                  <h2 className="text-4xl md:text-7xl font-black font-display mb-2 uppercase tracking-tighter text-black">Kits</h2>
                </div>
                <button onClick={() => navigate(kitsCategory ? `/shop?category=${kitsCategory.slug}` : '/shop')} className="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-black transition-colors">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-6 sm:gap-y-12">
                {kitsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="kits-card animate-pulse">
                      <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm" />
                      <div className="mt-4 h-4 bg-gray-100 rounded w-3/4" />
                      <div className="mt-2 h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))
                ) : kitsProducts.length > 0 ? (
                  kitsProducts.map((product) => (
                    <div key={product.id} className="kits-card">
                      <ProductCard
                        product={product}
                        onViewDetails={(p) => navigate(`/shop/product/${p.id}`)}
                      />
                    </div>
                  ))
                ) : null}
              </div>
            </div>
            )}

            {/* 3b. LIMITED RELEASES SECTION */}
            {view === 'home' && (limitedLoading || limitedProducts.length > 0) && (
              <div ref={limitedRef} className="relative mt-20 sm:mt-40 mb-16 sm:mb-32">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/80 rounded-full blur-3xl -z-10"></div>
                <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-6">
                  <div>
                    <h2 className="text-4xl md:text-7xl font-black font-display mb-2 uppercase tracking-tighter text-black">Limited Releases</h2>
                  </div>
                  <button onClick={() => navigate('/shop?tag=limited')} className="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-black transition-colors">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-6 sm:gap-y-12">
                  {limitedLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="limited-card animate-pulse">
                        <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm" />
                        <div className="mt-4 h-4 bg-gray-100 rounded w-3/4" />
                        <div className="mt-2 h-4 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))
                  ) : limitedProducts.length > 0 ? (
                    limitedProducts.map((product) => (
                      <div key={product.id} className="limited-card">
                        <ProductCard
                          product={product}
                          onViewDetails={(p) => navigate(`/shop/product/${p.id}`)}
                        />
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            )}

            {/* 4. COLOURS SECTION */}
            {view === 'home' && (
              <div className="mb-16 sm:mb-32 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter text-black mb-1">
                      Colours
                    </h2>
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-sm">Express Your Style</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => scrollColoursCarousel('left')}
                      className="p-2.5 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-sm"
                      aria-label="Previous colours"
                    >
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                    <button
                      onClick={() => scrollColoursCarousel('right')}
                      className="p-2.5 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-sm"
                      aria-label="Next colours"
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
                <div
                  ref={coloursCarouselRef}
                  className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide scroll-smooth"
                >
                  {colours.length > 0 ? (
                    colours.map((c) => (
                      <div
                        key={c.id}
                        className="flex-shrink-0 w-[160px] sm:w-[180px] rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => navigate('/shop')}
                      >
                        <div
                          className="aspect-[4/5] w-full"
                          style={{ backgroundColor: c.hex ?? '#e5e7eb' }}
                        />
                        <div className="px-4 py-3 bg-white">
                          <span className="font-bold text-black uppercase tracking-tight text-sm block truncate">
                            {c.name}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    COLOUR_SECTION_IMAGES.map((src, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-[160px] sm:w-[180px] rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => navigate('/shop')}
                      >
                        <img
                          src={src}
                          alt={`Scrub colours ${i + 1}`}
                          className="aspect-[4/5] w-full object-cover object-top"
                        />
                        <div className="px-4 py-3 bg-white">
                          <span className="font-bold text-black uppercase tracking-tight text-sm">
                            Scrub Colour {i + 1}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            
            {/* 5. TEAM KITS (QUOTES) SECTION */}
            <div className="relative w-full h-[50vh] sm:h-[70vh] md:h-[80vh] bg-zinc-900 overflow-hidden flex items-center justify-center group">
               <div className="absolute inset-0 bg-purple-900/30 mix-blend-color z-10 pointer-events-none"></div>
               <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
               <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2664" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale contrast-125" 
                alt="Team"
               />
               <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl">
                 <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black font-display mb-4 sm:mb-8 text-white uppercase tracking-tighter leading-[0.85] drop-shadow-xl">
                    Team Orders
                 </h3>
                 <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-200 mb-6 sm:mb-10 max-w-2xl mx-auto font-medium drop-shadow-md px-2">
                   We provide premium uniform solutions for clinics, hospitals, and private practices. Embroidery, group rates, and personalized service.
                 </p>
                 <button onClick={() => navigate('/contact')} className="bg-white text-black px-6 py-3 sm:px-12 sm:py-5 rounded-full font-bold tracking-widest hover:bg-purple-600 hover:text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] uppercase text-xs sm:text-sm">
                   Get A Quote
                 </button>
               </div>
            </div>
          </main>
        </>
      ) : view === 'product_detail' && selectedProduct ? (
        <ProductDetail 
          product={selectedProduct} 
          onAddToCart={handleAddToCart} 
          onBack={() => setView('collection')}
        />
      ) : null}

      <Footer />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
};

export default App;