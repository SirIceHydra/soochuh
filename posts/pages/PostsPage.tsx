import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PostGrid } from '../components/PostGrid';
import { usePostsWithPagination } from '../hooks/usePosts';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../shop/core/cart/CartContext';

const PostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  
  const {
    posts,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    filters,
    goToPage,
    setPerPage,
    setCategory,
    setSearch,
    setOrderBy,
    setOrder,
    clearFilters,
  } = usePostsWithPagination({
    perPage: 9,
    orderBy: 'date',
    order: 'desc',
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setCategory(categoryFromUrl);
    }
  }, [searchParams, setCategory, filters.category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchQuery);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery('');
  };

  const hasActiveFilters = filters.category || filters.tag || filters.search || filters.orderBy !== 'date' || filters.order !== 'desc';

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Blog | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Read the latest articles about medical apparel, healthcare fashion, and professional wear tips." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 text-purple-600">
            Blog
          </h1>
          <p className="text-zinc-500 mb-10 max-w-2xl text-lg">
            Discover articles about medical apparel, healthcare fashion, and professional wear tips.
          </p>

          {/* Search and Filters */}
          <div className="bg-zinc-50 border border-zinc-200 p-4 sm:p-6 mb-6 sm:mb-8 rounded-sm">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 hover:bg-purple-600 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 bg-white hover:border-purple-500 transition-colors font-bold uppercase tracking-widest text-xs"
              >
                <Filter size={16} />
                Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-purple-600 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-6 p-4 bg-white border border-zinc-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Sort By</label>
                    <select
                      value={filters.orderBy || 'date'}
                      onChange={(e) => setOrderBy(e.target.value as 'date' | 'title' | 'modified')}
                      className="w-full px-3 py-2 border border-zinc-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="date">Date</option>
                      <option value="title">Title</option>
                      <option value="modified">Last Modified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Order</label>
                    <select
                      value={filters.order || 'desc'}
                      onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-3 py-2 border border-zinc-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest mb-2">Posts Per Page</label>
                    <select
                      value={filters.perPage || 9}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-zinc-200 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
              Showing {posts.length} of {total} posts
            </p>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Active filters:</span>
                {filters.search && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold uppercase tracking-widest text-xs">Search: {filters.search}</span>
                )}
                {filters.category && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold uppercase tracking-widest text-xs">Category: {filters.category}</span>
                )}
                {filters.tag && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold uppercase tracking-widest text-xs">Tag: {filters.tag}</span>
                )}
              </div>
            )}
          </div>

          {/* Posts Grid */}
          <PostGrid
            posts={posts}
            loading={loading}
            error={error}
            columns={3}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-zinc-200 bg-white hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 border font-bold uppercase tracking-widest text-xs transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-zinc-200 bg-white hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-zinc-200 bg-white hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostsPage;
