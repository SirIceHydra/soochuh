import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag, Menu, X, Search, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import soochuhLogo from '../assets/logos/SOOCHA LOGO 2.svg';
import { useCategories } from '../shop/core/hooks/useCategories';
import { findKitsCategory } from '../shop/core/utils/kitsCategory';
import { getSearchSuggestions } from '../services/woocommerce';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onNavigate }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ products: any[]; categories: any[]; tags: any[]; attributes: any[] }>({ products: [], categories: [], tags: [], attributes: [] });
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [suggestionBoxStyle, setSuggestionBoxStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());
  const { categories, fetchCategories } = useCategories();
  const kitsCategory = findKitsCategory(categories);
  const kitsHref = kitsCategory ? `/shop?category=${kitsCategory.slug}` : '/shop';
  const FREE_SHIPPING_THRESHOLD = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD ?? '1499');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Debounced search suggestions
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions({ products: [], categories: [], tags: [], attributes: [] });
      setShowSuggestions(false);
      setSuggestionBoxStyle(null);
      setFailedImageIds(new Set());
      return;
    }
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      setShowSuggestions(true);
      try {
        const data = await getSearchSuggestions(q);
        setSuggestions(data);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Position suggestion box when it opens
  useEffect(() => {
    if (showSuggestions && searchQuery.trim().length >= 2 && searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setSuggestionBoxStyle({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 288) });
    } else {
      setSuggestionBoxStyle(null);
    }
  }, [showSuggestions, searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const applySuggestion = useCallback((text: string, productId?: number) => {
    if (text || productId) {
      if (productId) {
        navigate(`/shop/product/${productId}`);
      } else if (text) {
        navigate(`/shop?search=${encodeURIComponent(text)}`);
      }
      setSearchQuery('');
      setSearchExpanded(false);
      setShowSuggestions(false);
    }
  }, [navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setSearchExpanded(false);
      setShowSuggestions(false);
    } else {
      setSearchExpanded(false);
    }
  };

  const hasSuggestions = suggestions.products.length > 0 || suggestions.categories.length > 0 || suggestions.attributes.length > 0;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Fixed header: promo bar on top, nav slides up to fill space on scroll */}
      <header className="fixed top-0 left-0 w-full z-[90]">
        {/* Promo Banner - height stays constant; we fade it out when scrolled */}
        <div
          className={`bg-purple-600 text-white text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 text-center tracking-widest transition-opacity duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] ${
            isScrolled ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="px-2 sm:px-4">
            <span className="animate-pulse">⚡️</span>{' '}
            <span className="whitespace-nowrap">
              FREE SHIPPING ON ORDERS OVER R{FREE_SHIPPING_THRESHOLD}
            </span>{' '}
            <span className="hidden sm:inline">|</span>{' '}
            <span className="block sm:inline">FREE RETURNS</span>
          </div>
        </div>

        <nav
          className={`w-full transition-[padding,margin,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-md text-black py-8 -mt-10 shadow-sm border-b border-black/5'
              : 'bg-white/95 backdrop-blur-sm text-black py-4 mt-0'
          } ${mobileMenuOpen ? 'bg-white' : ''}`}
        >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 flex justify-between items-center">
          
          <div className="flex items-center gap-4 flex-1 md:flex-none">
             <button 
              className="md:hidden z-10 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            
             {/* Desktop Links Left */}
            <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest font-display">
              <Link to="/shop?category=women" className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">Women</Link>
              <Link to="/shop?category=men" className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">Men</Link>
              <Link to="/shop" className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">Shop</Link>
              <Link to="/shop?onSale=true" className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">Sale</Link>
            </div>
          </div>

          {/* Logo */}
          <Link 
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 z-10 h-8 sm:h-9 md:h-10"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={soochuhLogo} alt="Soochuh" className="h-full w-auto object-contain" />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end md:flex-none">
             <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest font-display mr-4">
                <Link to={kitsHref} className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">Kits</Link>
                <Link to="/about" className="hover:text-purple-500 transition-colors uppercase border-b-2 border-transparent pb-1">About</Link>
            </div>

            <div ref={searchContainerRef} className="hidden sm:flex items-center relative">
              {searchExpanded ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 relative">
                  <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if (searchQuery.trim().length >= 2 && hasSuggestions) setShowSuggestions(true); }}
                    onBlur={() => { if (!searchQuery.trim()) setSearchExpanded(false); }}
                    placeholder="Search products..."
                    className="w-32 sm:w-48 py-1 px-2 text-sm border-b border-zinc-300 focus:border-purple-500 focus:outline-none bg-transparent"
                  />
                  {showSuggestions && searchQuery.trim().length >= 2 && suggestionBoxStyle && (
                    <div
                      className="fixed max-h-80 overflow-y-auto bg-white border border-zinc-200 shadow-lg rounded-sm py-2"
                      style={{
                        top: suggestionBoxStyle.top,
                        left: suggestionBoxStyle.left,
                        width: suggestionBoxStyle.width,
                        zIndex: 9999,
                      }}
                    >
                      {suggestionsLoading ? (
                        <div className="px-4 py-3 text-sm text-zinc-500">Searching...</div>
                      ) : hasSuggestions ? (
                        <>
                          {suggestions.products.length > 0 && (
                            <div className="px-3 py-1">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Products</div>
                              {suggestions.products.map((p) => (
                                <button
                                  key={`p-${p.id}`}
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); applySuggestion(p.name, p.id); }}
                                  className="w-full text-left px-2 py-2 text-sm hover:bg-purple-50 rounded flex items-center gap-3"
                                >
                                  {p.image && !failedImageIds.has(p.id) ? (
                                    <img
                                      src={p.image}
                                      alt=""
                                      className="w-10 h-10 object-cover rounded flex-shrink-0 bg-zinc-100"
                                      onError={() => setFailedImageIds((prev) => new Set(prev).add(p.id))}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded flex-shrink-0 bg-zinc-200 flex items-center justify-center">
                                      <ShoppingBag className="w-4 h-4 text-zinc-400" />
                                    </div>
                                  )}
                                  <span className="truncate">{p.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {suggestions.categories.length > 0 && (
                            <div className="px-3 py-1 border-t border-zinc-100">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Categories</div>
                              {suggestions.categories.map((c) => (
                                <button
                                  key={`c-${c.id}`}
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); applySuggestion(c.name); }}
                                  className="w-full text-left px-2 py-2 text-sm hover:bg-purple-50 rounded truncate"
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          )}
                          {suggestions.attributes.length > 0 && (
                            <div className="px-3 py-1 border-t border-zinc-100">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Attributes</div>
                              {suggestions.attributes.map((a) => (
                                <button
                                  key={`a-${a.id}`}
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); applySuggestion(a.name); }}
                                  className="w-full text-left px-2 py-2 text-sm hover:bg-purple-50 rounded truncate"
                                >
                                  {a.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 text-sm text-zinc-500">No suggestions found</div>
                      )}
                    </div>
                  )}
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchExpanded(true)}
                  className="p-1 -m-1 hover:text-purple-500 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
            <Link to="/contact" className="hidden sm:block">
              <Mail className="w-5 h-5 cursor-pointer hover:text-purple-500 transition-colors" />
            </Link>
            
            <Link to="/cart" className="relative cursor-pointer group z-10">
              <ShoppingBag className="w-5 h-5 group-hover:text-purple-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      </header>

      {/* Mobile Menu Overlay - Full Screen - OUTSIDE nav to cover entire viewport including promo banner */}
      <div 
        className={`fixed inset-0 top-0 bg-white text-black z-[9999] transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
          {/* Mobile Menu Header */}
          <div className="border-b border-zinc-200 px-4 sm:px-6 py-5 sm:py-6 flex justify-between items-center bg-white">
            <Link 
              to="/"
              className="h-9 sm:h-10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={soochuhLogo} alt="Soochuh" className="h-full w-auto object-contain" />
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-black"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-black stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="h-[calc(100vh-73px)] overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 flex flex-col bg-white pb-12">
            <div className="flex flex-col gap-2 sm:gap-4">
               <Link 
                 to="/shop?category=women" 
                 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-black hover:text-purple-600 transition-colors py-3 border-b border-zinc-100" 
                 onClick={() => setMobileMenuOpen(false)}
               >
                 Women
               </Link>
               <Link 
                 to="/shop?category=men" 
                 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-black hover:text-purple-600 transition-colors py-3 border-b border-zinc-100" 
                 onClick={() => setMobileMenuOpen(false)}
               >
                 Men
               </Link>
               <Link 
                 to={kitsHref} 
                 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-black hover:text-purple-600 transition-colors py-3 border-b border-zinc-100" 
                 onClick={() => setMobileMenuOpen(false)}
               >
                 Kits
               </Link>
               <Link 
                 to="/shop" 
                 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-black hover:text-purple-600 transition-colors py-3 border-b border-zinc-100" 
                 onClick={() => setMobileMenuOpen(false)}
               >
                 Shop
               </Link>
               <Link 
                 to="/shop?onSale=true" 
                 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-black hover:text-purple-600 transition-colors py-3 border-b border-zinc-100" 
                 onClick={() => setMobileMenuOpen(false)}
               >
                 Sale
               </Link>
            </div>
            
            {/* Mobile Menu Footer - Search */}
            <div className="mt-auto pt-8 sm:pt-12 pb-6 border-t border-zinc-200 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = (e.currentTarget.querySelector('input')?.value || '').trim();
                  if (q) navigate(`/shop?search=${encodeURIComponent(q)}`);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-zinc-50 rounded-lg px-3 py-2"
              >
                <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-base font-medium focus:outline-none"
                />
              </form>
              <Link 
                to="/contact" 
                className="flex items-center gap-3 text-base font-bold text-zinc-700 hover:text-purple-600 transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
      </div>
    </>
  );
};

export default Navbar;