import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Dumbbell, ChevronRight, Home, FileText, Phone, Mail, MapPin, Search, Loader2 } from 'lucide-react';
import { fetchCategories } from '../services/wordpress-api';
import { fetchPosts } from '../services/wordpress-api';
import { Loading } from '../../components/ui/Loading';
import { Navigation } from '../../components/Navigation';
import { Post } from '../types/post';
// Footer is not a named export in the site; remove import and footer usage if not present

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  description: string;
}

interface ParentCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  children: Category[];
}

const BlogHub: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<ParentCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [mobileOpenParentId, setMobileOpenParentId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.length > 0) {
      // Find the category by slug
      const category = categories.find(cat => cat.slug === categoryFromUrl);
      if (category) {
        setSelectedCategory(category);
        setSelectedParent(null);
        setError(null);
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPostsForCategory(selectedCategory.slug);
    } else if (selectedParent) {
      fetchPostsForParent(selectedParent);
    } else {
      fetchAllPosts();
    }
  }, [selectedCategory, selectedParent]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedCategories, fetchedPosts] = await Promise.all([
        fetchCategories(),
        fetchPosts({ perPage: 12, orderBy: 'date', order: 'desc' })
      ]);
      setCategories(fetchedCategories);
      setPosts(fetchedPosts.posts);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostsForCategory = async (categorySlug: string) => {
    try {
      setCategoryLoading(true);
      // Clear posts immediately to show loading state
      setPosts([]);
      
      const postsData = await fetchPosts({ 
        perPage: 12, 
        orderBy: 'date', 
        order: 'desc',
        category: categorySlug
      });
      setPosts(postsData.posts);
    } catch (err) {
      setError('Failed to load category posts');
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchPostsForParent = async (parent: ParentCategory) => {
    try {
      setCategoryLoading(true);
      // Clear posts immediately to show loading state
      setPosts([]);
      
      // Fetch posts from all child categories
      const allPosts: Post[] = [];
      for (const child of parent.children) {
        try {
          const postsData = await fetchPosts({ 
            perPage: 50, 
            orderBy: 'date', 
            order: 'desc',
            category: child.slug
          });
          allPosts.push(...postsData.posts);
        } catch (err) {
          // Continue to next child category
        }
      }
      // Sort by date and take first 12
      const sortedPosts = allPosts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 12);
      setPosts(sortedPosts);
    } catch (err) {
      setError('Failed to load parent category posts');
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      setCategoryLoading(true);
      // Clear posts immediately to show loading state
      setPosts([]);
      
      const postsData = await fetchPosts({ 
        perPage: 12, 
        orderBy: 'date', 
        order: 'desc' 
      });
      setPosts(postsData.posts);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setCategoryLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // Get icon for parent category based on name or slug
  const getCategoryIcon = (category: Category): React.ReactNode => {
    const name = category.name.toLowerCase();
    const slug = category.slug.toLowerCase();
    
    if (name.includes('workout') || slug.includes('workout') || name.includes('training')) {
      return <Dumbbell className="w-6 h-6" />;
    } else if (name.includes('nutrition') || slug.includes('nutrition') || name.includes('recipe')) {
      return <BookOpen className="w-6 h-6" />;
    } else if (name.includes('lifestyle') || slug.includes('lifestyle')) {
      return <FileText className="w-6 h-6" />;
    } else {
      return <FileText className="w-6 h-6" />;
    }
  };

  // Define the parent categories dynamically from WordPress data
  const getParentCategories = (): ParentCategory[] => {
    const parentCategories = categories.filter(cat => cat.parent === 0);
    
    return parentCategories.map(parent => {
      const children = categories.filter(cat => cat.parent === parent.id);
      
      return {
        id: parent.id,
        name: parent.name,
        slug: parent.slug,
        description: parent.description || 'Explore our content in this category',
        icon: getCategoryIcon(parent),
        children: children
      };
    });
  };

  const handleParentSelect = (parent: ParentCategory) => {
    setSelectedParent(parent);
    setSelectedCategory(null);
    setError(null); // Clear any previous errors
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedParent(null);
    setError(null); // Clear any previous errors
  };

  const handleAllPosts = () => {
    setSelectedParent(null);
    setSelectedCategory(null);
    setError(null); // Clear any previous errors
  };

  const handleBackToParents = () => {
    setSelectedParent(null);
    setSelectedCategory(null);
    setError(null); // Clear any previous errors
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-tertiary flex items-center justify-center">
        <Loading text="Loading blog content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary text-tertiary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Content</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-tertiary text-white hover:bg-primarySupport transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const parentCategories = getParentCategories();

  return (
    <div className="min-h-screen bg-primary text-tertiary">
      {/* Navigation */}
      <Navigation isScrolled={false} />
      
      {/* Page Header */}
      <div className="bg-primarySupport border-b border-black/20 pt-32">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-tertiary hover:text-primarySupport transition-colors"
            >
              <Home size={20} />
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-600">Blog</span>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-4">BLOG</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Discover nutrition tips, workout routines, and lifestyle advice to help you achieve your fitness goals.
          </p>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-primarySupport border-b border-black/20 md:sticky md:top-0 md:z-10">
        <div className="container mx-auto px-4">
          {/* Mobile: vertical accordion */}
          <div className="md:hidden py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={categoryLoading}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAllPosts}
                disabled={categoryLoading}
                className={`w-full text-left text-sm font-semibold uppercase tracking-wide transition-colors flex items-center justify-between gap-2 ${
                  !selectedParent && !selectedCategory 
                    ? 'text-tertiary'
                    : 'text-gray-700 hover:text-tertiary'
                } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>ALL POSTS</span>
              </button>

              {parentCategories.map((parent) => (
                <div key={parent.id}>
                  <button
                    onClick={() => setMobileOpenParentId(mobileOpenParentId === parent.id ? null : parent.id)}
                    disabled={categoryLoading}
                    className={`w-full text-left text-sm font-semibold uppercase tracking-wide transition-colors flex items-center justify-between gap-2 ${
                      selectedParent?.id === parent.id 
                        ? 'text-tertiary' 
                        : 'text-gray-700 hover:text-tertiary'
                    } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="flex items-center gap-2">{parent.icon}{parent.name}</span>
                    <span className="text-xs text-gray-400">{mobileOpenParentId === parent.id ? '−' : '+'}</span>
                  </button>
                  {mobileOpenParentId === parent.id && parent.children.length > 0 && (
                    <div className="mt-2 pl-4 space-y-1">
                      {parent.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleCategorySelect(child)}
                          disabled={categoryLoading}
                          className={`w-full text-left px-2 py-1 text-sm text-gray-700 hover:text-tertiary hover:bg-gray-50 ${
                            categoryLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {child.name} <span className="text-gray-400">({child.count})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <button
                onClick={handleAllPosts}
                disabled={categoryLoading}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors flex items-center gap-2 ${
                  !selectedParent && !selectedCategory 
                    ? 'text-tertiary border-b-2 border-tertiary' 
                    : 'text-gray-600 hover:text-tertiary'
                } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {categoryLoading && !selectedParent && !selectedCategory && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                ALL POSTS
              </button>
              {parentCategories.map((parent) => (
                <div key={parent.id} className="relative group">
                  <button
                    onClick={() => handleParentSelect(parent)}
                    disabled={categoryLoading}
                    className={`text-sm font-semibold uppercase tracking-wide transition-colors flex items-center gap-2 ${
                      selectedParent?.id === parent.id 
                        ? 'text-tertiary border-b-2 border-tertiary' 
                        : 'text-gray-600 hover:text-tertiary'
                    } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {categoryLoading && selectedParent?.id === parent.id && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {parent.icon}
                    {parent.name}
                  </button>
                  
                  {/* Dropdown for child categories */}
                  {parent.children.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-primarySupport border border-black/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                      <div className="py-2">
                        {parent.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleCategorySelect(child)}
                            disabled={categoryLoading}
                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-tertiary transition-colors flex items-center justify-between ${
                              categoryLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <span>{child.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">({child.count})</span>
                              {categoryLoading && selectedCategory?.id === child.id && (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={categoryLoading}
                className="pl-10 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {(selectedParent || selectedCategory) && (
          <div className="mb-6">
            <button 
              onClick={handleBackToParents}
              disabled={categoryLoading}
              className="flex items-center gap-2 text-tertiary hover:text-primarySupport transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
              Back to All Posts
            </button>
          </div>
        )}

        {/* Category Loading State */}
        {categoryLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-tertiary mx-auto mb-4" />
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Loading ${selectedCategory.name} posts...`
                  : selectedParent 
                    ? `Loading ${selectedParent.name} posts...`
                    : 'Loading posts...'
                }
              </p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!categoryLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              return (
                <article key={post.id} className="bg-primarySupport overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Featured Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage || '/assets/placeholder-product.jpg'}
                      alt={post.featuredImageAlt || post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    {post.categories && post.categories.length > 0 && post.categories[0] && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-tertiary/20 text-tertiary text-xs font-semibold uppercase tracking-wide">
                          {post.categories[0]}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-tertiary transition-colors">
                      <Link to={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>{post.readingTime || 1} min read</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* No Posts Message */}
        {!categoryLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
            <p className="text-gray-600">
              {searchQuery ? `No posts match "${searchQuery}"` : 'No posts available in this category.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer can be added here if available */}
    </div>
  );
};

export default BlogHub;
