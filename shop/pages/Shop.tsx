import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ProductGrid } from '../ui/ProductGrid';
import { useCategories } from '../core/hooks/useCategories';
import { useProducts } from '../core/hooks/useProducts';
import { useCart } from '../core/cart/CartContext';
import { Search, Filter, Grid, List, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getSearchSuggestions } from '../../services/woocommerce';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [onSale, setOnSale] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<'date' | 'price' | 'name'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { cart } = useCart();
  const cartCount = cart.itemCount;
  
  const { categories, loading: catsLoading, fetchCategories } = useCategories();
  
  const { products, loading, error, fetchProducts } = useProducts({
    perPage: 100,
    page: 1,
    category: categoryId,
    tag: tag,
    search: searchTerm,
    onSale: onSale,
    orderBy: orderBy,
    order: order
  });
  
  const catMenuRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Record<number, boolean>>({});
  const [suggestions, setSuggestions] = useState<{ products: any[]; categories: any[]; attributes: any[] }>({ products: [], categories: [], attributes: [] });
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCategories({ forceRefresh: true } as any);
  }, [fetchCategories]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const onSaleParam = searchParams.get('onSale');
    const searchParam = searchParams.get('search');
    
    setSearchTerm(searchParam || '');
    setOnSale(onSaleParam === 'true');
    setTag(tagParam || undefined);
    
    if (categoryParam && !catsLoading && categories.length > 0) {
      const paramLower = categoryParam.toLowerCase();
      const category = categories.find(
        (cat) =>
          cat.name?.toLowerCase() === paramLower ||
          (cat.slug && cat.slug.toLowerCase() === paramLower)
      );
      if (category) {
        setCategoryId(category.id);
      } else {
        const parsedId = parseInt(categoryParam);
        if (!isNaN(parsedId)) {
          setCategoryId(parsedId);
        }
      }
    } else if (!categoryParam) {
      setCategoryId(undefined);
    }
  }, [searchParams, categories, catsLoading]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && catsLoading) {
      return;
    }
    
    if (categoryParam && categoryId === undefined && !catsLoading) {
      return;
    }
    
    fetchProducts({
      perPage: 100,
      page: 1,
      category: categoryId,
      tag: tag,
      search: searchTerm,
      onSale: onSale,
      orderBy: orderBy,
      order: order
    });
  }, [categoryId, tag, searchTerm, onSale, orderBy, order, fetchProducts, catsLoading, searchParams]);

  useEffect(() => {
    if (!isCatMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (catMenuRef.current && !catMenuRef.current.contains(target)) {
        setIsCatMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isCatMenuOpen]);

  // Debounced search suggestions for shop search bar
  useEffect(() => {
    const q = searchTerm.trim();
    if (q.length < 2) {
      setSuggestions({ products: [], categories: [], attributes: [] });
      setShowSuggestions(false);
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
  }, [searchTerm]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const applyShopSuggestion = useCallback((text: string, productId?: number, suggestedCategoryId?: number) => {
    if (productId) {
      navigate(`/shop/product/${productId}`);
    } else if (suggestedCategoryId !== undefined) {
      setCategoryId(suggestedCategoryId);
      const params: Record<string, string> = { category: suggestedCategoryId.toString() };
      if (onSale) params.onSale = 'true';
      if (tag) params.tag = tag;
      if (text) params.search = text;
      setSearchParams(params);
    } else if (text) {
      setSearchTerm(text);
      const params: Record<string, string> = {};
      if (categoryId !== undefined) params.category = categoryId.toString();
      if (onSale) params.onSale = 'true';
      if (tag) params.tag = tag;
      params.search = text;
      setSearchParams(params);
    }
    setShowSuggestions(false);
  }, [navigate, onSale, setSearchParams, categoryId, tag]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Shop | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Shop premium medical apparel, scrubs, and professional healthcare wear. Engineered for comfort, durability, and performance." />
      </Helmet>
      <Navbar cartCount={cartCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-purple-600">
            Shop
          </h1>
          {tag === 'limited' && (
            <p className="text-sm font-bold tracking-widest uppercase text-zinc-500 -mt-6 mb-6">Limited Releases</p>
          )}
          {tag === 'latest' && (
            <p className="text-sm font-bold tracking-widest uppercase text-zinc-500 -mt-6 mb-6">Latest Arrivals</p>
          )}
          
          {/* Search and Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div ref={searchContainerRef} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  const params: Record<string, string> = {};
                  if (categoryId) params.category = categoryId.toString();
                  if (onSale) params.onSale = 'true';
                  if (tag) params.tag = tag;
                  if (value) params.search = value;
                  setSearchParams(Object.keys(params).length > 0 ? params : {});
                }}
                onFocus={() => { if (searchTerm.trim().length >= 2) setShowSuggestions(true); }}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {showSuggestions && searchTerm.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 shadow-xl rounded-sm py-2 max-h-80 overflow-y-auto z-50">
                  {suggestionsLoading ? (
                    <div className="px-4 py-3 text-sm text-zinc-500">Searching...</div>
                  ) : (suggestions.products.length > 0 || suggestions.categories.length > 0 || suggestions.attributes.length > 0) ? (
                    <>
                      {suggestions.products.length > 0 && (
                        <div className="px-3 py-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Products</div>
                          {suggestions.products.map((p) => (
                            <button
                              key={`p-${p.id}`}
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); applyShopSuggestion(p.name, p.id); }}
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
                              onMouseDown={(e) => { e.preventDefault(); applyShopSuggestion(c.name, undefined, c.id); }}
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
                              onMouseDown={(e) => { e.preventDefault(); applyShopSuggestion(a.name); }}
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
            </div>
            <Link 
              to="/cart" 
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cartCount})</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-zinc-50 p-4 sm:p-6 mb-6 sm:mb-8 rounded-sm border border-zinc-200">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-sm uppercase tracking-widest">Filters:</span>
              </div>
              
              {/* Categories dropdown */}
              <div ref={catMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCatMenuOpen(prev => !prev)}
                  disabled={catsLoading}
                  className="bg-white border border-zinc-200 px-3 sm:px-4 py-2 w-full sm:w-48 text-left flex items-center justify-between hover:border-purple-500 transition-colors text-sm"
                >
                  <span className="truncate">
                    {catsLoading ? 'Loading...' : (categoryId ? (categories.find(c => c.id === categoryId)?.name || 'Category') : 'All Categories')}
                  </span>
                  <span>▾</span>
                </button>
                {isCatMenuOpen && !catsLoading && (
                  <div className="absolute top-full left-0 z-50 w-full sm:w-48 mt-1 bg-white border border-zinc-200 shadow-xl max-h-80 overflow-y-auto">
                    <div
                      onClick={() => {
                        setCategoryId(undefined);
                        setIsCatMenuOpen(false);
                        const params: Record<string, string> = {};
                        if (onSale) params.onSale = 'true';
                        if (tag) params.tag = tag;
                        if (searchTerm) params.search = searchTerm;
                        setSearchParams(Object.keys(params).length > 0 ? params : {});
                      }}
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                    >
                      All Categories
                    </div>
                    {categories
                      .filter(cat => !cat.parent || cat.parent === 0)
                      .map(parent => {
                        const isExpanded = !!expandedParents[parent.id];
                        return (
                          <div key={`gp-${parent.id}`}>
                            <div 
                              className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                              onClick={() => {
                                setCategoryId(parent.id);
                                setIsCatMenuOpen(false);
                                const params: Record<string, string> = { category: parent.id.toString() };
                                if (onSale) params.onSale = 'true';
                                if (tag) params.tag = tag;
                                if (searchTerm) params.search = searchTerm;
                                setSearchParams(params);
                              }}
                            >
                              <span>{parent.name}</span>
                              {categories.some(c => c.parent === parent.id) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedParents(prev => ({ ...prev, [parent.id]: !prev[parent.id] }));
                                  }}
                                  className="text-purple-600"
                                >
                                  {isExpanded ? '▾' : '▸'}
                                </button>
                              )}
                            </div>
                            {isExpanded && (
                              <div>
                                {categories
                                  .filter(child => child.parent === parent.id)
                                  .map(child => (
                                    <div
                                      key={`gc-${child.id}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCategoryId(child.id);
                                        setIsCatMenuOpen(false);
                                        const params: Record<string, string> = { category: child.id.toString() };
                                        if (onSale) params.onSale = 'true';
                                        if (tag) params.tag = tag;
                                        if (searchTerm) params.search = searchTerm;
                                        setSearchParams(params);
                                      }}
                                      className="px-4 py-2 pl-8 hover:bg-purple-50 cursor-pointer"
                                    >
                                      {child.name}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={onSale}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setOnSale(checked);
                    const params: Record<string, string> = {};
                    if (categoryId) params.category = categoryId.toString();
                    if (checked) params.onSale = 'true';
                    if (tag) params.tag = tag;
                    if (searchTerm) params.search = searchTerm;
                    setSearchParams(Object.keys(params).length > 0 ? params : {});
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor="onSale" className="text-sm font-bold uppercase tracking-widest">
                  On Sale
                </label>
              </div>
              
              <select 
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as 'date' | 'price' | 'name')} 
                className="bg-white border border-zinc-200 px-4 py-2 hover:border-purple-500 transition-colors"
              >
                <option value="date">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              
              <select 
                value={order}
                onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')} 
                className="bg-white border border-zinc-200 px-4 py-2 hover:border-purple-500 transition-colors"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
              
              <div className="flex items-center gap-2 border border-zinc-200 rounded-sm p-1 bg-white">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-purple-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-purple-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              variant={viewMode}
              columns={4}
              onViewDetails={(p) => navigate(`/shop/product/${p.id}`)}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
